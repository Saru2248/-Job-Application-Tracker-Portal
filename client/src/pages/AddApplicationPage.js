/**
 * pages/AddApplicationPage.js — Add New Job Application Form
 *
 * A multi-section form to add a new job application.
 * Sections:
 *   1. Company & Role details
 *   2. Application status & dates
 *   3. Salary, job URL, contact
 *   4. Notes
 *
 * On submit: calls POST /api/jobs and redirects to /applications
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  company: '',
  position: '',
  location: 'Remote',
  status: 'Applied',
  applicationDate: new Date().toISOString().split('T')[0], // today's date
  interviewDate: '',
  followUpDate: '',
  jobUrl: '',
  salary: '',
  jobType: 'Full-time',
  priority: 'Medium',
  notes: '',
  contactName: '',
  contactEmail: '',
};

const AddApplicationPage = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company.trim()) {
      setError('Company name is required');
      return;
    }
    if (!formData.position.trim()) {
      setError('Job position is required');
      return;
    }

    setLoading(true);
    try {
      await jobsAPI.create(formData);
      toast.success(`✅ Application to ${formData.company} added!`);
      navigate('/applications');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add application';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">➕ Add Application</h1>
          <p className="page-subtitle">Track a new job application</p>
        </div>
        <Link to="/applications" className="btn btn-secondary">
          ← Back to Applications
        </Link>
      </div>

      {/* Form Card */}
      <div className="form-card">
        {error && (
          <div className="alert alert-error">⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} id="add-application-form" noValidate>

          {/* Section 1: Company & Role */}
          <div className="form-section-title">🏢 Company & Role</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="add-company">Company Name *</label>
              <input
                type="text"
                id="add-company"
                name="company"
                className="form-input"
                placeholder="e.g. Google, TCS, Infosys"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-position">Job Position *</label>
              <input
                type="text"
                id="add-position"
                name="position"
                className="form-input"
                placeholder="e.g. Software Engineer, React Developer"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-location">Location</label>
              <input
                type="text"
                id="add-location"
                name="location"
                className="form-input"
                placeholder="e.g. Pune, Mumbai, Remote"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-jobType">Job Type</label>
              <select
                id="add-jobType"
                name="jobType"
                className="form-select"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          {/* Section 2: Status & Dates */}
          <div className="form-section-title">📅 Status & Dates</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="add-status">Application Status</label>
              <select
                id="add-status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Applied">📩 Applied</option>
                <option value="Under Review">🔍 Under Review</option>
                <option value="Interview Scheduled">📅 Interview Scheduled</option>
                <option value="Interview Done">✅ Interview Done</option>
                <option value="Offer Received">🎉 Offer Received</option>
                <option value="Accepted">🥳 Accepted</option>
                <option value="Rejected">❌ Rejected</option>
                <option value="Withdrawn">↩️ Withdrawn</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-priority">Priority</label>
              <select
                id="add-priority"
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">⚪ Low</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-applicationDate">Application Date</label>
              <input
                type="date"
                id="add-applicationDate"
                name="applicationDate"
                className="form-input"
                value={formData.applicationDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-interviewDate">
                Interview Date <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
              </label>
              <input
                type="date"
                id="add-interviewDate"
                name="interviewDate"
                className="form-input"
                value={formData.interviewDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-followUpDate">
                Follow-up Date <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
              </label>
              <input
                type="date"
                id="add-followUpDate"
                name="followUpDate"
                className="form-input"
                value={formData.followUpDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section 3: Job Details */}
          <div className="form-section-title">💼 Job Details</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="add-salary">
                Salary/Package <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
              </label>
              <input
                type="text"
                id="add-salary"
                name="salary"
                className="form-input"
                placeholder="e.g. ₹6 LPA, $80,000/yr"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-jobUrl">
                Job Posting URL <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
              </label>
              <input
                type="url"
                id="add-jobUrl"
                name="jobUrl"
                className="form-input"
                placeholder="https://linkedin.com/jobs/..."
                value={formData.jobUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-contactName">
                Recruiter Name <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
              </label>
              <input
                type="text"
                id="add-contactName"
                name="contactName"
                className="form-input"
                placeholder="e.g. Priya Verma"
                value={formData.contactName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-contactEmail">
                Recruiter Email <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
              </label>
              <input
                type="email"
                id="add-contactEmail"
                name="contactEmail"
                className="form-input"
                placeholder="recruiter@company.com"
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section 4: Notes */}
          <div className="form-section-title">📝 Notes</div>
          <div className="form-group">
            <label className="form-label" htmlFor="add-notes">
              Personal Notes <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
            </label>
            <textarea
              id="add-notes"
              name="notes"
              className="form-textarea"
              placeholder="Interview tips, skills required, your preparation notes..."
              value={formData.notes}
              onChange={handleChange}
              maxLength={1000}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {formData.notes.length}/1000 characters
            </span>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              id="submit-application-btn"
              disabled={loading}
            >
              {loading ? '⏳ Adding...' : '✅ Add Application'}
            </button>
            <Link to="/applications" className="btn btn-secondary btn-lg">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApplicationPage;
