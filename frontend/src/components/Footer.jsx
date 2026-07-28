import React from 'react';
import { Github, Mail, Linkedin, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <BookOpen size={16} strokeWidth={2} />
          AI Story Weaver
        </div>

        <div className="footer-links">
          <a
            href="https://github.com/MungaiHub"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github size={16} />
            MungaiHub
          </a>
          <a href="mailto:njamaa91@mail.com" aria-label="Email">
            <Mail size={16} />
            njamaa91@mail.com
          </a>
          <a
            href="https://www.linkedin.com/in/amos-mungai-210567297/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} />
            Amos Mungai
          </a>
        </div>
      </div>
    </footer>
  );
}
