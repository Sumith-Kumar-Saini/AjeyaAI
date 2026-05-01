import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wrap async controllers and pass any thrown error to next()
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
