import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: "Upload" },
  fileName: { type: String, required: true },
  chartType: { type: String, required: true },
  xAxis: { type: String, required: true },
  yAxis: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Analysis = mongoose.model("Analysis", analysisSchema);
export default Analysis;
