import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Namecheap Private Email / SMTP Mailer
function getEmailTransporter() {
  const host = process.env.SMTP_HOST || 'mail.privateemail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || 'hello@vixceestudios.com';
  const pass = process.env.SMTP_PASS;

  if (!pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

// Dynamically resolves an active Google OAuth2 access token
// Supports:
// 1. Raw Service Account JSON (GOOGLE_SERVICE_ACCOUNT_JSON)
// 2. Service Account Email + Private Key (GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_KEY / GOOGLE_CALENDAR_ACCESS_TOKEN)
// 3. Direct OAuth2 Access Token (ya29....)
async function resolveGoogleAccessToken(): Promise<string | null> {
  let saJsonStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  let clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_CALENDAR_ACCESS_TOKEN;

  if (saJsonStr) {
    try {
      const sa = JSON.parse(saJsonStr);
      if (sa.client_email) clientEmail = sa.client_email;
      if (sa.private_key) privateKey = sa.private_key;
    } catch {
      // not JSON
    }
  }

  if (privateKey && privateKey.startsWith('ya29.')) {
    return privateKey.trim();
  }

  if (clientEmail && privateKey && privateKey.includes('BEGIN PRIVATE KEY')) {
    try {
      const keyFormatted = privateKey.replace(/\\n/g, '\n');
      const now = Math.floor(Date.now() / 1000);
      const header = { alg: 'RS256', typ: 'JWT' };
      const claimSet = {
        iss: clientEmail.trim(),
        scope: 'https://www.googleapis.com/auth/calendar.events',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
      };

      const b64 = (obj: any) =>
        Buffer.from(JSON.stringify(obj))
          .toString('base64')
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');

      const unsigned = `${b64(header)}.${b64(claimSet)}`;
      const signer = crypto.createSign('RSA-SHA256');
      signer.update(unsigned);
      const signature = signer
        .sign(keyFormatted, 'base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      const jwt = `${unsigned}.${signature}`;

      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        return data.access_token;
      } else {
        const errText = await res.text();
        console.warn('[Google JWT Token Exchange Error]', errText);
      }
    } catch (jwtErr) {
      console.warn('[JWT Sign Exception]', jwtErr);
    }
  }

  return null;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Backend Calendar & Google Meet Creation Endpoint (Zero client friction)
  app.post('/api/create-calendar-meeting', async (req: Request, res: Response) => {
    try {
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
      } = req.body;

      if (!name || !email || !dateString || !timeSlot) {
        return res.status(400).json({ error: 'Missing required booking fields' });
      }

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
            attendees: [
              { email, displayName: name },
            ],
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
            const calData = (await calRes.json()) as any;
            calendarEventId = calData.id || '';
            calendarHtmlLink = calData.htmlLink || '';
            meetUrl =
              calData.hangoutLink ||
              calData.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri ||
              meetUrl;
            console.log(`[Google Calendar Created] Event ID: ${calendarEventId}, Meet: ${meetUrl}`);
          } else {
            const errBody = await calRes.text();
            console.warn('[Google Calendar Server Error Response]', calRes.status, errBody);
          }
        } catch (calErr) {
          console.warn('[Google Calendar Server Error]', calErr);
        }
      }

      return res.status(200).json({
        success: true,
        meetUrl,
        calendarEventId,
        calendarHtmlLink,
      });
    } catch (err: any) {
      console.error('[Create Calendar Meeting Error]', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // Email automation proxy endpoint
  app.post('/api/send-booking-confirmation', async (req: Request, res: Response) => {
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
        return res.status(400).json({ error: 'Missing required booking fields' });
      }

      console.log(`[Booking Confirmation] Processing for: ${name} <${email}> on ${date} at ${timeSlot}`);

      const studioOwnerEmail = process.env.STUDIO_OWNER_EMAIL || 'mathewudochukwu656@gmail.com';
      const fromEmail = process.env.EMAIL_FROM || '"Vixcee Studios" <hello@vixceestudios.com>';
      const finalMeetUrl = req.body.meetUrl || 'https://meet.google.com/vdd-fxch-jcm';

      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0c0e; color: #ffffff; padding: 40px 20px; margin: 0; }
              .container { max-width: 560px; margin: 0 auto; background: #141418; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 32px; }
              .header { margin-bottom: 24px; }
              .title { font-size: 24px; font-weight: 300; letter-spacing: -0.02em; color: #ffffff; margin: 0 0 8px; }
              .badge { display: inline-block; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #ffffff; background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 999px; margin-bottom: 16px; }
              .slot-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; margin: 20px 0; }
              .slot-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
              .slot-label { font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; }
              .slot-val { font-size: 14px; color: #ffffff; font-weight: 500; }
              .notes { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6; margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
              .footer { margin-top: 32px; font-size: 12px; color: rgba(255,255,255,0.4); text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="badge">VIXCEE STUDIOS &bull; CONFIRMATION</div>
                <h1 class="title">You're on our calendar, ${name}.</h1>
                <p style="font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.5; margin: 0;">
                  We've reserved your 15-minute high-velocity sprint consultation. We'll map out your mobile architecture, interaction dynamics, and 5-day delivery roadmap.
                </p>
              </div>
              <div class="slot-card">
                <div class="slot-row">
                  <span class="slot-label">Date</span>
                  <span class="slot-val">${date}</span>
                </div>
                <div class="slot-row">
                  <span class="slot-label">Time</span>
                  <span class="slot-val">${timeSlot}</span>
                </div>
                <div class="slot-row">
                  <span class="slot-label">Platform</span>
                  <span class="slot-val">${location || 'Google Meet'}</span>
                </div>
                <div class="slot-row">
                  <span class="slot-label">Meeting URL</span>
                  <span class="slot-val"><a href="${finalMeetUrl}" style="color: #ffffff; text-decoration: underline;">${finalMeetUrl}</a></span>
                </div>
                <div class="slot-row">
                  <span class="slot-label">Host</span>
                  <span class="slot-val">Lead Engineer, Vixcee Studios</span>
                </div>
                ${
                  projectNotes
                    ? `<div class="notes"><span class="slot-label">Project Scope:</span><br/>${projectNotes}</div>`
                    : ''
                }
              </div>
              <div style="text-align: center; margin: 24px 0 16px;">
                <a href="${finalMeetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #000000; text-decoration: none; font-weight: 600; font-size: 13px; border-radius: 6px; letter-spacing: 0.04em;">
                  Join Google Meet &rarr;
                </a>
              </div>
              <p style="font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 16px; text-align: center;">
                If you need to reschedule or prepare assets beforehand, simply reply to this email.
              </p>
              <div class="footer">
                &copy; ${new Date().getFullYear()} Vixcee Studios &bull; Websites live in days, not weeks.
              </div>
            </div>
          </body>
        </html>
      `;

      const ownerAlertHtml = `
        <div style="font-family: sans-serif; background: #0c0c0e; color: #fff; padding: 24px;">
          <h2 style="color: #fc8000;">New Strategy Booking Received</h2>
          <p><strong>Client:</strong> ${name} &lt;${email}&gt;</p>
          <p><strong>Scheduled:</strong> ${date} at ${timeSlot}</p>
          <p><strong>Meeting Room:</strong> <a href="${finalMeetUrl}" style="color:#fc8000;">${finalMeetUrl}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
          ${guests ? `<p><strong>Guests:</strong> ${guests}</p>` : ''}
          ${currentWebsite ? `<p><strong>Current Website:</strong> <a href="${currentWebsite}" style="color:#fc8000;">${currentWebsite}</a></p>` : ''}
          ${estimatedBudget ? `<p><strong>Estimated Budget:</strong> ${estimatedBudget}</p>` : ''}
          ${additionalInterests && additionalInterests.length > 0 ? `<p><strong>Also Interested In:</strong> ${additionalInterests.join(', ')}</p>` : ''}
          ${projectNotes ? `<p><strong>Project Details:</strong><br/>${projectNotes}</p>` : ''}
          ${foreseenChallenges ? `<p><strong>Foreseen Challenges:</strong><br/>${foreseenChallenges}</p>` : ''}
        </div>
      `;

      const transporter = getEmailTransporter();

      if (transporter) {
        // Primary: Dispatch via Namecheap Private Email (SMTP)
        try {
          // 1. Notify Client
          await transporter.sendMail({
            from: fromEmail,
            to: email,
            subject: `Confirmed: 15-Minute Strategy Consultation — Vixcee Studios`,
            html: emailHtml,
          });

          // 2. Notify Studio Owner
          await transporter.sendMail({
            from: fromEmail,
            to: studioOwnerEmail,
            subject: `New 15-Min Booking: ${name} (${date} at ${timeSlot})`,
            html: ownerAlertHtml,
          });

          console.log(`[SMTP Sent] Confirmation delivered to ${email} and alert to ${studioOwnerEmail}`);
          return res.status(200).json({ success: true, provider: 'smtp' });
        } catch (smtpErr) {
          console.error('[SMTP Sending Error]', smtpErr);
          // fall through to Resend fallback if available
        }
      }

      if (resend) {
        // Fallback: Resend API
        try {
          await resend.emails.send({
            from: fromEmail,
            to: [studioOwnerEmail],
            subject: `New 15-Min Booking: ${name} (${date} at ${timeSlot})`,
            html: ownerAlertHtml,
          });
        } catch (ownerErr) {
          console.warn('[Resend Owner Alert Warning]', ownerErr);
        }

        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: `Confirmed: 15-Minute Strategy Consultation — Vixcee Studios`,
          html: emailHtml,
        });

        if (error) {
          console.warn('[Resend API Error]', error);
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
    } catch (err: any) {
      console.error('[Booking Confirmation Server Error]', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // Newsletter / Waitlist welcome email endpoint
  app.post('/api/send-newsletter-welcome', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email required' });
      }

      const transporter = getEmailTransporter();
      const fromEmail = process.env.EMAIL_FROM || '"Vixcee Studios" <hello@vixceestudios.com>';
      const studioOwnerEmail = process.env.STUDIO_OWNER_EMAIL || 'mathewudochukwu656@gmail.com';

      if (transporter) {
        // 1. Send subscriber welcome email
        await transporter.sendMail({
          from: fromEmail,
          to: email.trim(),
          subject: 'Welcome to Vixcee Studios — You are in the loop',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0c0e; color: #ffffff; padding: 40px 20px; margin: 0; }
                  .container { max-width: 560px; margin: 0 auto; background: #141418; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 32px; }
                  .badge { display: inline-block; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #ffffff; background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 999px; margin-bottom: 16px; }
                  .title { font-size: 24px; font-weight: 300; letter-spacing: -0.02em; color: #ffffff; margin: 0 0 12px; }
                  p { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 16px; }
                  .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #F04E23, #FF661F, #FFAA00); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; border-radius: 6px; letter-spacing: 0.04em; margin-top: 8px; }
                  .footer { margin-top: 32px; font-size: 12px; color: rgba(255,255,255,0.4); text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="badge">VIXCEE STUDIOS &bull; DISPATCH</div>
                  <h1 class="title">You're in the loop.</h1>
                  <p>
                    Thank you for subscribing to Vixcee Studios. Whenever we drop new AI coding agent prompts, high-velocity case studies, or production templates, you'll get them directly in your inbox.
                  </p>
                  <p>
                    No noise, no spam. Just engineering blueprints, UI interaction patterns, and production-tested agent prompts.
                  </p>
                  <div style="text-align: center; margin: 24px 0 16px;">
                    <a href="https://vixceestudios.com" class="btn" style="color: #ffffff;">Explore Case Studies &rarr;</a>
                  </div>
                  <div class="footer">
                    &copy; ${new Date().getFullYear()} Vixcee Studios &bull; Websites live in days, not weeks.
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        // 2. Alert studio owner
        try {
          await transporter.sendMail({
            from: fromEmail,
            to: studioOwnerEmail,
            subject: `New Newsletter Subscriber: ${email.trim()}`,
            text: `A new user joined the Vixcee Studios dispatch list: ${email.trim()}`,
          });
        } catch (e) {
          console.warn('[Owner subscriber alert note]', e);
        }

        return res.status(200).json({ success: true, message: 'Welcome email dispatched via Namecheap SMTP' });
      }

      return res.status(200).json({ success: true, message: 'Subscriber saved' });
    } catch (err: any) {
      console.error('[Newsletter Welcome Email Error]', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // Early Access / Prompts Waitlist Welcome Email Endpoint
  app.post('/api/send-early-access-welcome', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email required' });
      }

      const transporter = getEmailTransporter();
      const fromEmail = process.env.EMAIL_FROM || '"Vixcee Studios" <hello@vixceestudios.com>';
      const studioOwnerEmail = process.env.STUDIO_OWNER_EMAIL || 'mathewudochukwu656@gmail.com';

      if (transporter) {
        // 1. Send subscriber early access welcome email
        await transporter.sendMail({
          from: fromEmail,
          to: email.trim(),
          subject: "You're on the early access list — Vixcee Studios",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0c0e; color: #ffffff; padding: 40px 20px; margin: 0; }
                  .container { max-width: 560px; margin: 0 auto; background: #141418; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 32px; }
                  .badge { display: inline-block; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #ffffff; background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 999px; margin-bottom: 16px; }
                  .title { font-size: 24px; font-weight: 300; letter-spacing: -0.02em; color: #ffffff; margin: 0 0 12px; }
                  p { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 16px; }
                  .highlight-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px 20px; margin: 20px 0; }
                  .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #F04E23, #FF661F, #FFAA00); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; border-radius: 6px; letter-spacing: 0.04em; margin-top: 8px; }
                  .footer { margin-top: 32px; font-size: 12px; color: rgba(255,255,255,0.4); text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="badge">VIXCEE STUDIOS &bull; EARLY ACCESS</div>
                  <h1 class="title">You're on the early access list.</h1>
                  <p>
                    Thank you for joining the VIP waitlist for Vixcee Studios' AI Coding Prompts engine.
                  </p>
                  <div class="highlight-box">
                    <p style="margin: 0; color: #ffffff; font-weight: 500; font-size: 13px;">
                      What to expect:
                    </p>
                    <p style="margin: 8px 0 0; font-size: 13px; color: rgba(255,255,255,0.65);">
                      Watch your inbox this Friday for our first drop of production-ready agent blueprints, including Linear-style scroll dynamics, zero-pill UI constitutions, and mobile-first micro-interactions.
                    </p>
                  </div>
                  <div style="text-align: center; margin: 24px 0 16px;">
                    <a href="https://vixceestudios.com" class="btn" style="color: #ffffff;">Visit Vixcee Studios &rarr;</a>
                  </div>
                  <div class="footer">
                    &copy; ${new Date().getFullYear()} Vixcee Studios &bull; Websites live in days, not weeks.
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        // 2. Alert studio owner
        try {
          await transporter.sendMail({
            from: fromEmail,
            to: studioOwnerEmail,
            subject: `New Prompt Early Access Lead: ${email.trim()}`,
            text: `A new user joined the AI Coding Prompts early access waitlist: ${email.trim()}`,
          });
        } catch (e) {
          console.warn('[Owner early access alert note]', e);
        }

        return res.status(200).json({ success: true, message: 'Early access welcome email dispatched' });
      }

      return res.status(200).json({ success: true, message: 'Lead saved' });
    } catch (err: any) {
      console.error('[Early Access Email Error]', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // Serve static assets from public/ folder (favicons, manifests, robots.txt, sitemaps)
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
