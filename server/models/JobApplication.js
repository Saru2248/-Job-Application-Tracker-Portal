// ============================================================
// models/JobApplication.js — Mongoose Job Application Schema
// ============================================================
// Defines the structure of a job application document.
// Each application belongs to a user (via user field reference).
// Tracks: company, role, status, dates, notes, salary, etc.
// ============================================================

const mongoose = require("mongoose");

// Job Application Status Options
const STATUS_OPTIONS = [
  "Wishlist",    // Saved for later
  "Applied",     // Application submitted
  "Interviewing",// Currently in interview process
  "Offer",       // Got an offer
  "Rejected",    // Application rejected
  "Withdrawn",   // Withdrew application
];

const jobApplicationSchema = new mongoose.Schema(
  {
    // Reference to the User who created this application
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster queries
    },

    // Company Information
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },

    jobDescription: {
      type: String,
      trim: true,
      maxlength: [2000, "Job description cannot exceed 2000 characters"],
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "Remote",
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"],
      default: "Full-time",
    },

    // Application Status
    status: {
      type: String,
      enum: STATUS_OPTIONS,
      default: "Applied",
      required: true,
    },

    // Salary Range (optional)
    salaryMin: {
      type: Number,
      default: null,
    },

    salaryMax: {
      type: Number,
      default: null,
    },

    salaryCurrency: {
      type: String,
      default: "INR",
    },

    // Important Dates
    appliedDate: {
      type: Date,
      default: Date.now,
    },

    interviewDate: {
      type: Date,
      default: null,
    },

    offerDeadline: {
      type: Date,
      default: null,
    },

    // Application Source
    jobPortal: {
      type: String,
      trim: true,
      default: "", // e.g., LinkedIn, Naukri, Indeed, Company Website
    },

    jobUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // HR / Recruiter Contact
    contactName: {
      type: String,
      trim: true,
      default: "",
    },

    contactEmail: {
      type: String,
      trim: true,
      default: "",
    },

    // Personal Notes
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
      default: "",
    },

    // Priority flag
    isPriority: {
      type: Boolean,
      default: false,
    },

    // Skills required for this job
    skills: {
      type: [String],
      default: [],
    },

    // Resume version used
    resumeVersion: {
      type: String,
      trim: true,
      default: "v1",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// ============================================================
// Virtual: Computed full salary range string
// ============================================================
jobApplicationSchema.virtual("salaryRange").get(function () {
  if (this.salaryMin && this.salaryMax) {
    return `${this.salaryCurrency} ${this.salaryMin.toLocaleString()} - ${this.salaryMax.toLocaleString()}`;
  }
  return "Not specified";
});

// ============================================================
// Index for efficient filtering and searching
// ============================================================
jobApplicationSchema.index({ user: 1, status: 1 });
jobApplicationSchema.index({ user: 1, companyName: "text", jobTitle: "text" });

// Export the model
const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

module.exports = JobApplication;
