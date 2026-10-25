import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  IntegrationError,
} from '../errors.ts';

describe('AppError Hierarchy', () => {
  it('instantiates AppError with default 500 status and INTERNAL_ERROR code', () => {
    const err = new AppError('Server error');
    expect(err.message).toBe('Server error');
    expect(err.statusCode).toBe(500);
    expect(err.code).toBe('INTERNAL_ERROR');
    expect(err.isOperational).toBe(true);
  });

  it('instantiates ValidationError with 400 and VALIDATION_ERROR code', () => {
    const err = new ValidationError('Invalid input');
    expect(err.message).toBe('Invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
  });

  it('instantiates NotFoundError with 404 and NOT_FOUND code', () => {
    const err = new NotFoundError('Resource missing');
    expect(err.message).toBe('Resource missing');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
  });

  it('instantiates AuthenticationError with 401 and AUTHENTICATION_ERROR code', () => {
    const err = new AuthenticationError('Unauthorized');
    expect(err.message).toBe('Unauthorized');
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('AUTHENTICATION_ERROR');
  });

  it('instantiates IntegrationError with 502 and INTEGRATION_ERROR code', () => {
    const err = new IntegrationError('Google API failed');
    expect(err.message).toBe('Google API failed');
    expect(err.statusCode).toBe(502);
    expect(err.code).toBe('INTEGRATION_ERROR');
  });
});
