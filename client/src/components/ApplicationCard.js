/**
 * components/ApplicationCard.js — Individual Job Card
 *
 * Displays one job application as a card with:
 * - Company name, position, location
 * - Status badge, priority badge
 * - Application date, interview date
 * - Edit and Delete buttons
 *
 * Props:
 *   job    — the job application object
 *   onEdit — callback for edit (navigates to edit page)
 *   onDelete — callback for delete (shows confirmation modal)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from './StatusBadge';

const ApplicationCard = ({ job, onDelete }) => {
  const navigate = useNavigate();

  // Format date to readable string (e.g. "May 24, 2025")
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if interview is upcoming (within next 7 days)
  const isInterviewSoon = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date - now;
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="job-card" id={`job-card-${job._id}`}>
      {/* Card Header */}
      <div className="job-card-header">
        <div>
          <div className="job-card-company">🏢 {job.company}</div>
          <div className="job-card-position">{job.position}</div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Meta Info */}
      <div className="job-card-meta">
        <span className="job-card-meta-item">
          📍 {job.location || 'Remote'}
        </span>
        <span className="job-card-meta-item">
          💼 {job.jobType || 'Full-time'}
        </span>
        <PriorityBadge priority={job.priority} />
        {job.salary && (
          <span className="job-card-meta-item">
            💰 {job.salary}
          </span>
        )}
      </div>

      {/* Dates */}
      <div className="job-card-meta">
        <span className="job-card-meta-item">
          📅 Applied: {formatDate(job.applicationDate)}
        </span>
        {job.interviewDate && (
          <span
            className="job-card-meta-item"
            style={{ color: isInterviewSoon(job.interviewDate) ? 'var(--accent-orange)' : 'inherit' }}
          >
            🗓️ Interview: {formatDate(job.interviewDate)}
            {isInterviewSoon(job.interviewDate) && ' ⚠️ Soon!'}
          </span>
        )}
      </div>

      {/* Notes Preview */}
      {job.notes && (
        <div className="job-card-notes">
          📝 {job.notes}
        </div>
      )}

      {/* Contact Info */}
      {job.contactName && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          👤 {job.contactName} {job.contactEmail && `· ${job.contactEmail}`}
        </div>
      )}

      {/* Job URL */}
      {job.jobUrl && (
        <div style={{ marginTop: '8px' }}>
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}
          >
            🔗 View Job Posting
          </a>
        </div>
      )}

      {/* Action Buttons */}
      <div className="job-card-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/applications/edit/${job._id}`)}
          id={`edit-btn-${job._id}`}
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(job._id, `${job.company} — ${job.position}`)}
          id={`delete-btn-${job._id}`}
        >
          🗑️ Delete
        </button>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            alignSelf: 'center',
          }}
        >
          Added {formatDate(job.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default ApplicationCard;
