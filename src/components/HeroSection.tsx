import React from 'react';
import { ArrowDown, Sparkles, Layers, Sliders, CheckCircle2 } from 'lucide-react';
import { DesignTokens } from '../types/design';
import { studioImg, avatarImg } from '../data/portfolioData';

interface HeroSectionProps {
  tokens: DesignTokens;
  onExploreWork: () => void;
  onOpenWorkbench: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  tokens,
  onExploreWork,
  onOpenWorkbench,
}) => {
  return (
    <section className="relative pt-12 pb-20 md:py-24 border-b border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Typographic & Manifest Anchor */}
          <div className="lg:col-span-7 space-y-8">
            {/* Unboxed Metadata discipline: no capsule pill */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400 font-medium">
              <span>UI/UX Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Design Systems</span>
              <span aria-hidden="true">·</span>
              <span>Frontend Engineering</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight font-normal text-balance"
                style={{ color: tokens.theme === 'dark' ? '#fafafa' : '#09090b' }}
              >
                Spatial craft & typographic rigor for high-consequence interfaces.
              </h1>
              
              <p className="text-base sm:text-lg leading-relaxed text-zinc-400 max-w-2xl font-normal">
                I translate ambiguous product complexity into calm, mathematically rigorous digital systems. 
                Combining Swiss graphic design discipline with modern reactive front-end architecture—zero AI slop, 
                zero decorative clutter, and uncompromising microinteraction precision.
              </p>
            </div>

            {/* Quantitative Proof: Claim-to-Proof Adjacency with Tabular Figures */}
            <div className="grid grid-cols-3 gap-6 pt-2 pb-2 border-y border-white/[0.08]">
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-medium tracking-tight tabular-nums"
                  style={{ color: tokens.accentHex }}
                >
                  14 yrs
                </div>
                <div className="text-xs text-zinc-400 mt-1">Design & Engineering Craft</div>
              </div>
              
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-medium tracking-tight tabular-nums"
                  style={{ color: tokens.accentHex }}
                >
                  380K+
                </div>
                <div className="text-xs text-zinc-400 mt-1">Active Institutional Users</div>
              </div>

              <div>
                <div className="font-mono text-2xl sm:text-3xl font-medium tracking-tight tabular-nums"
                  style={{ color: tokens.accentHex }}
                >
                  &lt; 12ms
                </div>
                <div className="text-xs text-zinc-400 mt-1">Interaction Latency Budget</div>
              </div>
            </div>

            {/* Primary Action Zone */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreWork}
                className="px-6 py-3 text-sm font-semibold text-white transition-all cursor-pointer shadow-md hover:brightness-110 active:scale-[0.98] flex items-center gap-2"
                style={{
                  borderRadius: tokens.radiusPx,
                  backgroundColor: tokens.accentHex,
                }}
              >
                <span>Examine Selected Works</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenWorkbench}
                className="px-5 py-3 text-sm font-medium border border-white/10 hover:border-white/25 transition-all cursor-pointer flex items-center gap-2"
                style={{
                  borderRadius: tokens.radiusPx,
                  backgroundColor: tokens.theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
                  color: tokens.theme === 'dark' ? '#f4f4f5' : '#18181b',
                }}
              >
                <Sliders className="w-4 h-4" />
                <span>Launch Design System Lab</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Fidelity Studio Frame */}
          <div className="lg:col-span-5 relative">
            <div
              className="relative overflow-hidden border border-white/10 shadow-2xl transition-all"
              style={{ borderRadius: tokens.radiusPx }}
            >
              <img
                src={studioImg}
                alt="Kairos Architectural Design Studio and drafting workbench"
                className="w-full aspect-[4/3] object-cover filter brightness-95 contrast-105 hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              {/* Bottom Credential Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 flex items-center gap-4">
                <img
                  src={avatarImg}
                  alt="Principal UI/UX Designer portrait"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-0.5">
                  <div className="text-sm font-medium text-white flex items-center gap-1.5">
                    <span>Valen Thorne</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" title="Available for advisory" />
                  </div>
                  <div className="text-xs text-zinc-300">
                    Principal UI/UX & Frontend Architect
                  </div>
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <span>Zurich</span>
                    <span aria-hidden="true">·</span>
                    <span>Design Systems Advisory</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Subtle Quality Indicator with real content */}
            <div
              className="hidden sm:flex items-center gap-3 p-3.5 border border-white/10 backdrop-blur-md mt-4 text-xs font-mono"
              style={{
                borderRadius: tokens.radiusPx,
                backgroundColor: tokens.theme === 'dark' ? 'rgba(20, 21, 23, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                color: tokens.theme === 'dark' ? '#d4d4d8' : '#3f3f46'
              }}
            >
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-sans font-semibold">WCAG AAA Certified</span>
              </div>
              <span className="text-zinc-500">|</span>
              <span className="tabular-nums">Contrast 14.8:1</span>
              <span className="text-zinc-500">|</span>
              <span>Sub-Pixel Antialiasing</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
