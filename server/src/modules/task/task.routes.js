import { Router } from "express";
import { createTasks, getTasksByFeature } from "./task.controller.js";
import {} from "./task.service.js";

export const taskRoutes = Router();

taskRoutes.post("/:id/generate", createTasks);
taskRoutes.get(
  "/:resultId/features/:featureId",
  getTasksByFeature
);
