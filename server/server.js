// ============================================================
// server.js — Express Application Entry Point
// ============================================================
// This is the main server file. It:
//   1. Loads environment variables from .env
//   2. Connects to MongoDB
//   3. Sets up Express with middleware
//   4. Registers all API routes
//   5. Adds global error handling
//   6. Starts the server on the specified port
// ============================================================

// Load environment variables FIRST (before any other imports)
require("dotenv").config();

// Auto-catches async errors — wrap async route handlers automatically
require("express-async-errors");

// Import required packages
const express = require("express");
const cors = require("cors");

// Import database connection
const connectDB = require("./config/db");

// Import route handlers
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");

// Import global error handler
const errorHandler = require("./middleware/errorHandler");

// ============================================================
// Connect to MongoDB
// ============================================================
connectDB();

// ============================================================
// Initialize Express App
// ============================================================
const app = express();

// ============================================================
// Global Middleware
// ============================================================

// CORS — Allow requests from React frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse incoming JSON request bodies
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// ============================================================
// API Routes
// ============================================================
app.use("/api/auth", authRoutes);   // Authentication routes
app.use("/api/jobs", jobRoutes);    // Job application routes

// ============================================================
// Health Check Route
// ============================================================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Job Tracker API is running!",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// Handle undefined routes (404)
// ============================================================
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ============================================================
// Global Error Handler (must be LAST middleware)
// ============================================================
app.use(errorHandler);

// ============================================================
// Start Server
// ============================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("============================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
  console.log("============================================");
});

// Handle unhandled promise rejections (safety net)
process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Promise Rejection:", err.message);
  process.exit(1);
});
// Trigger nodemon reload

