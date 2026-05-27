// ============================================================
// pages/Profile.js — User Profile Page
// ============================================================
// Allows the user to:
//   - View their profile info
//   - Update name and email
//   - Change password
// ============================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { MdSave, MdLock } from 'react-icons/md';
import { format } from 'date-fns';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setProfileLoading(true);
    try {
      const res = await axiosInstance.put('/auth/profile', profileData);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      await axiosInstance.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      toast.success('Password changed successfully! 🔒');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Layout title="My Profile" subtitle="Manage your account settings">
      <div style={{ maxWidth: 600 }}>

        {/* Profile Overview Card */}
        <div className="card" style={{ marginBottom: 24, textAlign: 'center' }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80,
            background: 'var(--gradient-primary)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', fontWeight: 800, color: 'white',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px var(--primary-glow)',
          }}>
            {getInitials(user?.name)}
          </div>

          <h2 style={{ fontSize: '1.25rem', marginBottom: 4 }}>{user?.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email}</p>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 10, padding: '4px 12px',
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: 600,
          }}>
            ✅ {user?.role?.toUpperCase() || 'USER'} ACCOUNT
          </div>

          {user?.createdAt && (
            <p style={{ color: 'var(--text-disabled)', fontSize: '0.75rem', marginTop: 8 }}>
              Member since {format(new Date(user.createdAt), 'MMMM yyyy')}
            </p>
          )}
        </div>

        {/* Update Profile Form */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            👤 Update Profile
          </h3>

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="your@email.com"
              />
            </div>

            <button
              id="update-profile-btn"
              type="submit"
              className={`btn btn-primary ${profileLoading ? 'btn-loading' : ''}`}
              disabled={profileLoading}
            >
              <MdSave />
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="card">
          <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MdLock style={{ color: 'var(--primary)' }} /> Change Password
          </h3>

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                autoComplete="current-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-input"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                className="form-input"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                placeholder="Repeat new password"
                autoComplete="new-password"
              />
            </div>

            <button
              id="change-password-btn"
              type="submit"
              className={`btn btn-secondary ${passwordLoading ? 'btn-loading' : ''}`}
              disabled={passwordLoading}
            >
              <MdLock />
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
