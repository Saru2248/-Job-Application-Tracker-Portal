// ============================================================
// routes/jobRoutes.js — Job Application Routes
// ============================================================
// All routes are protected — user must be logged in.
//
//   GET    /api/jobs          → Get all user's jobs (with filters)
//   GET    /api/jobs/stats    → Get dashboard statistics
//   GET    /api/jobs/:id      → Get single job by ID
//   POST   /api/jobs          → Create new job application
//   PUT    /api/jobs/:id      → Update job application
//   DELETE /api/jobs/:id      → Delete job application
// ============================================================

const express = require("express");
const router = express.Router();

// Import controller functions
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getDashboardStats,
} = require("../controllers/jobController");

// Import auth middleware — all job routes require login
const { protect } = require("../middleware/authMiddleware");

// Apply protect middleware to ALL routes in this router
router.use(protect);

// ---- Job Application Routes ----
router.get("/stats", getDashboardStats);  // Must be BEFORE /:id to avoid conflict
router.route("/").get(getAllJobs).post(createJob);
router.route("/:id").get(getJobById).put(updateJob).delete(deleteJob);

module.exports = router;
