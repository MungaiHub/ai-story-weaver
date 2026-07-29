import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, PlusCircle, UserCircle2, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/home');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`navbar-nav-link${pathname === to ? ' active' : ''}`}
      onClick={closeMenu}
    >
      {label}
    </Link>
  );

  return (
    <nav className="navbar">
      <div className="container navbar-inner">

        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <Link to={user ? '/' : '/home'} className="navbar-brand" onClick={closeMenu}>
          <BookOpen size={20} strokeWidth={2} />
          AI Story Weaver
        </Link>

        {/* ── Desktop centre links ───────────────────────────────────────── */}
        <div className="navbar-nav navbar-nav--desktop">
          {navLink('/home', 'Home')}
          {user && navLink('/', 'My Stories')}
          {navLink('/how-it-works', 'How It Works')}
        </div>

        {/* ── Desktop right actions ──────────────────────────────────────── */}
        <div className="navbar-actions navbar-actions--desktop">
          {user ? (
            <>
              <Link to="/generate" className="btn btn-primary btn-sm" onClick={closeMenu}>
                <PlusCircle size={14} />
                New Story
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <LogOut size={14} />
                Sign out
              </button>
              <span className="navbar-user-badge">
                <UserCircle2 size={15} strokeWidth={1.8} />
                {user.username || user.email}
              </span>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm" onClick={closeMenu}>
              Sign in
            </Link>
          )}
        </div>

        {/* ── Hamburger (mobile only) ────────────────────────────────────── */}
        <button
          className="navbar-hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      {menuOpen && (
        <div className="navbar-drawer">
          <div className="container">
            {/* Nav links */}
            <div className="navbar-drawer-links">
              {navLink('/home', 'Home')}
              {user && navLink('/', 'My Stories')}
              {navLink('/how-it-works', 'How It Works')}
            </div>

            {/* Actions */}
            <div className="navbar-drawer-actions">
              {user ? (
                <>
                  <Link
                    to="/generate"
                    className="btn btn-primary"
                    style={{ justifyContent: 'center' }}
                    onClick={closeMenu}
                  >
                    <PlusCircle size={15} />
                    New Story
                  </Link>
                  <button
                    className="btn btn-ghost"
                    style={{ justifyContent: 'center' }}
                    onClick={handleLogout}
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                  <span className="navbar-user-badge" style={{ justifyContent: 'center' }}>
                    <UserCircle2 size={15} strokeWidth={1.8} />
                    {user.username || user.email}
                  </span>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="btn btn-primary"
                  style={{ justifyContent: 'center' }}
                  onClick={closeMenu}
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
