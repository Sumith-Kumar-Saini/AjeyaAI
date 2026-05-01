import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

const getAccessToken = (req) => {
  const authHeader = req.get('authorization');

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  const cookieToken = req.get('cookie')
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('accessToken='))
    ?.slice('accessToken='.length);

  return cookieToken ? decodeURIComponent(cookieToken) : undefined;
};

export const authMiddleware = (req, res, next) => {
  const accessSecret = process.env.ACCESS_SECRET || process.env.JWT_SECRET;
  const token = getAccessToken(req);

  if (!accessSecret) {
    return next(new AppError('Access token secret is not configured', 500, 'ACCESS_SECRET_MISSING'));
  }

  if (!token) {
    return next(new AppError('Authentication required', 401, 'AUTHENTICATION_REQUIRED'));
  }

  try {
    req.user = jwt.verify(token, accessSecret);
    return next();
  } catch {
    return next(new AppError('Invalid or expired token', 401, 'INVALID_ACCESS_TOKEN'));
  }
};
