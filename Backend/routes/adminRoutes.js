import express from "express";
import User from "../models/User.js";
import Upload from "../models/Upload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Middleware: Admin-only access (reuse this everywhere)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// ✅ GET: Fetch all users (without passwords)
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Fetch users error:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ✅ GET: Fetch all uploads (with user info populated)
router.get("/uploads", protect, adminOnly, async (req, res) => {
  try {
    const uploads = await Upload.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 }); // newest first
    res.status(200).json(uploads);
  } catch (error) {
    console.error("❌ Fetch uploads error:", error.message);
    res.status(500).json({ message: "Failed to fetch uploads" });
  }
});

// ✅ DELETE: Delete a user + their uploads
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: delete all uploads by that user
    await Upload.deleteMany({ user: user._id });
    await User.findByIdAndDelete(user._id);

    res.json({ message: "User and their uploads deleted successfully" });
  } catch (error) {
    console.error("❌ Delete user error:", error.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// ✅ DELETE: Delete an upload
router.delete("/uploads/:id", protect, adminOnly, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ message: "Upload not found" });

    await upload.deleteOne();
    res.json({ message: "Upload deleted successfully" });
  } catch (error) {
    console.error("❌ Delete upload error:", error.message);
    res.status(500).json({ message: "Failed to delete upload" });
  }
});

export default router;
