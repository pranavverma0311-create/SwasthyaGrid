import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUser } from '../services/auth';
import '../App.css';

function LandingPage() {
  const navigate = useNavigate();
  const [activeNotice, setActiveNotice] = useState(null);
  const user = getUser();
  const loggedIn = isAuthenticated();

  const handleReportClick = () => {
    setActiveNotice('Citizen Health Reporting module will be activated in the reporting phase.');
  };

  const handleDashboardClick = () => {
    if (loggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <header className="navbar">
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

        <nav className="navbar-nav">
          <span className="navbar-badge">
            <span className="status-dot"></span>
            Public Health Grid
          </span>
          <a href="#features" className="nav-link">Platform Capabilities</a>
          
          {loggedIn ? (
            <Link to="/dashboard" className="nav-link" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
              Dashboard ({user?.name ? user.name.split(' ')[0] : 'User'})
            </Link>
          ) : (
            <>
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/register" className="nav-link" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Main Hero & Content */}
      <main className="main-content">
        <section className="hero-section">
          <div className="team-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Team INNVOX • Public Health Intelligence
          </div>

          <h1 className="hero-title">SwasthyaGrid</h1>

          <p className="hero-tagline">
            Connecting Health Signals. Enabling Faster Response.
          </p>

          <p className="hero-description">
            An intelligent community health signal monitoring and early warning platform designed to capture localized health observations, aggregate disease signals, and empower public health officers with rapid, data-driven response coordination.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={handleReportClick}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              Report a Health Issue
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleDashboardClick}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              Officer Dashboard
            </button>
          </div>

          {activeNotice && (
            <div className="notification-banner" role="status">
              <span>{activeNotice}</span>
              <button
                type="button"
                className="banner-dismiss"
                onClick={() => setActiveNotice(null)}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          )}
        </section>

        {/* Feature Cards Grid */}
        <section id="features" className="features-section">
          <div className="section-header">
            <h2 className="section-title">Core Grid Modules</h2>
            <p className="section-subtitle">
              Unified surveillance architecture linking citizen reports, geospatial tracking, and algorithmic triage.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1: Health Reports */}
            <article className="feature-card">
              <div className="card-header">
                <div className="feature-icon-wrapper icon-reports" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <span className="card-tag">Surveillance</span>
              </div>
              <h3 className="feature-name">Health Reports</h3>
              <p className="feature-desc">
                Structured symptom logging for citizens and field health workers with localized tagging to identify syndromic trends.
              </p>
            </article>

            {/* Feature 2: Smart Alerts */}
            <article className="feature-card">
              <div className="card-header">
                <div className="feature-icon-wrapper icon-alerts" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <span className="card-tag">Early Warning</span>
              </div>
              <h3 className="feature-name">Smart Alerts</h3>
              <p className="feature-desc">
                Automated threshold monitoring and anomaly detection to flag localized clusters before disease propagation escalates.
              </p>
            </article>

            {/* Feature 3: Health Map */}
            <article className="feature-card">
              <div className="card-header">
                <div className="feature-icon-wrapper icon-map" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                    <line x1="8" y1="2" x2="8" y2="18" />
                    <line x1="16" y1="6" x2="16" y2="22" />
                  </svg>
                </div>
                <span className="card-tag">GIS Mapping</span>
              </div>
              <h3 className="feature-name">Health Map</h3>
              <p className="feature-desc">
                Geospatial visualization mapping hotspot clusters, ward boundaries, and health facility readiness in real time.
              </p>
            </article>

            {/* Feature 4: AI Assistance */}
            <article className="feature-card">
              <div className="card-header">
                <div className="feature-icon-wrapper icon-ai" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4" />
                    <path d="M12 18v4" />
                    <path d="M4.93 4.93l2.83 2.83" />
                    <path d="M16.24 16.24l2.83 2.83" />
                    <path d="M2 12h4" />
                    <path d="M18 12h4" />
                    <path d="M4.93 19.07l2.83-2.83" />
                    <path d="M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <span className="card-tag">Risk Engine</span>
              </div>
              <h3 className="feature-name">AI Assistance</h3>
              <p className="feature-desc">
                Epidemiological signal analysis and intelligent risk scoring assisting officers in prioritizing urgent community interventions.
              </p>
            </article>
          </div>
        </section>

        {/* Foundation Notice */}
        <section id="about" className="info-banner">
          <p className="info-text">
            <strong>Architecture Note:</strong> Authentication + RBAC connected to backend. Citizen and Officer portals active.
          </p>
          <span className="info-badge">Phase: Auth Integration</span>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-tagline">
            SwasthyaGrid &mdash; Connecting Health Signals. Enabling Faster Response.
          </div>
          <div className="footer-copy">
            Team INNVOX &bull; Public Health Response System
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
