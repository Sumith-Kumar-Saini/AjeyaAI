export const buildPrompt = (question, docsText) => `
You are a Senior AI Product Manager.

Analyze the customer feedback below.

QUESTION:
${question}

CUSTOMER DATA:
${docsText}

Return ONLY valid JSON.

{
  "featureIdeas": [
    {
      "title": "",
      "description": "",
      "confidenceScore": 0.85,
      "conflictNote": ""
    }
  ],
  "justification": "",
  "uiSuggestions": ["", ""],
  "engineeringTasks": [
    {
      "task": "",
      "estimate": "",
      "priority": "high"
    }
  ]
}
`;