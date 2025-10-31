import express from "express";
import multer from "multer";
import path from "path";
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
    const ext = path.extname(file.originalname);
    if (!allowed.includes(ext)) {
      return cb(new Error("Only Excel or CSV files allowed"));
    }
    cb(null, true);
  },
});

// ✅ POST upload
router.post("/", protect, upload.single("file"), async (req, res) => {
  const newFile = new Upload({
    fileName: req.file.originalname,
    filePath: req.file.path,
    userId: req.user.id,
  });
  await newFile.save();
  res.json(newFile);
});

// ✅ GET all uploads
router.get("/", protect, async (req, res) => {
  const files = await Upload.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(files);
});

// ✅ DELETE upload
router.delete("/:id", protect, async (req, res) => {
  const file = await Upload.findById(req.params.id);
  if (!file) return res.status(404).json({ message: "File not found" });
  await file.deleteOne();
  res.json({ message: "File deleted" });
});

export default router;
