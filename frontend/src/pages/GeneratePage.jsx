import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Wand2 } from 'lucide-react';
import { storyApi } from '../services/api';

const GENRES = ['fantasy', 'sci-fi', 'mystery', 'romance', 'horror', 'adventure', 'literary'];

export default function GeneratePage() {
  const [theme, setTheme] = useState('');
  const [genre, setGenre] = useState('fantasy');
  const [beats, setBeats] = useState(['', '', '']);
  const [segmentCount, setSegmentCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function addBeat() {
    if (beats.length < 10) setBeats([...beats, '']);
  }

  function removeBeat(i) {
    if (beats.length > 1) setBeats(beats.filter((_, idx) => idx !== i));
  }

  function updateBeat(i, val) {
    const next = [...beats];
    next[i] = val;
    setBeats(next);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const filled = beats.filter((b) => b.trim().length > 0);
    if (filled.length === 0) {
      setError('Please add at least one plot beat.');
      return;
    }

    setLoading(true);
    try {
      const result = await storyApi.generate(
        theme.trim(),
        genre,
        filled,
        segmentCount
      );
      navigate(`/story/${result.story._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', paddingBottom: '3rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>
        New Story
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Describe your story and the AI will generate it in segments you can steer.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="theme">Theme</label>
          <input
            id="theme"
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            required
            maxLength={300}
            minLength={2}
            placeholder="e.g. Redemption through sacrifice"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="genre">Genre</label>
          <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)}>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Plot beats</label>
          <div className="beat-list">
            {beats.map((b, i) => (
              <div className="beat-row" key={i}>
                <span style={{ color: 'var(--muted)', fontSize: '0.8rem', minWidth: '1.2rem' }}>
                  {i + 1}.
                </span>
                <input
                  type="text"
                  value={b}
                  onChange={(e) => updateBeat(i, e.target.value)}
                  maxLength={500}
                  placeholder={`Beat ${i + 1}`}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => removeBeat(i)}
                  disabled={beats.length === 1}
                  aria-label="Remove beat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          {beats.length < 10 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}
              onClick={addBeat}
            >
              <PlusCircle size={14} />
              Add beat
            </button>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="segCount">
            Number of segments (scenes)
          </label>
          <select
            id="segCount"
            value={segmentCount}
            onChange={(e) => setSegmentCount(Number(e.target.value))}
          >
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : <Wand2 size={16} />}
          {loading ? 'Generating…' : 'Generate Story'}
        </button>
      </form>
    </div>
  );
}
