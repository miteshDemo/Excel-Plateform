import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: "Upload", required: true },
  fileName: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  result: { type: Object }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Analysis", AnalysisSchema);
