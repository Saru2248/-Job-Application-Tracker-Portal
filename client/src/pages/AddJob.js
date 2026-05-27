// ============================================================
// pages/AddJob.js — Add New Job Application Form Page
// ============================================================
// Comprehensive form to add a new job application.
// Fields: company, title, status, location, type, salary,
//         dates, portal, contact, notes, priority, skills.
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { MdSave, MdArrowBack, MdAdd } from 'react-icons/md';

const STATUSES = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];
const PORTALS = ['LinkedIn', 'Naukri', 'Indeed', 'Glassdoor', 'Monster', 'Company Website', 'Campus Placement', 'Referral', 'Other'];
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];

const INITIAL_FORM = {
  companyName: '',
  jobTitle: '',
  jobDescription: '',
  location: '',
  jobType: 'Full-time',
  status: 'Applied',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'INR',
  appliedDate: new Date().toISOString().split('T')[0],
  interviewDate: '',
  offerDeadline: '',
  jobPortal: '',
  jobUrl: '',
  contactName: '',
  contactEmail: '',
  notes: '',
  isPriority: false,
  skills: '',
  resumeVersion: 'v1',
};

const AddJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.companyName.trim()) errs.companyName = 'Company name is required';
    if (!formData.jobTitle.trim()) errs.jobTitle = 'Job title is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill in the required fields');
      return;
    }

    setLoading(true);
    try {
      // Convert skills string to array
      const skillsArray = formData.skills
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...formData,
        skills: skillsArray,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
        interviewDate: formData.interviewDate || null,
        offerDeadline: formData.offerDeadline || null,
      };

      await axiosInstance.post('/jobs', payload);
      toast.success('Job application added successfully! 🚀');
      navigate('/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add application');
    } finally {
      setLoading(false);
    }
  };

  // Section title component for form organization
  const SectionTitle = ({ title, emoji }) => (
    <div style={{
      fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-light)',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      paddingBottom: '12px', marginBottom: '16px', marginTop: '8px',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 6
    }}>
      {emoji} {title}
    </div>
  );

  return (
    <Layout title="Add Job Application" subtitle="Track a new job opportunity">

      <div style={{ maxWidth: 800 }}>
        {/* Back button */}
        <button
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: 20 }}
          onClick={() => navigate('/jobs')}
        >
          <MdArrowBack /> Back to Applications
        </button>

        <form onSubmit={handleSubmit} noValidate>
          <div className="card" style={{ marginBottom: 20 }}>
            <SectionTitle title="Job Information" emoji="💼" />
            <div className="grid-2">
              {/* Company Name */}
              <div className="form-group">
                <label className="form-label">
                  Company Name <span className="required">*</span>
                </label>
                <input
                  id="company-name-input"
                  type="text"
                  name="companyName"
                  className="form-input"
                  placeholder="e.g., Google, Infosys, TCS"
                  value={formData.companyName}
                  onChange={handleChange}
                  autoFocus
                />
                {errors.companyName && <span className="form-error">{errors.companyName}</span>}
              </div>

              {/* Job Title */}
              <div className="form-group">
                <label className="form-label">
                  Job Title <span className="required">*</span>
                </label>
                <input
                  id="job-title-input"
                  type="text"
                  name="jobTitle"
                  className="form-input"
                  placeholder="e.g., Software Engineer, MERN Developer"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
                {errors.jobTitle && <span className="form-error">{errors.jobTitle}</span>}
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder="e.g., Bangalore, Remote, Mumbai"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              {/* Job Type */}
              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select name="jobType" className="form-select" value={formData.jobType} onChange={handleChange}>
                  {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label">Application Status</label>
                <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Job Portal */}
              <div className="form-group">
                <label className="form-label">Applied Via</label>
                <select name="jobPortal" className="form-select" value={formData.jobPortal} onChange={handleChange}>
                  <option value="">Select Portal</option>
                  {PORTALS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Job Description */}
            <div className="form-group">
              <label className="form-label">Job Description (optional)</label>
              <textarea
                name="jobDescription"
                className="form-textarea"
                placeholder="Paste the job description here..."
                value={formData.jobDescription}
                onChange={handleChange}
                style={{ minHeight: 100 }}
              />
            </div>

            {/* Job URL */}
            <div className="form-group">
              <label className="form-label">Job URL (optional)</label>
              <input
                type="url"
                name="jobUrl"
                className="form-input"
                placeholder="https://linkedin.com/jobs/..."
                value={formData.jobUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="card" style={{ marginBottom: 20 }}>
            <SectionTitle title="Important Dates" emoji="📅" />
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Applied Date</label>
                <input
                  type="date"
                  name="appliedDate"
                  className="form-input"
                  value={formData.appliedDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Interview Date</label>
                <input
                  type="date"
                  name="interviewDate"
                  className="form-input"
                  value={formData.interviewDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Offer Deadline</label>
                <input
                  type="date"
                  name="offerDeadline"
                  className="form-input"
                  value={formData.offerDeadline}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Salary */}
          <div className="card" style={{ marginBottom: 20 }}>
            <SectionTitle title="Salary Details" emoji="💰" />
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select name="salaryCurrency" className="form-select" value={formData.salaryCurrency} onChange={handleChange}>
                  {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Min Salary (per year)</label>
                <input type="number" name="salaryMin" className="form-input"
                  placeholder="e.g., 600000" value={formData.salaryMin} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Salary (per year)</label>
                <input type="number" name="salaryMax" className="form-input"
                  placeholder="e.g., 1200000" value={formData.salaryMax} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="card" style={{ marginBottom: 20 }}>
            <SectionTitle title="HR / Recruiter Contact" emoji="👤" />
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Contact Name</label>
                <input type="text" name="contactName" className="form-input"
                  placeholder="Recruiter's name" value={formData.contactName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input type="email" name="contactEmail" className="form-input"
                  placeholder="recruiter@company.com" value={formData.contactEmail} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Extra */}
          <div className="card" style={{ marginBottom: 20 }}>
            <SectionTitle title="Additional Details" emoji="📝" />

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Skills Required (comma-separated)</label>
                <input type="text" name="skills" className="form-input"
                  placeholder="React, Node.js, MongoDB, REST API"
                  value={formData.skills} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Resume Version Used</label>
                <input type="text" name="resumeVersion" className="form-input"
                  placeholder="e.g., v1, v2-fullstack" value={formData.resumeVersion} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Personal Notes</label>
              <textarea name="notes" className="form-textarea"
                placeholder="Add any notes about this application, interview tips, etc."
                value={formData.notes} onChange={handleChange} />
            </div>

            {/* Priority Toggle */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              padding: '10px 14px', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', userSelect: 'none',
              background: formData.isPriority ? 'rgba(251,191,36,0.08)' : 'transparent',
              borderColor: formData.isPriority ? 'rgba(251,191,36,0.3)' : 'var(--border)',
              transition: 'all 0.2s',
            }}>
              <input
                type="checkbox"
                name="isPriority"
                checked={formData.isPriority}
                onChange={handleChange}
                style={{ width: 16, height: 16, accentColor: '#f59e0b' }}
              />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                ⭐ Mark as Priority Application
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              id="submit-job-btn"
              type="submit"
              className={`btn btn-primary btn-lg ${loading ? 'btn-loading' : ''}`}
              disabled={loading}
            >
              <MdSave />
              {loading ? 'Saving...' : 'Save Application'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/jobs')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddJob;
