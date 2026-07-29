import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, PlusCircle, UserCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function handleLogout() {
    logout();
    navigate('/home');
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
        <Link to={user ? '/' : '/home'} className="navbar-brand">
          <BookOpen size={20} strokeWidth={2} />
          AI Story Weaver
        </Link>

        {/* Centre nav links — always visible */}
        <div className="navbar-nav">
          {navLink('/home', 'Home')}
          {user && navLink('/', 'My Stories')}
          {navLink('/how-it-works', 'How It Works')}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              {/* User badge with icon */}
              <span className="navbar-user-badge">
                <UserCircle2 size={16} strokeWidth={1.8} />
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
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
