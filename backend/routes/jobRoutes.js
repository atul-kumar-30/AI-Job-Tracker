import express from "express";
import { createJob, getJobs, updateJob } from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes for Jobs
router.route("/")
  .get(protect, getJobs)
  .post(protect, createJob);

// NEW: Route for updating a job (Drag and Drop)
router.route("/:id").put(protect, updateJob);

export default router;