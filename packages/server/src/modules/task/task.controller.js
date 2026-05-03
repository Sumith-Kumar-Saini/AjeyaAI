import { generateTasksForFeature } from "./task.service.js";

export const createTasks =
  async (req, res) => {
    try {
      const data =
        await generateTasksForFeature({
          resultId:
            req.params.id,
          featureId:
            req.body.featureId,
          userId:
            req.user?._id ||
            "guest",
        });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error:
          error.message,
      });
    }
  };