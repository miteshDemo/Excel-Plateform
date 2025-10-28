import mongoose from "mongoose";

const DownloadSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: "Upload", required: true },
  fileName: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who downloaded (optional)
  type: { type: String }, // visualization_png, visualization_pdf, excel_download etc.
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Download", DownloadSchema);
