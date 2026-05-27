// ============================================================
// pages/JobDetail.js — Single Job Application Detail View
// ============================================================
// Shows all details of a single job application.
// Includes: Edit and Delete actions.
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { MdEdit, MdDelete, MdArrowBack, MdOpenInNew, MdEmail, MdStar } from 'react-icons/md';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch (error) {
        toast.error('Job application not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      toast.success('Application deleted successfully');
      navigate('/jobs');
    } catch (error) {
      toast.error('Failed to delete application');
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '—';
    try { return format(new Date(date), 'MMMM dd, yyyy'); }
    catch { return '—'; }
  };

  const InfoRow = ({ label, value, icon }) => (
    value ? (
      <div style={{
        display: 'flex', gap: 12, padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        alignItems: 'flex-start'
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', minWidth: 140, fontWeight: 500 }}>
          {icon} {label}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', flex: 1 }}>{value}</span>
      </div>
    ) : null
  );

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />
      </Layout>
    );
  }

  if (!job) return null;

  return (
    <Layout
      title={job.companyName}
      subtitle={job.jobTitle}
    >
      {/* Back + Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/jobs')}>
          <MdArrowBack /> Back to Applications
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <MdOpenInNew /> View Job Post
            </a>
          )}
          <button className="btn btn-outline btn-sm" onClick={() => navigate(`/jobs/${id}/edit`)}>
            <MdEdit /> Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
            <MdDelete /> {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              {job.isPriority && <MdStar style={{ color: '#fbbf24', fontSize: '1.2rem' }} />}
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{job.companyName}</h2>
            </div>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{job.jobTitle}</p>
            {job.location && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 {job.location}</p>}
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* Details Grid */}
        <div>
          <InfoRow icon="🏢" label="Job Type" value={job.jobType} />
          <InfoRow icon="📋" label="Applied Via" value={job.jobPortal} />
          <InfoRow icon="📅" label="Applied Date" value={formatDate(job.appliedDate)} />
          <InfoRow icon="🎯" label="Interview Date" value={formatDate(job.interviewDate)} />
          <InfoRow icon="⏰" label="Offer Deadline" value={formatDate(job.offerDeadline)} />
          <InfoRow icon="💰" label="Salary Range" value={
            job.salaryMin
              ? `${job.salaryCurrency} ${job.salaryMin?.toLocaleString()} – ${job.salaryMax?.toLocaleString()}`
              : null
          } />
          <InfoRow icon="📄" label="Resume Version" value={job.resumeVersion} />
          <InfoRow icon="📅" label="Added On" value={formatDate(job.createdAt)} />
        </div>
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 14 }}>🛠️ Skills Required</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {job.skills.map(skill => (
              <span key={skill} style={{
                padding: '4px 12px',
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.25)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                color: 'var(--primary-light)',
                fontWeight: 500,
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact Info */}
      {(job.contactName || job.contactEmail) && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 14 }}>👤 Recruiter / HR Contact</h3>
          {job.contactName && (
            <p style={{ color: 'var(--text-secondary)', marginBottom: 6 }}>
              <strong>Name:</strong> {job.contactName}
            </p>
          )}
          {job.contactEmail && (
            <p style={{ color: 'var(--text-secondary)' }}>
              <MdEmail style={{ marginRight: 4 }} />
              <a href={`mailto:${job.contactEmail}`} style={{ color: 'var(--primary-light)' }}>
                {job.contactEmail}
              </a>
            </p>
          )}
        </div>
      )}

      {/* Job Description */}
      {job.jobDescription && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 14 }}>📋 Job Description</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.875rem' }}>
            {job.jobDescription}
          </p>
        </div>
      )}

      {/* Notes */}
      {job.notes && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 14 }}>📝 My Notes</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {job.notes}
          </p>
        </div>
      )}

      {/* Quick Status Update */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 14 }}>⚡ Quick Status Update</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 14 }}>
          Update the application status without opening the full edit form.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/jobs/${id}/edit`)}
        >
          <MdEdit /> Open Edit Form
        </button>
      </div>
    </Layout>
  );
};

export default JobDetail;
