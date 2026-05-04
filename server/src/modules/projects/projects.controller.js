import {
  createProjectForUser,
  getProjectsForUser,
  updateProjectForUser,
} from './projects.service.js';
import { logAudit } from '../audit-logs/auditLogger.js';

export const createProject = async (req, res) => {
  try {
    const project = await createProjectForUser(req.user.id, req.body);

    logAudit({
      action: 'PROJECT_CREATED',
      userId: req.user._id,
      targetId: project.id,
      targetType: 'Project',
      details: {
        name: project.name,
        description: project.description,
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const listProjects = async (req, res) => {
  try {
    const projects = await getProjectsForUser(req.user.id);

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await updateProjectForUser(req.user.id, req.params.projectId, req.body);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    logAudit({
      action: 'PROJECT_UPDATED',
      userId: req.user._id,
      targetId: project.id,
      targetType: 'Project',
      details: {
        updatedFields: req.body,
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
