import React, { useState } from 'react';
import { ArrowUpRight, Sliders, ExternalLink, Sparkles, Eye, Check } from 'lucide-react';
import { CASE_STUDIES } from '../data/portfolioData';
import { CaseStudy, DesignTokens } from '../types/design';
import { CaseStudyModal } from './CaseStudyModal';

interface CaseStudiesSectionProps {
  tokens: DesignTokens;
  onOpenConsultation: () => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  tokens,
  onOpenConsultation,
}) => {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filterOptions = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'Fintech', label: 'Financial UX' },
    { id: 'Audio', label: 'Hardware & Audio' },
    { id: 'Editorial', label: 'Editorial Systems' },
  ];

  const filteredStudies = CASE_STUDIES.filter((study) => {
    if (filter === 'all') return true;
    if (filter === 'Fintech') return study.disciplines.some(d => d.includes('Financial'));
    if (filter === 'Audio') return study.disciplines.some(d => d.includes('Audio') || d.includes('Hardware'));
    if (filter === 'Editorial') return study.disciplines.some(d => d.includes('Editorial'));
    return true;
  });

  return (
    <section id="work" className="py-20 md:py-28 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Unboxed category indicator */}
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              01. Selected Works & Case Architecture
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-balance"
              style={{ color: tokens.theme === 'dark' ? '#fafafa' : '#09090b' }}
            >
              Engineered interfaces for high-consequence operational domains.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              In-depth breakdowns showcasing interaction friction analysis, mathematical typography scales, 
              custom state machines, and real business outcomes.
            </p>
          </div>

          {/* Interactive Filter Tabs: Segmented Control Pattern */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] self-start md:self-end"
            style={{ borderRadius: tokens.radiusPx }}
          >
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFilter(opt.id)}
                className={`px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  filter === opt.id
                    ? 'text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                style={{
                  borderRadius: `calc(${tokens.radiusPx} - 2px)`,
                  backgroundColor: filter === opt.id ? tokens.accentHex : 'transparent',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Bento Grid of Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Hero Card: Aethelgard (Takes 8 cols on desktop) */}
          {filteredStudies[0] && (
            <div
              className="lg:col-span-8 group relative border border-white/10 overflow-hidden bg-white/[0.015] hover:border-white/20 transition-all flex flex-col justify-between"
              style={{ borderRadius: tokens.radiusPx }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={filteredStudies[0].heroImage}
                  alt={filteredStudies[0].title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 filter brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Top overlay unboxed metadata */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 font-mono">
                    <span>{filteredStudies[0].client}</span>
                    <span aria-hidden="true">·</span>
                    <span>{filteredStudies[0].year}</span>
                  </div>

                  <button
                    onClick={() => setSelectedStudy(filteredStudies[0])}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-zinc-950 font-semibold text-xs rounded hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
                  >
                    <span>Examine Architecture</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom title on image scrim */}
                <div className="absolute bottom-5 inset-x-6 space-y-1">
                  <div className="text-xs uppercase tracking-wider text-sky-400 font-mono">
                    Featured Case Study
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium">
                    {filteredStudies[0].title}
                  </h3>
                  <p className="text-sm text-zinc-300 max-w-xl line-clamp-2">
                    {filteredStudies[0].subtitle}
                  </p>
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="p-6 space-y-4 border-t border-white/[0.08]">
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {filteredStudies[0].summary}
                </p>

                {/* Claim-to-Proof Adjacency */}
                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/[0.06]">
                  {filteredStudies[0].impactMetrics.map((m) => (
                    <div key={m.label}>
                      <div className="font-mono text-xl font-medium tabular-nums" style={{ color: tokens.accentHex }}>
                        {m.value}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  {/* Clean unboxed tags */}
                  <div className="text-zinc-500 font-mono">
                    {filteredStudies[0].disciplines.slice(0, 3).join(' · ')}
                  </div>
                  <button
                    onClick={() => setSelectedStudy(filteredStudies[0])}
                    className="font-medium hover:underline text-zinc-300 flex items-center gap-1 cursor-pointer"
                  >
                    Read full case <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Bento Column (Takes 4 cols on desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {filteredStudies.slice(1, 3).map((study, idx) => (
              <div
                key={study.id}
                className="group border border-white/10 overflow-hidden bg-white/[0.015] hover:border-white/20 transition-all flex-1 flex flex-col justify-between"
                style={{ borderRadius: tokens.radiusPx }}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={study.heroImage}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 filter brightness-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => setSelectedStudy(study)}
                      className="p-2 bg-black/60 backdrop-blur-md text-white rounded border border-white/10 hover:bg-black/90 transition-colors cursor-pointer"
                      title="Inspect case"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 inset-x-4">
                    <div className="text-[11px] font-mono text-zinc-400">
                      {study.client} · {study.year}
                    </div>
                    <h4 className="font-serif text-lg text-white font-medium">
                      {study.title}
                    </h4>
                  </div>
                </div>

                <div className="p-5 space-y-3 border-t border-white/[0.08]">
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {study.summary}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
                    <div className="font-mono text-zinc-400 tabular-nums">
                      {study.impactMetrics[0]?.label}: <span style={{ color: tokens.accentHex }} className="font-semibold">{study.impactMetrics[0]?.value}</span>
                    </div>

                    <button
                      onClick={() => setSelectedStudy(study)}
                      className="text-zinc-300 font-medium hover:underline cursor-pointer"
                    >
                      Details &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Case Study Detail Modal */}
      <CaseStudyModal
        study={selectedStudy}
        tokens={tokens}
        onClose={() => setSelectedStudy(null)}
        onOpenConsultation={onOpenConsultation}
      />
    </section>
  );
};
