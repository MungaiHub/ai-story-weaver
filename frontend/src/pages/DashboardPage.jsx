import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, PlusCircle, Calendar } from 'lucide-react';
import { sanitize } from '../utils/sanitize';
import { useAuth } from '../context/AuthContext';
import { storyApi } from '../services/api';

export default function DashboardPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    async function fetchStories() {
      try {
        const data = await storyApi.listStories();
        if (!cancelled) setStories(data.stories);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchStories();
    return () => { cancelled = true; };
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
                <div className="story-list-meta" style={{ marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={11} />
                  {new Date(s.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  &nbsp;·&nbsp;{s.segmentCount} scene{s.segmentCount !== 1 ? 's' : ''}
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
