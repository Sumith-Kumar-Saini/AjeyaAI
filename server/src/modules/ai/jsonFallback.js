export const extractJSON = (text) => {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};