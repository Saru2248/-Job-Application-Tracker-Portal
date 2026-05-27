// ============================================================
// controllers/authController.js — Authentication Controller
// ============================================================
// Handles all authentication logic:
//   - registerUser: Creates a new user account
//   - loginUser: Authenticates user and returns JWT token
//   - getMe: Returns the currently logged-in user's profile
//   - updateProfile: Updates user's name or email
//   - changePassword: Changes user password securely
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ============================================================
// Helper: Generate JWT Token
// ============================================================
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                    // Payload: store user ID
    process.env.JWT_SECRET,            // Secret key from .env
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // Token expiry
  );
};

// ============================================================
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ============================================================
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // --- Input Validation ---
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email, and password",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  // --- Check if email already exists ---
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Email already registered. Please log in or use another email.",
    });
  }

  // --- Create new user (password is hashed by pre-save hook in model) ---
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  // --- Generate JWT token ---
  const token = generateToken(user._id);

  // --- Send response ---
  res.status(201).json({
    success: true,
    message: "Account created successfully! Welcome aboard 🎉",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

// ============================================================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ============================================================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // --- Input Validation ---
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  // --- Find user (explicitly select password since it's select:false) ---
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // --- Compare entered password with stored hash ---
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // --- Generate JWT token ---
  const token = generateToken(user._id);

  // --- Send response ---
  res.status(200).json({
    success: true,
    message: `Welcome back, ${user.name}! 👋`,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

// ============================================================
// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private (requires JWT token)
// ============================================================
const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
};

// ============================================================
// @desc    Update user profile (name, email)
// @route   PUT /api/auth/profile
// @access  Private
// ============================================================
const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  // Build update object (only include provided fields)
  const updateFields = {};
  if (name) updateFields.name = name.trim();
  if (email) updateFields.email = email.toLowerCase().trim();

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateFields,
    { new: true, runValidators: true } // Return updated doc and run validators
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

// ============================================================
// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
// ============================================================
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide current and new password",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters",
    });
  }

  // Get user with password
  const user = await User.findById(req.user.id).select("+password");

  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  // Update password (pre-save hook will hash it)
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
};
