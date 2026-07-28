import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function handleLogout() {
    logout();
    navigate('/auth');
  }

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`navbar-nav-link${pathname === to ? ' active' : ''}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <BookOpen size={20} strokeWidth={2} />
          AI Story Weaver
        </Link>

        {user && (
          <>
            {/* Centre nav links */}
            <div className="navbar-nav">
              {navLink('/', 'Dashboard')}
              {navLink('/how-it-works', 'How It Works')}
              {navLink('/about', 'About')}
            </div>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                {user.username || user.email}
              </span>
              <Link to="/generate" className="btn btn-primary btn-sm">
                <PlusCircle size={14} />
                New Story
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
