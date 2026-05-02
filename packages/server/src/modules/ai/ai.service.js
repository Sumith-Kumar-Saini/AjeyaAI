import { GoogleGenAI } from "@google/genai";
import AIResult from "./ai.model.js";
import { buildPrompt } from "./promptBuilder.js";
import { validateAIJSON } from "./jsonValidator.js";
import { extractJSON } from "./jsonFallback.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeProject = async ({ projectId, question, userId }) => {
  const docsText = `
Users say bulk upload is missing.
Many users want dashboard analytics.
Some users complain onboarding is confusing.
Need faster CSV import.
`;

  const prompt = buildPrompt(question, docsText);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const rawText = response.text;

  let parsed;
  let fallbackUsed = false;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    parsed = extractJSON(rawText);
    fallbackUsed = true;
  }

  if (!validateAIJSON(parsed)) {
    throw new Error("Invalid AI JSON response");
  }

  const saved = await AIResult.create({
    projectId,
    userId,
    question,

    featureIdeas: parsed.featureIdeas,
    justification: parsed.justification,
    uiSuggestions: parsed.uiSuggestions,
    engineeringTasks: parsed.engineeringTasks,

    rawResponse: rawText,
    parsedWithFallback: fallbackUsed,
  });

  return saved;
};