/**
 * components/LoadingSpinner.js — Full-page Loading Indicator
 * Shown while checking authentication status on app load
 */

import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
