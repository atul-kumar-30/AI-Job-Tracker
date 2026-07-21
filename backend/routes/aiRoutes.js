import express from "express";
import { generateCoverLetter, calculateAtsScore } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/cover-letter").post(protect, generateCoverLetter);
router.route("/ats-score").post(protect, calculateAtsScore); // NEW ROUTE

export default router;