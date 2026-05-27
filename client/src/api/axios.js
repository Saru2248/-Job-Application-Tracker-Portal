// ============================================================
// src/api/axios.js — Axios HTTP Client Configuration
// ============================================================
// Creates a configured Axios instance with:
//   - Base URL pointing to our backend API
//   - Request interceptor to auto-attach JWT token
//   - Response interceptor to handle 401 errors globally
// ============================================================

import axios from "axios";

// Base URL for all API calls
// In development: proxy in package.json handles this
// In production: set REACT_APP_API_URL in .env
const BASE_URL = process.env.REACT_APP_API_URL || "/api";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// Request Interceptor — Attach JWT token to every request
// ============================================================
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Add Authorization header with Bearer token
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// Response Interceptor — Handle global errors
// ============================================================
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses

  (error) => {
    // Handle token expiration — redirect to login
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || "";

      // If it's a token expiry, clear auth and redirect
      if (
        message.includes("expired") ||
        message.includes("invalid") ||
        message.includes("not authorized")
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
