import { Router } from 'express';

export const authRoutes = Router();

// TODO: Implement full signup logic in auth.controller.ts → auth.service.ts
// authRoutes.post('/signup', validate(signupSchema), signup);

// TODO: Implement full login logic in auth.controller.ts → auth.service.ts
// authRoutes.post('/login', validate(loginSchema), login);

// TODO: Implement protected route to fetch current user
// authRoutes.get('/me', authMiddleware, (req, res) =>
//   res.json({ success: true, data: req.user })
// );