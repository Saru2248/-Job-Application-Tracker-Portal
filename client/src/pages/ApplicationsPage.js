/**
 * pages/ApplicationsPage.js — All Job Applications with Filters
 *
 * Features:
 * - Search by company/position name
 * - Filter by status, priority, job type
 * - Sort by date
 * - Grid of ApplicationCard components
 * - Delete confirmation modal
 * - Empty state when no results
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import ApplicationCard from '../components/ApplicationCard';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  'All', 'Applied', 'Under Review', 'Interview Scheduled',
  'Interview Done', 'Offer Received', 'Accepted', 'Rejected', 'Withdrawn'
];

const PRIORITY_OPTIONS = ['All', 'High', 'Medium', 'Low'];
const JOB_TYPE_OPTIONS = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];
const SORT_OPTIONS = [
  { value: '-applicationDate', label: 'Newest First' },
  { value: 'applicationDate', label: 'Oldest First' },
  { value: 'company', label: 'Company A-Z' },
  { value: '-company', label: 'Company Z-A' },
];

// Delete Confirmation Modal
const DeleteModal = ({ jobLabel, onConfirm, onCancel }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <h3>🗑️ Delete Application</h3>
      <p>
        Are you sure you want to delete <strong>{jobLabel}</strong>?
        This action cannot be undone.
      </p>
      <div className="modal-actions">
        <button className="btn btn-danger" onClick={onConfirm} id="confirm-delete-btn">
          Yes, Delete
        </button>
        <button className="btn btn-secondary" onClick={onCancel} id="cancel-delete-btn">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const ApplicationsPage = () => {
  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || 'All',
    priority: 'All',
    jobType: 'All',
    sort: '-applicationDate',
  });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    jobId: null,
    jobLabel: '',
  });

  // Fetch jobs whenever filters or search changes
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        sort: filters.sort,
      };
      if (filters.status !== 'All') params.status = filters.status;
      if (filters.priority !== 'All') params.priority = filters.priority;
      if (filters.jobType !== 'All') params.jobType = filters.jobType;
      if (search.trim()) params.search = search.trim();

      const { data } = await jobsAPI.getAll(params);
      setJobs(data.jobs);
    } catch (err) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [filters, search]);

  useEffect(() => {
    // Debounce search input by 400ms to avoid too many API calls
    const timer = setTimeout(fetchJobs, 400);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteRequest = (jobId, jobLabel) => {
    setDeleteModal({ show: true, jobId, jobLabel });
  };

  const handleDeleteConfirm = async () => {
    try {
      await jobsAPI.delete(deleteModal.jobId);
      toast.success('Application deleted');
      setDeleteModal({ show: false, jobId: null, jobLabel: '' });
      fetchJobs();
    } catch (err) {
      toast.error('Failed to delete application');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, jobId: null, jobLabel: '' });
  };

  return (
    <div className="page-wrapper">
      {/* Delete Modal */}
      {deleteModal.show && (
        <DeleteModal
          jobLabel={deleteModal.jobLabel}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 My Applications</h1>
          <p className="page-subtitle">
            {loading ? 'Loading...' : `${jobs.length} application${jobs.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <Link to="/applications/add" className="btn btn-primary" id="add-application-btn">
          ➕ Add Application
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        {/* Search */}
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            id="search-input"
            className="form-input search-input"
            placeholder="Search company or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <select
          id="status-filter"
          className="form-select filter-select"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'All' ? '🔖 All Statuses' : s}</option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          id="priority-filter"
          className="form-select filter-select"
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
        >
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p === 'All' ? '⭐ All Priorities' : p}</option>
          ))}
        </select>

        {/* Job Type Filter */}
        <select
          id="jobtype-filter"
          className="form-select filter-select"
          value={filters.jobType}
          onChange={(e) => handleFilterChange('jobType', e.target.value)}
        >
          {JOB_TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t === 'All' ? '💼 All Types' : t}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          id="sort-filter"
          className="form-select filter-select"
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Clear Filters */}
        {(filters.status !== 'All' || filters.priority !== 'All' || filters.jobType !== 'All' || search) && (
          <button
            className="btn btn-secondary btn-sm"
            id="clear-filters-btn"
            onClick={() => {
              setSearch('');
              setFilters({ status: 'All', priority: 'All', jobType: 'All', sort: '-applicationDate' });
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Applications Grid */}
      {loading ? (
        <div className="loading-container" style={{ minHeight: '300px' }}>
          <div className="spinner"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No applications found</h3>
          <p>
            {search || filters.status !== 'All'
              ? 'Try adjusting your filters'
              : "You haven't added any applications yet"}
          </p>
          <Link to="/applications/add" className="btn btn-primary">
            ➕ Add Your First Application
          </Link>
        </div>
      ) : (
        <div className="job-cards-grid">
          {jobs.map((job) => (
            <ApplicationCard
              key={job._id}
              job={job}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
