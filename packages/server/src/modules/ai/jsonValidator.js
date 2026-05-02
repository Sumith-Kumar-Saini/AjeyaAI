export const validateAIJSON = (data) => {
  if (!data) return false;
  if (!Array.isArray(data.featureIdeas)) return false;
  if (!data.justification) return false;
  if (!Array.isArray(data.uiSuggestions)) return false;
  if (!Array.isArray(data.engineeringTasks)) return false;

  return true;
};
