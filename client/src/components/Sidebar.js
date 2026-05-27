// ============================================================
// components/Sidebar.js — Main Navigation Sidebar
// ============================================================
// Left-side navigation with:
//   - Logo / branding
//   - Navigation links with active state
//   - User info and logout at bottom
//   - Mobile responsive toggle
// ============================================================

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  MdDashboard, MdWork, MdAdd, MdPerson,
  MdLogout, MdMenu, MdClose, MdBarChart
} from 'react-icons/md';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully. See you soon! 👋');
    navigate('/login');
  };

  // Get initials from user name for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navItems = [
    { to: '/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
    { to: '/jobs', icon: <MdWork />, label: 'All Applications' },
    { to: '/jobs/add', icon: <MdAdd />, label: 'Add Application' },
    { to: '/profile', icon: <MdPerson />, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div style={{
        display: 'none',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '60px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        zIndex: 150,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
      }} className="mobile-header">
        <div className="sidebar-logo" style={{ marginBottom: 0, padding: 0 }}>
          <div className="sidebar-logo-icon">💼</div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Job Tracker</span>
        </div>
        <button
          className="btn btn-secondary btn-icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <MdClose /> : <MdMenu />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 190, display: 'none'
          }}
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">💼</div>
          <div>
            <div className="sidebar-logo-text">Job Tracker</div>
            <div className="sidebar-logo-sub">Portal</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <span className="nav-section-title">Navigation</span>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <span className="nav-section-title" style={{ marginTop: '8px' }}>Analytics</span>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link`}
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="nav-icon"><MdBarChart /></span>
            Progress Report
          </NavLink>
        </nav>

        {/* User Info & Logout */}
        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <div className="user-avatar">{getInitials(user?.name)}</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'User'}
              </div>
              <div className="user-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || ''}
              </div>
            </div>
          </div>

          <button
            className="nav-link btn"
            onClick={handleLogout}
            style={{
              width: '100%', justifyContent: 'flex-start', marginTop: '4px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#f87171', padding: '10px 12px', borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem', fontWeight: 500,
            }}
          >
            <span className="nav-icon"><MdLogout /></span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
