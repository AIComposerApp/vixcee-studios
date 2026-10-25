import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { BookingRequestSchema, EarlyAccessRequestSchema } from './src/server/schemas.ts';
import { logger } from './src/server/logger.ts';
import { AppError, ValidationError } from './src/server/errors.ts';
import { getEmailTransporter, resolveGoogleAccessToken, resend } from './src/server/integrations.ts';
import {
  generateBookingClientHtml,
  generateBookingOwnerHtml,
  generateNewsletterWelcomeHtml,
  generateEarlyAccessWelcomeHtml,
} from './src/server/emailTemplates.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export function createApp() {
  const app = express();
  app.use(express.json());

  // Health check endpoint for uptime and container health monitors
  app.get('/healthz', (_req: Request, res: Response) => {
    return res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: Date.now(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Backend Calendar & Google Meet Creation Endpoint
  app.post('/api/create-calendar-meeting', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = BookingRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          issues: parseResult.error.format(),
        });
      }

      const {
        name,
        email,
        phone,
        dateString,
        timeSlot,
        projectNotes,
        foreseenChallenges,
        estimatedBudget,
        additionalInterests,
        currentWebsite,
      } = parseResult.data;

      // Compute start and end times (15-min sprint call)
      const [year, month, day] = dateString.split('-').map(Number);
      const isPM = timeSlot.includes('PM');
      const [timePart] = timeSlot.split(' ');
      const [rawH, rawM] = timePart.split(':').map(Number);
      let hours = rawH;
      if (isPM && hours < 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;

      const startDate = new Date(year, month - 1, day, hours, rawM);
      const endDate = new Date(startDate.getTime() + 15 * 60 * 1000);

      const hostAccessToken = await resolveGoogleAccessToken();
      const hostCalendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

      let meetUrl = 'https://meet.google.com/vdd-fxch-jcm';
      let calendarEventId = '';
      let calendarHtmlLink = '';

      if (hostAccessToken) {
        try {
          const calendarPayload = {
            summary: `Vixcee Studios Consultation with ${name}`,
            description: `15-Minute Sprint Architecture Consultation.\n\nClient: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nWebsite: ${currentWebsite || 'N/A'}\nBudget: ${estimatedBudget || 'Not specified'}\nInterests: ${additionalInterests?.join(', ') || 'None'}\nProject Details: ${projectNotes || 'None'}\nChallenges: ${foreseenChallenges || 'None'}`,
            start: {
              dateTime: startDate.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
            },
            end: {
              dateTime: endDate.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
            },
            attendees: [{ email, displayName: name }],
            conferenceData: {
              createRequest: {
                requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                conferenceSolutionKey: {
                  type: 'hangoutsMeet',
                },
              },
            },
          };

          const calRes = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(hostCalendarId)}/events?conferenceDataVersion=1&sendUpdates=all`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${hostAccessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(calendarPayload),
            }
          );

          if (calRes.ok) {
            const calData = (await calRes.json()) as {
              id?: string;
              htmlLink?: string;
              hangoutLink?: string;
              conferenceData?: { entryPoints?: Array<{ entryPointType?: string; uri?: string }> };
            };
            calendarEventId = calData.id || '';
            calendarHtmlLink = calData.htmlLink || '';
            meetUrl =
              calData.hangoutLink ||
              calData.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === 'video')?.uri ||
              meetUrl;
            logger.info('Google Calendar event created', { calendarEventId, meetUrl });
          } else {
            const errBody = await calRes.text();
            logger.warn('Google Calendar server error response', { status: calRes.status, errBody });
          }
        } catch (calErr) {
          logger.warn('Google Calendar creation exception', { error: String(calErr) });
        }
      }

      return res.status(200).json({
        success: true,
        meetUrl,
        calendarEventId,
        calendarHtmlLink,
      });
    } catch (err: unknown) {
      logger.error('Failed to create calendar meeting', { error: String(err) });
      return next(err);
    }
  });

  // Email automation proxy endpoint
  app.post('/api/send-booking-confirmation', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        email,
        date,
        timeSlot,
        phone,
        location,
        guests,
        currentWebsite,
        projectNotes,
        foreseenChallenges,
        estimatedBudget,
        additionalInterests,
      } = req.body;

      if (!name || !email || !date || !timeSlot) {
        throw new ValidationError('Missing required booking fields');
      }

      logger.info('Processing booking confirmation email', { name, email, date, timeSlot });

      const studioOwnerEmail = process.env.STUDIO_OWNER_EMAIL || 'mathewudochukwu656@gmail.com';
      const fromEmail = process.env.EMAIL_FROM || '"Vixcee Studios" <hello@vixceestudios.com>';
      const finalMeetUrl = req.body.meetUrl || 'https://meet.google.com/vdd-fxch-jcm';

      const emailData = {
        name,
        email,
        date,
        timeSlot,
        phone,
        location,
        guests,
        currentWebsite,
        projectNotes,
        foreseenChallenges,
        estimatedBudget,
        additionalInterests,
        meetUrl: finalMeetUrl,
      };

      const emailHtml = generateBookingClientHtml(emailData);
      const ownerAlertHtml = generateBookingOwnerHtml(emailData);

      const transporter = getEmailTransporter();

      if (transporter) {
        try {
          await transporter.sendMail({
            from: fromEmail,
            to: email,
            subject: `Confirmed: 15-Minute Strategy Consultation — Vixcee Studios`,
            html: emailHtml,
          });

          await transporter.sendMail({
            from: fromEmail,
            to: studioOwnerEmail,
            subject: `New 15-Min Booking: ${name} (${date} at ${timeSlot})`,
            html: ownerAlertHtml,
          });

          logger.info('Booking confirmation sent via SMTP', { email, studioOwnerEmail });
          return res.status(200).json({ success: true, provider: 'smtp' });
        } catch (smtpErr) {
          logger.error('SMTP sending error, attempting fallback', { error: String(smtpErr) });
        }
      }

      if (resend) {
        try {
          await resend.emails.send({
            from: fromEmail,
            to: [studioOwnerEmail],
            subject: `New 15-Min Booking: ${name} (${date} at ${timeSlot})`,
            html: ownerAlertHtml,
          });
        } catch (ownerErr) {
          logger.warn('Resend owner alert warning', { error: String(ownerErr) });
        }

        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: `Confirmed: 15-Minute Strategy Consultation — Vixcee Studios`,
          html: emailHtml,
        });

        if (error) {
          logger.warn('Resend API returned warning', { error });
          return res.status(200).json({
            success: true,
            warning: 'Booking saved in Firestore, Resend returned error',
            details: error,
          });
        }

        return res.status(200).json({ success: true, emailId: data?.id, provider: 'resend' });
      }

      return res.status(200).json({
        success: true,
        mock: true,
        message: 'Booking saved. Configure SMTP or RESEND_API_KEY for live dispatch.',
      });
    } catch (err: unknown) {
      logger.error('Booking confirmation server error', { error: String(err) });
      return next(err);
    }
  });

  // Newsletter / Waitlist welcome email endpoint
  app.post('/api/send-newsletter-welcome', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        throw new ValidationError('Valid email required');
      }

      const transporter = getEmailTransporter();
      const fromEmail = process.env.EMAIL_FROM || '"Vixcee Studios" <hello@vixceestudios.com>';
      const studioOwnerEmail = process.env.STUDIO_OWNER_EMAIL || 'mathewudochukwu656@gmail.com';

      if (transporter) {
        await transporter.sendMail({
          from: fromEmail,
          to: email.trim(),
          subject: 'Welcome to Vixcee Studios — You are in the loop',
          html: generateNewsletterWelcomeHtml(),
        });

        try {
          await transporter.sendMail({
            from: fromEmail,
            to: studioOwnerEmail,
            subject: `New Newsletter Subscriber: ${email.trim()}`,
            text: `A new user joined the Vixcee Studios dispatch list: ${email.trim()}`,
          });
        } catch (e) {
          logger.warn('Owner subscriber alert note', { error: String(e) });
        }

        return res.status(200).json({ success: true, message: 'Welcome email dispatched via Namecheap SMTP' });
      }

      return res.status(200).json({ success: true, message: 'Subscriber saved' });
    } catch (err: unknown) {
      logger.error('Newsletter welcome email error', { error: String(err) });
      return next(err);
    }
  });

  // Early Access / Prompts Waitlist Welcome Email Endpoint
  app.post('/api/send-early-access-welcome', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = EarlyAccessRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Valid email required',
          code: 'VALIDATION_ERROR',
          issues: parseResult.error.format(),
        });
      }
      const { email } = parseResult.data;

      const transporter = getEmailTransporter();
      const fromEmail = process.env.EMAIL_FROM || '"Vixcee Studios" <hello@vixceestudios.com>';
      const studioOwnerEmail = process.env.STUDIO_OWNER_EMAIL || 'mathewudochukwu656@gmail.com';

      if (transporter) {
        await transporter.sendMail({
          from: fromEmail,
          to: email.trim(),
          subject: "You're on the early access list — Vixcee Studios",
          html: generateEarlyAccessWelcomeHtml(),
        });

        try {
          await transporter.sendMail({
            from: fromEmail,
            to: studioOwnerEmail,
            subject: `New Prompt Early Access Lead: ${email.trim()}`,
            text: `A new user joined the AI Coding Prompts early access waitlist: ${email.trim()}`,
          });
        } catch (e) {
          logger.warn('Owner early access alert note', { error: String(e) });
        }

        return res.status(200).json({ success: true, message: 'Early access welcome email dispatched' });
      }

      return res.status(200).json({ success: true, message: 'Lead saved' });
    } catch (err: unknown) {
      logger.error('Early access email error', { error: String(err) });
      return next(err);
    }
  });

  // Centralized Error Handling Middleware for typed AppErrors
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json(err.toJSON());
    }
    const message = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({
      success: false,
      error: message,
      code: 'INTERNAL_ERROR',
    });
  });

  return app;
}

export async function startServer() {
  const app = createApp();

  // Serve static assets from public/ folder
  app.use(
    express.static(path.resolve(__dirname, 'public'), {
      maxAge: '7d',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.ico')) {
          res.setHeader('Content-Type', 'image/x-icon');
          res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
        } else if (filePath.endsWith('.png')) {
          res.setHeader('Content-Type', 'image/png');
          res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
        } else if (filePath.endsWith('.svg')) {
          res.setHeader('Content-Type', 'image/svg+xml');
          res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
        } else if (filePath.endsWith('.webmanifest')) {
          res.setHeader('Content-Type', 'application/manifest+json');
          res.setHeader('Cache-Control', 'public, max-age=86400');
        }
      },
    })
  );

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running at http://0.0.0.0:${PORT}`);
  });

  return { app, server };
}

if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  startServer().catch((err) => {
    logger.error('Failed to start server', { error: String(err) });
  });
}
