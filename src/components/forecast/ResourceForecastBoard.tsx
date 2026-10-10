import React, { useState, useMemo } from 'react';
import {
  Project,
  ProjectCategory,
  WPXPerson,
  WPXWorkspace,
  DailyShiftPlan,
} from '../../types/resourceForecast';
import {
  Sun,
  Moon,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Camera,
  Download,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  MessageSquare,
  Copy,
  Clock,
  Building2,
  Users,
  Check,
  X,
  FileText,
  History,
  Info,
  Layers,
} from 'lucide-react';

interface ResourceForecastBoardProps {
  workspace: WPXWorkspace;
  workspaces: WPXWorkspace[];
  onSelectWorkspace: (ws: WPXWorkspace) => void;
  categories: ProjectCategory[];
  projects: Project[];
  personnelPool: WPXPerson[];
  shiftFilter: 'both' | 'day' | 'night';
  setShiftFilter: (filter: 'both' | 'day' | 'night') => void;
  onOpenEditForecast: (project: Project, date: string, shift?: 'both' | 'day' | 'night') => void;
  onOpenNotes: (project: Project) => void;
  onUpdateBudget: (projectId: string, newBudget: number) => void;
  onUpdateVariation: (projectId: string, newVariation: number) => void;
  onDuplicateShiftToNextDay: (projectId: string, date: string) => void;
  onTakeSnapshot: () => void;
  onViewPrd: () => void;
  onViewSnapshots: () => void;
  showToast: (msg: string) => void;
}

export const ResourceForecastBoard: React.FC<ResourceForecastBoardProps> = ({
  workspace,
  workspaces,
  onSelectWorkspace,
  categories,
  projects,
  personnelPool,
  shiftFilter,
  setShiftFilter,
  onOpenEditForecast,
  onOpenNotes,
  onUpdateBudget,
  onUpdateVariation,
  onDuplicateShiftToNextDay,
  onTakeSnapshot,
  onViewPrd,
  onViewSnapshots,
  showToast,
}) => {
  // Category / Status Filter
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Fortnight offset in 14-day increments (0 = Oct 12 to Oct 25, 2026)
  const [fortnightOffset, setFortnightOffset] = useState<number>(0);

  // Inline editing state for Live Project Budget
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [tempBudgetVal, setTempBudgetVal] = useState<number>(0);

  // Inline editing state for Variation Hours
  const [editingVariationId, setEditingVariationId] = useState<string | null>(null);
  const [tempVariationVal, setTempVariationVal] = useState<number>(0);

  // Generate 14 dates for current fortnight view
  const fortnightDates = useMemo(() => {
    // Base date: Oct 12, 2026
    const baseDate = new Date(2026, 9, 12); // month 9 is October
    baseDate.setDate(baseDate.getDate() + fortnightOffset * 14);

    const dates: { dateString: string; dayNum: number; dayName: string; isWeekend: boolean }[] = [];
    for (let i = 0; i < 14; i++) {
      const cur = new Date(baseDate);
      cur.setDate(baseDate.getDate() + i);
      const year = cur.getFullYear();
      const month = String(cur.getMonth() + 1).padStart(2, '0');
      const day = String(cur.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      const dayOfWeek = cur.getDay(); // 0 is Sunday, 6 is Saturday
      const dayName = cur.toLocaleDateString('en-US', { weekday: 'short' });

      dates.push({
        dateString,
        dayNum: cur.getDate(),
        dayName,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });
    }
    return dates;
  }, [fortnightOffset]);

  const fortnightLabel = useMemo(() => {
    if (fortnightDates.length === 0) return '';
    const first = fortnightDates[0];
    const last = fortnightDates[fortnightDates.length - 1];
    return `${first.dayName} ${first.dayNum} Oct – ${last.dayName} ${last.dayNum} Oct, 2026 (14 Days)`;
  }, [fortnightDates]);

  // Filter projects by workspace, category/status, and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (p.workspaceId !== workspace.id) return false;
      if (selectedStatus !== 'all' && p.categoryId !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBuilder = p.builder.toLowerCase().includes(query);
        const matchesCode = p.code.toLowerCase().includes(query);
        const matchesPM = p.projectManager.toLowerCase().includes(query);
        if (!matchesName && !matchesBuilder && !matchesCode && !matchesPM) return false;
      }
      return true;
    });
  }, [projects, workspace.id, selectedStatus, searchQuery]);

  // Compute workspace aggregate KPI metrics
  const { totalBudget, totalVariation, totalConsumed, totalRemaining, totalDayHeadcount, totalNightHeadcount } = useMemo(() => {
    let b = 0;
    let v = 0;
    let c = 0;
    let dHead = 0;
    let nHead = 0;

    filteredProjects.forEach((p) => {
      b += p.budgetHours || 0;
      v += p.variationHours || 0;
      c += p.consumedHours || 0;

      // Calculate active headcount across fortnight dates
      fortnightDates.forEach(({ dateString }) => {
        const plan = p.schedule[dateString];
        if (plan) {
          dHead += plan.dayShift?.assignedPeople?.length || 0;
          nHead += plan.nightShift?.assignedPeople?.length || 0;
        }
      });
    });

    return {
      totalBudget: b,
      totalVariation: v,
      totalConsumed: c,
      totalRemaining: (b + v) - c,
      totalDayHeadcount: dHead,
      totalNightHeadcount: nHead,
    };
  }, [filteredProjects, fortnightDates]);

  // Handle inline budget save
  const handleSaveBudget = (projectId: string) => {
    onUpdateBudget(projectId, tempBudgetVal);
    setEditingBudgetId(null);
  };

  // Handle inline variation save
  const handleSaveVariation = (projectId: string) => {
    onUpdateVariation(projectId, tempVariationVal);
    setEditingVariationId(null);
  };

  // Export current view as CSV
  const handleExportCSV = () => {
    const headers = [
      'Project Code',
      'Project Name',
      'Status',
      'Builder',
      'Site Contact',
      'Budget Hours',
      'Variation Hours',
      'Total Budget',
      'Consumed Hours',
      'Remaining Hours',
    ];

    fortnightDates.forEach((d) => {
      if (shiftFilter === 'both' || shiftFilter === 'day') {
        headers.push(`${d.dateString} (Day Headcount)`);
      }
      if (shiftFilter === 'both' || shiftFilter === 'night') {
        headers.push(`${d.dateString} (Night Headcount)`);
      }
    });

    const rows = filteredProjects.map((p) => {
      const cat = categories.find((c) => c.id === p.categoryId)?.name || p.categoryId;
      const budget = p.budgetHours || 0;
      const variation = p.variationHours || 0;
      const totalB = budget + variation;
      const consumed = p.consumedHours || 0;
      const remaining = totalB - consumed;

      const row = [
        `"${p.code}"`,
        `"${p.name}"`,
        `"${cat}"`,
        `"${p.builder}"`,
        `"${p.projectManager}"`,
        budget,
        variation,
        totalB,
        consumed,
        remaining,
      ];

      fortnightDates.forEach((d) => {
        const plan = p.schedule[d.dateString];
        if (shiftFilter === 'both' || shiftFilter === 'day') {
          row.push(plan?.dayShift?.assignedPeople?.length || 0);
        }
        if (shiftFilter === 'both' || shiftFilter === 'night') {
          row.push(plan?.nightShift?.assignedPeople?.length || 0);
        }
      });

      return row.join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `resource_forecast_${workspace.code}_${fortnightDates[0].dateString}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported forecast matrix to CSV');
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP CONTROL BAR / FILTER STRIP (As in Section 8 Wireframe) */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Workspace Selector + Shift Filter Pill Group */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Workspace Dropdown */}
            <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1.5 rounded-lg text-xs">
              <Building2 className="w-4 h-4 text-[#0073ea]" />
              <span className="font-semibold text-[#64748b]">Workspace:</span>
              <select
                value={workspace.id}
                onChange={(e) => {
                  const ws = workspaces.find((w) => w.id === e.target.value);
                  if (ws) onSelectWorkspace(ws);
                }}
                className="bg-transparent font-bold text-[#1e293b] cursor-pointer focus:outline-none pr-1"
              >
                {workspaces.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Shift Filter Pill Group: [ Both ] [ ☀️ Day ] [ 🌙 Night ] */}
            <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-lg border border-[#e2e8f0] text-xs">
              <span className="text-[11px] font-semibold text-[#64748b] px-2 hidden sm:inline">Shift:</span>
              <button
                type="button"
                onClick={() => setShiftFilter('both')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium text-xs ${
                  shiftFilter === 'both'
                    ? 'bg-white text-[#0f172a] shadow-xs font-bold border border-[#cbd5e1]'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                Both
              </button>
              <button
                type="button"
                onClick={() => setShiftFilter('day')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer font-medium text-xs ${
                  shiftFilter === 'day'
                    ? 'bg-amber-500 text-white shadow-xs font-bold'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Day</span>
              </button>
              <button
                type="button"
                onClick={() => setShiftFilter('night')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all cursor-pointer font-medium text-xs ${
                  shiftFilter === 'night'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Night</span>
              </button>
            </div>

            {/* Status / Category Dropdown */}
            <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1.5 rounded-lg text-xs">
              <span className="font-semibold text-[#64748b]">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent font-medium text-[#1e293b] cursor-pointer focus:outline-none"
              >
                <option value="all">All Statuses ({projects.filter((p) => p.workspaceId === workspace.id).length})</option>
                {categories.map((c) => {
                  const count = projects.filter((p) => p.workspaceId === workspace.id && p.categoryId === c.id).length;
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Right: Actions (Snapshot, Export CSV, PRD Reference) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onTakeSnapshot}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1e293b] bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#0073ea]" />
              <span>Snapshot</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1e293b] bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Second Row: Fortnight Date Navigation & Search Box */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#f1f5f9]">
          
          {/* Fortnight Horizon Picker */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setFortnightOffset((prev) => prev - 1)}
                className="p-1 hover:bg-white rounded text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer"
                title="Previous Fortnight"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#1e293b]">
                <Calendar className="w-3.5 h-3.5 text-[#0073ea]" />
                <span>{fortnightLabel}</span>
              </div>

              <button
                type="button"
                onClick={() => setFortnightOffset((prev) => prev + 1)}
                className="p-1 hover:bg-white rounded text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer"
                title="Next Fortnight"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {fortnightOffset !== 0 && (
              <button
                type="button"
                onClick={() => setFortnightOffset(0)}
                className="text-xs text-[#0073ea] hover:underline cursor-pointer font-medium"
              >
                Return to Oct 12–25
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#94a3b8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter project, builder, manager..."
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#0073ea] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[#94a3b8] hover:text-[#0f172a] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. INSTANT KPI RIBBON (Section 8 Wireframe High-Level Stats) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Budget Card */}
        <div className="bg-white border border-[#e2e8f0] p-3 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Total Budget
            </span>
            <div className="text-lg font-bold text-[#1e293b] mt-0.5">
              {totalBudget.toLocaleString()}h
            </div>
            {totalVariation !== 0 && (
              <span className="text-[10px] text-[#0073ea] font-medium">
                Variation: {totalVariation > 0 ? `+${totalVariation}h` : `${totalVariation}h`}
              </span>
            )}
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0073ea] flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Consumed Hours Card */}
        <div className="bg-white border border-[#e2e8f0] p-3 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Consumed Hours
            </span>
            <div className="text-lg font-bold text-[#1e293b] mt-0.5">
              {totalConsumed.toLocaleString()}h
            </div>
            <span className="text-[10px] text-[#64748b]">
              Formula: ∑ (People × 8h)
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* Remaining Hours Card */}
        <div className="bg-white border border-[#e2e8f0] p-3 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Remaining Hours
            </span>
            <div className={`text-lg font-bold mt-0.5 ${totalRemaining < 0 ? 'text-[#e11d48]' : 'text-[#059669]'}`}>
              {totalRemaining.toLocaleString()}h
            </div>
            {totalRemaining < 0 ? (
              <span className="text-[10px] font-bold text-[#e11d48] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Over Budget
              </span>
            ) : (
              <span className="text-[10px] text-[#059669] font-medium">
                Under Budget Balance
              </span>
            )}
          </div>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${
            totalRemaining < 0 ? 'bg-rose-50 text-[#e11d48]' : 'bg-emerald-50 text-[#059669]'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Shift Roster Summary Card */}
        <div className="bg-white border border-[#e2e8f0] p-3 rounded-xl shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Horizon Attendees
            </span>
            <div className="flex items-center gap-2 mt-0.5 text-xs font-bold">
              {(shiftFilter === 'both' || shiftFilter === 'day') && (
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                  <Sun className="w-3 h-3" /> {totalDayHeadcount} D
                </span>
              )}
              {(shiftFilter === 'both' || shiftFilter === 'night') && (
                <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
                  <Moon className="w-3 h-3" /> {totalNightHeadcount} N
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#64748b] mt-0.5 block">
              14-day shift roster
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. MAIN PROJECTS FORECAST MATRIX (Section 8 Wireframe Table) */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse text-xs">
            {/* TABLE HEADER (Two-Tier for Date Fortnight Grid) */}
            <thead className="bg-[#f8fafc] text-[#475569] border-b border-[#e2e8f0]">
              
              {/* TOP HEADER ROW: Project, Metadata, and Dates */}
              <tr>
                {/* 1. Project Column Header (Sticky Left - NEVER TRUNCATED) */}
                <th
                  rowSpan={2}
                  className="sticky left-0 z-30 bg-[#f8fafc] py-3 px-4 font-bold text-[#1e293b] border-r border-[#e2e8f0] shadow-[2px_0_4px_-1px_rgba(0,0,0,0.05)] min-w-[320px] max-w-[360px]"
                >
                  <div className="flex items-center justify-between">
                    <span>Project Name & Details</span>
                    <span className="text-[10px] font-normal text-[#94a3b8] uppercase">Sticky</span>
                  </div>
                </th>

                {/* 2. Builder Column (Scrollable per user request) */}
                <th
                  rowSpan={2}
                  className="py-3 px-3 font-semibold min-w-[130px] whitespace-nowrap border-r border-[#f1f5f9]"
                >
                  Builder
                </th>

                {/* 3. Site Contact / Attendees */}
                <th
                  rowSpan={2}
                  className="py-3 px-3 font-semibold min-w-[140px] whitespace-nowrap border-r border-[#f1f5f9]"
                >
                  Site Attendees
                </th>

                {/* 4. Budget Hours (Editable) */}
                <th
                  rowSpan={2}
                  className="py-3 px-3 text-right font-semibold min-w-[105px] whitespace-nowrap border-r border-[#f1f5f9]"
                >
                  Budget (h)
                </th>

                {/* 5. Variation Hours */}
                <th
                  rowSpan={2}
                  className="py-3 px-3 text-right font-semibold min-w-[95px] whitespace-nowrap border-r border-[#f1f5f9]"
                >
                  Var (h)
                </th>

                {/* 6. Consumed Hours */}
                <th
                  rowSpan={2}
                  className="py-3 px-3 text-right font-semibold min-w-[105px] whitespace-nowrap border-r border-[#f1f5f9]"
                >
                  Consumed (h)
                </th>

                {/* 7. Remaining Hours */}
                <th
                  rowSpan={2}
                  className="py-3 px-3 text-right font-semibold min-w-[115px] whitespace-nowrap border-r border-[#e2e8f0]"
                >
                  Remaining (h)
                </th>

                {/* 8. 14 DATES HEADERS (Two-Tier Spanning) */}
                {fortnightDates.map((d) => {
                  const colSpan = shiftFilter === 'both' ? 2 : 1;
                  return (
                    <th
                      key={d.dateString}
                      colSpan={colSpan}
                      className={`py-2 px-2 text-center font-bold border-r border-[#e2e8f0] ${
                        d.isWeekend ? 'bg-[#f1f5f9] text-[#64748b]' : 'bg-[#f8fafc] text-[#1e293b]'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">
                          {d.dayName}
                        </span>
                        <span className="text-xs font-extrabold text-[#1e293b]">
                          {d.dayNum}
                        </span>
                      </div>
                    </th>
                  );
                })}

                {/* Notes Column Header */}
                <th
                  rowSpan={2}
                  className="py-3 px-3.5 font-semibold min-w-[180px] border-l border-[#e2e8f0]"
                >
                  Latest Shift Note
                </th>

                {/* Actions Header */}
                <th
                  rowSpan={2}
                  className="py-3 px-3 text-right font-semibold min-w-[90px] whitespace-nowrap"
                >
                  Actions
                </th>
              </tr>

              {/* BOTTOM HEADER ROW: Shift Sub-Columns (D / N) */}
              <tr>
                {fortnightDates.map((d) => (
                  <React.Fragment key={`sub-${d.dateString}`}>
                    {(shiftFilter === 'both' || shiftFilter === 'day') && (
                      <th
                        className={`py-1.5 px-2 text-center font-semibold text-[10px] text-amber-700 bg-amber-50/60 border-r border-[#f1f5f9] ${
                          shiftFilter === 'both' ? 'min-w-[44px]' : 'min-w-[55px]'
                        }`}
                        title="Day Shift (8h)"
                      >
                        D
                      </th>
                    )}
                    {(shiftFilter === 'both' || shiftFilter === 'night') && (
                      <th
                        className={`py-1.5 px-2 text-center font-semibold text-[10px] text-indigo-700 bg-indigo-50/60 border-r border-[#e2e8f0] ${
                          shiftFilter === 'both' ? 'min-w-[44px]' : 'min-w-[55px]'
                        }`}
                        title="Night Shift (8h)"
                      >
                        N
                      </th>
                    )}
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-[#f1f5f9] bg-white text-[#334155]">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={8 + fortnightDates.length * (shiftFilter === 'both' ? 2 : 1) + 2}
                    className="p-12 text-center text-[#64748b] space-y-2"
                  >
                    <p className="font-bold text-sm text-[#1e293b]">No projects found</p>
                    <p className="text-xs">
                      Try selecting another workspace or clearing filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => {
                  const category = categories.find((c) => c.id === project.categoryId);
                  const isLive = project.categoryId === 'cat-live';
                  const isPostTender = project.categoryId === 'cat-post-tender';

                  const budget = project.budgetHours || 0;
                  const variation = project.variationHours || 0;
                  const totalBudget = budget + variation;
                  const consumed = project.consumedHours || 0;
                  const remaining = totalBudget - consumed;
                  const isOverBudget = isLive && remaining < 0;

                  const latestNote =
                    project.notes && project.notes.length > 0 ? project.notes[0] : null;

                  return (
                    <tr
                      key={project.id}
                      className="group hover:bg-[#f8fafc] transition-colors"
                    >
                      {/* 1. STICKY PROJECT NAME COLUMN (NEVER TRUNCATED - HIGH READABILITY) */}
                      <td className="sticky left-0 z-20 bg-white group-hover:bg-[#f8fafc] py-3 px-4 border-r border-[#e2e8f0] shadow-[2px_0_4px_-1px_rgba(0,0,0,0.05)] align-top min-w-[320px] max-w-[360px]">
                        <div className="space-y-1.5">
                          {/* Project Name (Full wrap, never truncated) */}
                          <div className="font-bold text-[#1e293b] text-xs leading-snug whitespace-normal break-words">
                            {project.name}
                          </div>

                          {/* Code, Status Tag, and Category */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="font-mono text-[#64748b] bg-[#f1f5f9] px-1.5 py-0.5 rounded text-[10px] font-semibold">
                              {project.code}
                            </span>

                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                              style={{
                                backgroundColor: `${category?.color || '#3b82f6'}15`,
                                color: category?.color || '#3b82f6',
                                borderColor: `${category?.color || '#3b82f6'}30`,
                              }}
                            >
                              {category?.name || 'Project'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. BUILDER COLUMN (Scrollable alongside other columns) */}
                      <td className="py-3 px-3 align-top whitespace-nowrap border-r border-[#f1f5f9]">
                        <span className="inline-block bg-[#f8fafc] border border-[#e2e8f0] text-[#334155] font-semibold px-2 py-0.5 rounded text-[11px]">
                          {project.builder}
                        </span>
                      </td>

                      {/* 3. SITE CONTACT / ATTENDEES */}
                      <td className="py-3 px-3 align-top whitespace-nowrap border-r border-[#f1f5f9]">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-[#1e293b] text-xs">
                            {project.projectManager}
                          </div>
                          {project.siteContactPhone && (
                            <div className="text-[10px] text-[#64748b]">
                              {project.siteContactPhone}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 4. BUDGET HOURS (Editable for Live Projects, or '—' for Post Tender) */}
                      <td className="py-3 px-3 text-right align-top whitespace-nowrap border-r border-[#f1f5f9]">
                        {isPostTender ? (
                          <span
                            className="text-[#94a3b8] italic text-[11px]"
                            title="Per PRD Section 14: Post Tender does not require Budget Hours"
                          >
                            —
                          </span>
                        ) : editingBudgetId === project.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={tempBudgetVal}
                              onChange={(e) => setTempBudgetVal(Number(e.target.value))}
                              className="w-20 px-1.5 py-1 text-xs border border-[#0073ea] rounded text-right font-bold focus:outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveBudget(project.id);
                                if (e.key === 'Escape') setEditingBudgetId(null);
                              }}
                            />
                            <button
                              onClick={() => handleSaveBudget(project.id)}
                              className="p-1 text-[#059669] hover:bg-emerald-50 rounded cursor-pointer"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingBudgetId(null)}
                              className="p-1 text-[#64748b] hover:bg-slate-100 rounded cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBudgetId(project.id);
                              setTempBudgetVal(project.budgetHours || 0);
                            }}
                            className="group/b inline-flex items-center gap-1 font-mono font-bold text-[#1e293b] hover:text-[#0073ea] cursor-pointer"
                            title="Click to edit budget hours"
                          >
                            <span>{(project.budgetHours || 0).toLocaleString()}h</span>
                            <Edit2 className="w-3 h-3 text-[#94a3b8] opacity-0 group-hover/b:opacity-100 transition-opacity" />
                          </button>
                        )}
                      </td>

                      {/* 5. VARIATION HOURS */}
                      <td className="py-3 px-3 text-right align-top whitespace-nowrap border-r border-[#f1f5f9]">
                        {isPostTender ? (
                          <span className="text-[#94a3b8] italic text-[11px]">—</span>
                        ) : editingVariationId === project.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={tempVariationVal}
                              onChange={(e) => setTempVariationVal(Number(e.target.value))}
                              className="w-16 px-1.5 py-1 text-xs border border-[#0073ea] rounded text-right font-bold focus:outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveVariation(project.id);
                                if (e.key === 'Escape') setEditingVariationId(null);
                              }}
                            />
                            <button
                              onClick={() => handleSaveVariation(project.id)}
                              className="p-1 text-[#059669] hover:bg-emerald-50 rounded cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingVariationId(null)}
                              className="p-1 text-[#64748b] hover:bg-slate-100 rounded cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingVariationId(project.id);
                              setTempVariationVal(project.variationHours || 0);
                            }}
                            className="group/v inline-flex items-center gap-1 font-mono text-[#64748b] hover:text-[#0073ea] cursor-pointer"
                            title="Click to edit variation hours"
                          >
                            <span>{(project.variationHours || 0) > 0 ? `+${project.variationHours}h` : `${project.variationHours || 0}h`}</span>
                            <Edit2 className="w-2.5 h-2.5 text-[#94a3b8] opacity-0 group-hover/v:opacity-100" />
                          </button>
                        )}
                      </td>

                      {/* 6. CONSUMED HOURS */}
                      <td className="py-3 px-3 text-right align-top whitespace-nowrap border-r border-[#f1f5f9]">
                        <span className="font-mono font-bold text-[#1e293b]">
                          {(project.consumedHours || 0).toLocaleString()}h
                        </span>
                      </td>

                      {/* 7. REMAINING HOURS */}
                      <td className="py-3 px-3 text-right align-top whitespace-nowrap border-r border-[#e2e8f0]">
                        {isPostTender ? (
                          <span className="text-[#94a3b8] italic text-[11px]">—</span>
                        ) : isOverBudget ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono font-bold text-[11px] bg-rose-50 text-[#e11d48] border border-rose-200">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{remaining.toLocaleString()}h</span>
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-[#059669]">
                            {remaining.toLocaleString()}h
                          </span>
                        )}
                      </td>

                      {/* 8. 14 DATE COLUMNS (Fortnight Matrix Cells) */}
                      {fortnightDates.map((d) => {
                        const plan: DailyShiftPlan | undefined = project.schedule[d.dateString];
                        const dayPeople = plan?.dayShift?.assignedPeople || [];
                        const nightPeople = plan?.nightShift?.assignedPeople || [];
                        const dayCount = dayPeople.length;
                        const nightCount = nightPeople.length;

                        return (
                          <React.Fragment key={`${project.id}-${d.dateString}`}>
                            {/* Day Shift Cell */}
                            {(shiftFilter === 'both' || shiftFilter === 'day') && (
                              <td
                                onClick={() => onOpenEditForecast(project, d.dateString, 'day')}
                                className={`py-2 px-1 text-center align-middle border-r border-[#f1f5f9] transition-colors cursor-pointer hover:bg-amber-100/50 ${
                                  d.isWeekend ? 'bg-[#fcfdfd]' : ''
                                }`}
                                title={`Day Shift: ${dayCount} people (${dayCount * 8}h). Click to edit.`}
                              >
                                {dayCount > 0 ? (
                                  <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded font-bold text-xs bg-amber-50 text-amber-800 border border-amber-200/80 shadow-3xs hover:scale-105 transition-transform">
                                    {dayCount}
                                  </span>
                                ) : (
                                  <span className="text-[#cbd5e1] hover:text-[#94a3b8] text-xs font-mono">
                                    ·
                                  </span>
                                )}
                              </td>
                            )}

                            {/* Night Shift Cell */}
                            {(shiftFilter === 'both' || shiftFilter === 'night') && (
                              <td
                                onClick={() => onOpenEditForecast(project, d.dateString, 'night')}
                                className={`py-2 px-1 text-center align-middle border-r border-[#e2e8f0] transition-colors cursor-pointer hover:bg-indigo-100/50 ${
                                  d.isWeekend ? 'bg-[#fcfdfd]' : ''
                                }`}
                                title={`Night Shift: ${nightCount} people (${nightCount * 8}h). Click to edit.`}
                              >
                                {nightCount > 0 ? (
                                  <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded font-bold text-xs bg-indigo-50 text-indigo-800 border border-indigo-200/80 shadow-3xs hover:scale-105 transition-transform">
                                    {nightCount}
                                  </span>
                                ) : (
                                  <span className="text-[#cbd5e1] hover:text-[#94a3b8] text-xs font-mono">
                                    ·
                                  </span>
                                )}
                              </td>
                            )}
                          </React.Fragment>
                        );
                      })}

                      {/* Notes Column */}
                      <td className="py-3 px-3.5 align-top border-l border-[#e2e8f0] min-w-[180px]">
                        {latestNote ? (
                          <div
                            onClick={() => onOpenNotes(project)}
                            className="cursor-pointer group/note"
                          >
                            <p className="text-[11px] text-[#334155] line-clamp-2 leading-tight group-hover/note:text-[#0073ea] transition-colors">
                              "{latestNote.content}"
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-[#94a3b8] mt-1">
                              <span className="font-semibold text-[#64748b]">{latestNote.author}</span>
                              <span>·</span>
                              <span>{latestNote.timestamp}</span>
                              <span className="text-[#0073ea] ml-auto font-medium">
                                ({project.notes.length})
                              </span>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenNotes(project)}
                            className="text-[#94a3b8] hover:text-[#0073ea] text-[11px] italic flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Add shift note</span>
                          </button>
                        )}
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3 px-3 text-right align-middle whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onOpenEditForecast(project, fortnightDates[0].dateString, shiftFilter)}
                            className="p-1.5 text-[#64748b] hover:text-[#0073ea] hover:bg-[#f1f5f9] rounded-md transition-colors cursor-pointer"
                            title="Edit Roster"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenNotes(project)}
                            className="p-1.5 text-[#64748b] hover:text-[#0073ea] hover:bg-[#f1f5f9] rounded-md transition-colors cursor-pointer"
                            title="View Notes"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* TABLE FOOTER / TOTAL SUMMARY ROW */}
            <tfoot className="bg-[#f8fafc] text-[#1e293b] font-bold border-t-2 border-[#cbd5e1]">
              <tr>
                {/* Sticky Left Summary Label */}
                <td className="sticky left-0 z-30 bg-[#f8fafc] py-3 px-4 border-r border-[#e2e8f0] shadow-[2px_0_4px_-1px_rgba(0,0,0,0.05)] min-w-[320px] max-w-[360px]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-extrabold text-[#0f172a]">
                      Horizon Totals ({filteredProjects.length} Projects)
                    </span>
                  </div>
                </td>

                <td className="py-3 px-3 border-r border-[#f1f5f9] text-[#64748b] font-normal text-[11px]">
                  —
                </td>

                <td className="py-3 px-3 border-r border-[#f1f5f9] text-[#64748b] font-normal text-[11px]">
                  —
                </td>

                {/* Total Budget */}
                <td className="py-3 px-3 text-right font-mono font-extrabold text-xs border-r border-[#f1f5f9]">
                  {totalBudget.toLocaleString()}h
                </td>

                {/* Total Variation */}
                <td className="py-3 px-3 text-right font-mono font-semibold text-xs border-r border-[#f1f5f9] text-[#64748b]">
                  {totalVariation > 0 ? `+${totalVariation}h` : `${totalVariation}h`}
                </td>

                {/* Total Consumed */}
                <td className="py-3 px-3 text-right font-mono font-extrabold text-xs border-r border-[#f1f5f9]">
                  {totalConsumed.toLocaleString()}h
                </td>

                {/* Total Remaining */}
                <td className="py-3 px-3 text-right font-mono font-extrabold text-xs border-r border-[#e2e8f0]">
                  <span className={totalRemaining < 0 ? 'text-[#e11d48]' : 'text-[#059669]'}>
                    {totalRemaining.toLocaleString()}h
                  </span>
                </td>

                {/* Per-Day / Per-Shift Total Headcount Cells */}
                {fortnightDates.map((d) => {
                  let daySum = 0;
                  let nightSum = 0;

                  filteredProjects.forEach((p) => {
                    const plan = p.schedule[d.dateString];
                    if (plan) {
                      daySum += plan.dayShift?.assignedPeople?.length || 0;
                      nightSum += plan.nightShift?.assignedPeople?.length || 0;
                    }
                  });

                  return (
                    <React.Fragment key={`tot-${d.dateString}`}>
                      {(shiftFilter === 'both' || shiftFilter === 'day') && (
                        <td
                          className="py-3 px-1 text-center font-mono font-bold text-xs text-amber-900 bg-amber-50/70 border-r border-[#f1f5f9]"
                          title={`Total Day Headcount on ${d.dateString}: ${daySum} people (${daySum * 8}h)`}
                        >
                          {daySum > 0 ? daySum : '0'}
                        </td>
                      )}
                      {(shiftFilter === 'both' || shiftFilter === 'night') && (
                        <td
                          className="py-3 px-1 text-center font-mono font-bold text-xs text-indigo-900 bg-indigo-50/70 border-r border-[#e2e8f0]"
                          title={`Total Night Headcount on ${d.dateString}: ${nightSum} people (${nightSum * 8}h)`}
                        >
                          {nightSum > 0 ? nightSum : '0'}
                        </td>
                      )}
                    </React.Fragment>
                  );
                })}

                <td className="py-3 px-3.5 border-l border-[#e2e8f0] text-[11px] text-[#64748b] font-normal">
                  —
                </td>

                <td className="py-3 px-3 text-right text-[11px] text-[#64748b] font-normal">
                  —
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
