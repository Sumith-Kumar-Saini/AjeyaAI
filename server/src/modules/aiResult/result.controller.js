import {
  getAllResults,
  getSingleResult,
  getSingleFeature,
  updateFeedback,
} from "./result.service.js";

export const fetchResults =
  async (req, res) => {
    try {
      const data =
        await getAllResults({
          userId:
            req.user?._id ||
            "guest",
          projectId:
            req.query.projectId,
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

export const fetchOneResult =
  async (req, res) => {
    try {
      const data =
        await getSingleResult({
          id: req.params.id,
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

export const fetchFeature =
  async (req, res) => {
    try {
      const data =
        await getSingleFeature({
          featureId:
            req.params
              .featureId,
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

export const changeFeedback =
  async (req, res, next) => {
    try {
      const data =
        await updateFeedback({
          resultId:
            req.params.id,
          featureId:
            req.body
              .featureId,
          feedback:
            req.body
              .feedback,
          userId:
            req.user?._id ||
            "guest",
        });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error)
      res.status(500).json({
        success: false,
        error:
          error.message,
      });
    }
  };