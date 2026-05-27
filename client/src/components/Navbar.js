/**
 * components/Navbar.js — Top Navigation Bar
 *
 * Shows:
 * - App logo and name
 * - Navigation links (Dashboard, Applications)
 * - User avatar with initials
 * - Logout button
 *
 * Uses useAuth() hook to get the current user and logout function.
 * Uses NavLink from React Router for active link highlighting.
 */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Get user's initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <NavLink to="/dashboard" className="navbar-brand">
          <div className="navbar-brand-icon">💼</div>
          <span>JobTracker</span>
        </NavLink>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
            >
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/applications"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
            >
              📋 Applications
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/applications/add"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
            >
              ➕ Add New
            </NavLink>
          </li>
        </ul>

        {/* User Info & Logout */}
        <div className="navbar-user">
          <div className="navbar-avatar" title={user?.name}>
            {getInitials(user?.name)}
          </div>
          <span className="navbar-username">{user?.name}</span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleLogout}
            id="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
