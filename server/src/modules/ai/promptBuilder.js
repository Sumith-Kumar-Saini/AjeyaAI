export const buildPrompt = (question, docsText) => `
You are a Senior AI Product Manager.

Analyze the user feedback and answer this product question.

QUESTION:
${question}

CUSTOMER FEEDBACK:
${docsText}

Return ONLY valid JSON.

{
  "featureIdeas": [
    {
      "title": "",
      "description": "",
      "confidenceScore": 0.85,
      "conflictNote": "",
      "justification": ""
    }
  ]
}
`;