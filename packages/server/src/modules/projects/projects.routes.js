import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { validate } from '../auth/auth.validation.js';
import { createProject, listProjects, updateProject } from './projects.controller.js';
import { createProjectSchema, updateProjectSchema } from './projects.validation.js';

export const projectsRoutes = Router();

projectsRoutes.post('/', authMiddleware, validate(createProjectSchema), createProject);
projectsRoutes.get('/', authMiddleware, listProjects);
projectsRoutes.patch('/:projectId', authMiddleware, validate(updateProjectSchema), updateProject);