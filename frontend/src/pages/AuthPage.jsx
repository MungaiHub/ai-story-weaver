import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '4rem auto' }}>
      <div className="card">
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.3rem' }}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          {mode === 'login'
            ? 'Sign in to access your stories.'
            : 'Start weaving AI-powered stories.'}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={254}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={128}
              placeholder={mode === 'login' ? '••••••••' : 'Min. 8 characters'}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : null}
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '1.25rem', textAlign: 'center' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            className="btn btn-ghost btn-sm"
            style={{ display: 'inline', padding: '0', border: 'none', color: 'var(--accent-light)' }}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
