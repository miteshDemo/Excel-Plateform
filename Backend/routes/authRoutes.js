import express from "express";
import { register, login } from "../controller/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/dashboard", protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}`, role: req.user.role });
});

router.get("/admin", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

export default router;
