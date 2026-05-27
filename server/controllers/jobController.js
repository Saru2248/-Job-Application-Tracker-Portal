// ============================================================
// controllers/jobController.js — Job Application Controller
// ============================================================
// Handles all CRUD operations for job applications:
//   - getAllJobs: Get all jobs for logged-in user (with filters)
//   - getJobById: Get a single job application
//   - createJob: Add a new job application
//   - updateJob: Update an existing job application
//   - deleteJob: Delete a job application
//   - getDashboardStats: Get summary statistics for dashboard
// ============================================================

const JobApplication = require("../models/JobApplication");

// ============================================================
// @desc    Get all job applications for the logged-in user
// @route   GET /api/jobs
// @access  Private
// @query   status, jobType, search, sortBy, page, limit
// ============================================================
const getAllJobs = async (req, res) => {
  const {
    status,
    jobType,
    search,
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
    isPriority,
  } = req.query;

  // --- Build the filter object ---
  const filter = { user: req.user.id }; // Always filter by logged-in user

  // Filter by status if provided
  if (status && status !== "All") {
    filter.status = status;
  }

  // Filter by job type if provided
  if (jobType && jobType !== "All") {
    filter.jobType = jobType;
  }

  // Filter priority jobs
  if (isPriority === "true") {
    filter.isPriority = true;
  }

  // Search by company name or job title (case-insensitive)
  if (search) {
    filter.$or = [
      { companyName: { $regex: search, $options: "i" } },
      { jobTitle: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  // --- Pagination ---
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // --- Sort ---
  const sortOrder = order === "asc" ? 1 : -1;
  const sortObj = { [sortBy]: sortOrder };

  // --- Execute Query ---
  const [jobs, total] = await Promise.all([
    JobApplication.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean(), // .lean() returns plain JS objects (faster)
    JobApplication.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: jobs.length,
    total,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    jobs,
  });
};

// ============================================================
// @desc    Get a single job application by ID
// @route   GET /api/jobs/:id
// @access  Private
// ============================================================
const getJobById = async (req, res) => {
  const job = await JobApplication.findOne({
    _id: req.params.id,
    user: req.user.id, // Ensure user owns this job
  });

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job application not found",
    });
  }

  res.status(200).json({
    success: true,
    job,
  });
};

// ============================================================
// @desc    Create a new job application
// @route   POST /api/jobs
// @access  Private
// ============================================================
const createJob = async (req, res) => {
  const {
    companyName,
    jobTitle,
    jobDescription,
    location,
    jobType,
    status,
    salaryMin,
    salaryMax,
    salaryCurrency,
    appliedDate,
    interviewDate,
    offerDeadline,
    jobPortal,
    jobUrl,
    contactName,
    contactEmail,
    notes,
    isPriority,
    skills,
    resumeVersion,
  } = req.body;

  // --- Basic validation ---
  if (!companyName || !jobTitle) {
    return res.status(400).json({
      success: false,
      message: "Company name and job title are required",
    });
  }

  // --- Create job application ---
  const job = await JobApplication.create({
    user: req.user.id, // Link to logged-in user
    companyName,
    jobTitle,
    jobDescription,
    location,
    jobType,
    status,
    salaryMin,
    salaryMax,
    salaryCurrency,
    appliedDate,
    interviewDate,
    offerDeadline,
    jobPortal,
    jobUrl,
    contactName,
    contactEmail,
    notes,
    isPriority,
    skills: skills || [],
    resumeVersion,
  });

  res.status(201).json({
    success: true,
    message: "Job application added successfully! 🚀",
    job,
  });
};

// ============================================================
// @desc    Update a job application
// @route   PUT /api/jobs/:id
// @access  Private
// ============================================================
const updateJob = async (req, res) => {
  // Find job and verify ownership
  let job = await JobApplication.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job application not found",
    });
  }

  // Update the job with provided fields
  job = await JobApplication.findByIdAndUpdate(
    req.params.id,
    req.body, // Update with all provided fields
    { new: true, runValidators: true } // Return updated doc
  );

  res.status(200).json({
    success: true,
    message: "Job application updated successfully ✅",
    job,
  });
};

// ============================================================
// @desc    Delete a job application
// @route   DELETE /api/jobs/:id
// @access  Private
// ============================================================
const deleteJob = async (req, res) => {
  // Find job and verify ownership
  const job = await JobApplication.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job application not found",
    });
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job application deleted successfully 🗑️",
  });
};

// ============================================================
// @desc    Get dashboard statistics
// @route   GET /api/jobs/stats
// @access  Private
// ============================================================
const getDashboardStats = async (req, res) => {
  const userId = req.user.id;

  // Use MongoDB aggregation to get counts by status
  const statusCounts = await JobApplication.aggregate([
    { $match: { user: require("mongoose").Types.ObjectId.createFromHexString(userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  // Get total applications count
  const total = await JobApplication.countDocuments({ user: userId });

  // Get recent applications (last 5)
  const recentJobs = await JobApplication.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("companyName jobTitle status appliedDate");

  // Get upcoming interviews
  const upcomingInterviews = await JobApplication.find({
    user: userId,
    interviewDate: { $gte: new Date() },
    status: "Interviewing",
  })
    .sort({ interviewDate: 1 })
    .limit(3)
    .select("companyName jobTitle interviewDate");

  // Format statusCounts into an easy-to-use object
  const statusObj = {};
  statusCounts.forEach((item) => {
    statusObj[item._id] = item.count;
  });

  res.status(200).json({
    success: true,
    stats: {
      total,
      wishlist: statusObj["Wishlist"] || 0,
      applied: statusObj["Applied"] || 0,
      interviewing: statusObj["Interviewing"] || 0,
      offers: statusObj["Offer"] || 0,
      rejected: statusObj["Rejected"] || 0,
      withdrawn: statusObj["Withdrawn"] || 0,
    },
    recentJobs,
    upcomingInterviews,
  });
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getDashboardStats,
};
