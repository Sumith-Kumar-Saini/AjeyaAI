import { logger } from '../utils/logger.js';

/**
 * Custom request logger middleware for Pino
 * Logs method, URL, status, response time, and optionally body (dev only)
 */
export const requestLogger = {
  info: (msg, meta) => logger.info(meta, msg),
  error: (msg, meta) => logger.error(meta, msg),
};

/**
 * Express middleware to log incoming requests
 * Can be used with app.use(requestLoggerMiddleware)
 */
export const requestLoggerMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const responseTimeMs = diff[0] * 1000 + diff[1] / 1e6;

    const logMeta = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTimeMs: responseTimeMs.toFixed(2),
      body: req.body, // optional, only log in development if needed
    };

    requestLogger.info('Incoming HTTP request', logMeta);
  });

  next();
};