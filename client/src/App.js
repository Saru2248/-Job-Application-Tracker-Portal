// ============================================================
// src/App.js — Root React Application Component
// ============================================================
// Sets up:
//   - AuthProvider (global auth state)
//   - React Router (client-side routing)
//   - Protected Routes (redirect if not logged in)
//   - Toaster (notifications)
//   - All page routes
// ============================================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import AddJob from './pages/AddJob';
import EditJob from './pages/EditJob';
import JobDetail from './pages/JobDetail';
import Profile from './pages/Profile';

// Components
import Loader from './components/Loader';

// ============================================================
// ProtectedRoute: Redirect to login if not authenticated
// ============================================================
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ============================================================
// PublicRoute: Redirect to dashboard if already logged in
// ============================================================
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// ============================================================
// App Component
// ============================================================
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Toast Notification System */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1e1e2e',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            },
            success: {
              iconTheme: { primary: '#34d399', secondary: '#1e1e2e' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#1e1e2e' },
            },
          }}
        />

        <Routes>
          {/* Default: redirect to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public Routes (only accessible when NOT logged in) */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected Routes (require authentication) */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><JobList /></ProtectedRoute>} />
          <Route path="/jobs/add" element={<ProtectedRoute><AddJob /></ProtectedRoute>} />
          <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
          <Route path="/jobs/:id/edit" element={<ProtectedRoute><EditJob /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* 404 Catch-all */}
          <Route path="*" element={
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              minHeight: '100vh', textAlign: 'center', color: '#94a3b8'
            }}>
              <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🔍</div>
              <h2 style={{ color: '#f1f5f9', marginBottom: '8px' }}>Page Not Found</h2>
              <p>The page you're looking for doesn't exist.</p>
              <a href="/dashboard" style={{
                marginTop: '20px', padding: '10px 24px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', borderRadius: '12px', textDecoration: 'none',
                fontWeight: '600'
              }}>Go to Dashboard</a>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
