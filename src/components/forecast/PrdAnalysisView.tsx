import React from 'react';
import {
  FileText,
  CheckCircle2,
  Database,
  Layers,
  Clock,
  Users,
  ShieldCheck,
  TrendingUp,
  Cpu,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';

export const PrdAnalysisView: React.FC = () => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto py-4">
      
      {/* Header Banner */}
      <div className="space-y-3 border-b border-white/[0.08] pb-6">
        <div className="text-xs font-mono uppercase tracking-widest text-blue-400">
          Executive Document Analysis
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
          WPX Resource Forecast: PRD Analysis & System Architecture
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Comprehensive functional decomposition, entity relationship specification, 
          and UI/UX low-click interaction design mapping derived from Section 1 (Executive Summary) 
          and Section 2 (Product Vision).
        </p>
      </div>

      {/* 1. Core Architectural Boundary & Data Flow */}
      <div className="p-6 rounded-xl bg-[#141820] border border-white/[0.08] space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Database className="w-4 h-4 text-blue-400" />
          <span>1. System Integration & Data Isolation Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300">
          <div className="p-4 rounded-lg bg-[#10141a] border border-white/[0.06] space-y-2">
            <div className="font-mono text-zinc-400 text-[11px] uppercase tracking-wider">
              WPX Ingestion Layer (One-Way Read)
            </div>
            <ul className="space-y-1.5 text-zinc-300 list-disc list-inside">
              <li><strong>Workspaces:</strong> Name, code, location region, site project boundaries.</li>
              <li><strong>User Directory & Roles:</strong> Supervisors, engineers, tradespeople.</li>
              <li><strong>Project Names & Codes:</strong> Core project registry entries.</li>
              <li><strong>Site Attendee Information:</strong> Badge numbers, shift availability, trades.</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-[#10141a] border border-white/[0.06] space-y-2">
            <div className="font-mono text-emerald-400 text-[11px] uppercase tracking-wider">
              Resource Forecast Internal Store (Strict Isolation)
            </div>
            <ul className="space-y-1.5 text-zinc-300 list-disc list-inside">
              <li><strong>Maintains its own application database:</strong> Zero write-back to WPX.</li>
              <li><strong>Forecast Data Sovereignty:</strong> Day & Night shift allocations.</li>
              <li><strong>Budget Hours:</strong> Live project baseline allocations.</li>
              <li><strong>Audit History:</strong> Immutable snapshot states and timeline notes.</li>
            </ul>
          </div>
        </div>

        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            <strong>Architectural Guarantee:</strong> Forecasting iterations, hypothetical staging, 
            and shift changes remain purely within Resource Forecast, preventing unintended operational changes in the primary WPX ERP system.
          </span>
        </div>
      </div>

      {/* 2. Functional Requirements Decomposition */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif text-white font-medium">
          2. Functional Requirements Breakdown & UX Mapping
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            {
              req: 'Workspace Selection',
              desc: 'Select a workspace available from WPX; view the forecast for that specific workspace immediately.',
              ux: 'Persistent header dropdown with instant workspace switching and WPX sync timestamp.'
            },
            {
              req: 'Project Category Governance',
              desc: 'Manage categories such as Live Project and Post Tender; add future categories when required.',
              ux: 'Dedicated Category Manager modal + inline category filtering tabs in the planning matrix.'
            },
            {
              req: 'People Planning Against Projects',
              desc: 'Allocate personnel against projects with trade and role visibility.',
              ux: 'Low-click attendee selector filtered by preferred shift with 1-click hour assignment.'
            },
            {
              req: 'Budget Hours for Live Projects',
              desc: 'Input and configure budget hours specifically for Live Projects.',
              ux: 'Single-click inline editable numeric cells with keyboard Enter/Escape confirmation.'
            },
            {
              req: 'Day & Night Shift Planning',
              desc: 'Explicit dual-shift planning model for round-the-clock site activities.',
              ux: 'Dedicated visual columns for Day (Sun icon) and Night (Moon icon) with independent headcounts.'
            },
            {
              req: 'Consumed & Remaining Hours Math',
              desc: 'Automated calculation of consumed hours and remaining balances in real time.',
              ux: 'Instant reactive formula recalculation on every shift change with tabular figures.'
            },
            {
              req: 'Forecast Notes & Remarks',
              desc: 'Add and maintain contextual notes regarding shift bottlenecks or weather.',
              ux: 'Badge counter on project rows opening a modal with categorized note threads.'
            },
            {
              req: 'Forecast History & Snapshots',
              desc: 'Maintain history of forecast adjustments and milestones over project lifecycle.',
              ux: 'Immutable snapshot engine with versioning, author attribution, and delta review.'
            },
          ].map((item, idx) => (
            <div
              key={item.req}
              className="p-4 rounded-lg bg-[#141820] border border-white/[0.08] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-100 text-sm">
                  {idx + 1}. {item.req}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
              <div className="pt-2 border-t border-white/[0.06] text-blue-400 text-[11px] font-mono">
                UI IMPLEMENTATION: {item.ux}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Mathematical Formula Engine */}
      <div className="p-6 rounded-xl bg-[#141820] border border-white/[0.08] space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span>3. Mathematical Engine Specification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-[#10141a] border border-white/[0.06] space-y-2">
            <div className="text-zinc-400 text-[11px]">CONSUMED HOURS FORMULA</div>
            <div className="text-blue-400 font-bold text-sm">
              H_consumed = H_base + Σ(H_day + H_night)
            </div>
            <p className="text-zinc-500 font-sans text-[11px]">
              Sum of historical logged hours plus current planned shift hours across all site attendees.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#10141a] border border-white/[0.06] space-y-2">
            <div className="text-zinc-400 text-[11px]">REMAINING HOURS FORMULA</div>
            <div className="text-emerald-400 font-bold text-sm">
              H_remaining = H_budget - H_consumed
            </div>
            <p className="text-zinc-500 font-sans text-[11px]">
              Available hours quota. Inverted to negative alert status when consumed exceeds allocated budget.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#10141a] border border-white/[0.06] space-y-2">
            <div className="text-zinc-400 text-[11px]">BURN RATE COEFFICIENT</div>
            <div className="text-zinc-200 font-bold text-sm">
              Velocity = (H_consumed / H_budget) × 100%
            </div>
            <p className="text-zinc-500 font-sans text-[11px]">
              Visual progress indicator with color thresholds: &lt;75% (Blue), 75-90% (Amber), &gt;90% (Red).
            </p>
          </div>
        </div>
      </div>

      {/* 4. The "Simple, Fast, and Low-Click" Design Constitution */}
      <div className="p-6 rounded-xl bg-[#141820] border border-white/[0.08] space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>4. Human Factors & Cognitive Ergonomics (The "Low-Click" Vision)</span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          The PRD explicitly states: <em className="text-white">“The primary goal is to make resource forecasting simple, visible, fast and low-click.”</em> 
          To achieve this, the application replaces slow enterprise sub-menus with:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-[#10141a] rounded border border-white/[0.06] space-y-1">
            <div className="font-semibold text-white">Single-Click Day/Night Toggle</div>
            <p className="text-zinc-400 text-[11px]">
              No nested modal forms to pick shifts. Color-coded Sun/Moon buttons enable instantaneous roster tagging.
            </p>
          </div>

          <div className="p-3 bg-[#10141a] rounded border border-white/[0.06] space-y-1">
            <div className="font-semibold text-white">Direct Inline Cell Editing</div>
            <p className="text-zinc-400 text-[11px]">
              Clicking any budget number turns it into an active numeric input immediately, confirmed by keyboard Enter.
            </p>
          </div>

          <div className="p-3 bg-[#10141a] rounded border border-white/[0.06] space-y-1">
            <div className="font-semibold text-white">One-Click Next Day Clone</div>
            <p className="text-zinc-400 text-[11px]">
              The copy button duplicates today’s shift crew to tomorrow in a single click, saving hours of repetitive data entry.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
