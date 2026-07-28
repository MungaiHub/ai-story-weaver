import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Github, Mail, Linkedin, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          About AI Story Weaver
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>
          A project born from a love of storytelling and curiosity about AI.
        </p>
      </div>

      {/* Project overview */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
          <BookOpen size={22} strokeWidth={1.5} style={{ color: 'var(--accent-light)' }} />
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>The Project</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>
          AI Story Weaver is an interactive story generation platform powered by Google Gemini.
          Writers provide a theme, genre, and plot beats — the AI crafts a story split into
          individual scenes that can be steered, branched, and compared in real time.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
          Built with React + Vite on the frontend and Node.js + Express + MongoDB on the backend.
          The LLM layer is provider-agnostic — swap between Gemini, OpenAI, or a deterministic
          stub via a single environment variable.
        </p>
      </div>

      {/* Stack */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>Tech Stack</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'Google Gemini', 'JWT', 'Mongoose'].map((t) => (
            <span key={t} className="pill">{t}</span>
          ))}
        </div>
      </div>

      {/* Author */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem' }}>Author</div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Built by <strong style={{ color: 'var(--text)' }}>Amos Mungai</strong> — a developer
          who enjoys building tools that blend creativity with modern AI.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <a
            href="https://github.com/MungaiHub"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
          >
            <Github size={16} /> github.com/MungaiHub
          </a>
          <a
            href="mailto:njamaa91@mail.com"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
          >
            <Mail size={16} /> njamaa91@mail.com
          </a>
          <a
            href="https://www.linkedin.com/in/amos-mungai-210567297/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
          >
            <Linkedin size={16} /> linkedin.com/in/amos-mungai-210567297
          </a>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          className="btn btn-primary"
          style={{ display: 'inline-flex' }}
          onClick={() => navigate('/generate')}
        >
          Start Writing <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
