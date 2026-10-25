import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getEmailTransporter, resolveGoogleAccessToken } from '../integrations.ts';

describe('Server Integrations', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('getEmailTransporter', () => {
    it('returns a mock transporter in test environment', async () => {
      process.env.NODE_ENV = 'test';
      const transporter = getEmailTransporter();
      expect(transporter).not.toBeNull();
      if (transporter) {
        const result = await transporter.sendMail({
          to: 'client@example.com',
          subject: 'Test Subject',
          text: 'Hello test',
        });
        expect(result.messageId).toBe('mock-test-id');
      }
    });

    it('returns null in production if SMTP_PASS is missing', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.SMTP_PASS;
      const transporter = getEmailTransporter();
      expect(transporter).toBeNull();
    });
  });

  describe('resolveGoogleAccessToken', () => {
    it('returns mock access token in test environment', async () => {
      process.env.NODE_ENV = 'test';
      const token = await resolveGoogleAccessToken();
      expect(token).toBe('mock-test-access-token');
    });

    it('returns ya29 token directly if provided in environment', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
      delete process.env.GOOGLE_CALENDAR_ACCESS_TOKEN;
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY = 'ya29.mock-oauth-token-value';
      const token = await resolveGoogleAccessToken();
      expect(token).toBe('ya29.mock-oauth-token-value');
    });

    it('returns null when no credentials are provided in production', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
      delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      delete process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      delete process.env.GOOGLE_CALENDAR_ACCESS_TOKEN;
      const token = await resolveGoogleAccessToken();
      expect(token).toBeNull();
    });
  });
});
