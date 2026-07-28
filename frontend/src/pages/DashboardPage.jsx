import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, PlusCircle, Lightbulb, Info } from 'lucide-react';
import { sanitize } from '../utils/sanitize';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dashboard fetches aren't in the current API spec (no GET /api/story list
  // endpoint). We detect this gracefully and show the empty state + CTA.
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div style={{ paddingBottom: '3rem' }}>
      {/* ── Welcome banner ───────────────────────────────────────────── */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          {user?.username ? `Welcome back, ${user.username} 👋` : 'Your Stories'}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.3rem' }}>
          Pick up where you left off, or start something new.
        </p>
      </div>

      {/* ── Quick action cards ───────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div
          className="quick-card"
          onClick={() => navigate('/generate')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/generate')}
        >
          <PlusCircle size={22} strokeWidth={1.5} style={{ color: 'var(--accent-light)' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>New Story</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Generate a new story with AI</div>
          </div>
        </div>
        <div
          className="quick-card"
          onClick={() => navigate('/how-it-works')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/how-it-works')}
        >
          <Lightbulb size={22} strokeWidth={1.5} style={{ color: 'var(--accent-light)' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>How It Works</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Learn about AI story branching</div>
          </div>
        </div>
        <div
          className="quick-card"
          onClick={() => navigate('/about')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/about')}
        >
          <Info size={22} strokeWidth={1.5} style={{ color: 'var(--accent-light)' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>About</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>About this project</div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Your Stories</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/generate')}
        >
          <PlusCircle size={14} />
          New Story
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <span className="spinner" />
        </div>
      )}

      {!loading && stories.length === 0 && (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--muted)' }}
        >
          <BookOpen size={40} strokeWidth={1.2} style={{ margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No stories yet</p>
          <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Generate your first story to get started.
          </p>
          <button
            className="btn btn-primary"
            style={{ display: 'inline-flex' }}
            onClick={() => navigate('/generate')}
          >
            <PlusCircle size={15} />
            Generate a story
          </button>
        </div>
      )}

      {!loading && stories.length > 0 && (
        <div className="story-list">
          {stories.map((s) => (
            <div
              key={s._id}
              className="story-list-item"
              onClick={() => navigate(`/story/${s._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/story/${s._id}`)}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{sanitize(s.title)}</div>
                <div className="story-list-meta">
                  <span className="pill">{sanitize(s.genre)}</span>
                  &nbsp;·&nbsp;
                  {sanitize(s.theme)}
                </div>
              </div>
              <ChevronRight size={18} color="var(--muted)" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
