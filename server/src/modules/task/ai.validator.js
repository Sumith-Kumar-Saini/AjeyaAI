export const validateAnalyzeBody =
  (req, res, next) => {
    const {
      projectId,
      question,
    } = req.body;

    if (!projectId) {
      return res
        .status(400)
        .json({
          success: false,
          error:
            "projectId is required",
        });
    }

    if (
      !question ||
      question.trim()
        .length < 5
    ) {
      return res
        .status(400)
        .json({
          success: false,
          error:
            "Question must be at least 5 characters",
        });
    }

    next();
  };