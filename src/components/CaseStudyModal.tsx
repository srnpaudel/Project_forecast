import React, { useEffect, useState } from 'react';
import { X, Check, ArrowRight, ExternalLink, Sliders, ShieldCheck, Eye, Layers } from 'lucide-react';
import { CaseStudy, DesignTokens } from '../types/design';

interface CaseStudyModalProps {
  study: CaseStudy | null;
  tokens: DesignTokens;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  study,
  tokens,
  onClose,
  onOpenConsultation,
}) => {
  const [viewMode, setViewMode] = useState<'production' | 'wireframe'>('production');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!study) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl my-auto border border-white/10 shadow-2xl overflow-hidden transition-all text-left max-h-[90vh] flex flex-col"
        style={{
          borderRadius: tokens.radiusPx,
          backgroundColor: tokens.theme === 'dark' ? '#121316' : '#ffffff',
          color: tokens.theme === 'dark' ? '#f4f4f5' : '#18181b',
        }}
      >
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="space-y-1">
            {/* Unboxed metadata */}
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>{study.client}</span>
              <span aria-hidden="true">·</span>
              <span>{study.year}</span>
              <span aria-hidden="true">·</span>
              <span>{study.role}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight">
              {study.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Blueprint vs Production Interactive Toggle */}
            <div className="flex items-center bg-zinc-800/60 p-0.5 rounded-md border border-white/10">
              <button
                onClick={() => setViewMode('production')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  viewMode === 'production'
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Production Hi-Fi
              </button>
              <button
                onClick={() => setViewMode('wireframe')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  viewMode === 'wireframe'
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Wireframe Blueprint
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-md border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close case study dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="px-6 sm:px-8 py-6 overflow-y-auto space-y-8 flex-1">
          {/* Visual Showcase with Mode Switcher */}
          <div
            className="relative border border-white/10 overflow-hidden shadow-inner aspect-[16/9] max-h-[380px]"
            style={{ borderRadius: tokens.radiusPx }}
          >
            {viewMode === 'production' ? (
              <img
                src={study.heroImage}
                alt={study.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              /* High-Craft Interactive Wireframe Blueprint Mode */
              <div className="w-full h-full bg-[#0a0c10] p-6 flex flex-col justify-between font-mono text-xs text-sky-400 border border-sky-900/40 select-none">
                <div className="flex justify-between items-center border-b border-sky-900/60 pb-3">
                  <div className="flex items-center gap-2 text-sky-300">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span>UX_WIREFRAME_SPEC_CANVAS_V3</span>
                  </div>
                  <div className="text-zinc-500">GRID_BASE: 8px | MEASURE: 65ch</div>
                </div>

                <div className="grid grid-cols-12 gap-4 my-auto">
                  <div className="col-span-3 border border-dashed border-sky-800/80 p-3 h-32 flex flex-col justify-between">
                    <span className="text-[10px] text-sky-500">ZONE_A: GLOBAL_NAV</span>
                    <div className="space-y-1.5 opacity-60">
                      <div className="h-2 bg-sky-900 rounded w-3/4" />
                      <div className="h-2 bg-sky-900 rounded w-1/2" />
                      <div className="h-2 bg-sky-900 rounded w-5/6" />
                    </div>
                    <span className="text-[9px] text-zinc-500">0-PILL RULE</span>
                  </div>

                  <div className="col-span-6 border border-dashed border-sky-800/80 p-3 h-32 flex flex-col justify-between">
                    <span className="text-[10px] text-sky-500">ZONE_B: PRIMARY_STAGE (1-LEVEL ELEVATION)</span>
                    <div className="flex items-baseline gap-2">
                      <div className="h-5 bg-sky-500/20 border border-sky-400/40 rounded w-1/2" />
                      <div className="h-3 bg-sky-900 rounded w-1/4" />
                    </div>
                    <span className="text-[9px] text-zinc-500">WCAG AAA / RATIO 14.8:1</span>
                  </div>

                  <div className="col-span-3 border border-dashed border-sky-800/80 p-3 h-32 flex flex-col justify-between">
                    <span className="text-[10px] text-sky-500">ZONE_C: TELEMETRY</span>
                    <div className="font-mono text-zinc-400 space-y-1 text-[11px] tabular-nums">
                      <div>VOL: $14.28M</div>
                      <div>SLIP: 0.002%</div>
                      <div>LAT: 4.8ms</div>
                    </div>
                    <span className="text-[9px] text-zinc-500">TABULAR-NUMS LOCK</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-sky-900/60 pt-3 text-[11px] text-zinc-400">
                  <span>FITTS LAW INDEX: 0.94</span>
                  <span>HEURISTIC #1-10 AUDITED</span>
                </div>
              </div>
            )}
          </div>

          {/* Impact Metrics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-white/[0.02] border border-white/[0.08]"
            style={{ borderRadius: tokens.radiusPx }}
          >
            {study.impactMetrics.map((metric) => (
              <div key={metric.label} className="space-y-1">
                <div className="text-xs text-zinc-400">{metric.label}</div>
                <div
                  className="font-mono text-3xl font-medium tracking-tight tabular-nums"
                  style={{ color: tokens.accentHex }}
                >
                  {metric.value}
                </div>
                <div className="text-xs text-zinc-500 leading-snug">{metric.context}</div>
              </div>
            ))}
          </div>

          {/* Problem & Solution Narrative */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-400">
                The Product Friction
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                {study.challenge}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-400">
                The Architectural Solution
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                {study.solution}
              </p>
            </div>
          </div>

          {/* Key Architectural Decisions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-400">
              Key UX Heuristics & Design Decisions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {study.designDecisions.map((decision) => (
                <div
                  key={decision.title}
                  className="p-4 border border-white/[0.08] space-y-2 bg-white/[0.01]"
                  style={{ borderRadius: tokens.radiusPx }}
                >
                  <div className="text-xs font-mono text-zinc-400">{decision.principle}</div>
                  <h4 className="text-sm font-semibold text-zinc-100">{decision.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{decision.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Design Token Blueprint */}
          <div className="p-4 border border-white/[0.08] bg-black/30 font-mono text-xs space-y-2"
            style={{ borderRadius: tokens.radiusPx }}
          >
            <div className="text-zinc-400 font-semibold uppercase text-[11px] tracking-wider">
              Token & Mathematical Specification
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-zinc-300 pt-1">
              <div>
                <span className="text-zinc-500 block text-[10px]">DISPLAY SCALE</span>
                {study.tokensSample.primaryType}
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">BODY MEASURE</span>
                {study.tokensSample.bodyType}
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">SPATIAL UNIT</span>
                {study.tokensSample.baseUnit}
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">SURFACE DEPTH</span>
                {study.tokensSample.elevationLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="text-xs text-zinc-400">
            Disciplines: {study.disciplines.join(' · ')}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Back to Overview
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="px-5 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-1.5"
              style={{
                borderRadius: tokens.radiusPx,
                backgroundColor: tokens.accentHex,
              }}
            >
              <span>Consult on Similar Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
