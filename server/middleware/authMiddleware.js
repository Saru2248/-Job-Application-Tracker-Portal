// ============================================================
// middleware/authMiddleware.js — JWT Authentication Middleware
// ============================================================
// This middleware protects routes that require authentication.
// It checks for a Bearer token in the Authorization header,
// verifies it using JWT, and attaches the user to req.user.
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ============================================================
// protect — Verify JWT and attach user to request
// ============================================================
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token: "Bearer <token>" → split → take index 1
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object (exclude password field)
      // decoded.id is the user ID we stored when creating the token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found. Token invalid.",
        });
      }

      // Move to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);

      // Handle specific JWT errors
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please log in again.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Not authorized. Invalid token.",
      });
    }
  }

  // No token provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No token provided.",
    });
  }
};

// ============================================================
// authorize — Role-based access control middleware
// Usage: authorize("admin") to restrict to admins only
// ============================================================
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
