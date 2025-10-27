import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import UploadFile from "../models/Upload.js";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// 🗂️ Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ✅ Allow only Excel or spreadsheet files
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.includes("spreadsheetml") ||
      file.mimetype.includes("excel")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type — only Excel files are allowed"));
    }
  },
});

// 📤 Upload File
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, size, path: filePath } = req.file;

    const file = new UploadFile({
      user: req.user._id, // ✅ ensure consistency with MongoDB ObjectId
      name: originalname,
      size: `${(size / (1024 * 1024)).toFixed(2)} MB`,
      path: filePath,
    });

    await file.save();
    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// 📄 Get user’s recent files
router.get("/recent", protect, async (req, res) => {
  try {
    const files = await UploadFile.find({ user: req.user._id })
      .sort({ createdAt: -1 }) // ✅ ensure using correct timestamp field
      .limit(10);
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch recent files" });
  }
});

// 🔢 Get total file count
router.get("/count", protect, async (req, res) => {
  try {
    const count = await UploadFile.countDocuments({ user: req.user._id });
    res.json({ total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get file count" });
  }
});

// 🗑️ Delete File
router.delete("/:id", protect, async (req, res) => {
  try {
    const file = await UploadFile.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found" });

    fs.unlinkSync(file.path); // remove file from server
    await file.deleteOne();
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete file" });
  }
});

// 📥 Download File
router.get("/download/:id", protect, async (req, res) => {
  try {
    const file = await UploadFile.findOne({ _id: req.params.id, user: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found" });

    res.download(file.path, file.name);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to download file" });
  }
});

// 🧮 Get total analyzed files
router.get("/analysis-count", protect, async (req, res) => {
  try {
    const count = await UploadFile.countDocuments({
      user: req.user._id,
      analyzed: true, // ✅ Make sure you have this field in your model
    });
    res.json({ total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get analysis count" });
  }
});

// 📥 Get total download count
router.get("/download-count", protect, async (req, res) => {
  try {
    const count = await UploadFile.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, totalDownloads: { $sum: "$downloads" } } },
    ]);
    res.json({ total: count[0]?.totalDownloads || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get download count" });
  }
});


export default router;
