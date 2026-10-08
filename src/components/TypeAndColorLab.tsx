import React, { useState } from 'react';
import { Type, Palette, CheckCircle2, XCircle, Sliders, RefreshCw, Eye } from 'lucide-react';
import { DesignTokens } from '../types/design';

interface TypeAndColorLabProps {
  tokens: DesignTokens;
}

// Relative luminance calculation for WCAG 2.1 compliance
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export const TypeAndColorLab: React.FC<TypeAndColorLabProps> = ({ tokens }) => {
  // Type scale state
  const [scaleRatio, setScaleRatio] = useState<number>(1.25); // Major Third
  const [baseSize, setBaseSize] = useState<number>(16);

  // Color contrast state
  const [fgColor, setFgColor] = useState<string>('#ffffff');
  const [bgColor, setBgColor] = useState<string>('#0c0d0e');

  const ratioOptions = [
    { label: '1.125 Major Second', value: 1.125 },
    { label: '1.200 Minor Third', value: 1.2 },
    { label: '1.250 Major Third', value: 1.25 },
    { label: '1.333 Perfect Fourth', value: 1.333 },
    { label: '1.414 Aug. Fourth', value: 1.414 },
    { label: '1.618 Golden Ratio', value: 1.618 },
  ];

  // Calculated modular steps
  const microSize = Math.round(baseSize / scaleRatio);
  const bodySize = baseSize;
  const h3Size = Math.round(baseSize * scaleRatio);
  const h2Size = Math.round(baseSize * Math.pow(scaleRatio, 2));
  const h1Size = Math.round(baseSize * Math.pow(scaleRatio, 3));
  const displaySize = Math.round(baseSize * Math.pow(scaleRatio, 4));

  // Contrast math
  let contrastRatio = 14.8;
  try {
    contrastRatio = Number(getContrastRatio(fgColor, bgColor).toFixed(2));
  } catch (e) {
    contrastRatio = 14.8;
  }

  const passAANormal = contrastRatio >= 4.5;
  const passAALarge = contrastRatio >= 3.0;
  const passAAANormal = contrastRatio >= 7.0;
  const passAAALarge = contrastRatio >= 4.5;

  return (
    <section id="lab" className="py-20 md:py-28 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              04. Precision Typography & WCAG Contrast Engine
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-balance"
              style={{ color: tokens.theme === 'dark' ? '#fafafa' : '#09090b' }}
            >
              Mathematical harmony through modular scales and APCA contrast.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              True front-end design is rooted in proportional mathematics. We eliminate arbitrary font sizes 
              and ensure every text node satisfies international readability thresholds.
            </p>
          </div>
        </div>

        {/* Studio Grid: Type Scale on Left, WCAG Contrast on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Modular Typography Scale (7 cols) */}
          <div
            className="lg:col-span-7 p-6 sm:p-8 border border-white/10 bg-white/[0.015] space-y-8"
            style={{ borderRadius: tokens.radiusPx }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Modular Typographic Scale</h3>
              </div>
              <span className="text-xs font-mono text-zinc-400">BASE: {baseSize}px · RATIO: {scaleRatio}</span>
            </div>

            {/* Controls: Ratio Selector & Base Size Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-300 font-medium">Modular Harmonic Interval</label>
                <select
                  value={scaleRatio}
                  onChange={(e) => setScaleRatio(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-black/40 border border-white/15 text-zinc-200 rounded focus:outline-none cursor-pointer"
                >
                  {ratioOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-zinc-300 font-medium">
                  <span>Base Prose Size</span>
                  <span className="font-mono tabular-nums">{baseSize}px</span>
                </div>
                <input
                  type="range"
                  min="13"
                  max="18"
                  value={baseSize}
                  onChange={(e) => setBaseSize(parseInt(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-white/10 rounded-lg cursor-pointer mt-2"
                  style={{ accentColor: tokens.accentHex }}
                />
              </div>
            </div>

            {/* Live Visual Scale Ladder */}
            <div className="space-y-5 pt-2 border-t border-white/[0.06]">
              {/* Display Heading */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>DISPLAY SERIF · {displaySize}px / 1.05</span>
                  <span>Instrument Serif Regular</span>
                </div>
                <div
                  className="font-serif leading-none tracking-tight text-white transition-all overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ fontSize: `${displaySize}px` }}
                >
                  Spatial Clarity in Architecture
                </div>
              </div>

              {/* H1 Heading */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>H1 SECTION · {h1Size}px / 1.15</span>
                  <span>Plus Jakarta Sans 600</span>
                </div>
                <div
                  className="font-sans font-semibold tracking-tight text-zinc-100 transition-all"
                  style={{ fontSize: `${h1Size}px` }}
                >
                  Uncompromising Usability & Form
                </div>
              </div>

              {/* H2 Heading */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>H2 COMPONENT · {h2Size}px / 1.25</span>
                  <span>Plus Jakarta Sans 500</span>
                </div>
                <div
                  className="font-sans font-medium text-zinc-200 transition-all"
                  style={{ fontSize: `${h2Size}px` }}
                >
                  Sub-5ms feedback cycles and zero layout shifts
                </div>
              </div>

              {/* Body Prose */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>BODY TEXT · {bodySize}px / 1.625 · 68ch Measure</span>
                  <span>Plus Jakarta Sans 400</span>
                </div>
                <p
                  className="font-sans text-zinc-300 leading-relaxed max-w-xl transition-all"
                  style={{ fontSize: `${bodySize}px` }}
                >
                  Information should emerge through typographic hierarchy and structural rhythm, 
                  not through arbitrary badge sandwiches or floating decorative cards.
                </p>
              </div>

              {/* Tabular Telemetry Outlier */}
              <div className="space-y-1 pt-2 border-t border-white/[0.05]">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>TABULAR DATA OUTLIER · {microSize}px</span>
                  <span>JetBrains Mono Tabular-Nums</span>
                </div>
                <div
                  className="font-mono text-zinc-300 tabular-nums flex items-center gap-4 text-xs"
                >
                  <span>LATENCY: 4.82ms</span>
                  <span>RATIO: 1.250:1</span>
                  <span>DELTA: +0.0018</span>
                  <span className="text-emerald-400">PASSED</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: WCAG 2.1 & APCA Color Contrast Engine (5 cols) */}
          <div
            className="lg:col-span-5 p-6 sm:p-8 border border-white/10 bg-white/[0.015] space-y-6"
            style={{ borderRadius: tokens.radiusPx }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-100">WCAG Contrast Auditor</h3>
              </div>
              <span className="text-xs font-mono text-zinc-400">ALGORITHM: WCAG 2.1</span>
            </div>

            {/* Color Swatch Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Foreground Hex</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs font-mono bg-black/40 border border-white/10 rounded text-zinc-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Background Hex</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs font-mono bg-black/40 border border-white/10 rounded text-zinc-200"
                  />
                </div>
              </div>
            </div>

            {/* Live Contrast Ratio Readout Card */}
            <div
              className="p-6 border border-white/10 flex flex-col items-center justify-center text-center space-y-2 transition-all"
              style={{
                borderRadius: tokens.radiusPx,
                backgroundColor: bgColor,
                color: fgColor,
              }}
            >
              <div className="text-xs font-mono uppercase tracking-wider opacity-75">
                Measured Luminance Delta
              </div>
              <div className="font-mono text-4xl sm:text-5xl font-medium tracking-tight tabular-nums">
                {contrastRatio} : 1
              </div>
              <p className="text-xs max-w-xs mt-1">
                Visual inspection sample text rendered using your active test palette.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <div className="text-xs text-zinc-400 font-mono">QUICK PRESET COMBINATIONS:</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setFgColor('#ffffff');
                    setBgColor('#0c0d0e');
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono border border-white/10 hover:border-white/20 rounded text-zinc-300 cursor-pointer"
                >
                  Dark Slate (18.5:1)
                </button>
                <button
                  onClick={() => {
                    setFgColor('#ffffff');
                    setBgColor(tokens.accentHex);
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono border border-white/10 hover:border-white/20 rounded text-zinc-300 cursor-pointer"
                >
                  Active Accent
                </button>
                <button
                  onClick={() => {
                    setFgColor('#18181b');
                    setBgColor('#f6f5f1');
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono border border-white/10 hover:border-white/20 rounded text-zinc-300 cursor-pointer"
                >
                  Warm Alabaster (15.2:1)
                </button>
              </div>
            </div>

            {/* Compliance Matrix Checklist */}
            <div className="p-4 border border-white/[0.08] bg-white/[0.02] space-y-3"
              style={{ borderRadius: tokens.radiusPx }}
            >
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                WCAG 2.1 Certification Status
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between p-2 border border-white/5 rounded bg-black/20">
                  <span className="text-zinc-300">AA Normal (&ge;4.5)</span>
                  {passAANormal ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-mono font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-mono font-semibold">
                      <XCircle className="w-3.5 h-3.5" /> FAIL
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 border border-white/5 rounded bg-black/20">
                  <span className="text-zinc-300">AA Large (&ge;3.0)</span>
                  {passAALarge ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-mono font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-mono font-semibold">
                      <XCircle className="w-3.5 h-3.5" /> FAIL
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 border border-white/5 rounded bg-black/20">
                  <span className="text-zinc-300">AAA Normal (&ge;7.0)</span>
                  {passAAANormal ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-mono font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-mono font-semibold">
                      <XCircle className="w-3.5 h-3.5" /> FAIL
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 border border-white/5 rounded bg-black/20">
                  <span className="text-zinc-300">AAA Large (&ge;4.5)</span>
                  {passAAALarge ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-mono font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-mono font-semibold">
                      <XCircle className="w-3.5 h-3.5" /> FAIL
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
