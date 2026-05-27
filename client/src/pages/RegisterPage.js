/**
 * pages/RegisterPage.js — User Registration Page
 *
 * Features:
 * - Name, email, password, confirm-password form
 * - Client-side validation before API call
 * - Password strength indicator
 * - Auto-login after registration (token stored)
 * - Redirect to dashboard on success
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  // Password strength (simple)
  const getPasswordStrength = (password) => {
    if (password.length === 0) return { label: '', color: '', width: '0%' };
    if (password.length < 6)  return { label: 'Too short', color: 'var(--accent-red)', width: '20%' };
    if (password.length < 8)  return { label: 'Weak', color: 'var(--accent-orange)', width: '40%' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
                               return { label: 'Fair', color: 'var(--accent-orange)', width: '60%' };
    if (password.length >= 10) return { label: 'Strong', color: 'var(--accent-green)', width: '100%' };
    return { label: 'Good', color: 'var(--accent-green)', width: '80%' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created! Welcome to JobTracker 🎉');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
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
          <div className="auth-logo float">🚀</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Start tracking your job applications today</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error" role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} id="register-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">
              Full Name *
            </label>
            <input
              type="text"
              id="register-name"
              name="name"
              className="form-input"
              placeholder="Priya Sharma"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Email Address *
            </label>
            <input
              type="email"
              id="register-email"
              name="email"
              className="form-input"
              placeholder="priya@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              Password *
            </label>
            <input
              type="password"
              id="register-password"
              name="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            {/* Password Strength Bar */}
            {formData.password && (
              <div style={{ marginTop: '8px' }}>
                <div
                  style={{
                    height: '4px',
                    background: 'var(--border-color)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: strength.width,
                      background: strength.color,
                      transition: 'width 0.3s ease, background 0.3s ease',
                      borderRadius: '2px',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm-password">
              Confirm Password *
            </label>
            <input
              type="password"
              id="register-confirm-password"
              name="confirmPassword"
              className="form-input"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            {/* Match indicator */}
            {formData.confirmPassword && (
              <span
                style={{
                  fontSize: '0.75rem',
                  color:
                    formData.password === formData.confirmPassword
                      ? 'var(--accent-green)'
                      : 'var(--accent-red)',
                }}
              >
                {formData.password === formData.confirmPassword
                  ? '✅ Passwords match'
                  : '❌ Passwords do not match'}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            id="register-submit-btn"
            disabled={loading}
          >
            {loading ? '⏳ Creating account...' : '✨ Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" id="go-to-login-link">
            Sign in →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
