import { Router } from "express";
import { createTasks } from "./task.controller.js";

export const taskRoutes =
  Router();

taskRoutes.post(
  "/:id/generate",
  createTasks
);