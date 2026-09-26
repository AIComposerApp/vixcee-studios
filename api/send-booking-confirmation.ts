import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, date, timeSlot, projectNotes } = req.body || {};

    if (!name || !email || !date || !timeSlot) {
      return res.status(400).json({ error: 'Missing required booking fields: name, email, date, timeSlot' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn('[Resend Warning] RESEND_API_KEY is not set in environment variables.');
      return res.status(200).json({
        success: true,
        mock: true,
        message: 'RESEND_API_KEY not configured. Add RESEND_API_KEY in Vercel project settings to deliver live emails.',
      });
    }

    const resend = new Resend(resendApiKey);
    const studioOwnerEmail = process.env.STUDIO_OWNER_EMAIL || 'mathewudochukwu656@gmail.com';

    let ownerDeliveryStatus = 'pending';
    let clientDeliveryStatus = 'pending';
    let ownerError = null;
    let clientError = null;

    // 1. Send alert notification to Studio Owner
    try {
      const ownerResult = await resend.emails.send({
        from: 'Vixcee Studios <onboarding@resend.dev>',
        to: [studioOwnerEmail],
        subject: `New 15-Min Booking: ${name} (${date} at ${timeSlot})`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0c0e; color: #ffffff; padding: 32px 16px; margin: 0; }
                .card { max-width: 540px; margin: 0 auto; background: #15151a; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 28px; }
                .badge { display: inline-block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #fc8000; background: rgba(252,128,0,0.12); border: 1px solid rgba(252,128,0,0.25); padding: 4px 10px; border-radius: 999px; margin-bottom: 16px; }
                h2 { font-size: 20px; font-weight: 400; color: #ffffff; margin: 0 0 16px; }
                .info-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; margin-bottom: 20px; }
                .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; }
                .row:last-child { border-bottom: none; }
                .label { color: rgba(255,255,255,0.5); }
                .val { color: #ffffff; font-weight: 500; }
                .notes { font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.6; margin-top: 12px; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="badge">&bull; NEW CLIENT BOOKING</div>
                <h2>A new strategy session has been scheduled.</h2>
                <div class="info-box">
                  <div class="row">
                    <span class="label">Client Name</span>
                    <span class="val">${name}</span>
                  </div>
                  <div class="row">
                    <span class="label">Client Email</span>
                    <span class="val"><a href="mailto:${email}" style="color: #fc8000; text-decoration: none;">${email}</a></span>
                  </div>
                  <div class="row">
                    <span class="label">Date</span>
                    <span class="val">${date}</span>
                  </div>
                  <div class="row">
                    <span class="label">Time</span>
                    <span class="val">${timeSlot}</span>
                  </div>
                  ${
                    projectNotes
                      ? `<div class="notes"><strong>Project Notes:</strong><br/>${projectNotes}</div>`
                      : ''
                  }
                </div>
                <p style="font-size: 12px; color: rgba(255,255,255,0.4); margin: 0;">
                  This booking has also been logged to your Firestore database.
                </p>
              </div>
            </body>
          </html>
        `,
      });

      if (ownerResult.error) {
        ownerError = ownerResult.error;
        ownerDeliveryStatus = 'failed';
      } else {
        ownerDeliveryStatus = 'delivered';
      }
    } catch (err: any) {
      ownerError = err.message;
      ownerDeliveryStatus = 'failed';
    }

    // 2. Send confirmation email to Client
    try {
      const clientResult = await resend.emails.send({
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
                .badge { display: inline-block; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #ffffff; background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 999px; margin-bottom: 16px; }
                .title { font-size: 24px; font-weight: 300; letter-spacing: -0.02em; color: #ffffff; margin: 0 0 8px; }
                .slot-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; margin: 20px 0; }
                .slot-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
                .slot-label { font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.05em; }
                .slot-val { color: #ffffff; font-weight: 500; }
                .notes { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6; margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
                .footer { margin-top: 32px; font-size: 12px; color: rgba(255,255,255,0.4); text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="badge">VIXCEE STUDIOS &bull; CONFIRMATION</div>
                <h1 class="title">You're on our calendar, ${name}.</h1>
                <p style="font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.5; margin: 0 0 16px;">
                  We've reserved your 15-minute consultation sprint. We'll map out your mobile architecture, interaction dynamics, and 5-day delivery roadmap.
                </p>
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
                  If you need to reschedule or prepare assets beforehand, simply reply directly to this email.
                </p>
                <div class="footer">
                  &copy; ${new Date().getFullYear()} Vixcee Studios &bull; Sites live in days, not weeks.
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (clientResult.error) {
        clientError = clientResult.error;
        clientDeliveryStatus = 'failed';
      } else {
        clientDeliveryStatus = 'delivered';
      }
    } catch (err: any) {
      clientError = err.message;
      clientDeliveryStatus = 'failed';
    }

    return res.status(200).json({
      success: true,
      ownerDeliveryStatus,
      clientDeliveryStatus,
      ownerError,
      clientError,
    });
  } catch (error: any) {
    console.error('[Booking Serverless Error]', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
