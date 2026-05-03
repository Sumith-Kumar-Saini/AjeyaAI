import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    task: String,
    estimate: String,
    priority: String,
  },
  { _id: false }
);

const featureSchema = new mongoose.Schema({
  title: String,
  description: String,
  confidenceScore: Number,
  conflictNote: String,
  justification: String,

  feedback: {
    type: String,
    enum: ["accepted", "rejected", "neutral"],
    default: "neutral",
  },

  engineeringTasks: [taskSchema],
});

const resultSchema = new mongoose.Schema(
  {
    projectId: String,
    userId: String,
    question: String,

    featureIdeas: [featureSchema],

    rawResponse: String,
    parsedWithFallback: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AIResult", resultSchema);