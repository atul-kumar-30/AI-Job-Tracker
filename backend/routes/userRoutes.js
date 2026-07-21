import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"; // Ensure authMiddleware also exports correctly!

const router = express.Router();

// All these routes require the user to be logged in (protected)
router.route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteAccount);

router.route("/change-password").put(protect, changePassword);

export default router;