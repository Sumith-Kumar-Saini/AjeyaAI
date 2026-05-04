import { z } from 'zod';

const projectFieldsSchema = {
  name: z.string().trim().min(3, 'Project name is required').max(60, 'Project name is too long'),
  description: z.string().trim().max(2000, 'Project description is too long'),
};

export const createProjectSchema = z.object({
  ...projectFieldsSchema,
  description: projectFieldsSchema.description.optional().default(''),
});

export const updateProjectSchema = z
  .object({
    name: projectFieldsSchema.name.optional(),
    description: projectFieldsSchema.description.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide a project name or description to update',
  });
