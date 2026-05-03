import { Router } from "express";

import {
  fetchResults,
  fetchOneResult,
  fetchFeature,
  changeFeedback,
} from "./result.controller.js";

export const resultRoutes =
  Router();

resultRoutes.get(
  "/",
  fetchResults
);

resultRoutes.get(
  "/feature/:featureId",
  fetchFeature
);

resultRoutes.get(
  "/:id",
  fetchOneResult
);

resultRoutes.patch(
  "/:id/feedback",
  changeFeedback
);