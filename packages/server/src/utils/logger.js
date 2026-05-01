import pino from 'pino';
import { env } from '../config/env.config.js'; // adjust path if needed

let logger;

// Use pretty logs only in development
if (env.NODE_ENV === 'development') {
  logger = pino({
    level: env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  });
} else {
  // Production and test: raw JSON logs
  logger = pino({
    level: env.LOG_LEVEL || 'info',
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    formatters: {
      level(label) {
        return { level: label };
      },
    },
  });
}

export { logger };

// Usage examples:
// logger.info("Server started");
// logger.error("Something went wrong", { error: new Error("Example error") });