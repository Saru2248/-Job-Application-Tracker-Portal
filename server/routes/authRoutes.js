// ============================================================
// routes/authRoutes.js — Authentication Routes
// ============================================================
// Maps HTTP endpoints to authentication controller functions.
//
// Public Routes (no auth needed):
//   POST /api/auth/register  → Register new user
//   POST /api/auth/login     → Login and get JWT token
//
// Private Routes (require JWT token):
//   GET  /api/auth/me           → Get current user profile
//   PUT  /api/auth/profile      → Update profile
//   PUT  /api/auth/change-password → Change password
// ============================================================

const express = require("express");
const router = express.Router();

// Import controller functions
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

// Import protect middleware for private routes
const { protect } = require("../middleware/authMiddleware");

// ---- Public Routes ----
router.post("/register", registerUser);
router.post("/login", loginUser);

// ---- Private Routes (require authentication) ----
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
