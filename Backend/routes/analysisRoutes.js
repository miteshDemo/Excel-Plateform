import express from "express";
import xlsx from "xlsx";
import Analysis from "../models/Analysis.js";
import Upload from "../models/Upload.js"; // your upload model
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * POST /api/uploads/analyze/:id
 * - Protected
 * - Reads the uploaded Excel (from Upload record), computes analysis,
 *   saves it to Analyses collection, returns the saved analysis
 */
router.post("/uploads/analyze/:id", protect, async (req, res) => {
  try {
    const fileId = req.params.id;
    const upload = await Upload.findById(fileId);
    if (!upload) return res.status(404).json({ message: "File not found" });

    // If your Upload model stores a path to the saved Excel file, use it:
    // e.g. upload.path or upload.filePath
    // Here we'll assume upload.filePath exists
    const workbook = xlsx.readFile(upload.filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

    // Basic analysis
    const summary = {
      totalRows: rows.length,
      totalColumns: rows[0] ? Object.keys(rows[0]).length : 0,
      missingValues: 0
    };

    const columnStats = {};
    const dataQuality = { missingValues: 0, completeRows: 0 };
    const insights = [];

    if (rows.length > 0) {
      // Build stats per column
      const cols = Object.keys(rows[0]).filter(c => !["_id", "createdAt"].includes(c));
      cols.forEach(col => {
        const values = rows.map(r => r[col]).filter(v => v !== null && v !== undefined && v !== "");
        const numericValues = values.filter(v => !isNaN(parseFloat(v))).map(Number);

        columnStats[col] = {
          count: values.length,
          missing: rows.length - values.length,
          unique: new Set(values).size
        };

        if (numericValues.length > 0) {
          columnStats[col].stats = {
            min: Math.min(...numericValues),
            max: Math.max(...numericValues),
            mean: numericValues.reduce((a,b) => a+b, 0) / numericValues.length,
          };
        }

        dataQuality.missingValues += rows.length - values.length;
      });

      dataQuality.completeRows = rows.filter(row => {
        return cols.every(c => row[c] !== null && row[c] !== undefined && row[c] !== "");
      }).length;

      // Simple insights
      const numericCols = Object.keys(columnStats).filter(c => !!columnStats[c].stats);
      if (numericCols.length >= 2) insights.push("Multiple numeric columns detected — correlation possible");
      if (dataQuality.missingValues > 0) insights.push(`${dataQuality.missingValues} missing values found`);
    }

    const result = {
      summary,
      columnStats,
      dataQuality,
      insights
    };

    const analysisDoc = new Analysis({
      fileId: upload._id,
      fileName: upload.name,
      userId: req.user._id,
      result
    });

    await analysisDoc.save();
    return res.json(analysisDoc);
  } catch (err) {
    console.error("Analysis error:", err);
    return res.status(500).json({ message: "Analysis failed" });
  }
});

/**
 * GET /api/analyses/recent
 * returns recent analyses for the logged-in user (or you can return all analyses)
 */
router.get("/analyses/recent", protect, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
    return res.json(analyses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch analyses" });
  }
});

export default router;
