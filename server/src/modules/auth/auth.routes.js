import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import {
    getMe,
    googleCallback,
    googleLogin,
    login,
    logout,
    refreshToken,
    signup,
} from './auth.controller.js';
import { loginSchema, signupSchema, validate } from './auth.validation.js';

export const authRoutes = Router();

authRoutes.get('/google', googleLogin);
authRoutes.get('/google/callback', googleCallback);
authRoutes.post('/signup', validate(signupSchema), signup);
authRoutes.post('/login', validate(loginSchema), login);
authRoutes.post('/refresh', refreshToken);
authRoutes.post('/logout', authMiddleware, logout);
authRoutes.get('/me', authMiddleware, getMe);
