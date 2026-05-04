import mongoose from "mongoose";
import AIResult from "../ai/ai.model.js";
import { generateTasksForFeature } from "./task.service.js";

export const createTasks = async (req, res) => {
  try {
    const data = await generateTasksForFeature({
      resultId: req.params.id,
      featureId: req.body.featureId,
      userId: req.user?._id || "guest",
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


export const getTasksByFeature = async (req, res) => {
  try {
    const { resultId, featureId } = req.params;


    if (!mongoose.Types.ObjectId.isValid(resultId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid resultId",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(featureId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid featureId",
      });
    }

    const result = await AIResult.findById(resultId);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Result not found",
      });
    }

    const feature = result.featureIdeas.id(featureId);

    if (!feature) {
      return res.status(404).json({
        success: false,
        error: "Feature not found",
      });
    }

    if (feature.feedback !== "accepted") {
      return res.status(400).json({
        success: false,
        error: "Feature not accepted yet",
      });
    }

    return res.json({
      success: true,
      data: feature.engineeringTasks || [],
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
