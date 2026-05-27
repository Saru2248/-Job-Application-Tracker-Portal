// ============================================================
// pages/EditJob.js — Edit Existing Job Application
// ============================================================
// Pre-fills form with existing job data.
// On submit: sends PUT request to update the record.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { MdSave, MdArrowBack } from 'react-icons/md';

const STATUSES = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];
const PORTALS = ['LinkedIn', 'Naukri', 'Indeed', 'Glassdoor', 'Monster', 'Company Website', 'Campus Placement', 'Referral', 'Other'];

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Fetch existing job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/${id}`);
        const job = res.data.job;

        // Pre-fill form with existing data
        setFormData({
          companyName: job.companyName || '',
          jobTitle: job.jobTitle || '',
          jobDescription: job.jobDescription || '',
          location: job.location || '',
          jobType: job.jobType || 'Full-time',
          status: job.status || 'Applied',
          salaryMin: job.salaryMin || '',
          salaryMax: job.salaryMax || '',
          salaryCurrency: job.salaryCurrency || 'INR',
          appliedDate: job.appliedDate ? new Date(job.appliedDate).toISOString().split('T')[0] : '',
          interviewDate: job.interviewDate ? new Date(job.interviewDate).toISOString().split('T')[0] : '',
          offerDeadline: job.offerDeadline ? new Date(job.offerDeadline).toISOString().split('T')[0] : '',
          jobPortal: job.jobPortal || '',
          jobUrl: job.jobUrl || '',
          contactName: job.contactName || '',
          contactEmail: job.contactEmail || '',
          notes: job.notes || '',
          isPriority: job.isPriority || false,
          skills: (job.skills || []).join(', '),
          resumeVersion: job.resumeVersion || 'v1',
        });
      } catch (error) {
        toast.error('Failed to load job application');
        navigate('/jobs');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName.trim() || !formData.jobTitle.trim()) {
      toast.error('Company name and job title are required');
      return;
    }

    setLoading(true);
    try {
      const skillsArray = formData.skills
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      await axiosInstance.put(`/jobs/${id}`, {
        ...formData,
        skills: skillsArray,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
        interviewDate: formData.interviewDate || null,
        offerDeadline: formData.offerDeadline || null,
      });

      toast.success('Application updated successfully ✅');
      navigate(`/jobs/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update application');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Layout title="Edit Application">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </Layout>
    );
  }

  if (!formData) return null;

  const SectionTitle = ({ title, emoji }) => (
    <div style={{
      fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-light)',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      paddingBottom: '12px', marginBottom: '16px',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 6
    }}>
      {emoji} {title}
    </div>
  );

  return (
    <Layout title="Edit Application" subtitle={`Updating: ${formData.jobTitle} at ${formData.companyName}`}>

      <div style={{ maxWidth: 800 }}>
        <button
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: 20 }}
          onClick={() => navigate(-1)}
        >
          <MdArrowBack /> Go Back
        </button>

        <form onSubmit={handleSubmit} noValidate>
          {/* Job Info */}
          <div className="card" style={{ marginBottom: 20 }}>
            <SectionTitle title="Job Information" emoji="💼" />
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Company Name <span className="required">*</span></label>
                <input type="text" name="companyName" className="form-input"
                  value={formData.companyName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Job Title <span className="required">*</span></label>
                <input type="text" name="jobTitle" className="form-input"
                  value={formData.jobTitle} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input type="text" name="location" className="form-input"
                  value={formData.location} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select name="jobType" className="form-select" value={formData.jobType} onChange={handleChange}>
                  {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              {/* Status — most important field to update */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  🔄 Update Status
                </label>
                <select name="status" className="form-select"
                  value={formData.status} onChange={handleChange}
                  style={{ fontSize: '1rem', padding: '12px 16px', borderColor: 'var(--border-focus)' }}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Applied Via</label>
                <select name="jobPortal" className="form-select" value={formData.jobPortal} onChange={handleChange}>
                  <option value="">Select Portal</option>
                  {PORTALS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Job URL</label>
                <input type="url" name="jobUrl" className="form-input"
                  value={formData.jobUrl} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Job Description</label>
              <textarea name="jobDescription" className="form-textarea"
                value={formData.jobDescription} onChange={handleChange} />
            </div>
          </div>

          {/* Dates */}
          <div className="card" style={{ marginBottom: 20 }}>
            <SectionTitle title="Important Dates" emoji="📅" />
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Applied Date</label>
                <input type="date" name="appliedDate" className="form-input"
                  value={formData.appliedDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Interview Date</label>
                <input type="date" name="interviewDate" className="form-input"
                  value={formData.interviewDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Offer Deadline</label>
                <input type="date" name="offerDeadline" className="form-input"
                  value={formData.offerDeadline} onChange={handleChange} />
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
                  {['INR', 'USD', 'EUR', 'GBP'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Min Salary</label>
                <input type="number" name="salaryMin" className="form-input"
                  value={formData.salaryMin} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Max Salary</label>
                <input type="number" name="salaryMax" className="form-input"
                  value={formData.salaryMax} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Notes & Extra */}
          <div className="card" style={{ marginBottom: 20 }}>
            <SectionTitle title="Additional Details" emoji="📝" />
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Contact Name</label>
                <input type="text" name="contactName" className="form-input"
                  value={formData.contactName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input type="email" name="contactEmail" className="form-input"
                  value={formData.contactEmail} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Skills (comma-separated)</label>
                <input type="text" name="skills" className="form-input"
                  value={formData.skills} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Resume Version</label>
                <input type="text" name="resumeVersion" className="form-input"
                  value={formData.resumeVersion} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea name="notes" className="form-textarea"
                value={formData.notes} onChange={handleChange} />
            </div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              padding: '10px 14px', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', userSelect: 'none',
              background: formData.isPriority ? 'rgba(251,191,36,0.08)' : 'transparent',
              borderColor: formData.isPriority ? 'rgba(251,191,36,0.3)' : 'var(--border)',
            }}>
              <input type="checkbox" name="isPriority" checked={formData.isPriority} onChange={handleChange}
                style={{ width: 16, height: 16, accentColor: '#f59e0b' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                ⭐ Mark as Priority Application
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              id="update-job-btn"
              type="submit"
              className={`btn btn-primary btn-lg ${loading ? 'btn-loading' : ''}`}
              disabled={loading}
            >
              <MdSave />
              {loading ? 'Updating...' : 'Update Application'}
            </button>
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditJob;
