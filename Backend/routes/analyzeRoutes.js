import express from "express";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import UploadFile from "../models/Upload.js";
import Analysis from "../models/Analysis.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route GET /api/analyze/:id
 * @desc Analyze Excel file by ID
 * @access Private
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const file = await UploadFile.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) {
      return res.status(404).json({ message: "File not found for this user." });
    }

    // ✅ Ensure file exists on disk
    if (!file.path || !fs.existsSync(file.path)) {
      console.error("❌ File not found on disk:", file.path);
      return res.status(404).json({ message: "Uploaded file not found on server." });
    }

    // ✅ Safely read Excel file
    let workbook;
    try {
      workbook = xlsx.readFile(file.path);
    } catch (e) {
      console.error("❌ Failed to read Excel file:", e.message);
      return res.status(400).json({ message: "Invalid or corrupted Excel file." });
    }

    const sheetNames = workbook.SheetNames;
    if (!sheetNames || sheetNames.length === 0) {
      return res.status(400).json({ message: "No sheets found in Excel file." });
    }

    const firstSheetName = sheetNames[0];
    const firstSheet = workbook.Sheets[firstSheetName];
    const jsonData = xlsx.utils.sheet_to_json(firstSheet);

    if (!jsonData.length) {
      return res.status(400).json({ message: "Empty or invalid Excel sheet." });
    }

    // ✅ Generate column statistics
    const columnNames = Object.keys(jsonData[0]);
    const columnStats = columnNames.map((col) => {
      const values = jsonData.map((row) => row[col]);
      const validValues = values.filter((v) => v !== undefined && v !== null && v !== "");
      const unique = new Set(validValues).size;
      const empty = values.length - validValues.length;
      const sample = validValues.find((v) => v !== undefined && v !== null);
      const type = sample ? typeof sample : "unknown";

      return { name: col, type, unique, empty };
    });

    // ✅ Chart data (Top 5 frequent values in first column)
    const firstCol = columnNames[0];
    const valueCount = {};
    jsonData.forEach((row) => {
      const val = row[firstCol];
      if (val) valueCount[val] = (valueCount[val] || 0) + 1;
    });

    const chartData = Object.entries(valueCount)
      .sort((a, b) => b[1] - a[1]) // Sort by frequency
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // ✅ Save analysis in DB
    const analysis = await Analysis.create({
      user: req.user._id,
      fileId: file._id,
      fileName: file.name,
      sheetName: firstSheetName,
      columnStats,
      chartData,
    });

    res.json({
      success: true,
      message: "File analyzed successfully.",
      fileName: file.name,
      sheetNames,
      columnStats,
      chartData,
    });
  } catch (err) {
    console.error("🔥 Analysis route error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while analyzing file.",
      error: err.message,
    });
  }
});

/**
 * @route GET /api/analyze/history
 * @desc Fetch user's analysis history
 * @access Private
 */
router.get("/history", protect, async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("fileName createdAt sheetName");
    res.json({ success: true, history });
  } catch (err) {
    console.error("🔥 Error fetching analysis history:", err);
    res.status(500).json({ message: "Failed to fetch analysis history." });
  }
});

export default router;
