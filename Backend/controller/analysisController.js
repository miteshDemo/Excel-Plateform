import Analysis from "../models/Analysis.js";

// ✅ Save Analysis
export const saveAnalysis = async (req, res) => {
  try {
    const { fileId, fileName, chartType, xAxis, yAxis } = req.body;

    if (!fileName || !xAxis || !yAxis || !chartType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const analysis = new Analysis({
      user: req.user._id,
      fileId,
      fileName,
      chartType,
      xAxis,
      yAxis,
      date: new Date(),
    });

    const saved = await analysis.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error saving analysis:", error);
    res.status(500).json({ message: "Server error while saving analysis" });
  }
};

// ✅ Get All Analysis for Logged-in User
export const getAnalysisHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.json(analyses);
  } catch (error) {
    console.error("Error fetching analysis history:", error);
    res.status(500).json({ message: "Server error while fetching analysis" });
  }
};

// ✅ Delete Analysis
export const deleteAnalysis = async (req, res) => {
  try {
    const deleted = await Analysis.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Analysis not found" });
    res.json({ message: "Analysis deleted successfully" });
  } catch (error) {
    console.error("Error deleting analysis:", error);
    res.status(500).json({ message: "Server error while deleting analysis" });
  }
};
