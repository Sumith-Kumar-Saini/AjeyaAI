import mongoose from "mongoose";

const schema = new mongoose.Schema({
  projectId: String,
  userId: String,
  filename: String,
  content: String,
  type: String
}, { timestamps:true });

export default mongoose.model("Document", schema);