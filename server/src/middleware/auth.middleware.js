import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { getRedisClient } from '../config/redis.config.js';
import { User } from '../modules/auth/user.model.js';

const getAccessToken = (req) => {
  const authHeader = req.get('authorization');

  // Send token in header like: Authorization: Bearer <accessToken>
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

export const authMiddleware = async (req, res, next) => {
  const accessSecret = process.env.ACCESS_SECRET || process.env.JWT_SECRET;
  const token = getAccessToken(req);

  if (!accessSecret) {
    return next(new AppError('Access token secret is not configured', 500, 'ACCESS_SECRET_MISSING'));
  }

  if (!token) {
    return next(new AppError('Authentication required', 401, 'AUTHENTICATION_REQUIRED'));
  }

  try {
    const tokenPayload = jwt.verify(token, accessSecret);

    // Check if token is blacklisted
    const redisClient = getRedisClient();
    const isBlacklisted = await redisClient.get(`blacklist:access:${token}`);
    if (isBlacklisted) {
      return next(new AppError('Token has been revoked', 401, 'TOKEN_REVOKED'));
    }

    if (!tokenPayload?.id) {
      return next(new AppError('Invalid token', 401, 'INVALID_ACCESS_TOKEN'));
    }

    const user = await User.findById(tokenPayload.id);
    if (!user) {
      return next(new AppError('User not found', 401, 'USER_NOT_FOUND'));
    }

    if (user.isEnabled === false) {
      return next(new AppError('You are disabled. Contact admin.', 403, 'USER_DISABLED'));
    }

    req.auth = tokenPayload;
    req.user = user;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token has expired', 401, 'TOKEN_EXPIRED'));
    }
    return next(new AppError('Invalid token', 401, 'INVALID_ACCESS_TOKEN'));
  }
};
