import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    confidenceScore: Number,
    conflictNote: String,
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    task: String,
    estimate: String,
    priority: String,
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    projectId: String,
    userId: String,
    question: String,

    featureIdeas: [featureSchema],
    justification: String,
    uiSuggestions: [String],
    engineeringTasks: [taskSchema],

    rawResponse: String,
    parsedWithFallback: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("AIResult", resultSchema);
