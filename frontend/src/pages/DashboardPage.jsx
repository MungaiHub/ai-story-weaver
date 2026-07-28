import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, PlusCircle } from 'lucide-react';
import { sanitize } from '../utils/sanitize';

export default function DashboardPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Dashboard fetches aren't in the current API spec (no GET /api/story list
  // endpoint). We detect this gracefully and show the empty state + CTA.
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Your Stories</h1>
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
