import express from "express";
import xlsx from "xlsx";
import fs from "fs";
import UploadFile from "../models/Upload.js";
import Analysis from "../models/Analysis.js"; // new model for saving analysis history
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
    if (!file) return res.status(404).json({ message: "File not found" });

    // Read Excel
    const workbook = xlsx.readFile(file.path);
    const sheetNames = workbook.SheetNames;
    const firstSheet = workbook.Sheets[sheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(firstSheet);

    if (!jsonData.length) {
      return res.status(400).json({ message: "Empty or invalid Excel sheet" });
    }

    // Column stats
    const columnNames = Object.keys(jsonData[0]);
    const columnStats = columnNames.map((col) => {
      const values = jsonData.map((r) => r[col]);
      const unique = new Set(values.filter((v) => v !== undefined && v !== null && v !== "")).size;
      const empty = values.filter((v) => v === undefined || v === null || v === "").length;
      const type = typeof values.find((v) => v !== undefined && v !== null) || "unknown";
      return { name: col, type, unique, empty };
    });

    // Chart data (top 5 of first column)
    const firstCol = columnNames[0];
    const valueCount = {};
    jsonData.forEach((row) => {
      const val = row[firstCol];
      if (val) valueCount[val] = (valueCount[val] || 0) + 1;
    });
    const chartData = Object.entries(valueCount)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Save analysis to DB
    const analysis = await Analysis.create({
      user: req.user._id,
      fileId: file._id,
      fileName: file.name,
      sheetName: sheetNames[0],
      columnStats,
      chartData,
    });

    res.json({
      fileName: file.name,
      sheetNames,
      columnStats,
      chartData,
      saved: true,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({ message: "Failed to analyze file" });
  }
});

export default router;
