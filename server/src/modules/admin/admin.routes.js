import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireAdmin } from "../../middleware/admin.middleware.js";
import { listUsers, updateUserStatusHandler, getStats } from "./admin.controller.js";
import { auditLogRoutes } from "../audit-logs/audit-log.routes.js";


export const adminRoutes = Router();

adminRoutes.get('/users', authMiddleware, requireAdmin, listUsers);
adminRoutes.patch('/users/:id/status', authMiddleware, requireAdmin, updateUserStatusHandler);
adminRoutes.get('/stats', authMiddleware, requireAdmin, getStats);
adminRoutes.use('/audit-logs', auditLogRoutes);




// "name": "Admin",
//     "email": "admin@controlall.com",
//         "password": "secureAdmin@1234"