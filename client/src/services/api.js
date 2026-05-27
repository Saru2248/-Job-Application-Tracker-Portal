/**
 * services/api.js — Centralized Axios API Service
 *
 * Why centralize API calls?
 * - Single place to manage base URL
 * - Automatically attach JWT token to every request
 * - Easy to update if the API URL changes
 * - Interceptors handle 401 (unauthorized) globally
 */

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Runs before EVERY request — attaches the JWT token if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Runs after EVERY response — handles global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or invalid, log the user out automatically
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Jobs API ─────────────────────────────────────────────────────────────────

export const jobsAPI = {
  // Get all jobs with optional filters
  getAll: (params) => api.get('/jobs', { params }),

  // Get dashboard stats
  getStats: () => api.get('/jobs/stats'),

  // Get single job
  getById: (id) => api.get(`/jobs/${id}`),

  // Create new job application
  create: (data) => api.post('/jobs', data),

  // Update existing job application
  update: (id, data) => api.put(`/jobs/${id}`, data),

  // Delete job application
  delete: (id) => api.delete(`/jobs/${id}`),
};

export default api;
