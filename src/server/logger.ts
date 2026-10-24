export interface LogContext {
  [key: string]: unknown;
}

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  if (process.env.NODE_ENV === 'test') {
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }
  return JSON.stringify({
    timestamp,
    level,
    message,
    ...(context ? { context } : {}),
  });
}

export const logger = {
  info(message: string, context?: LogContext): void {
    console.log(formatMessage('info', message, context));
  },
  warn(message: string, context?: LogContext): void {
    console.warn(formatMessage('warn', message, context));
  },
  error(message: string, context?: LogContext): void {
    console.error(formatMessage('error', message, context));
  },
  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('debug', message, context));
    }
  },
};
