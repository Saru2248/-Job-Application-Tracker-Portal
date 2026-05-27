// ============================================================
// components/Layout.js — Page Layout Wrapper
// ============================================================
// Wraps all protected pages with Sidebar + main content area.
// ============================================================

import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, title, subtitle }) => {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <main className="main-content">
        {(title || subtitle) && (
          <div className="page-header animate-fadeIn">
            {title && <h1 className="page-title">{title}</h1>}
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;
