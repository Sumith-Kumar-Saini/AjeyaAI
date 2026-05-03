import { GoogleGenAI } from "@google/genai";
import AIResult from "../ai/ai.model.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateTasksForFeature = async ({
  resultId,
  featureId,
  userId,
}) => {
  const result = await AIResult.findOne({
    _id: resultId,
    userId,
  });

  if (!result) {
    throw new Error("Result not found");
  }

  const feature = result.featureIdeas.id(featureId);

  if (!feature) {
    throw new Error("Feature not found");
  }

  if (feature.feedback !== "accepted") {
    throw new Error("Accept feature first");
  }

  const prompt = `
Break this feature into maximum 8 small engineering tasks.

Feature:
${feature.title}

Description:
${feature.description}

Return ONLY valid JSON.

{
  "tasks":[
    {
      "task":"",
      "estimate":"",
      "priority":"high"
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });

  const rawText = response.text;

  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("Invalid task JSON response");
  }

  const parsed = JSON.parse(match[0]);

  feature.engineeringTasks = parsed.tasks || [];

  await result.save();

  return feature;
};