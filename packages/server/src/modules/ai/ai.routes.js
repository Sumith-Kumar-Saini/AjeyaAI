import { Router } from "express";
import { analyzeQuery } from "./ai.controller.js";
import { validateAnalyzeBody } from "./ai.validator.js";

export const aiRoutes = Router();

aiRoutes.post(
  "/analyze",
  validateAnalyzeBody,
  analyzeQuery
);