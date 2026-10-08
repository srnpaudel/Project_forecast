import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import { DesignTokens } from '../types/design';

interface FooterProps {
  tokens: DesignTokens;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ tokens, onOpenConsultation }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="border-t border-white/[0.08] py-14 transition-colors"
      style={{
        backgroundColor: tokens.theme === 'dark' ? '#090a0c' : '#f0efe9',
        color: tokens.theme === 'dark' ? '#a1a1aa' : '#52525b',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          
          {/* Brand & Manifesto Column */}
          <div className="md:col-span-5 space-y-3">
            <a
              href="#"
              className="font-serif text-2xl tracking-tight text-white font-medium hover:opacity-80 transition-opacity"
              style={{ color: tokens.theme === 'dark' ? '#ffffff' : '#18181b' }}
            >
              Atelier Kairos
            </a>
            <p className="text-xs sm:text-sm leading-relaxed max-w-sm">
              An independent design studio & front-end engineering practice dedicated to high-precision software, 
              systems architecture, and humane digital craft.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-4 space-y-2 text-xs">
            <div className="font-mono text-zinc-400 uppercase tracking-wider text-[11px] pb-1">
              Architecture Index
            </div>
            <ul className="space-y-1.5 font-medium">
              <li><a href="#work" className="hover:text-white transition-colors">Selected Case Studies</a></li>
              <li><a href="#system" className="hover:text-white transition-colors">Design System Token Lab</a></li>
              <li><a href="#archetypes" className="hover:text-white transition-colors">Domain Layout Archetypes</a></li>
              <li><a href="#lab" className="hover:text-white transition-colors">Type Scale & Contrast Auditor</a></li>
              <li><a href="#heuristics" className="hover:text-white transition-colors">Nielsen Usability Heuristics</a></li>
            </ul>
          </div>

          {/* Direct Engagement */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <div className="font-mono text-zinc-400 uppercase tracking-wider text-[11px] pb-1">
              Advisory Office
            </div>
            <p className="text-xs text-zinc-400">
              Zurich, Switzerland · Operating globally with leading product teams.
            </p>
            <button
              onClick={onOpenConsultation}
              className="px-4 py-2 text-xs font-semibold text-white rounded transition-all hover:brightness-110 cursor-pointer"
              style={{ backgroundColor: tokens.accentHex }}
            >
              Book Design Consultation
            </button>
          </div>

        </div>

        {/* Quiet Sub-Footer */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} Atelier Kairos. Universal Frontend Design Constitution compliant.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Return to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
