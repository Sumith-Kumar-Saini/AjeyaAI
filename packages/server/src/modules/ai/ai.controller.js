import { analyzeProject } from "./ai.service.js";

export const analyzeQuery = async (
  req,
  res
) => {
  try {
    const result =
      await analyzeProject({
        projectId:
          req.body.projectId,
        question:
          req.body.question,
        userId:
          req.user?._id ||
          "guest",
      });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};