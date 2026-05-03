import mongoose from 'mongoose';
import { Project } from './project.model.js';

const toPublicProject = (project) => ({
  id: project._id.toString(),
  name: project.name,
  description: project.description,
  owner: project.owner.toString(),
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

export const getProjectsForUser = async (userId) => {
  const projects = await Project.find({ owner: userId })
    .sort({ updatedAt: -1 })
    .lean();

  return projects.map(toPublicProject);
};

export const createProjectForUser = async (userId, projectData) => {
  const project = await Project.create({
    ...projectData,
    owner: userId,
  });

  return toPublicProject(project);
};

export const updateProjectForUser = async (userId, projectId, projectData) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return null;
  }

  const project = await Project.findOneAndUpdate(
    { _id: projectId, owner: userId },
    { $set: projectData },
    { new: true, runValidators: true },
  ).lean();

  return project ? toPublicProject(project) : null;
};
