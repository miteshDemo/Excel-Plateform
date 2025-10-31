import Upload from "../models/Upload.js";
import path from "path";
import fs from "fs";

// ✅ Get all uploads for a user
export const getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Save uploaded file info
export const createUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const newUpload = new Upload({
      fileName: req.file.originalname,
      filePath: req.file.path,
      userId: req.user._id,
    });

    await newUpload.save();
    res.status(201).json(newUpload);
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// ✅ Delete upload by ID
export const deleteUpload = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ message: "File not found" });

    // Remove file from disk
    if (fs.existsSync(upload.filePath)) {
      fs.unlinkSync(upload.filePath);
    }

    await upload.deleteOne();
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error: error.message });
  }
};
