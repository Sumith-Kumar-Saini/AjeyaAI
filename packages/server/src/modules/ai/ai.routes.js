import { Router } from "express";

export const aiRoutes = Router();
import { analyzeQuery } from "./ai.controller.js";
import { validateAnalyzeBody } from "./ai.validator.js";

aiRoutes.post("/analyze", validateAnalyzeBody, analyzeQuery);

// TODO: Implement AI analysis endpoint in ai.controller.ts → ai.service.ts
// Handles single-turn query to Gemini, validates input, returns structured JSON
// aiRoutes.post(
//   '/analyze',
//   authMiddleware,
//   rateLimiter,
//   validate(analyzeQuerySchema),
//   analyzeQuery
// );
