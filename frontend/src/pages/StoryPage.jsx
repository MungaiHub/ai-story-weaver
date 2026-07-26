import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { storyApi } from '../services/api';
import { sanitize } from '../utils/sanitize';
import SegmentCard from '../components/SegmentCard';

export default function StoryPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  // tree: { [index]: segmentDoc[] }
  const [tree, setTree] = useState({});
  // activeBranches: { [index]: branchId }
  const [activeBranches, setActiveBranches] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await storyApi.getStory(storyId);
      setStory(data.story);
      setTree(data.tree);

      // Initialise active branches from the story's saved activeBranches map
      const initial = {};
      for (const [idx, branchId] of Object.entries(data.story.activeBranches || {})) {
        initial[idx] = branchId;
      }
      setActiveBranches(initial);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    loadStory();
  }, [loadStory]);

  function handleBranchChange(index, branchId) {
    setActiveBranches((prev) => ({ ...prev, [String(index)]: branchId }));
  }

  function handleSteerSuccess(newSegment) {
    const key = String(newSegment.index);
    // Add the new branch to the local tree
    setTree((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newSegment],
    }));
    // Switch active branch to the new one
    setActiveBranches((prev) => ({ ...prev, [key]: newSegment.branchId }));
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
        <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>Loading story…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={15} /> Back to dashboard
        </button>
      </div>
    );
  }

  if (!story) return null;

  const sortedIndices = Object.keys(tree)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* ── Story header ─────────────────────────────────────────────── */}
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '1.25rem' }}
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={14} /> Dashboard
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          {sanitize(story.title)}
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="pill">{sanitize(story.genre)}</span>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
            {sanitize(story.theme)}
          </span>
        </div>
      </div>

      {/* ── Segment list ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {sortedIndices.map((index) => {
          const branches = tree[String(index)] || [];
          const activeBranchId = activeBranches[String(index)] || 'main';

          return (
            <SegmentCard
              key={index}
              storyId={storyId}
              segmentIndex={index}
              branches={branches}
              activeBranchId={activeBranchId}
              onBranchChange={handleBranchChange}
              onSteerSuccess={handleSteerSuccess}
            />
          );
        })}
      </div>
    </div>
  );
}
