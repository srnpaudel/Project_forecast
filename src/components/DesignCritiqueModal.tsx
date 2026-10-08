import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, Calendar, Sparkles, Send } from 'lucide-react';
import { DesignTokens } from '../types/design';

interface DesignCritiqueModalProps {
  isOpen: boolean;
  tokens: DesignTokens;
  onClose: () => void;
}

export const DesignCritiqueModal: React.FC<DesignCritiqueModalProps> = ({
  isOpen,
  tokens,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState('Design System Architecture');
  const [timeline, setTimeline] = useState('2-Week Intensive Audit');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 text-left transition-all max-h-[90vh] overflow-y-auto"
        style={{
          borderRadius: tokens.radiusPx,
          backgroundColor: tokens.theme === 'dark' ? '#121316' : '#ffffff',
          color: tokens.theme === 'dark' ? '#f4f4f5' : '#18181b',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Direct Advisory Consultation
            </div>
            <h2 className="font-serif text-2xl font-medium tracking-tight">
              Initiate Design & Frontend Engagement
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded border border-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-medium">Inquiry Dispatched</h3>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto">
              Your engagement briefing for <strong className="text-zinc-200">{selectedService}</strong> has been received. 
              Valen will review your architectural constraints and respond within 24 hours.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-5 py-2 text-xs font-semibold text-white rounded transition-all cursor-pointer"
                style={{ backgroundColor: tokens.accentHex }}
              >
                Return to Studio
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Service Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Engagement Scope</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Design System Architecture',
                  'UI/UX Workstation Redesign',
                  'Frontend Performance & Motion',
                  'Heuristic & WCAG Audit',
                ].map((srv) => (
                  <button
                    type="button"
                    key={srv}
                    onClick={() => setSelectedService(srv)}
                    className={`p-2.5 text-xs text-left border rounded transition-all cursor-pointer ${
                      selectedService === srv
                        ? 'border-white text-white bg-white/10 font-semibold'
                        : 'border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    {srv}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Expected Cadence</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  '2-Week Sprint',
                  '1-Month Overhaul',
                  'Ongoing Advisory',
                ].map((tm) => (
                  <button
                    type="button"
                    key={tm}
                    onClick={() => setTimeline(tm)}
                    className={`py-2 text-xs text-center border rounded transition-all cursor-pointer ${
                      timeline === tm
                        ? 'border-white text-white bg-white/10 font-semibold'
                        : 'border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    {tm}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Contact */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Direct Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="valen@organisation.com"
                className="w-full px-3.5 py-2 text-xs bg-black/40 border border-white/10 rounded text-zinc-100 focus:outline-none focus:border-zinc-300"
              />
            </div>

            {/* Brief Context */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Project Context & Specific Friction</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly describe your product domain, user pain points, and current tech stack..."
                className="w-full px-3.5 py-2 text-xs bg-black/40 border border-white/10 rounded text-zinc-100 focus:outline-none focus:border-zinc-300"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-[11px] text-zinc-500 font-mono">
                NON-DISCLOSURE AGREEMENT OBSERVED
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                style={{
                  borderRadius: tokens.radiusPx,
                  backgroundColor: tokens.accentHex,
                }}
              >
                <span>Transmit Briefing</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
