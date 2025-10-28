import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "UploadFile", required: true },
    fileName: String,
    sheetName: String,
    columnStats: [
      {
        name: String,
        type: String,
        unique: Number,
        empty: Number,
      },
    ],
    chartData: [{ name: String, count: Number }],
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
