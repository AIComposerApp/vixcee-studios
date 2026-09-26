import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Email automation proxy endpoint
  app.post('/api/send-booking-confirmation', async (req: Request, res: Response) => {
    try {
      const { name, email, date, timeSlot, projectNotes } = req.body;

      if (!name || !email || !date || !timeSlot) {
        return res.status(400).json({ error: 'Missing required booking fields' });
      }

      console.log(`[Booking Confirmation] Processing for: ${name} <${email}> on ${date} at ${timeSlot}`);

      if (resend) {
        const studioOwnerEmail = process.env.STUDIO_OWNER_EMAIL || 'mathewudochukwu656@gmail.com';

        // 1. Notify Studio Owner
        try {
          await resend.emails.send({
            from: 'Vixcee Studios <onboarding@resend.dev>',
            to: [studioOwnerEmail],
            subject: `New 15-Min Booking: ${name} (${date} at ${timeSlot})`,
            html: `
              <div style="font-family: sans-serif; background: #0c0c0e; color: #fff; padding: 24px;">
                <h2 style="color: #fc8000;">New Strategy Booking Received</h2>
                <p><strong>Client:</strong> ${name} &lt;${email}&gt;</p>
                <p><strong>Scheduled:</strong> ${date} at ${timeSlot}</p>
                ${projectNotes ? `<p><strong>Notes:</strong><br/>${projectNotes}</p>` : ''}
              </div>
            `,
          });
        } catch (ownerErr) {
          console.warn('[Resend Owner Alert Warning]', ownerErr);
        }

        // 2. Notify Client
        const { data, error } = await resend.emails.send({
          from: 'Vixcee Studios <onboarding@resend.dev>',
          to: [email],
          subject: `Confirmed: 15-Minute Strategy Consultation — Vixcee Studios`,
          html: `
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
                      <span class="slot-label">Host</span>
                      <span class="slot-val">Lead Engineer, Vixcee Studios</span>
                    </div>
                    ${
                      projectNotes
                        ? `<div class="notes"><span class="slot-label">Project Scope:</span><br/>${projectNotes}</div>`
                        : ''
                    }
                  </div>
                  <p style="font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 24px;">
                    Google Meet and calendar invite will appear in your inbox shortly. If you need to reschedule or prepare assets beforehand, simply reply to this email.
                  </p>
                  <div class="footer">
                    &copy; ${new Date().getFullYear()} Vixcee Studios &bull; Websites live in days, not weeks.
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        if (error) {
          console.warn('[Resend API Error]', error);
          return res.status(200).json({
            success: true,
            warning: 'Booking saved in Firestore, but Resend API returned error (check domain/API key)',
            details: error,
          });
        }

        return res.status(200).json({ success: true, emailId: data?.id });
      } else {
        // Mock fallback if RESEND_API_KEY is not configured yet
        console.log('[Resend Mock Notification] Email simulated (set RESEND_API_KEY in .env for production sending)');
        return res.status(200).json({
          success: true,
          mock: true,
          message: 'Booking successfully confirmed and logged. Provide RESEND_API_KEY for live email dispatch.',
        });
      }
    } catch (err: any) {
      console.error('[Booking Confirmation Server Error]', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

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
