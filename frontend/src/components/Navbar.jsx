import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/auth');
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <BookOpen size={20} strokeWidth={2} />
          AI Story Weaver
        </Link>

        {user && (
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
        )}
      </div>
    </nav>
  );
}
