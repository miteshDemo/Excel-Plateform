import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import xlsx from "xlsx";
import Upload from "../models/Upload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [".xlsx", ".csv"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Only Excel or CSV files allowed"));
    }
    cb(null, true);
  },
});

// ✅ POST upload
router.post("/", protect, upload.single("file"), async (req, res) => {
  try {
    const newFile = new Upload({
      fileName: req.file.originalname,
      filePath: req.file.path,
      userId: req.user.id,
    });
    await newFile.save();
    res.status(201).json(newFile);
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ✅ GET all uploads for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const files = await Upload.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching uploads" });
  }
});

// ✅ GET file contents (parse Excel/CSV → JSON)
router.get("/file/:fileName", protect, async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(process.cwd(), "uploads", fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    res.json(jsonData);
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ message: "Error reading file" });
  }
});

// ✅ DELETE upload by ID
router.delete("/:id", protect, async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // delete from disk
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    await file.deleteOne();
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).json({ message: "Error deleting file" });
  }
});

export default router;
