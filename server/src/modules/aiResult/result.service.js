import AIResult from "../ai/ai.model.js";

export const getAllResults =
  async ({
    userId,
    projectId,
  }) => {
    const query = {
      userId,
    };

    if (projectId) {
      query.projectId =
        projectId;
    }

    return await AIResult.find(
      query
    ).sort({
      createdAt: -1,
    });
  };

export const getSingleResult =
  async ({
    id,
    userId,
  }) => {
    return await AIResult.findOne({
      _id: id,
      userId,
    });
  };

export const getSingleFeature =
  async ({
    featureId,
    userId,
  }) => {
    const result =
      await AIResult.findOne({
        userId,
        "featureIdeas._id":
          featureId,
      });

    if (!result)
      return null;

    return result.featureIdeas.id(
      featureId
    );
  };

export const updateFeedback =
  async ({
    resultId,
    featureId,
    feedback,
    userId,
  }) => {
    const result =
      await AIResult.findOne({
        _id: resultId,
        userId,
      });

    if (!result) {
      throw new Error(
        "Result not found"
      );
    }

    const feature =
      result.featureIdeas.id(
        featureId
      );

    if (!feature) {
      throw new Error(
        "Feature not found"
      );
    }

    feature.feedback =
      feedback;

    await result.save();

    return result;
  };