import User from "../models/userModel.js";
import Job from "../models/jobModel.js";
import bcrypt from "bcryptjs";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// @desc    Update user profile (AI context)
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, role, bio, skills, profilePhoto } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, role, bio, skills, profilePhoto },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error changing password" });
  }
};

// @desc    Delete user account and all their jobs
// @route   DELETE /api/users/profile
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    // Delete all jobs associated with this user
    await Job.deleteMany({ user: req.user.id });
    
    // Delete the user
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ message: "Account and data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting account" });
  }
};