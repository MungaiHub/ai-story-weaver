import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, GitBranch, ArrowRight, BookOpen, Pencil, Shuffle } from 'lucide-react';

const steps = [
  {
    icon: <Wand2 size={28} strokeWidth={1.5} />,
    title: '1. Set the Stage',
    desc: 'Choose a genre, write a theme, and add a few plot beats — key story moments you want the narrative to hit. You stay in control of the direction.',
  },
  {
    icon: <BookOpen size={28} strokeWidth={1.5} />,
    title: '2. AI Generates Your Story',
    desc: 'Google Gemini writes your story as a series of numbered scenes, each 3–5 sentences. Every scene is stored individually so it can be edited independently.',
  },
  {
    icon: <Pencil size={28} strokeWidth={1.5} />,
    title: '3. Steer Any Scene',
    desc: 'Click "Steer" on any scene and give a plain-English instruction — "make this darker", "add a plot twist", "change the tone to hopeful". The AI rewrites just that scene.',
  },
  {
    icon: <GitBranch size={28} strokeWidth={1.5} />,
    title: '4. Branch & Compare',
    desc: 'Each steered scene is saved as a new branch. The original is never deleted. Switch between versions with one click to compare and pick your favourite.',
  },
  {
    icon: <Shuffle size={28} strokeWidth={1.5} />,
    title: '5. Mix & Match',
    desc: 'Every scene can have multiple branches independently. Scene 2 can be on Branch A while Scene 4 is on Branch C — build the story your way.',
  },
];

export default function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          How It Works
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>
          AI Story Weaver turns your ideas into a branching, editable narrative in five steps.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {steps.map((step) => (
          <div key={step.title} className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent-light)', flexShrink: 0, marginTop: '0.1rem' }}>
              {step.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>
                {step.title}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                {step.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
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
