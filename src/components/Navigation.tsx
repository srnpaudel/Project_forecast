import React, { useState } from 'react';
import { Sliders, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';
import { DesignTokens } from '../types/design';

interface NavigationProps {
  tokens: DesignTokens;
  onOpenTokens: () => void;
  onOpenCritique: () => void;
  activeSection: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  tokens,
  onOpenTokens,
  onOpenCritique,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Selected Work', href: '#work' },
    { label: 'Design System', href: '#system' },
    { label: 'Layouts', href: '#archetypes' },
    { label: 'Type & Color', href: '#lab' },
    { label: 'UX Heuristics', href: '#heuristics' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-opacity-80 transition-colors border-b border-white/[0.08]"
      style={{
        backgroundColor: tokens.theme === 'dark' ? 'rgba(12, 13, 14, 0.85)' : 'rgba(246, 245, 241, 0.9)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in display face */}
        <a
          href="#"
          className="font-serif text-2xl tracking-tight font-medium hover:opacity-80 transition-opacity whitespace-nowrap"
          style={{ color: tokens.theme === 'dark' ? '#f4f4f5' : '#18181b' }}
        >
          Atelier Kairos
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-white relative py-1"
                style={{
                  color: isActive
                    ? (tokens.theme === 'dark' ? '#ffffff' : '#09090b')
                    : (tokens.theme === 'dark' ? '#a1a1aa' : '#52525b')
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px] transition-all"
                    style={{ backgroundColor: tokens.accentHex }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenTokens}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium border border-white/10 hover:border-white/20 transition-all cursor-pointer whitespace-nowrap"
            style={{
              borderRadius: tokens.radiusPx,
              backgroundColor: tokens.theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              color: tokens.theme === 'dark' ? '#f4f4f5' : '#18181b'
            }}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tune Tokens</span>
          </button>

          <button
            onClick={onOpenCritique}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white transition-all cursor-pointer whitespace-nowrap shadow-sm hover:brightness-110 active:scale-[0.98]"
            style={{
              borderRadius: tokens.radiusPx,
              backgroundColor: tokens.accentHex
            }}
          >
            <span>Book Consultation</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-b border-white/10 px-6 py-4 space-y-3"
          style={{
            backgroundColor: tokens.theme === 'dark' ? '#121315' : '#ebe9e1'
          }}
        >
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium py-1 transition-colors"
                style={{ color: tokens.theme === 'dark' ? '#e4e4e7' : '#27272a' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTokens();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium border border-white/10 rounded-md"
              style={{
                backgroundColor: tokens.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
              }}
            >
              <Sliders className="w-3.5 h-3.5" />
              Tune Tokens
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCritique();
              }}
              className="flex-1 py-2 text-xs font-semibold text-white rounded-md text-center"
              style={{ backgroundColor: tokens.accentHex }}
            >
              Book Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
