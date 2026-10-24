import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../../../server.ts';
import type { Server } from 'http';

describe('Server API Endpoints & Health Check', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const addr = server.address();
        if (addr && typeof addr === 'object') {
          baseUrl = `http://127.0.0.1:${addr.port}`;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('GET /healthz returns 200 OK with health status metadata', async () => {
    const res = await fetch(`${baseUrl}/healthz`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; uptime: number; timestamp: number };
    expect(body.status).toBe('ok');
    expect(typeof body.uptime).toBe('number');
    expect(typeof body.timestamp).toBe('number');
  });

  it('POST /api/create-calendar-meeting returns 400 Bad Request on empty payload', async () => {
    const res = await fetch(`${baseUrl}/api/create-calendar-meeting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string; issues: Record<string, unknown> };
    expect(body.error).toBe('Validation failed');
    expect(body.issues).toBeDefined();
  });

  it('POST /api/create-calendar-meeting returns 400 Bad Request on invalid email', async () => {
    const res = await fetch(`${baseUrl}/api/create-calendar-meeting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Morgan',
        email: 'invalid-email-string',
        dateString: '2026-10-28',
        timeSlot: '01:30 PM',
      }),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe('Validation failed');
  });

  it('POST /api/create-calendar-meeting returns 200 OK on valid payload with mock meet URL', async () => {
    const res = await fetch(`${baseUrl}/api/create-calendar-meeting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Lee',
        email: 'jordan@example.com',
        dateString: '2026-10-28',
        timeSlot: '01:30 PM',
        projectNotes: 'Fullstack redesign with high performance requirements',
      }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { success: boolean; meetUrl: string };
    expect(body.success).toBe(true);
    expect(body.meetUrl).toBeTruthy();
  });

  it('POST /api/send-early-access-welcome returns 400 on invalid email', async () => {
    const res = await fetch(`${baseUrl}/api/send-early-access-welcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/send-early-access-welcome returns 200 on valid subscriber email', async () => {
    const res = await fetch(`${baseUrl}/api/send-early-access-welcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'subscriber@example.com' }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { success: boolean };
    expect(body.success).toBe(true);
  });
});
