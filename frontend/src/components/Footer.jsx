import React from 'react';
import { Github, Linkedin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        {/* Left — social icon links only */}
        <div className="footer-links">
          <a
            href="https://github.com/MungaiHub"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub — MungaiHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/amos-mungai-210567297/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn — Amos Mungai"
          >
            <Linkedin size={18} />
          </a>
        </div>

        {/* Right — copyright */}
        <div className="footer-copy">
          &copy; {year} AI Story Weaver &mdash; Built for storytellers, powered by AI.
        </div>
      </div>
    </footer>
  );
}
