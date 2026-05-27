/**
 * pages/LoginPage.js — User Login Page
 *
 * Features:
 * - Email and password form with validation
 * - Error display for wrong credentials
 * - Loading state during API call
 * - Redirect to dashboard on success
 * - Link to register page
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle input changes — updates the correct field in formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      // Show the error message from the API response
      const msg = err.response?.data?.message || 'Login failed. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo float">💼</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to track your job applications</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error" role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} id="login-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <input
              type="email"
              id="login-email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              type="password"
              id="login-password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            id="login-submit-btn"
            disabled={loading}
          >
            {loading ? '⏳ Signing in...' : '🚀 Sign In'}
          </button>
        </form>

        {/* Demo Credentials Hint */}
        <div className="auth-divider">
          <span>Demo credentials</span>
        </div>
        <div
          style={{
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            fontFamily: 'monospace',
          }}
        >
          <div>📧 demo@jobtracker.com</div>
          <div>🔑 demo123456</div>
        </div>

        {/* Register Link */}
        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" id="go-to-register-link">
            Create one free →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
