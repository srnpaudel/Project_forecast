import React, { useState } from 'react';
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
  Moon,
  Workflow,
  Sparkles,
  GitBranch,
  BookOpen,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface PrdAnalysisViewProps {
  onNavigateToBoard?: () => void;
}

export const PrdAnalysisView: React.FC<PrdAnalysisViewProps> = ({ onNavigateToBoard }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'architecture' | 'formulas'>('overview');

  const requirementsList = [
    {
      id: 'FR-1',
      title: 'Workspace Selection & Isolation',
      desc: 'Users select from workspaces ingested from WPX (e.g., Metro Rail, North Port, Renewable Grid). Switching workspaces dynamically loads that workspace’s projects with zero cross-tenant contamination.',
      impl: 'Implemented via persistent header and sidebar dropdowns with reactive project filtering.',
      status: 'Verified',
    },
    {
      id: 'FR-2',
      title: 'Project Category Governance',
      desc: 'Support categorized grouping such as "Live Project" (requires budget) and "Post Tender" (no budget required per Section 14). Allows adding future custom categories with custom colors.',
      impl: 'Implemented with CategoryTreeSidebar and CategoryManagerModal for on-the-fly category additions.',
      status: 'Verified',
    },
    {
      id: 'FR-3',
      title: 'People Planning Against Projects',
      desc: 'Site attendees can be scheduled onto day and night shifts. Roster shows headcount and 8h/person standard shifts.',
      impl: 'Implemented with 1-click edit stepper modal and direct personnel assignment drawer.',
      status: 'Verified',
    },
    {
      id: 'FR-4',
      title: 'Budget & Variation Hours for Live Projects',
      desc: 'Budget hours must only be input for Live Projects. Post Tender projects show "—" (no budget). Variation hours can be added and inline edited directly in the table.',
      impl: 'Inline click-to-edit numeric inputs with Enter/Escape handlers and automated total budget summation.',
      status: 'Verified',
    },
    {
      id: 'FR-5',
      title: 'Day & Night Dual-Shift Model',
      desc: 'Site planning operates on round-the-clock 24/7 rosters. When user filters by "Day Shift", both table columns and the header roster card dynamically isolate Day Shift. Same for Night Shift.',
      impl: 'Shift filter pill toggle in table and reactive Day/Night card in top header KPI ribbon.',
      status: 'Verified',
    },
    {
      id: 'FR-6',
      title: 'Consumed & Remaining Hours Math',
      desc: 'Consumed hours are calculated automatically as sum of (People × 8h). Remaining hours = (Budget + Variation) - Consumed. Over-budget condition flags a red badge with negative hours.',
      impl: 'Instant reactive formula engine with zero manual consumed entry and over-budget visual warning.',
      status: 'Verified',
    },
    {
      id: 'FR-7',
      title: 'Forecast Notes & Shift Log',
      desc: 'Contextual notes for shift bottlenecks, weather disruptions, or procurement alerts. Latest note preview in table, newest note displayed first in modal dialog.',
      impl: 'ProjectNotesModal with author, role, timestamp tags and category filters.',
      status: 'Verified',
    },
    {
      id: 'FR-8',
      title: 'Forecast History & Immutable Snapshots',
      desc: 'Maintain history of forecast adjustments over project lifecycle with version milestones (e.g. Week 41 Baseline) for audit compliance.',
      impl: 'Snapshot engine supporting version tags, author attribution, and state delta review.',
      status: 'Verified',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Top Breadcrumb & Document Meta */}
      <div className="bg-white border border-[#e6e9ef] rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-[#f0f7ff] text-[#0073ea] font-semibold border border-[#b2d9fc]">
              PRD SPECIFICATION v2.4
            </span>
            <span className="text-[#808294]">·</span>
            <span className="text-[#00c875] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Production Ready
            </span>
            <span className="text-[#808294]">·</span>
            <span className="text-[#676879]">WPX Ecosystem ERP</span>
          </div>

          {onNavigateToBoard && (
            <button
              onClick={onNavigateToBoard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0073ea] hover:bg-[#0060c0] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>Open Live Forecast Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1e293b] tracking-tight">
            WPX Resource Forecast: Product Requirements Document (PRD)
          </h1>
          <p className="mt-2 text-sm text-[#64748b] leading-relaxed max-w-4xl">
            This document outlines the operational and architectural requirements for the Resource Forecast module.
            Designed around the core principle: <strong className="text-[#1e293b]">“Simple, Visible, Fast and Low-Click”</strong>,
            enabling construction leads to plan 24/7 site operations with zero friction and strict WPX data isolation.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-[#e2e8f0] pt-2">
          {[
            { id: 'overview', label: 'Executive Summary & Scope', icon: FileText },
            { id: 'requirements', label: 'Functional Requirements (FR-1 to FR-8)', icon: CheckCircle2 },
            { id: 'architecture', label: 'System Isolation & WPX Flow', icon: Database },
            { id: 'formulas', label: 'Mathematical Formulations', icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#0073ea] text-[#0073ea] bg-[#f0f7ff]/50'
                    : 'border-transparent text-[#64748b] hover:text-[#1e293b] hover:border-[#cbd5e1]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: EXECUTIVE SUMMARY & SCOPE */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Product Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#e6e9ef] p-5 rounded-xl shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#eaf4fe] text-[#0073ea] flex items-center justify-center font-bold">
                <Sun className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1e293b]">Dual Day / Night Shifts</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Seamless 24-hour construction coverage with independent Day (8h) and Night (8h) headcounts.
                Dynamic shift filtering isolates view on the active shift.
              </p>
            </div>

            <div className="bg-white border border-[#e6e9ef] p-5 rounded-xl shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#00c875] flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1e293b]">Automated Reactive Math</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Consumed hours are calculated automatically based on roster headcount (People × 8h).
                Live budget subtraction with over-budget negative balance warnings.
              </p>
            </div>

            <div className="bg-white border border-[#e6e9ef] p-5 rounded-xl shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#f5f3ff] text-[#7c3aed] flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1e293b]">Zero ERP Write-Back</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Workspaces, projects, and attendee pools are ingested read-only from WPX.
                Forecasting simulations remain isolated in the dedicated forecast store.
              </p>
            </div>
          </div>

          {/* Scope Matrix */}
          <div className="bg-white border border-[#e6e9ef] rounded-xl p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
              <Workflow className="w-4 h-4 text-[#0073ea]" />
              <span>Scope Boundaries & Design Constitution</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3 p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <div className="font-bold text-[#0073ea] uppercase tracking-wider text-[11px]">
                  ✓ In-Scope Capabilities
                </div>
                <ul className="space-y-2 text-[#475569]">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00c875] shrink-0 mt-0.5" />
                    <span><strong>Workspace Switcher:</strong> Instantly switch site boundaries with synchronized stats.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00c875] shrink-0 mt-0.5" />
                    <span><strong>Sticky Project Column:</strong> Project name is the only sticky column with full text wrapping (no truncation).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00c875] shrink-0 mt-0.5" />
                    <span><strong>Scrollable Builder Column:</strong> Builder column scrolls naturally with site details.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00c875] shrink-0 mt-0.5" />
                    <span><strong>Low-Click Shift Duplication:</strong> Clone entire daily rosters to subsequent dates with 1 click.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00c875] shrink-0 mt-0.5" />
                    <span><strong>Contextual Shift Notes:</strong> Timestamped note threads categorized by shift and risk.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <div className="font-bold text-[#e2445c] uppercase tracking-wider text-[11px]">
                  ✕ Explicit Out-of-Scope Constraints
                </div>
                <ul className="space-y-2 text-[#475569]">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#e2445c] shrink-0 mt-0.5" />
                    <span><strong>No ERP Modification:</strong> Resource Forecast does NOT alter financial ledgers or payroll in WPX.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#e2445c] shrink-0 mt-0.5" />
                    <span><strong>No Manual Consumed Entry:</strong> Consumed hours must always derive from roster headcount to preserve data integrity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#e2445c] shrink-0 mt-0.5" />
                    <span><strong>No Post Tender Budgets:</strong> Post Tender contracts do not have contractual hour ceilings.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FUNCTIONAL REQUIREMENTS */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e6e9ef] p-4 rounded-xl shadow-2xs flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1e293b]">Core Functional Requirements Matrix (FR-1 through FR-8)</h2>
              <p className="text-xs text-[#64748b]">All requirements are strictly validated against live user actions and UI state.</p>
            </div>
            <div className="px-2.5 py-1 rounded bg-[#ecfdf5] border border-[#a7f3d0] text-xs font-bold text-[#059669]">
              8/8 Implemented
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {requirementsList.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-[#e6e9ef] p-4 rounded-xl shadow-2xs hover:border-[#b2d9fc] transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#f0f7ff] text-[#0073ea] font-mono font-bold text-xs border border-[#b2d9fc]">
                      {req.id}
                    </span>
                    <h3 className="font-bold text-sm text-[#1e293b]">{req.title}</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#059669] bg-[#ecfdf5] px-2 py-0.5 rounded-full border border-[#a7f3d0]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {req.status}
                  </span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">{req.desc}</p>
                <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[#0073ea] font-medium">UX Implementation: {req.impl}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM ARCHITECTURE & WPX INGESTION */}
      {activeTab === 'architecture' && (
        <div className="bg-white border border-[#e6e9ef] rounded-xl p-6 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#0073ea]" />
              <span>System Integration & One-Way Read Boundary</span>
            </h2>
            <p className="text-xs text-[#64748b]">
              The Resource Forecast engine enforces a unidirectional read pipeline from WPX ERP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* WPX Ingestion */}
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3">
              <div className="font-mono text-[#0073ea] font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                <span>WPX ERP Core System</span>
                <span className="text-[10px] text-[#64748b] bg-white px-2 py-0.5 rounded border border-[#e2e8f0]">One-Way Read</span>
              </div>
              <ul className="space-y-2 text-[#475569]">
                <li className="p-2 bg-white rounded border border-[#e2e8f0]">
                  <strong>Workspaces Registry:</strong> Geographic divisions, site boundaries, and operational package codes.
                </li>
                <li className="p-2 bg-white rounded border border-[#e2e8f0]">
                  <strong>Project Names & Codes:</strong> Official project register entries and builder contracts.
                </li>
                <li className="p-2 bg-white rounded border border-[#e2e8f0]">
                  <strong>Site Attendee Directory:</strong> Active personnel, badges, trade specialties, and contact phones.
                </li>
              </ul>
            </div>

            {/* Resource Forecast Internal Store */}
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3">
              <div className="font-mono text-[#059669] font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Resource Forecast Store</span>
                <span className="text-[10px] text-[#059669] bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#a7f3d0]">Strict Isolation</span>
              </div>
              <ul className="space-y-2 text-[#475569]">
                <li className="p-2 bg-white rounded border border-[#e2e8f0]">
                  <strong>Daily Shift Rosters:</strong> Day and Night crew allocations with 8-hour shift normalization.
                </li>
                <li className="p-2 bg-white rounded border border-[#e2e8f0]">
                  <strong>Forecasting Budgets:</strong> Working baseline hours, variations, and consumed calculations.
                </li>
                <li className="p-2 bg-white rounded border border-[#e2e8f0]">
                  <strong>Audit Snapshots & Notes:</strong> Immutable timeline milestones and site supervisor notes.
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#f0f7ff] border border-[#b2d9fc] text-xs text-[#0073ea] flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 text-[#0073ea]" />
            <span>
              <strong>Guaranteed Operational Safety:</strong> Supervisors can experiment with roster variations, clone forward schedules, 
              and simulate budget overrun impacts without risking erroneous ledger postings in the main enterprise ERP.
            </span>
          </div>
        </div>
      )}

      {/* TAB 4: MATHEMATICAL ENGINE */}
      {activeTab === 'formulas' && (
        <div className="bg-white border border-[#e6e9ef] rounded-xl p-6 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#0073ea]" />
              <span>Mathematical Engine & Reactive Formula Specs</span>
            </h2>
            <p className="text-xs text-[#64748b]">
              Formulas calculate in real time as shifts are modified or budget cells are edited.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-2">
              <div className="text-[#64748b] text-[11px] font-bold">1. CONSUMED HOURS FORMULA</div>
              <div className="text-[#0073ea] font-bold text-sm bg-white p-2.5 rounded border border-[#e2e8f0]">
                H_consumed = Σ(People_day × 8) + Σ(People_night × 8)
              </div>
              <p className="font-sans text-[11px] text-[#64748b]">
                Each allocated person counts as standard 8 productive hours per shift.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-2">
              <div className="text-[#64748b] text-[11px] font-bold">2. TOTAL BUDGET FORMULA</div>
              <div className="text-[#1e293b] font-bold text-sm bg-white p-2.5 rounded border border-[#e2e8f0]">
                H_total_budget = H_budget + H_variation
              </div>
              <p className="font-sans text-[11px] text-[#64748b]">
                Applies only to Live Projects. Post Tender contracts are exempt.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-2">
              <div className="text-[#64748b] text-[11px] font-bold">3. REMAINING HOURS FORMULA</div>
              <div className="text-[#059669] font-bold text-sm bg-white p-2.5 rounded border border-[#e2e8f0]">
                H_remaining = H_total_budget - H_consumed
              </div>
              <p className="font-sans text-[11px] text-[#64748b]">
                If H_remaining &lt; 0, UI renders an alert badge (e.g. -200h in red).
              </p>
            </div>
          </div>

          {/* Interactive Simulation / Test Bench */}
          <div className="p-5 rounded-xl bg-[#f0f7ff]/60 border border-[#b2d9fc] space-y-3">
            <div className="font-bold text-xs text-[#0073ea] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>PRD Verification Examples</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-[#e2e8f0] space-y-1">
                <div className="font-semibold text-[#1e293b]">Scenario A: Normal Under Budget</div>
                <div className="font-mono text-[#64748b]">Budget: 5,200h | Consumed: 1,940h</div>
                <div className="font-mono font-bold text-[#059669]">Remaining: +3,260h (Healthy)</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#e2e8f0] space-y-1">
                <div className="font-semibold text-[#1e293b]">Scenario B: Over Budget Condition</div>
                <div className="font-mono text-[#64748b]">Budget: 5,200h | Consumed: 5,400h</div>
                <div className="font-mono font-bold text-[#e2445c]">Remaining: -200h (Warning Pill)</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#e2e8f0] space-y-1">
                <div className="font-semibold text-[#1e293b]">Scenario C: Post Tender Contract</div>
                <div className="font-mono text-[#64748b]">Budget: Exempt (—) | Consumed: 24h</div>
                <div className="font-mono font-bold text-[#64748b]">Remaining: — (No Cap)</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
