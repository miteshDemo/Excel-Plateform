import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  size: String,
  path: String,
  uploadDate: { type: Date, default: Date.now },
  downloadCount: { type: Number, default: 0 },
  analysisCount: { type: Number, default: 0 },
});

export default mongoose.model("Upload", uploadSchema);
