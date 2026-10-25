export interface BookingEmailData {
  name: string;
  email: string;
  date: string;
  timeSlot: string;
  phone?: string;
  location?: string;
  guests?: string;
  currentWebsite?: string;
  projectNotes?: string;
  foreseenChallenges?: string;
  estimatedBudget?: string;
  additionalInterests?: string[];
  meetUrl: string;
}

export function generateBookingClientHtml(data: BookingEmailData): string {
  return `
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
            <h1 class="title">You're on our calendar, ${data.name}.</h1>
            <p style="font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.5; margin: 0;">
              We've reserved your 15-minute high-velocity sprint consultation. We'll map out your mobile architecture, interaction dynamics, and 5-day delivery roadmap.
            </p>
          </div>
          <div class="slot-card">
            <div class="slot-row">
              <span class="slot-label">Date</span>
              <span class="slot-val">${data.date}</span>
            </div>
            <div class="slot-row">
              <span class="slot-label">Time</span>
              <span class="slot-val">${data.timeSlot}</span>
            </div>
            <div class="slot-row">
              <span class="slot-label">Platform</span>
              <span class="slot-val">${data.location || 'Google Meet'}</span>
            </div>
            <div class="slot-row">
              <span class="slot-label">Meeting URL</span>
              <span class="slot-val"><a href="${data.meetUrl}" style="color: #ffffff; text-decoration: underline;">${data.meetUrl}</a></span>
            </div>
            <div class="slot-row">
              <span class="slot-label">Host</span>
              <span class="slot-val">Lead Engineer, Vixcee Studios</span>
            </div>
            ${
              data.projectNotes
                ? `<div class="notes"><span class="slot-label">Project Scope:</span><br/>${data.projectNotes}</div>`
                : ''
            }
          </div>
          <div style="text-align: center; margin: 24px 0 16px;">
            <a href="${data.meetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #000000; text-decoration: none; font-weight: 600; font-size: 13px; border-radius: 6px; letter-spacing: 0.04em;">
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
}

export function generateBookingOwnerHtml(data: BookingEmailData): string {
  return `
    <div style="font-family: sans-serif; background: #0c0c0e; color: #fff; padding: 24px;">
      <h2 style="color: #fc8000;">New Strategy Booking Received</h2>
      <p><strong>Client:</strong> ${data.name} &lt;${data.email}&gt;</p>
      <p><strong>Scheduled:</strong> ${data.date} at ${data.timeSlot}</p>
      <p><strong>Meeting Room:</strong> <a href="${data.meetUrl}" style="color:#fc8000;">${data.meetUrl}</a></p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
      ${data.guests ? `<p><strong>Guests:</strong> ${data.guests}</p>` : ''}
      ${data.currentWebsite ? `<p><strong>Current Website:</strong> <a href="${data.currentWebsite}" style="color:#fc8000;">${data.currentWebsite}</a></p>` : ''}
      ${data.estimatedBudget ? `<p><strong>Estimated Budget:</strong> ${data.estimatedBudget}</p>` : ''}
      ${data.additionalInterests && data.additionalInterests.length > 0 ? `<p><strong>Also Interested In:</strong> ${data.additionalInterests.join(', ')}</p>` : ''}
      ${data.projectNotes ? `<p><strong>Project Details:</strong><br/>${data.projectNotes}</p>` : ''}
      ${data.foreseenChallenges ? `<p><strong>Foreseen Challenges:</strong><br/>${data.foreseenChallenges}</p>` : ''}
    </div>
  `;
}

export function generateNewsletterWelcomeHtml(): string {
  return `
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
  `;
}

export function generateEarlyAccessWelcomeHtml(): string {
  return `
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
  `;
}
