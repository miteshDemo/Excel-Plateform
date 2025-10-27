import Analysis from "../models/Analysis.js";

export const getAnalysisHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user's past analysis records
    const analyses = await Analysis.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("fileName createdAt summary results");

    res.json(analyses);
  } catch (error) {
    console.error("Error fetching analysis history:", error);
    res.status(500).json({ message: "Server error while fetching analysis history" });
  }
};
