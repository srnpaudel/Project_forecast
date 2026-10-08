import React, { useState } from 'react';
import {
  FileText,
  Activity,
  ShoppingBag,
  ArrowRight,
  Filter,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  Sliders,
  X
} from 'lucide-react';
import { DesignTokens } from '../types/design';
import audioImg from '../assets/images/project_spatial_audio_1791437517143.jpg';

interface LayoutArchetypesProps {
  tokens: DesignTokens;
}

export const LayoutArchetypesSection: React.FC<LayoutArchetypesProps> = ({ tokens }) => {
  const [activeArchetype, setActiveArchetype] = useState<'editorial' | 'saas' | 'ecommerce'>('editorial');
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState<'titanium' | 'obsidian' | 'raw_brass'>('titanium');
  
  // SaaS state
  const [saasFilter, setSaasFilter] = useState<'all' | 'settled' | 'pending'>('all');
  const [saasSearch, setSaasSearch] = useState('');

  const archetypes = [
    {
      id: 'editorial' as const,
      label: 'Editorial Broadsheet',
      desc: 'Bespoke publishing, longform measure & typographic rhythm'
    },
    {
      id: 'saas' as const,
      label: 'SaaS Control Plane',
      desc: 'High-density tabular data, keyboard-first, zero-pill statuses'
    },
    {
      id: 'ecommerce' as const,
      label: 'Quiet Luxury Commerce',
      desc: 'Material tactile spec, unboxed pricing, spatial rest'
    }
  ];

  const transactions = [
    { id: 'TX-9021', asset: 'Treasury Yield 10Y', amount: '$4,250,000.00', yield: '4.28%', status: 'Settled', latency: '4.2ms' },
    { id: 'TX-9022', asset: 'Sovereign Green Bond', amount: '$1,800,000.00', yield: '3.91%', status: 'Settled', latency: '3.8ms' },
    { id: 'TX-9023', asset: 'Euro STOXX Volatility', amount: '$950,000.00', yield: '5.14%', status: 'Pending', latency: '12.1ms' },
    { id: 'TX-9024', asset: 'Gold Bullion Physical', amount: '$6,420,000.00', yield: '2.04%', status: 'Settled', latency: '2.9ms' },
  ];

  return (
    <section id="archetypes" className="py-20 md:py-28 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              03. Interactive Domain Archetypes
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-balance"
              style={{ color: tokens.theme === 'dark' ? '#fafafa' : '#09090b' }}
            >
              Three foundational layout paradigms, executed with zero AI slop.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Switch between archetypes to inspect how spatial math, typography, and density are 
              orchestrated for distinct user intents.
            </p>
          </div>

          {/* Archetype Selector */}
          <div
            className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08]"
            style={{ borderRadius: tokens.radiusPx }}
          >
            {archetypes.map((arch) => (
              <button
                key={arch.id}
                onClick={() => setActiveArchetype(arch.id)}
                className={`px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeArchetype === arch.id
                    ? 'text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                style={{
                  borderRadius: `calc(${tokens.radiusPx} - 2px)`,
                  backgroundColor: activeArchetype === arch.id ? tokens.accentHex : 'transparent',
                }}
              >
                {arch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Archetype Stage Canvas */}
        <div
          className="border border-white/10 overflow-hidden shadow-2xl transition-all"
          style={{
            borderRadius: tokens.radiusPx,
            backgroundColor: tokens.theme === 'dark' ? '#101114' : '#ffffff',
            color: tokens.theme === 'dark' ? '#f4f4f5' : '#18181b',
          }}
        >
          {/* Top Bar for Stage Simulation */}
          <div className="px-6 py-3.5 border-b border-white/[0.08] flex items-center justify-between text-xs bg-white/[0.02]">
            <div className="flex items-center gap-2 font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tokens.accentHex }} />
              <span>LIVE_ARCHETYPE_SIMULATOR</span>
              <span className="text-zinc-600">/</span>
              <span className="capitalize">{activeArchetype}</span>
            </div>

            <div className="text-xs text-zinc-500 font-mono">
              Viewport: 1440px Desk Baseline · Zero Layout Shift
            </div>
          </div>

          {/* Archetype 1: Editorial Broadsheet */}
          {activeArchetype === 'editorial' && (
            <div className="p-8 sm:p-12 md:p-16 space-y-12 max-w-5xl mx-auto">
              {/* Unboxed Kicker */}
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400">
                <span>Dispatch № 42</span>
                <span aria-hidden="true">·</span>
                <span>The Architecture of Stillness</span>
                <span aria-hidden="true">·</span>
                <span>Zurich / London</span>
              </div>

              {/* Editorial Title */}
              <div className="space-y-4">
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.08] text-balance">
                  Against the Hyperactive Canvas: In Defense of Spatial Silence in Contemporary Software.
                </h1>
                <p className="text-sm font-mono text-zinc-400">
                  By Valen Thorne · 8 minute critical reading · Photography by Atelier Kairos
                </p>
              </div>

              {/* Asymmetric 2-Column Editorial Spread */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pt-6 border-t border-white/[0.08]">
                {/* Left Column: Pull quote & Marginalia */}
                <div className="md:col-span-4 space-y-6 md:sticky md:top-24">
                  <blockquote className="font-serif text-xl sm:text-2xl leading-snug italic text-zinc-300 border-l-2 pl-4"
                    style={{ borderColor: tokens.accentHex }}
                  >
                    “When every pixel shouts for attention with bouncing micro-animations and neon chips, the software becomes hostile to contemplation.”
                  </blockquote>

                  <div className="text-xs text-zinc-400 space-y-2 font-mono pt-4 border-t border-white/[0.06]">
                    <div>MEASURE RULE: 68 CHARACTERS</div>
                    <div>OPTICAL DENSITY: BALANCED</div>
                    <div>SCROLL OCCLUSION: 0%</div>
                  </div>
                </div>

                {/* Right Column: Balanced Body Prose (68ch) */}
                <div className="md:col-span-8 space-y-6 text-sm sm:text-base leading-[1.75] text-zinc-300">
                  <p className="first-letter:font-serif first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-white">
                    The modern software design industry has succumbed to a pervasive anxiety: the terror of empty space. 
                    Trained on gamified retention metrics, interface designers have gradually filled every serene margin 
                    with AI prompts, tooltip tours, pulsating badges, and floating status chips.
                  </p>
                  <p>
                    Yet the greatest physical instruments ever forged—from mechanical Leica rangefinders to Dieter Rams’s 
                    Braun audio modules—derive their timeless authority from restraint. A volume dial does not bounce. 
                    An altimeter does not flash confetti when altitude stabilizes. They present verified state with quiet dignity.
                  </p>
                  <p>
                    By embracing strict tabular numerals, single-elevation containers, and eliminating static pill boxes, 
                    we restore cognitive agency to the practitioner.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Archetype 2: SaaS Control Plane */}
          {activeArchetype === 'saas' && (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Top Filter and Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border border-white/[0.08] bg-white/[0.02]" style={{ borderRadius: tokens.radiusPx }}>
                  <div className="text-xs text-zinc-400 font-mono">GROSS NOMINAL NOTIONAL</div>
                  <div className="font-mono text-2xl font-medium tracking-tight tabular-nums mt-1" style={{ color: tokens.accentHex }}>
                    $13,420,000.00
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">4 Active Allocation Tranches</div>
                </div>

                <div className="p-4 border border-white/[0.08] bg-white/[0.02]" style={{ borderRadius: tokens.radiusPx }}>
                  <div className="text-xs text-zinc-400 font-mono">WEIGHTED DURATION</div>
                  <div className="font-mono text-2xl font-medium tracking-tight tabular-nums mt-1 text-zinc-100">
                    6.42 yrs
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">Hedging Delta: +0.02</div>
                </div>

                <div className="p-4 border border-white/[0.08] bg-white/[0.02]" style={{ borderRadius: tokens.radiusPx }}>
                  <div className="text-xs text-zinc-400 font-mono">SETTLEMENT INVARIANTS</div>
                  <div className="font-mono text-2xl font-medium tracking-tight tabular-nums mt-1 text-emerald-400">
                    100.0%
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">0 Failed Transits</div>
                </div>

                <div className="p-4 border border-white/[0.08] bg-white/[0.02]" style={{ borderRadius: tokens.radiusPx }}>
                  <div className="text-xs text-zinc-400 font-mono">GATE ENGINE LATENCY</div>
                  <div className="font-mono text-2xl font-medium tracking-tight tabular-nums mt-1 text-zinc-100">
                    5.2 ms
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">P99 SLA Guarantee</div>
                </div>
              </div>

              {/* Data Table with Tabular Numerals & Zero-Pills */}
              <div className="border border-white/[0.08] overflow-x-auto" style={{ borderRadius: tokens.radiusPx }}>
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-white/[0.03] border-b border-white/[0.08] text-zinc-400">
                    <tr>
                      <th className="py-3 px-4 font-medium">IDENTIFIER</th>
                      <th className="py-3 px-4 font-medium">UNDERLYING ASSET</th>
                      <th className="py-3 px-4 font-medium text-right">NOTIONAL VALUE</th>
                      <th className="py-3 px-4 font-medium text-right">YIELD</th>
                      <th className="py-3 px-4 font-medium">STATUS (UNBOXED)</th>
                      <th className="py-3 px-4 font-medium text-right">LATENCY</th>
                      <th className="py-3 px-4 font-medium text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-semibold text-zinc-200">{tx.id}</td>
                        <td className="py-3 px-4 text-zinc-300 font-sans">{tx.asset}</td>
                        <td className="py-3 px-4 text-right tabular-nums text-zinc-100 font-medium">{tx.amount}</td>
                        <td className="py-3 px-4 text-right tabular-nums text-emerald-400">{tx.yield}</td>
                        {/* ZERO PILL DISCIPLINE: Clean unboxed text with status dot */}
                        <td className="py-3 px-4">
                          <span className="flex items-center gap-1.5 font-sans">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                tx.status === 'Settled' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                              }`}
                            />
                            <span className={tx.status === 'Settled' ? 'text-zinc-300' : 'text-amber-400'}>
                              {tx.status}
                            </span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-zinc-400">{tx.latency}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            className="px-2.5 py-1 text-[11px] font-sans font-medium text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 rounded cursor-pointer transition-colors"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Archetype 3: Quiet Luxury E-Commerce */}
          {activeArchetype === 'ecommerce' && (
            <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              {/* Product Visual Container */}
              <div className="md:col-span-6 relative border border-white/10 overflow-hidden bg-black/40"
                style={{ borderRadius: tokens.radiusPx }}
              >
                <img
                  src={audioImg}
                  alt="Kroma Reference Spatial Audio Dial"
                  className="w-full aspect-square object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 text-xs font-mono text-zinc-400 bg-black/60 px-3 py-1 rounded backdrop-blur-md">
                  BATCH EDITION № 08 / 100
                </div>
              </div>

              {/* Product Spec & Interaction */}
              <div className="md:col-span-6 space-y-6">
                <div className="space-y-1">
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                    Kroma Sound Lab · Zurich
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-normal text-white">
                    Rotary Reference Attenuator Mk. II
                  </h3>
                  <div className="text-xl font-mono tabular-nums font-medium pt-2 text-zinc-100">
                    $1,480.00 <span className="text-xs text-zinc-400 font-sans font-normal">VAT included · Express Courier</span>
                  </div>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  Machined from a single solid ingot of aerospace-grade 7075 titanium. Features twin ceramic 
                  ball-bearings calibrated for 0.04 Nm rotational dampening, delivering tactile sensory mastery.
                </p>

                {/* Material Finish Selector */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-zinc-300">
                    Finish Specification: <span className="capitalize font-mono text-zinc-400">{selectedFinish}</span>
                  </div>
                  <div className="flex gap-2">
                    {(['titanium', 'obsidian', 'raw_brass'] as const).map((finish) => (
                      <button
                        key={finish}
                        onClick={() => setSelectedFinish(finish)}
                        className={`px-3 py-1.5 text-xs font-medium border capitalize cursor-pointer transition-all ${
                          selectedFinish === finish
                            ? 'border-white text-white bg-white/10'
                            : 'border-white/10 text-zinc-400 hover:border-white/20'
                        }`}
                        style={{ borderRadius: tokens.radiusPx }}
                      >
                        {finish.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specs in unboxed list */}
                <div className="pt-3 border-t border-white/[0.08] text-xs font-mono space-y-1.5 text-zinc-400">
                  <div className="flex justify-between">
                    <span>STEP RESOLUTION</span>
                    <span className="text-zinc-200">64 Gold-Plated Detents</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TOTAL HARMONIC DISTORTION</span>
                    <span className="text-zinc-200">&lt; 0.00008% THD+N</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TOTAL NET MASS</span>
                    <span className="text-zinc-200">840 grams</span>
                  </div>
                </div>

                {/* Add to Bag Action */}
                <button
                  onClick={() => setCartOpen(true)}
                  className="w-full py-3.5 text-sm font-semibold text-white transition-all cursor-pointer shadow-lg hover:brightness-110 active:scale-[0.99] flex items-center justify-center gap-2"
                  style={{
                    borderRadius: tokens.radiusPx,
                    backgroundColor: tokens.accentHex,
                  }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Acquire Instrument ($1,480.00)</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Slide-out Cart Simulation Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md h-full bg-[#121316] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="font-serif text-xl text-white">Acquisition Bag (1)</div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-4 p-4 border border-white/[0.08] rounded-lg bg-white/[0.02]">
                <img
                  src={audioImg}
                  alt="Item in bag"
                  className="w-20 h-20 object-cover rounded border border-white/10"
                />
                <div className="space-y-1">
                  <div className="text-xs font-mono text-zinc-400">KROMA-ROTARY-V2</div>
                  <div className="text-sm font-medium text-white">Rotary Reference Attenuator</div>
                  <div className="text-xs text-zinc-400 capitalize">Finish: {selectedFinish}</div>
                  <div className="font-mono text-sm text-zinc-100 tabular-nums pt-1">$1,480.00</div>
                </div>
              </div>

              <div className="p-4 border border-white/[0.08] rounded-lg text-xs font-mono space-y-2 text-zinc-400">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span className="tabular-nums text-zinc-200">$1,480.00</span>
                </div>
                <div className="flex justify-between">
                  <span>SWISS COURIER FREIGHT</span>
                  <span className="text-emerald-400">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/[0.06] text-white font-semibold">
                  <span>TOTAL DUE</span>
                  <span className="tabular-nums">$1,480.00</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/[0.08]">
              <button
                onClick={() => {
                  alert('Proceeding to checkout with 100% token security.');
                  setCartOpen(false);
                }}
                className="w-full py-3 text-xs font-semibold text-white rounded text-center transition-all hover:brightness-110 cursor-pointer"
                style={{ backgroundColor: tokens.accentHex }}
              >
                Proceed to Secure Settlement &rarr;
              </button>
              <button
                onClick={() => setCartOpen(false)}
                className="w-full py-2 text-xs text-zinc-400 hover:text-zinc-200 text-center"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
