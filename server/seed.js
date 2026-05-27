// ============================================================
// seed.js — Demo Data Seeder
// ============================================================
// Run this script to populate the database with:
//   - 1 Demo User: demo@jobtracker.com / demo123
//   - 15 Realistic Job Applications across all statuses
//
// Usage: node seed.js
// ============================================================

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const JobApplication = require("./models/JobApplication");

const connectDB = require("./config/db");

// ── Demo Job Applications Data ──────────────────────────────
const demoJobs = [
  {
    companyName: "Google",
    jobTitle: "Software Engineer III",
    jobDescription: "Build and maintain large-scale distributed systems. Work on Google Search infrastructure.",
    location: "Bangalore, India",
    jobType: "Full-time",
    status: "Interviewing",
    salaryMin: 2500000,
    salaryMax: 4000000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    interviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    jobPortal: "LinkedIn",
    jobUrl: "https://careers.google.com",
    contactName: "Priya Sharma",
    contactEmail: "priya.sharma@google.com",
    notes: "Completed 2 coding rounds. System design round scheduled next. Prepare LLD & HLD.",
    isPriority: true,
    skills: ["Java", "Distributed Systems", "Kubernetes", "Go"],
    resumeVersion: "v3",
  },
  {
    companyName: "Microsoft",
    jobTitle: "Full Stack Developer",
    jobDescription: "Work on Azure DevOps platform. React + .NET Core stack.",
    location: "Hyderabad, India",
    jobType: "Full-time",
    status: "Applied",
    salaryMin: 1800000,
    salaryMax: 2800000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    jobPortal: "Company Website",
    jobUrl: "https://careers.microsoft.com",
    contactName: "Rahul Verma",
    contactEmail: "rahul.verma@microsoft.com",
    notes: "Applied via referral from college senior. Waiting for HR callback.",
    isPriority: true,
    skills: ["React", ".NET Core", "TypeScript", "Azure", "SQL Server"],
    resumeVersion: "v3",
  },
  {
    companyName: "Amazon",
    jobTitle: "SDE-2 (Backend)",
    jobDescription: "Design and implement microservices for Amazon retail platform.",
    location: "Chennai, India",
    jobType: "Full-time",
    status: "Offer",
    salaryMin: 2200000,
    salaryMax: 3500000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    interviewDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    offerDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    jobPortal: "LinkedIn",
    jobUrl: "https://amazon.jobs",
    contactName: "Anjali Mehta",
    contactEmail: "anjali.mehta@amazon.com",
    notes: "Got verbal offer! Written letter expected soon. Need to negotiate CTC. Offer deadline in 7 days.",
    isPriority: true,
    skills: ["Java", "Spring Boot", "AWS", "DynamoDB", "Microservices"],
    resumeVersion: "v2",
  },
  {
    companyName: "Flipkart",
    jobTitle: "React Developer",
    jobDescription: "Build and optimize Flipkart's e-commerce frontend using React and Redux.",
    location: "Bangalore, India",
    jobType: "Full-time",
    status: "Rejected",
    salaryMin: 1200000,
    salaryMax: 2000000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    interviewDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    jobPortal: "Naukri",
    jobUrl: "https://careers.flipkart.com",
    contactName: "Vikram Singh",
    contactEmail: "vikram.singh@flipkart.com",
    notes: "Failed the machine coding round. Need to practice more React performance optimizations.",
    isPriority: false,
    skills: ["React", "Redux", "JavaScript", "CSS", "Performance Optimization"],
    resumeVersion: "v2",
  },
  {
    companyName: "Razorpay",
    jobTitle: "Backend Engineer - Payments",
    jobDescription: "Build scalable payment infrastructure. Work on fraud detection and transaction systems.",
    location: "Bangalore, India",
    jobType: "Full-time",
    status: "Applied",
    salaryMin: 1500000,
    salaryMax: 2500000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    jobPortal: "AngelList",
    jobUrl: "https://razorpay.com/jobs",
    notes: "Exciting fintech opportunity. Strong match with my Node.js background.",
    isPriority: false,
    skills: ["Node.js", "PostgreSQL", "Redis", "Kafka", "Payment Systems"],
    resumeVersion: "v3",
  },
  {
    companyName: "Zomato",
    jobTitle: "Node.js Backend Developer",
    jobDescription: "Develop and maintain APIs for Zomato's food delivery platform.",
    location: "Gurugram, India",
    jobType: "Full-time",
    status: "Wishlist",
    salaryMin: 1000000,
    salaryMax: 1800000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    jobPortal: "LinkedIn",
    jobUrl: "https://www.zomato.com/careers",
    notes: "Good product, interesting engineering challenges. Planning to apply this week.",
    isPriority: false,
    skills: ["Node.js", "MongoDB", "Docker", "RabbitMQ", "REST APIs"],
    resumeVersion: "v3",
  },
  {
    companyName: "Atlassian",
    jobTitle: "Full Stack Engineer",
    jobDescription: "Work on Jira and Confluence cloud products. Global remote team.",
    location: "Remote",
    jobType: "Full-time",
    status: "Interviewing",
    salaryMin: 3000000,
    salaryMax: 5000000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    interviewDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    jobPortal: "Company Website",
    jobUrl: "https://www.atlassian.com/company/careers",
    contactName: "Sarah Thompson",
    contactEmail: "s.thompson@atlassian.com",
    notes: "First round was a cultural fit interview — went great! Technical round tomorrow.",
    isPriority: true,
    skills: ["React", "Java", "AWS", "Microservices", "GraphQL"],
    resumeVersion: "v3",
  },
  {
    companyName: "Infosys",
    jobTitle: "Technology Analyst",
    jobDescription: "Enterprise software development. Client-facing projects across domains.",
    location: "Pune, India",
    jobType: "Full-time",
    status: "Withdrawn",
    salaryMin: 700000,
    salaryMax: 1000000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    jobPortal: "Company Website",
    jobUrl: "https://www.infosys.com/careers",
    notes: "Withdrew after getting better offers. Compensation was not competitive.",
    isPriority: false,
    skills: ["Java", "Spring", "Oracle DB", "Agile"],
    resumeVersion: "v1",
  },
  {
    companyName: "Swiggy",
    jobTitle: "Software Development Engineer",
    jobDescription: "Work on hyperlocal logistics and delivery partner app.",
    location: "Bangalore, India",
    jobType: "Full-time",
    status: "Applied",
    salaryMin: 1200000,
    salaryMax: 2000000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    jobPortal: "Instahyre",
    jobUrl: "https://careers.swiggy.com",
    notes: "Applied via Instahyre. Profile viewed by recruiter.",
    isPriority: false,
    skills: ["Python", "Django", "PostgreSQL", "Redis", "Docker"],
    resumeVersion: "v3",
  },
  {
    companyName: "PhonePe",
    jobTitle: "Senior Software Engineer",
    jobDescription: "Build payment and financial services platform used by 500M+ users.",
    location: "Bangalore, India",
    jobType: "Full-time",
    status: "Offer",
    salaryMin: 2000000,
    salaryMax: 3200000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    interviewDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    offerDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    jobPortal: "LinkedIn",
    jobUrl: "https://phonepe.com/en-in/careers",
    contactName: "Deepak Nair",
    contactEmail: "deepak.nair@phonepe.com",
    notes: "Received official offer letter. 25 LPA + ESOPs. Comparing with Amazon offer.",
    isPriority: true,
    skills: ["Kotlin", "Spring Boot", "Kafka", "Cassandra", "Microservices"],
    resumeVersion: "v2",
  },
  {
    companyName: "Meesho",
    jobTitle: "Frontend Engineer (React Native)",
    jobDescription: "Build mobile-first e-commerce experience for Tier 2 & 3 India.",
    location: "Bangalore, India",
    jobType: "Full-time",
    status: "Wishlist",
    salaryMin: 1000000,
    salaryMax: 1800000,
    salaryCurrency: "INR",
    appliedDate: new Date(),
    jobPortal: "LinkedIn",
    jobUrl: "https://meesho.io/careers",
    notes: "Interesting mission-driven company. Will apply once I complete React Native course.",
    isPriority: false,
    skills: ["React Native", "JavaScript", "Redux", "Firebase"],
    resumeVersion: "v3",
  },
  {
    companyName: "CRED",
    jobTitle: "Backend Engineer - Platform",
    jobDescription: "Build internal tooling and platform infrastructure for CRED's engineering teams.",
    location: "Bangalore, India",
    jobType: "Full-time",
    status: "Rejected",
    salaryMin: 1500000,
    salaryMax: 2500000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
    interviewDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    jobPortal: "Cutshort",
    jobUrl: "https://careers.cred.club",
    notes: "Cleared screening, failed final system design. Need to work more on DB sharding concepts.",
    isPriority: false,
    skills: ["Go", "gRPC", "Kubernetes", "PostgreSQL", "Terraform"],
    resumeVersion: "v2",
  },
  {
    companyName: "Zerodha",
    jobTitle: "Software Developer",
    jobDescription: "Work on trading platform backend. High performance, low latency systems.",
    location: "Bangalore, India",
    jobType: "Full-time",
    status: "Applied",
    salaryMin: 1200000,
    salaryMax: 2000000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    jobPortal: "Company Website",
    jobUrl: "https://zerodha.com/careers",
    notes: "Great work-life balance culture. No ESOP but good learning environment.",
    isPriority: false,
    skills: ["Python", "Go", "MySQL", "WebSockets", "Linux"],
    resumeVersion: "v3",
  },
  {
    companyName: "Groww",
    jobTitle: "SDE-1 (Frontend)",
    jobDescription: "Build wealth management and investment features for Groww web app.",
    location: "Bangalore, India",
    jobType: "Full-time",
    status: "Interviewing",
    salaryMin: 1000000,
    salaryMax: 1600000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    interviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    jobPortal: "LinkedIn",
    jobUrl: "https://groww.in/p/careers",
    contactName: "Kavya Reddy",
    contactEmail: "kavya.reddy@groww.in",
    notes: "HR round cleared. Technical interview in 5 days. Revising React hooks and Redux.",
    isPriority: false,
    skills: ["React", "TypeScript", "Next.js", "GraphQL", "Webpack"],
    resumeVersion: "v3",
  },
  {
    companyName: "Freshworks",
    jobTitle: "Software Engineer - Full Stack",
    jobDescription: "Build CRM and customer support SaaS products used by businesses globally.",
    location: "Chennai, India",
    jobType: "Full-time",
    status: "Applied",
    salaryMin: 1100000,
    salaryMax: 1900000,
    salaryCurrency: "INR",
    appliedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    jobPortal: "Naukri",
    jobUrl: "https://www.freshworks.com/company/careers",
    notes: "Good product company. ESOP program is attractive. Waiting for recruiter response.",
    isPriority: false,
    skills: ["Ruby on Rails", "React", "PostgreSQL", "Redis", "Sidekiq"],
    resumeVersion: "v3",
  },
];

// ── Main Seeder Function ──────────────────────────────────────
const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("\n🌱 Starting database seeding...\n");

    // ── 1. Create or find demo user ──
    let demoUser = await User.findOne({ email: "demo@jobtracker.com" });

    if (demoUser) {
      console.log("✅ Demo user already exists — skipping creation.");
    } else {
      demoUser = await User.create({
        name: "Demo User",
        email: "demo@jobtracker.com",
        password: "demo123",
      });
      console.log("✅ Demo user created: demo@jobtracker.com / demo123");
    }

    // ── 2. Clear existing job applications for demo user ──
    const deleted = await JobApplication.deleteMany({ user: demoUser._id });
    if (deleted.deletedCount > 0) {
      console.log(`🗑️  Cleared ${deleted.deletedCount} old demo job(s).`);
    }

    // ── 3. Seed job applications ──
    const jobsWithUser = demoJobs.map((job) => ({
      ...job,
      user: demoUser._id,
    }));

    const inserted = await JobApplication.insertMany(jobsWithUser);
    console.log(`✅ Inserted ${inserted.length} demo job applications.\n`);

    // ── 4. Print Summary ──
    const statusCounts = {};
    inserted.forEach((j) => {
      statusCounts[j.status] = (statusCounts[j.status] || 0) + 1;
    });

    console.log("📊 Job Status Summary:");
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status.padEnd(15)} → ${count} job(s)`);
    });

    console.log("\n🎉 Seeding complete!\n");
    console.log("─────────────────────────────────────");
    console.log("  Login with: demo@jobtracker.com");
    console.log("  Password:   demo123");
    console.log("─────────────────────────────────────\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
