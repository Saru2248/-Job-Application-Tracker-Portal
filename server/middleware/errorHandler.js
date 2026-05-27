// ============================================================
// middleware/errorHandler.js — Global Error Handler
// ============================================================
// This middleware catches all errors thrown in route handlers.
// It formats errors consistently and returns JSON responses.
// Must be registered LAST in server.js (after all routes).
// ============================================================

const errorHandler = (err, req, res, next) => {
  // Log error for debugging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.error("💥 Error:", err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ---- Mongoose Specific Error Handling ----

  // Mongoose: Invalid ObjectId (e.g., malformed ID in URL)
  if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found with id: ${err.value}`;
  }

  // Mongoose: Duplicate key (e.g., duplicate email on register)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use a different ${field}.`;
  }

  // Mongoose: Validation errors (e.g., required fields missing)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // JWT: Token expired
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired. Please log in again.";
  }

  // JWT: Invalid token
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  // Send formatted error response
  res.status(statusCode).json({
    success: false,
    message,
    // Only include stack trace in development mode
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
