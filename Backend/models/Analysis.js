import mongoose from "mongoose";

const columnStatSchema = new mongoose.Schema({
  name: String,
  type: String,
  unique: Number,
  empty: Number,
});

const chartDataSchema = new mongoose.Schema({
  name: String,
  count: Number,
});

const analysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "UploadFile", required: true },
    fileName: { type: String, required: true },
    sheetName: { type: String, required: true },
    columnStats: [columnStatSchema],
    chartData: [chartDataSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
