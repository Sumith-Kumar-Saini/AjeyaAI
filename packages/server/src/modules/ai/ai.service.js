import { GoogleGenAI } from "@google/genai";
import AIResult from "./ai.model.js";
import { buildPrompt } from "./promptBuilder.js";
import { validateAIJSON } from "./jsonValidator.js";
import { extractJSON } from "./jsonFallback.js";
import Document from "../document/document.model.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeProject = async ({
  projectId,
  question,
  userId,
}) => {
  const docs = await Document.find({
    projectId,
  });

  const docsText = docs
    .map((doc) => doc.content)
    .join("\n\n");

  const prompt = buildPrompt(
    question,
    docsText
  );

  const response =
    await ai.models.generateContent({
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
    throw new Error(
      "Invalid AI JSON response"
    );
  }

  const featureIdeas =
    parsed.featureIdeas.map(
      (item) => ({
        ...item,
        feedback: "neutral",
        engineeringTasks: [],
      })
    );

  const saved =
    await AIResult.create({
      projectId,
      userId,
      question,
      featureIdeas,
      rawResponse: rawText,
      parsedWithFallback:
        fallbackUsed,
    });

  return saved;
};