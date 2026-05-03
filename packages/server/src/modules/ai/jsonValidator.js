export const validateAIJSON = (data) => {
  if (!data) return false;

  if (!Array.isArray(data.featureIdeas)) {
    return false;
  }

  for (const item of data.featureIdeas) {
    if (!item.title) return false;
    if (!item.description) return false;
    if (typeof item.confidenceScore !== "number") return false;
    if (item.conflictNote === undefined) return false;
    if (!item.justification) return false;
  }

  return true;
};