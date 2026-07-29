import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, GitBranch, BookOpen, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    icon: <Sparkles size={22} strokeWidth={1.6} />,
    title: 'Instant AI Generation',
    desc: 'Describe your theme, pick a genre, and add plot beats — Gemini crafts a full multi-scene story in seconds.',
  },
  {
    icon: <Layers size={22} strokeWidth={1.6} />,
    title: 'Scene-by-Scene Control',
    desc: 'Every scene is stored independently. Steer any individual scene with a plain-English instruction without touching the rest.',
  },
  {
    icon: <GitBranch size={22} strokeWidth={1.6} />,
    title: 'Branch & Compare',
    desc: 'Each steered scene creates a branch. The original is never lost — switch between versions and mix them freely.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleGetStarted() {
    if (user) {
      navigate('/generate');
    } else {
      navigate('/auth');
    }
  }

  function handleHowItWorks() {
    navigate('/how-it-works');
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 1rem 3.5rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '3rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '999px',
            padding: '0.3rem 0.9rem',
            fontSize: '0.8rem',
            color: 'var(--accent-light)',
            marginBottom: '1.5rem',
            fontWeight: 600,
          }}
        >
          <BookOpen size={13} /> Powered by Google Gemini
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.9rem, 5vw, 2.8rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}
        >
          Generate stories instantly
          <br />
          <span style={{ color: 'var(--accent-light)' }}>with the power of AI</span>
        </h1>

        <p
          style={{
            color: 'var(--muted)',
            fontSize: '1rem',
            maxWidth: 520,
            margin: '0 auto 2rem',
            lineHeight: 1.7,
          }}
        >
          AI Story Weaver is an LLM-powered platform where you set the stage — genre,
          theme, plot beats — and the AI writes a branching, steerable narrative you can
          shape scene by scene.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleGetStarted} style={{ fontSize: '0.95rem', padding: '0.65rem 1.5rem' }}>
            <Wand2 size={16} />
            {user ? 'New Story' : 'Get Started — it\'s free'}
          </button>
          <button className="btn btn-ghost" onClick={handleHowItWorks} style={{ fontSize: '0.95rem', padding: '0.65rem 1.5rem' }}>
            How it works <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── Feature cards ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {FEATURES.map((f) => (
          <div key={f.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ color: 'var(--accent-light)' }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{f.title}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.65 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
