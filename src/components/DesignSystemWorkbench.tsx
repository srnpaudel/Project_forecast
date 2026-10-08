import React, { useState } from 'react';
import {
  Sliders,
  Copy,
  Check,
  RotateCcw,
  Code2,
  MousePointer2,
  Layers,
  Sparkles,
  Search,
  AlertCircle,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { DesignTokens, RadiusScale, AccentColor, SurfaceTheme, DensityMode } from '../types/design';

interface DesignSystemWorkbenchProps {
  tokens: DesignTokens;
  onUpdateTokens: (newTokens: Partial<DesignTokens>) => void;
  onResetTokens: () => void;
}

export const DesignSystemWorkbench: React.FC<DesignSystemWorkbenchProps> = ({
  tokens,
  onUpdateTokens,
  onResetTokens,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'css' | 'tailwind' | 'json'>('css');
  
  // Interactive component states for testing
  const [buttonLoading, setButtonLoading] = useState(false);
  const [inputValue, setInputValue] = useState('portfolio-rebalance-order');
  const [inputError, setInputError] = useState(false);
  const [activeSegment, setActiveSegment] = useState<'metrics' | 'layers' | 'tokens'>('metrics');
  const [sliderVal, setSliderVal] = useState(68);
  const [switchActive, setSwitchActive] = useState(true);

  const radiusOptions: { id: RadiusScale; label: string; px: string }[] = [
    { id: 'sharp', label: '0px (Brutalist)', px: '0px' },
    { id: 'subtle', label: '4px (Precision)', px: '4px' },
    { id: 'smooth', label: '8px (Modern)', px: '8px' },
    { id: 'rounded', label: '16px (Organic)', px: '16px' },
  ];

  const accentOptions: { id: AccentColor; label: string; hex: string }[] = [
    { id: 'cobalt', label: 'Cobalt', hex: '#2563eb' },
    { id: 'vermilion', label: 'Vermilion', hex: '#f43f5e' },
    { id: 'amber', label: 'Amber', hex: '#d97706' },
    { id: 'emerald', label: 'Emerald', hex: '#10b981' },
  ];

  const handleCopyCode = () => {
    let codeStr = '';
    if (activeCodeTab === 'css') {
      codeStr = `:root {
  --radius-primary: ${tokens.radiusPx};
  --color-accent: ${tokens.accentHex};
  --color-canvas: ${tokens.theme === 'dark' ? '#0c0d0e' : '#f6f5f1'};
  --color-surface: ${tokens.theme === 'dark' ? '#141517' : '#ffffff'};
  --space-unit: ${tokens.density === 'comfortable' ? '8px' : '4px'};
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}`;
    } else if (activeCodeTab === 'tailwind') {
      codeStr = `@theme {
  --radius-custom: ${tokens.radiusPx};
  --color-accent: ${tokens.accentHex};
  --font-serif: 'Instrument Serif', Georgia, serif;
  --font-sans: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}`;
    } else {
      codeStr = JSON.stringify(tokens, null, 2);
    }

    navigator.clipboard.writeText(codeStr);
    setCopiedFormat(activeCodeTab);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <section id="system" className="py-20 md:py-28 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              02. Living Design System & Token Studio
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-balance"
              style={{ color: tokens.theme === 'dark' ? '#fafafa' : '#09090b' }}
            >
              Real-time design token laboratory & component state matrix.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Adjust foundational tokens below and observe how the entire interface adapts dynamically.
              Every control enforces single-elevation math, WCAG AA compliance, and zero-pill typography.
            </p>
          </div>

          <button
            onClick={onResetTokens}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 transition-all self-start md:self-end cursor-pointer"
            style={{ borderRadius: tokens.radiusPx }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default Tokens</span>
          </button>
        </div>

        {/* The Studio Workbench: Split into Controls & Live Component Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Token Controls (5 cols) */}
          <div
            className="lg:col-span-5 p-6 border border-white/10 bg-white/[0.02] space-y-6"
            style={{ borderRadius: tokens.radiusPx }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                <Sliders className="w-4 h-4 text-zinc-400" />
                <span>Token Calibrator</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">LIVE SYNCED</span>
            </div>

            {/* Token 1: Corner Radius Scale */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-zinc-300 font-medium">Border Radius Math</label>
                <span className="font-mono text-zinc-400">{tokens.radiusPx}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {radiusOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onUpdateTokens({ radius: opt.id, radiusPx: opt.px })}
                    className={`px-3 py-2 text-xs font-medium border text-left transition-all cursor-pointer ${
                      tokens.radius === opt.id
                        ? 'border-zinc-300 bg-white/10 text-white shadow-sm'
                        : 'border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20'
                    }`}
                    style={{ borderRadius: opt.px }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Token 2: High-Intent Accent Budget */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-zinc-300 font-medium">10% Accent Color Budget</label>
                <span className="font-mono text-zinc-400 uppercase">{tokens.accentHex}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {accentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onUpdateTokens({ accent: opt.id, accentHex: opt.hex })}
                    className={`p-2.5 text-xs font-medium border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      tokens.accent === opt.id
                        ? 'border-white text-white bg-white/10'
                        : 'border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                    style={{ borderRadius: tokens.radiusPx }}
                  >
                    <span
                      className="w-4 h-4 rounded-full shadow-inner"
                      style={{ backgroundColor: opt.hex }}
                    />
                    <span className="text-[11px]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Token 3: Canvas Luminance & Surface */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-zinc-300 font-medium">Canvas Background</label>
                <span className="font-mono text-zinc-400 capitalize">{tokens.theme}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateTokens({ theme: 'dark' })}
                  className={`px-3 py-2 text-xs font-medium border text-center transition-all cursor-pointer ${
                    tokens.theme === 'dark'
                      ? 'border-zinc-300 bg-white/10 text-white'
                      : 'border-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                  style={{ borderRadius: tokens.radiusPx }}
                >
                  Dark Slate (#0C0D0E)
                </button>
                <button
                  onClick={() => onUpdateTokens({ theme: 'light' })}
                  className={`px-3 py-2 text-xs font-medium border text-center transition-all cursor-pointer ${
                    tokens.theme === 'light'
                      ? 'border-zinc-300 bg-white/10 text-white'
                      : 'border-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                  style={{ borderRadius: tokens.radiusPx }}
                >
                  Warm Alabaster (#F6F5F1)
                </button>
              </div>
            </div>

            {/* Token 4: Density Orchestration */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-zinc-300 font-medium">Information Density</label>
                <span className="font-mono text-zinc-400 capitalize">{tokens.density}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateTokens({ density: 'comfortable' })}
                  className={`px-3 py-2 text-xs font-medium border text-center transition-all cursor-pointer ${
                    tokens.density === 'comfortable'
                      ? 'border-zinc-300 bg-white/10 text-white'
                      : 'border-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                  style={{ borderRadius: tokens.radiusPx }}
                >
                  Comfortable (Airy)
                </button>
                <button
                  onClick={() => onUpdateTokens({ density: 'compact' })}
                  className={`px-3 py-2 text-xs font-medium border text-center transition-all cursor-pointer ${
                    tokens.density === 'compact'
                      ? 'border-zinc-300 bg-white/10 text-white'
                      : 'border-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                  style={{ borderRadius: tokens.radiusPx }}
                >
                  Compact (Workstation)
                </button>
              </div>
            </div>

            {/* Export Code Drawer */}
            <div className="pt-3 border-t border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                  <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Export Tokens</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono">
                  {(['css', 'tailwind', 'json'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setActiveCodeTab(fmt)}
                      className={`px-2 py-0.5 rounded uppercase ${
                        activeCodeTab === fmt ? 'bg-white/20 text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-zinc-200 border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all cursor-pointer"
                style={{ borderRadius: tokens.radiusPx }}
              >
                {copiedFormat ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied {copiedFormat.toUpperCase()} to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Config Snippet</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Live Component State Matrix (7 cols) */}
          <div
            className="lg:col-span-7 p-6 sm:p-8 border border-white/10 bg-white/[0.015] space-y-8"
            style={{ borderRadius: tokens.radiusPx }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Live Component State Matrix</h3>
                <p className="text-xs text-zinc-400">Interactive controls rendered with current tokens</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
                <MousePointer2 className="w-3.5 h-3.5" />
                <span>INTERACTIVE CANVAS</span>
              </div>
            </div>

            {/* Matrix 1: Button Hierarchy & States */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                A. Action Affordances (Buttons)
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                {/* Primary Button */}
                <button
                  className="px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                  style={{
                    borderRadius: tokens.radiusPx,
                    backgroundColor: tokens.accentHex,
                  }}
                >
                  Primary Action
                </button>

                {/* Secondary Button */}
                <button
                  className="px-4 py-2 text-xs font-medium text-zinc-200 border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer whitespace-nowrap"
                  style={{ borderRadius: tokens.radiusPx }}
                >
                  Secondary Outline
                </button>

                {/* Loading State Toggle */}
                <button
                  onClick={() => {
                    setButtonLoading(true);
                    setTimeout(() => setButtonLoading(false), 1200);
                  }}
                  className="px-4 py-2 text-xs font-medium bg-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
                  style={{ borderRadius: tokens.radiusPx }}
                >
                  {buttonLoading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Test Loading State</span>
                  )}
                </button>

                {/* Disabled State */}
                <button
                  disabled
                  className="px-4 py-2 text-xs font-medium bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed whitespace-nowrap"
                  style={{ borderRadius: tokens.radiusPx }}
                >
                  Disabled Gate
                </button>
              </div>
            </div>

            {/* Matrix 2: Segmented Control Tabs */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                B. Segmented Control Filter Tabs
              </div>
              <div
                className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] max-w-md"
                style={{ borderRadius: tokens.radiusPx }}
              >
                {(['metrics', 'layers', 'tokens'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSegment(tab)}
                    className={`flex-1 py-1.5 text-xs font-medium transition-all capitalize cursor-pointer ${
                      activeSegment === tab ? 'text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                    style={{
                      borderRadius: `calc(${tokens.radiusPx} - 2px)`,
                      backgroundColor: activeSegment === tab ? tokens.accentHex : 'transparent',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix 3: Form Input with Accessible Validation */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                C. Form Field & Accessible State
              </div>
              <div className="space-y-2 max-w-md">
                <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                  <span>Resource Identifier</span>
                  <button
                    onClick={() => setInputError(!inputError)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
                  >
                    Toggle Error State
                  </button>
                </label>
                
                <div className="relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className={`w-full px-3.5 py-2 text-xs font-mono bg-black/40 text-zinc-100 border transition-all focus:outline-none ${
                      inputError
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-white/10 focus:border-zinc-300'
                    }`}
                    style={{ borderRadius: tokens.radiusPx }}
                  />
                  <div className="absolute right-3 top-2.5 text-zinc-400">
                    {inputError ? (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                </div>

                <div className="text-[11px] flex items-center justify-between">
                  <span className={inputError ? 'text-rose-400' : 'text-zinc-500'}>
                    {inputError
                      ? 'Error: Resource ID contains unverified syntax'
                      : 'Must be kebab-case matching RFC-4122'}
                  </span>
                  <span className="font-mono text-zinc-500 tabular-nums">{inputValue.length}/64</span>
                </div>
              </div>
            </div>

            {/* Matrix 4: Tactile Slider with Spring & Numeric Readout */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase tracking-wider text-zinc-400">
                  D. Tactile Slider & Tabular Numeral Readout
                </span>
                <span className="font-mono text-sm tabular-nums font-semibold" style={{ color: tokens.accentHex }}>
                  {sliderVal} dB
                </span>
              </div>
              
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  style={{ accentColor: tokens.accentHex }}
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>-INF dB</span>
                  <span>-18 dB</span>
                  <span>0 dB REF</span>
                  <span>+6 dB</span>
                </div>
              </div>
            </div>

            {/* Matrix 5: Zero-Pill Unboxed Metadata Row */}
            <div className="space-y-3 pt-2 border-t border-white/[0.08]">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                E. Zero-Pill Unboxed Metadata Discipline
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between text-xs text-zinc-400"
                style={{ borderRadius: tokens.radiusPx }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-zinc-200 font-medium">Architecture Review</span>
                  <span aria-hidden="true">·</span>
                  <span>Version 2.4</span>
                  <span aria-hidden="true">·</span>
                  <span>4 min read</span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                  <span>WCAG 2.1 AA</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400">Invariants Valid</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
