import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';
import { getAuditLogsHandler, getAuditLogStatsHandler, getAuditLogByIdHandler } from './audit-log.controller.js';

export const auditLogRoutes = Router();

auditLogRoutes.get('/', authMiddleware, requireAdmin, getAuditLogsHandler);
auditLogRoutes.get('/stats', authMiddleware, requireAdmin, getAuditLogStatsHandler);
auditLogRoutes.get('/:id', authMiddleware, requireAdmin, getAuditLogByIdHandler);