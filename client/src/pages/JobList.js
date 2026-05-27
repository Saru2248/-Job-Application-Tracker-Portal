// ============================================================
// pages/JobList.js — All Job Applications List Page
// ============================================================
// Shows all applications in a filterable, searchable grid.
// Features:
//   - Status filter tabs
//   - Search by company/role
//   - Job type filter
//   - Sort by date/company
//   - Pagination
//   - Card view of each application
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import Layout from '../components/Layout';
import JobCard from '../components/JobCard';
import { MdAdd, MdSearch, MdFilterList, MdRefresh } from 'react-icons/md';
import toast from 'react-hot-toast';

const STATUSES = ['All', 'Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'];
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];
const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'appliedDate', label: 'Applied Date' },
  { value: 'companyName', label: 'Company Name' },
];

const JobList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [jobType, setJobType] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch jobs from API
  const fetchJobs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        sortBy,
        order: sortOrder,
      };
      if (status !== 'All') params.status = status;
      if (jobType !== 'All') params.jobType = jobType;
      if (search.trim()) params.search = search.trim();

      const res = await axiosInstance.get('/jobs', { params });
      setJobs(res.data.jobs);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [status, jobType, sortBy, sortOrder, search]);

  // Fetch when filters change (debounce search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs(1);
    }, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchJobs, search, status, jobType, sortBy, sortOrder]);

  // Remove deleted job from list
  const handleJobDelete = (deletedId) => {
    setJobs(prev => prev.filter(j => j._id !== deletedId));
    setTotal(prev => prev - 1);
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('All');
    setJobType('All');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const hasActiveFilters = search || status !== 'All' || jobType !== 'All';

  return (
    <Layout title="Job Applications" subtitle={`${total} total applications tracked`}>

      {/* Filter Bar */}
      <div className="filter-bar">
        {/* Search */}
        <div className="filter-search" style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <MdSearch className="filter-search-icon" />
          <input
            id="job-search-input"
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search company, role, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Job Type Filter */}
        <select
          className="form-select"
          style={{ width: 140 }}
          value={jobType}
          onChange={e => setJobType(e.target.value)}
        >
          {JOB_TYPES.map(type => (
            <option key={type} value={type}>{type === 'All' ? '🏢 All Types' : type}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="form-select"
          style={{ width: 150 }}
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Sort Order */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
          data-tooltip={sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        >
          {sortOrder === 'desc' ? '↓' : '↑'}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button className="btn btn-danger btn-sm" onClick={clearFilters}>
            <MdRefresh /> Clear
          </button>
        )}

        {/* Add New */}
        <button
          id="add-job-btn"
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/jobs/add')}
        >
          <MdAdd /> Add New
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24,
        padding: '4px', background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
      }}>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            style={{
              padding: '7px 16px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.82rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              background: status === s ? 'var(--gradient-primary)' : 'transparent',
              color: status === s ? 'white' : 'var(--text-muted)',
              boxShadow: status === s ? '0 2px 8px rgba(99,102,241,0.35)' : 'none',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p className="empty-title">
            {hasActiveFilters ? 'No applications match your filters' : 'No applications yet'}
          </p>
          <p className="empty-message">
            {hasActiveFilters
              ? 'Try clearing filters or adjusting your search'
              : 'Start by adding your first job application'}
          </p>
          {!hasActiveFilters && (
            <button className="btn btn-primary" style={{ marginTop: 16 }}
              onClick={() => navigate('/jobs/add')}>
              <MdAdd /> Add First Application
            </button>
          )}
          {hasActiveFilters && (
            <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16
        }}>
          {jobs.map(job => (
            <JobCard key={job._id} job={job} onDelete={handleJobDelete} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 8, marginTop: 32
        }}>
          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage === 1}
            onClick={() => fetchJobs(currentPage - 1)}
          >← Previous</button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => fetchJobs(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => fetchJobs(currentPage + 1)}
          >Next →</button>
        </div>
      )}
    </Layout>
  );
};

export default JobList;
