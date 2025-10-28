import express from "express";
import Download from "../models/Download.js";
import Upload from "../models/Upload.js";
import { protect } from "../middleware/authMiddleware.js";
import path from "path";
import fs from "fs";

const router = express.Router();

/**
 * POST /api/downloads/record
 * body: { fileId, type }
 * - Creates a Download record and increments a counter on Upload (if you keep one)
 */
router.post("/downloads/record", protect, async (req, res) => {
  try {
    const { fileId, type } = req.body;
    const upload = await Upload.findById(fileId);
    if (!upload) return res.status(404).json({ message: "File not found" });

    // Create record
    const dl = new Download({
      fileId,
      fileName: upload.name,
      userId: req.user._id,
      type
    });
    await dl.save();

    // Optional: increment a downloads field on Upload doc
    upload.downloads = (upload.downloads || 0) + 1;
    await upload.save();

    return res.json({ success: true });
  } catch (err) {
    console.error("Record download error", err);
    res.status(500).json({ message: "Failed to record download" });
  }
});

/**
 * (Optional) GET /api/uploads/download/:id
 * - Serves the actual file (excel blob). If you already have this route,
 *   modify it to increment counters and save Download record before sending attachment.
 */
router.get("/uploads/download/:id", protect, async (req, res) => {
  try {
    const fileId = req.params.id;
    const upload = await Upload.findById(fileId);
    if (!upload) return res.status(404).json({ message: "File not found" });

    // increment and record
    const dl = new Download({ fileId, fileName: upload.name, userId: req.user._id, type: "excel" });
    await dl.save();
    upload.downloads = (upload.downloads || 0) + 1;
    await upload.save();

    // send file
    const filePath = upload.filePath; // replace with actual path field
    return res.download(filePath, upload.name);
  } catch (err) {
    console.error("Download file error", err);
    res.status(500).json({ message: "Failed to download file" });
  }
});

export default router;
