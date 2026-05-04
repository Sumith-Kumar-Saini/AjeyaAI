import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

/**
 * Global error handler
 * Differentiates between:
 * - Operational errors (AppError)
 * - Unknown/internal errors (fallback)
 */
export const errorHandler = (err, req, res, next) => {
  // If error is an instance of our AppError, it's operational
  if (err instanceof AppError) {
    logger.error(
      { err, path: req.originalUrl, method: req.method },
      "Operational error",
    );
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
    });
  }

  // Fallback for unexpected errors (programming bugs, unknown exceptions)
  logger.error(
    { err, path: req.originalUrl, method: req.method },
    "Unknown error",
  );

  return res.status(500).json({
    success: false,
    error: "Internal server error",
  });
};

/**
 * Optional helper to wrap non-async middleware functions
 * Ensures that any thrown error still goes to errorHandler
 */
export const catchError = (fn) => (req, res, next) => {
  try {
    fn(req, res, next);
  } catch (err) {
    next(err);
  }
};
