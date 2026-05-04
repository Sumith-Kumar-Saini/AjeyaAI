import { User } from '../modules/auth/user.model.js';
import { AppError } from '../utils/AppError.js';

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401, 'AUTHENTICATION_REQUIRED'));
    }

    if (req.user.role !== 'Admin') {
      return next(new AppError('Admin access required', 403, 'ADMIN_ACCESS_REQUIRED'));
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
