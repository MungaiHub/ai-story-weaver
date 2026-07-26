import React, { useState } from 'react';
import { GitBranch, Pencil, X, Loader } from 'lucide-react';
import { sanitize } from '../utils/sanitize';
import { storyApi } from '../services/api';

/**
 * SegmentCard
 *
 * Renders a single story segment with:
 *  - Branch selector (tabs across all variants of this segment index)
 *  - Steer panel (inline textarea + submit)
 *
 * Props:
 *  storyId       – Mongo ID of the parent story
 *  segmentIndex  – 1-based index of this logical segment
 *  branches      – Array of segment docs for this index (all branches)
 *  activeBranchId– Currently shown branchId for this index
 *  onBranchChange– (index, branchId) => void — parent updates active branch map
 *  onSteerSuccess– (newSegment) => void — parent adds new branch to tree
 */
export default function SegmentCard({
  storyId,
  segmentIndex,
  branches,
  activeBranchId,
  onBranchChange,
  onSteerSuccess,
}) {
  const [steerOpen, setSteerOpen] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activeSegment = branches.find((b) => b.branchId === activeBranchId) || branches[0];

  async function handleSteer(e) {
    e.preventDefault();
    if (!instruction.trim()) return;
    setError('');
    setLoading(true);
    try {
      const newSeg = await storyApi.steer(storyId, activeSegment._id, instruction.trim());
      setInstruction('');
      setSteerOpen(false);
      onSteerSuccess(newSeg);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const branchLabel = (seg) => {
    if (seg.branchId === 'main') return 'Original';
    // Show first 6 chars of UUID as short label
    return `Branch ${seg.branchId.slice(0, 6)}`;
  };

  return (
    <div className="segment-card">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="segment-header">
        <span className="segment-index">Scene {segmentIndex}</span>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <span
            className={`segment-branch-badge ${activeSegment.branchId === 'main' ? '' : 'active-branch'}`}
          >
            {branchLabel(activeSegment)}
          </span>

          <button
            className={`btn btn-ghost btn-sm ${steerOpen ? 'active' : ''}`}
            onClick={() => { setSteerOpen(!steerOpen); setError(''); }}
            aria-label="Steer this segment"
            title="Steer this segment"
          >
            {steerOpen ? <X size={14} /> : <Pencil size={14} />}
            {steerOpen ? 'Cancel' : 'Steer'}
          </button>
        </div>
      </div>

      {/* ── Title ──────────────────────────────────────────────────── */}
      {activeSegment.title && (
        <div className="segment-title">{sanitize(activeSegment.title)}</div>
      )}

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="segment-content">{sanitize(activeSegment.content)}</div>

      {/* ── Steer instruction box (accordion) ──────────────────────── */}
      {steerOpen && (
        <div className="steer-panel">
          <div className="steer-panel-title">
            <Pencil size={13} />
            Steering instruction
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: '0.6rem' }}>{error}</div>}

          <form onSubmit={handleSteer}>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g. Make the protagonist seem more vulnerable. Change the tone to foreboding. Give it an alternate ending."
              maxLength={1000}
              rows={3}
              required
              style={{ marginBottom: '0.6rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => { setSteerOpen(false); setInstruction(''); setError(''); }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={loading || !instruction.trim()}
              >
                {loading ? <Loader size={13} className="spin-anim" /> : <GitBranch size={13} />}
                {loading ? 'Regenerating…' : 'Generate branch'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Branch selector ────────────────────────────────────────── */}
      {branches.length > 1 && (
        <div className="branch-selector">
          <GitBranch size={13} />
          <span style={{ marginRight: '0.25rem' }}>Versions:</span>
          {branches.map((seg) => (
            <button
              key={seg.branchId}
              className={`segment-branch-badge ${seg.branchId === activeBranchId ? 'active-branch' : ''}`}
              style={{ cursor: 'pointer', background: 'none', border: 'none', padding: '0.15rem 0.55rem' }}
              onClick={() => onBranchChange(segmentIndex, seg.branchId)}
              title={seg.steerInstruction ? `Instruction: ${seg.steerInstruction}` : 'Original version'}
            >
              {branchLabel(seg)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
