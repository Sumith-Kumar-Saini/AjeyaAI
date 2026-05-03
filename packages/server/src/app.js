import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { projectsRoutes } from './modules/projects/projects.routes.js';
import { aiRoutes } from './modules/ai/ai.routes.js';

export const app = express();

// Middleware
app.use(morgan('combined', { stream: { write: (msg) => requestLogger.info(msg.trim()) } }));
app.use(express.json());
app.use(cors({ origin: '*' })); // MVP: allow all origins

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/ai', aiRoutes);

// 404 fallback
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

// Global error handler
app.use(errorHandler);