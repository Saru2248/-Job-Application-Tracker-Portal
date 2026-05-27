// ============================================================
// pages/Dashboard.js — Main Dashboard Page
// ============================================================
// Shows:
//   - Summary stats cards (total, applied, interviews, offers...)
//   - Progress chart using Recharts
//   - Recent applications list
//   - Upcoming interviews
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { format } from 'date-fns';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { MdAdd, MdWork, MdTrendingUp, MdStar, MdCalendarToday } from 'react-icons/md';

// Colors matching CSS status variables
const STATUS_CHART_COLORS = {
  Wishlist: '#f59e0b',
  Applied: '#3b82f6',
  Interviewing: '#8b5cf6',
  Offer: '#10b981',
  Rejected: '#ef4444',
  Withdrawn: '#6b7280',
};

// Stat card configuration
const STAT_CONFIG = [
  { key: 'total', label: 'Total Applications', emoji: '📋', color: '#6366f1' },
  { key: 'applied', label: 'Applied', emoji: '📤', color: '#3b82f6' },
  { key: 'interviewing', label: 'Interviewing', emoji: '🎯', color: '#8b5cf6' },
  { key: 'offers', label: 'Offers', emoji: '🎉', color: '#10b981' },
  { key: 'rejected', label: 'Rejected', emoji: '❌', color: '#ef4444' },
  { key: 'wishlist', label: 'Wishlist', emoji: '⭐', color: '#f59e0b' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get('/jobs/stats');
        setStats(res.data.stats);
        setRecentJobs(res.data.recentJobs);
        setUpcomingInterviews(res.data.upcomingInterviews);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Format data for pie chart
  const pieData = stats
    ? Object.entries(STATUS_CHART_COLORS)
        .map(([status, color]) => ({
          name: status,
          value: stats[status.toLowerCase()] || stats[`${status.toLowerCase()}s`] || 0,
          color,
        }))
        .filter(item => item.value > 0)
    : [];

  // Format data for bar chart
  const barData = stats
    ? [
        { name: 'Wishlist', count: stats.wishlist, fill: '#f59e0b' },
        { name: 'Applied', count: stats.applied, fill: '#3b82f6' },
        { name: 'Interviewing', count: stats.interviewing, fill: '#8b5cf6' },
        { name: 'Offer', count: stats.offers, fill: '#10b981' },
        { name: 'Rejected', count: stats.rejected, fill: '#ef4444' },
      ]
    : [];

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try { return format(new Date(date), 'MMM dd, yyyy'); }
    catch { return 'N/A'; }
  };

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Welcome Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.08) 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -30, top: -30,
          width: 150, height: 150,
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div>
          <p style={{ color: 'var(--primary-light)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 4 }}>
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            Your Job Search Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {stats?.total || 0} total applications tracked
          </p>
        </div>
        <button
          id="dashboard-add-btn"
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/jobs/add')}
        >
          <MdAdd /> Add Application
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {STAT_CONFIG.map((item, i) => (
          <div
            key={item.key}
            className="stat-card animate-fadeIn"
            style={{
              '--stat-color': item.color,
              animationDelay: `${i * 60}ms`
            }}
            onClick={() => item.key !== 'total' && navigate(`/jobs?status=${item.label.split(' ')[0]}`)}
          >
            <div className="stat-icon" style={{ background: `${item.color}22` }}>
              <span style={{ fontSize: '1.25rem' }}>{item.emoji}</span>
            </div>
            <div className="stat-value" style={{ color: item.color }}>
              {stats?.[item.key] ?? 0}
            </div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      {stats?.total > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          {/* Pie Chart */}
          <div className="card">
            <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MdTrendingUp style={{ color: 'var(--primary)' }} /> Application Status
            </h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: 8, fontSize: '0.8rem', color: 'var(--text-primary)'
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <div className="empty-icon">📊</div>
                <p>No data yet. Add applications to see charts.</p>
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="card">
            <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MdWork style={{ color: 'var(--accent)' }} /> Applications by Stage
            </h3>
            {barData.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: 8, fontSize: '0.8rem', color: 'var(--text-primary)'
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <div className="empty-icon">📈</div>
                <p>Add applications to see your progress chart.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Applications */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>Recent Applications</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/jobs')}>
              View All
            </button>
          </div>

          {recentJobs.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-icon">📋</div>
              <p className="empty-title">No applications yet</p>
              <p className="empty-message">Start by adding your first job application</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}
                onClick={() => navigate('/jobs/add')}>
                <MdAdd /> Add First Application
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentJobs.map(job => (
                <div key={job._id}
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)', cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: 'var(--bg-input)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {job.companyName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{job.jobTitle}</div>
                  </div>
                  <StatusBadge status={job.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Interviews */}
        <div className="card">
          <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MdCalendarToday style={{ color: '#8b5cf6' }} /> Upcoming Interviews
          </h3>

          {upcomingInterviews.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <div className="empty-icon">📅</div>
              <p className="empty-title">No upcoming interviews</p>
              <p className="empty-message">Schedule interviews by updating application status</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcomingInterviews.map(interview => (
                <div key={interview._id} style={{
                  padding: '12px 16px',
                  background: 'rgba(139,92,246,0.08)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    🎯 {interview.companyName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {interview.jobTitle}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginTop: 6, fontWeight: 500 }}>
                    📅 {formatDate(interview.interviewDate)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
