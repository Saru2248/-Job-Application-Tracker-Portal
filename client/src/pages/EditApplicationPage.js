/**
 * pages/EditApplicationPage.js — Edit Existing Job Application
 *
 * On load:
 *   1. Reads :id from URL params
 *   2. Fetches the existing application from API
 *   3. Pre-fills the form with current data
 *
 * On submit:
 *   1. Calls PUT /api/jobs/:id
 *   2. Shows success toast
 *   3. Redirects to /applications
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import toast from 'react-hot-toast';

const EditApplicationPage = () => {
  const { id } = useParams(); // Get application ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Format date for input[type=date] — needs YYYY-MM-DD format
  const toDateInput = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  // Load the application data on mount
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await jobsAPI.getById(id);
        const job = data.job;

        // Pre-fill form with existing values, convert dates to input format
        setFormData({
          company: job.company || '',
          position: job.position || '',
          location: job.location || 'Remote',
          status: job.status || 'Applied',
          applicationDate: toDateInput(job.applicationDate),
          interviewDate: toDateInput(job.interviewDate),
          followUpDate: toDateInput(job.followUpDate),
          jobUrl: job.jobUrl || '',
          salary: job.salary || '',
          jobType: job.jobType || 'Full-time',
          priority: job.priority || 'Medium',
          notes: job.notes || '',
          contactName: job.contactName || '',
          contactEmail: job.contactEmail || '',
        });
      } catch (err) {
        toast.error('Failed to load application');
        navigate('/applications');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company.trim() || !formData.position.trim()) {
      setError('Company and Position are required');
      return;
    }

    setSaving(true);
    try {
      await jobsAPI.update(id, formData);
      toast.success(`✅ ${formData.company} application updated!`);
      navigate('/applications');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update application';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Show loading state while fetching
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading-container" style={{ minHeight: '400px' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">✏️ Edit Application</h1>
          <p className="page-subtitle">
            Update details for {formData?.company} — {formData?.position}
          </p>
        </div>
        <Link to="/applications" className="btn btn-secondary">
          ← Back
        </Link>
      </div>

      {/* Form Card */}
      <div className="form-card">
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} id="edit-application-form" noValidate>

          {/* Section 1: Company & Role */}
          <div className="form-section-title">🏢 Company & Role</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-company">Company Name *</label>
              <input
                type="text"
                id="edit-company"
                name="company"
                className="form-input"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-position">Job Position *</label>
              <input
                type="text"
                id="edit-position"
                name="position"
                className="form-input"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-location">Location</label>
              <input
                type="text"
                id="edit-location"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-jobType">Job Type</label>
              <select id="edit-jobType" name="jobType" className="form-select" value={formData.jobType} onChange={handleChange}>
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
              <label className="form-label" htmlFor="edit-status">Application Status</label>
              <select id="edit-status" name="status" className="form-select" value={formData.status} onChange={handleChange}>
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
              <label className="form-label" htmlFor="edit-priority">Priority</label>
              <select id="edit-priority" name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">⚪ Low</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-applicationDate">Application Date</label>
              <input type="date" id="edit-applicationDate" name="applicationDate" className="form-input" value={formData.applicationDate} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-interviewDate">Interview Date</label>
              <input type="date" id="edit-interviewDate" name="interviewDate" className="form-input" value={formData.interviewDate} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-followUpDate">Follow-up Date</label>
              <input type="date" id="edit-followUpDate" name="followUpDate" className="form-input" value={formData.followUpDate} onChange={handleChange} />
            </div>
          </div>

          {/* Section 3: Job Details */}
          <div className="form-section-title">💼 Job Details</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-salary">Salary/Package</label>
              <input type="text" id="edit-salary" name="salary" className="form-input" placeholder="e.g. ₹6 LPA" value={formData.salary} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-jobUrl">Job Posting URL</label>
              <input type="url" id="edit-jobUrl" name="jobUrl" className="form-input" placeholder="https://..." value={formData.jobUrl} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-contactName">Recruiter Name</label>
              <input type="text" id="edit-contactName" name="contactName" className="form-input" value={formData.contactName} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-contactEmail">Recruiter Email</label>
              <input type="email" id="edit-contactEmail" name="contactEmail" className="form-input" value={formData.contactEmail} onChange={handleChange} />
            </div>
          </div>

          {/* Section 4: Notes */}
          <div className="form-section-title">📝 Notes</div>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-notes">Personal Notes</label>
            <textarea
              id="edit-notes"
              name="notes"
              className="form-textarea"
              value={formData.notes}
              onChange={handleChange}
              maxLength={1000}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {formData.notes.length}/1000
            </span>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              className="btn btn-success btn-lg"
              id="save-application-btn"
              disabled={saving}
            >
              {saving ? '⏳ Saving...' : '💾 Save Changes'}
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

export default EditApplicationPage;
