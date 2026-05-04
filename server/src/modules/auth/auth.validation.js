import { z } from 'zod';
import { AppError } from '../../utils/AppError.js';

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80, 'Name is too long'),
  email: z.string().trim().email('Email must be valid').toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Email must be valid').toLowerCase(),
  password: z.string().min(1, 'Password is required').max(128, 'Password is too long'),
});

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(', ');
    return next(new AppError(message, 400, 'VALIDATION_ERROR'));
  }

  req.body = result.data;
  return next();
};
