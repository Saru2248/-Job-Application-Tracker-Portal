/**
 * pages/DashboardPage.js — Main Dashboard
 *
 * Displays:
 * - Welcome message with user's name
 * - Stats cards (Total, Applied, Interview, Offer, Rejected)
 * - Bar chart showing application status distribution
 * - Upcoming interviews in the next 7 days
 * - Quick actions (Add Application)
 * - Recent 3 applications
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import toast from 'react-hot-toast';

// Color mapping for chart bars
const STATUS_COLORS = {
  'Applied':             '#3b82f6',
  'Under Review':        '#f59e0b',
  'Interview Scheduled': '#8b5cf6',
  'Interview Done':      '#06b6d4',
  'Offer Received':      '#10b981',
  'Accepted':            '#059669',
  'Rejected':            '#ef4444',
  'Withdrawn':           '#64748b',
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats and recent jobs in parallel (both requests happen simultaneously)
      const [statsRes, jobsRes] = await Promise.all([
        jobsAPI.getStats(),
        jobsAPI.getAll({ sort: '-applicationDate' }),
      ]);

      setStats(statsRes.data);

      const jobs = jobsRes.data.jobs;
      setRecentJobs(jobs.slice(0, 3)); // Show latest 3

      // Filter jobs with upcoming interview dates (next 7 days)
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcoming = jobs.filter((job) => {
        if (!job.interviewDate) return false;
        const d = new Date(job.interviewDate);
        return d >= now && d <= nextWeek;
      });
      setUpcomingInterviews(upcoming);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data from statusCounts
  const getChartData = () => {
    if (!stats?.statusCounts) return [];
    return Object.entries(stats.statusCounts).map(([status, count]) => ({
      status: status.split(' ')[0], // Shorten label
      fullStatus: status,
      count,
    }));
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return {
      day: d.getDate(),
      month: d.toLocaleString('en', { month: 'short' }),
      full: d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' }),
    };
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="loading-container" style={{ minHeight: '400px' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const chartData = getChartData();

  return (
    <div className="page-wrapper">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h2>
          Good day, <span>{user?.name?.split(' ')[0]} 👋</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
          Here's your job application summary
        </p>
      </div>

      {/* ─── Stats Cards ─────────────────────────────────────────────────────── */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>
            {stats?.total || 0}
          </div>
          <div className="stat-label">Total Applications</div>
        </div>

        <div className="stat-card applied">
          <div className="stat-icon">📩</div>
          <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>
            {stats?.statusCounts?.['Applied'] || 0}
          </div>
          <div className="stat-label">Applied</div>
        </div>

        <div className="stat-card interview">
          <div className="stat-icon">📅</div>
          <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>
            {(stats?.statusCounts?.['Interview Scheduled'] || 0) +
              (stats?.statusCounts?.['Interview Done'] || 0)}
          </div>
          <div className="stat-label">Interviews</div>
        </div>

        <div className="stat-card offer">
          <div className="stat-icon">🎉</div>
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
            {(stats?.statusCounts?.['Offer Received'] || 0) +
              (stats?.statusCounts?.['Accepted'] || 0)}
          </div>
          <div className="stat-label">Offers</div>
        </div>

        <div className="stat-card rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-value" style={{ color: 'var(--accent-red)' }}>
            {stats?.statusCounts?.['Rejected'] || 0}
          </div>
          <div className="stat-label">Rejected</div>
        </div>

        <div className="stat-card" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <div className="stat-icon">⏰</div>
          <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>
            {upcomingInterviews.length}
          </div>
          <div className="stat-label">Interviews This Week</div>
        </div>
      </div>

      {/* ─── Chart ──────────────────────────────────────────────────────────── */}
      {chartData.length > 0 && (
        <div className="chart-container">
          <div className="chart-title">📈 Application Status Distribution</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="status" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullStatus || ''}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLORS[entry.fullStatus] || '#8b5cf6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* ─── Upcoming Interviews ─────────────────────────────────────────── */}
        <div>
          <div className="dashboard-section-title">⏰ Upcoming Interviews</div>
          {upcomingInterviews.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '32px',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
              }}
            >
              🗓️ No interviews scheduled this week
            </div>
          ) : (
            <div className="upcoming-list">
              {upcomingInterviews.map((job) => {
                const date = formatDate(job.interviewDate);
                return (
                  <div key={job._id} className="upcoming-item">
                    <div className="upcoming-date">
                      <div className="upcoming-date-day">{date.day}</div>
                      <div className="upcoming-date-month">{date.month}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {job.company}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {job.position}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                        {date.full}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Recent Applications ──────────────────────────────────────────── */}
        <div>
          <div className="dashboard-section-title">🕐 Recent Applications</div>
          {recentJobs.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '32px',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📭</div>
              <p>No applications yet</p>
              <Link to="/applications/add" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                + Add Your First Application
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentJobs.map((job) => (
                <div
                  key={job._id}
                  className="card"
                  style={{ padding: '14px 16px', cursor: 'pointer' }}
                  onClick={() => navigate(`/applications/edit/${job._id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{job.company}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{job.position}</div>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>
                </div>
              ))}
              <Link
                to="/applications"
                className="btn btn-secondary"
                style={{ textAlign: 'center', marginTop: '4px' }}
              >
                View All Applications →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ─── Quick Actions ────────────────────────────────────────────────────── */}
      <div style={{ marginTop: '32px' }}>
        <div className="dashboard-section-title">⚡ Quick Actions</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/applications/add" className="btn btn-primary">
            ➕ Add New Application
          </Link>
          <Link to="/applications" className="btn btn-secondary">
            📋 View All Applications
          </Link>
          <Link to="/applications?status=Interview Scheduled" className="btn btn-secondary">
            📅 View Scheduled Interviews
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
