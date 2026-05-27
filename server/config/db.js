// ============================================================
// config/db.js — MongoDB Database Connection
// ============================================================
// This file handles the connection to MongoDB using Mongoose.
// We export the connectDB function and call it in server.js.
// ============================================================

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise — we await it
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log error and exit the process
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;
