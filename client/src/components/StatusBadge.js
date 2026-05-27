// ============================================================
// components/StatusBadge.js — Status Badge Component
// ============================================================
// Renders a colored pill badge for job application status.
// Uses CSS classes from index.css for styling.
// ============================================================

import React from 'react';

// Map status to emoji and CSS class
const STATUS_CONFIG = {
  'Wishlist':     { emoji: '⭐', cssClass: 'badge-wishlist' },
  'Applied':      { emoji: '📤', cssClass: 'badge-applied' },
  'Interviewing': { emoji: '🎯', cssClass: 'badge-interviewing' },
  'Offer':        { emoji: '🎉', cssClass: 'badge-offer' },
  'Rejected':     { emoji: '❌', cssClass: 'badge-rejected' },
  'Withdrawn':    { emoji: '↩️', cssClass: 'badge-withdrawn' },
};

const StatusBadge = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || { emoji: '❓', cssClass: '' };

  return (
    <span
      className={`badge ${config.cssClass}`}
      style={{ fontSize: size === 'sm' ? '0.7rem' : '0.75rem' }}
    >
      <span>{config.emoji}</span>
      {status}
    </span>
  );
};

export default StatusBadge;
