// ============================================================
// components/JobCard.js — Individual Job Application Card
// ============================================================
// Displays a single job application in a card format.
// Shows: company, role, status, location, applied date.
// Actions: View, Edit, Delete.
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLocationOn, MdWork, MdCalendarToday, MdEdit, MdDelete, MdOpenInNew, MdStar } from 'react-icons/md';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

// Map status to left-border color
const STATUS_COLORS = {
  'Wishlist': 'var(--status-wishlist)',
  'Applied': 'var(--status-applied)',
  'Interviewing': 'var(--status-interviewing)',
  'Offer': 'var(--status-offer)',
  'Rejected': 'var(--status-rejected)',
  'Withdrawn': 'var(--status-withdrawn)',
};

const JobCard = ({ job, onDelete }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete application for ${job.jobTitle} at ${job.companyName}?`)) return;

    setDeleting(true);
    try {
      await axiosInstance.delete(`/jobs/${job._id}`);
      toast.success('Application deleted successfully');
      onDelete(job._id); // Notify parent to remove from list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try { return format(new Date(date), 'MMM dd, yyyy'); }
    catch { return 'N/A'; }
  };

  return (
    <div
      className="job-card animate-fadeIn"
      style={{ '--status-color': STATUS_COLORS[job.status] }}
    >
      {/* Header */}
      <div className="job-card-header">
        <div>
          <div className="job-company">
            {job.isPriority && <MdStar className="priority-star" style={{ marginRight: 4 }} />}
            {job.companyName}
          </div>
          <div className="job-title">{job.jobTitle}</div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Meta Info */}
      <div className="job-meta">
        {job.location && (
          <span className="job-meta-item">
            <MdLocationOn /> {job.location}
          </span>
        )}
        {job.jobType && (
          <span className="job-meta-item">
            <MdWork /> {job.jobType}
          </span>
        )}
        <span className="job-meta-item">
          <MdCalendarToday /> Applied: {formatDate(job.appliedDate)}
        </span>
        {job.jobPortal && (
          <span className="job-meta-item">
            📋 {job.jobPortal}
          </span>
        )}
      </div>

      {/* Notes preview */}
      {job.notes && (
        <p style={{
          fontSize: '0.8rem', color: 'var(--text-muted)',
          marginTop: '10px', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {job.notes}
        </p>
      )}

      {/* Upcoming interview */}
      {job.interviewDate && job.status === 'Interviewing' && (
        <div style={{
          marginTop: '10px', padding: '8px 12px',
          background: 'rgba(139,92,246,0.1)', borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(139,92,246,0.2)',
          fontSize: '0.78rem', color: '#a78bfa'
        }}>
          🎯 Interview: {formatDate(job.interviewDate)}
        </div>
      )}

      {/* Actions */}
      <div className="job-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/jobs/${job._id}`)}
        >
          <MdOpenInNew /> View
        </button>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate(`/jobs/${job._id}/edit`)}
        >
          <MdEdit /> Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
          disabled={deleting}
        >
          <MdDelete /> {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
