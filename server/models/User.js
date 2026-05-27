// ============================================================
// models/User.js — Mongoose User Schema
// ============================================================
// Defines the structure of a user document in MongoDB.
// Includes: name, email, password (hashed), timestamps.
// Also includes a pre-save hook to hash the password and
// a method to compare passwords during login.
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,               // Removes leading/trailing spaces
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,             // No two users with same email
      lowercase: true,          // Store as lowercase
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,            // Never return password in queries by default
    },

    profilePicture: {
      type: String,
      default: "",              // Optional profile picture URL
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,           // Adds createdAt and updatedAt automatically
  }
);

// ============================================================
// Pre-save Middleware: Hash password before saving to DB
// ============================================================
userSchema.pre("save", async function (next) {
  // Only hash the password if it was modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(12); // 12 rounds = secure & not too slow
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// ============================================================
// Instance Method: Compare entered password with hashed one
// ============================================================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model
const User = mongoose.model("User", userSchema);

module.exports = User;
