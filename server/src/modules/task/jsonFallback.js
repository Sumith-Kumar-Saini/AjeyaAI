export const extractJSON = (text) => {
  try {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const match = cleaned.match(/\{[\s\S]*\}/);

    if (!match) return null;

    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};