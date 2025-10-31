import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Upload", uploadSchema);
