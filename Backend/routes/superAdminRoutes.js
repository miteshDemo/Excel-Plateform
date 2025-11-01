import express from "express";
import { protect, superAdminOnly } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/admins", protect, superAdminOnly, async (req, res) => {
  const admins = await User.find({ role: "admin" }).select("-password");
  res.json(admins);
});

export default router;
