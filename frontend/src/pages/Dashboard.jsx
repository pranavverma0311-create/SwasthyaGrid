import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { getUser, isAuthenticated, logout, saveUser } from '../services/auth';
import './Auth.css';

function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getUser());
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    // Verify token with backend /api/auth/me
    authApi.getMe()
      .then((res) => {
        if (res && res.user) {
          setCurrentUser(res.user);
          saveUser(res.user);
        }
      })
      .catch(() => {
        // If token expired or invalid, log out
        logout();
        navigate('/login', { replace: true });
      })
      .finally(() => {
        setVerifying(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'role-badge role-admin';
      case 'OFFICER':
        return 'role-badge role-officer';
      case 'HEALTH_WORKER':
        return 'role-badge role-worker';
      default:
        return 'role-badge role-citizen';
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="brand-container">
          <div className="brand-icon-wrapper" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <span className="brand-title">SwasthyaGrid</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="nav-link" style={{ fontSize: '0.875rem' }}>
            &larr; Landing Page
          </Link>
          <button
            type="button"
            className="btn-logout"
            onClick={handleLogout}
            title="Sign out of current session"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <div className="welcome-top">
            <div>
              <h1 className="welcome-title">Welcome to SwasthyaGrid</h1>
              <p className="welcome-subtitle">
                Authenticated Session &bull; Community Health Intelligence Platform
              </p>
            </div>
            {currentUser?.role && (
              <span className={getRoleBadgeClass(currentUser.role)}>
                ● {currentUser.role}
              </span>
            )}
          </div>

          <div className="user-profile-grid">
            <div className="profile-item">
              <span className="profile-label">Full Name</span>
              <span className="profile-value">{currentUser?.name || 'Loading...'}</span>
            </div>

            <div className="profile-item">
              <span className="profile-label">Email Address</span>
              <span className="profile-value">{currentUser?.email || 'Loading...'}</span>
            </div>

            <div className="profile-item">
              <span className="profile-label">Assigned Role</span>
              <span className="profile-value">{currentUser?.role || 'CITIZEN'}</span>
            </div>

            <div className="profile-item">
              <span className="profile-label">Verification Status</span>
              <span className="profile-value" style={{ color: '#0d9488' }}>
                {verifying ? 'Verifying session...' : 'Verified (JWT Active)'}
              </span>
            </div>
          </div>

          <div className="dashboard-notice">
            <strong>Placeholder Notice:</strong> You are currently viewing the Phase 3 authenticated session placeholder. The full Officer Analytics Dashboard, GIS Surveillance Map, and Citizen Report workflows will be mounted here in subsequent phases.
          </div>

          <div>
            <button
              type="button"
              className="btn-logout"
              onClick={handleLogout}
            >
              Sign Out / Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
