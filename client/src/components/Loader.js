// ============================================================
// components/Loader.js — Full-page Loading Spinner
// ============================================================
import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="loader-overlay">
      <div style={{ textAlign: 'center' }}>
        <div className="loader" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{message}</p>
      </div>
    </div>
  );
};

export default Loader;
