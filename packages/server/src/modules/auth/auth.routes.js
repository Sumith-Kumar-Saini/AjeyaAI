import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { getMe, login, signup } from './auth.controller.js';
import { loginSchema, signupSchema, validate } from './auth.validation.js';

export const authRoutes = Router();

authRoutes.post('/signup', validate(signupSchema), signup);
authRoutes.post('/login', validate(loginSchema), login);
authRoutes.get('/me', authMiddleware, getMe);
