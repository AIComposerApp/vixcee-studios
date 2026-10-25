import nodemailer, { type SendMailOptions, type Transporter } from 'nodemailer';
import crypto from 'crypto';
import { Resend } from 'resend';
import { logger } from './logger.ts';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export function getEmailTransporter() {
  if (process.env.NODE_ENV === 'test') {
    return {
      sendMail: async (options: SendMailOptions) => {
        logger.debug('Mock sendMail called', { to: options.to, subject: options.subject });
        return { messageId: 'mock-test-id' };
      },
    } as unknown as Transporter;
  }

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

export async function resolveGoogleAccessToken(): Promise<string | null> {
  if (process.env.NODE_ENV === 'test') {
    return 'mock-test-access-token';
  }

  const saJsonStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
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

      const b64 = (obj: unknown) =>
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
        const data = (await res.json()) as { access_token?: string };
        return data.access_token || null;
      } else {
        const errText = await res.text();
        logger.warn('Google JWT Token Exchange Error', { error: errText });
      }
    } catch (jwtErr) {
      logger.warn('JWT Sign Exception', { error: String(jwtErr) });
    }
  }

  return null;
}
