import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  saveAnalysis,
  getAnalysisHistory,
  deleteAnalysis,
} from "../controller/analysisController.js";


const router = express.Router();

router.post("/", protect, saveAnalysis);
router.get("/", protect, getAnalysisHistory);
router.delete("/:id", protect, deleteAnalysis);

export default router;
