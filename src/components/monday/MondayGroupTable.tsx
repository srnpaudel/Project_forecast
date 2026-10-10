import React, { useState } from 'react';
import {
  Project,
  ProjectCategory,
  WPXPerson,
  ShiftType,
} from '../../types/resourceForecast';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  MessageSquare,
  Sun,
  Moon,
  Copy,
  Edit3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  HardHat,
  TrendingDown,
  Building2,
  Sparkles
} from 'lucide-react';

interface MondayGroupTableProps {
  projects: Project[];
  categories: ProjectCategory[];
  personnelPool: WPXPerson[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  shiftFilter?: 'both' | 'day' | 'night';
  setShiftFilter?: (filter: 'both' | 'day' | 'night') => void;
  onOpenEditForecast: (project: Project, date: string, shiftFilter?: 'both' | 'day' | 'night') => void;
  onOpenNotes: (project: Project) => void;
  onUpdateBudget: (projectId: string, newBudget: number) => void;
  onUpdateVariation?: (projectId: string, newVariation: number) => void;
  onDuplicateShiftToNextDay: (projectId: string, date: string) => void;
}

export const MondayGroupTable: React.FC<MondayGroupTableProps> = ({
  projects,
  categories,
  personnelPool,
  selectedDate,
  setSelectedDate,
  shiftFilter: controlledShiftFilter,
  setShiftFilter: controlledSetShiftFilter,
  onOpenEditForecast,
  onOpenNotes,
  onUpdateBudget,
  onUpdateVariation,
  onDuplicateShiftToNextDay,
}) => {
  // Collapsed categories state (default all open)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Shift view filter: all ('both'), day ('day'), night ('night')
  const [internalShiftFilter, setInternalShiftFilter] = useState<'both' | 'day' | 'night'>('both');
  const shiftFilter = controlledShiftFilter ?? internalShiftFilter;
  const setShiftFilter = controlledSetShiftFilter ?? setInternalShiftFilter;

  // Inline editing state for Live Project Budget Hours
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [tempBudgetVal, setTempBudgetVal] = useState<number>(0);

  // Inline editing state for Variation Hours
  const [editingVariationId, setEditingVariationId] = useState<string | null>(null);
  const [tempVariationVal, setTempVariationVal] = useState<number>(0);

  const dateOptions = [
    { date: '2026-10-08', label: 'Wed, Oct 8' },
    { date: '2026-10-09', label: 'Thu, Oct 9' },
    { date: '2026-10-10', label: 'Fri, Oct 10' },
    { date: '2026-10-11', label: 'Sat, Oct 11' },
    { date: '2026-10-12', label: 'Sun, Oct 12' },
  ];

  const toggleGroup = (catId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarBg = (name: string) => {
    const colors = ['#0073ea', '#a25ddc', '#00c875', '#fdab3d', '#e2445c', '#579bfc'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="space-y-6">
      
      {/* Planning Horizon & Shift Filter (PRD Section 6) */}
      <div className="bg-white border border-[#e6e9ef] p-3.5 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Date Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-[#323338] mr-2 flex items-center gap-1.5 shrink-0">
            <Calendar className="w-4 h-4 text-[#0073ea]" />
            Planning Horizon:
          </span>

          {dateOptions.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedDate === d.date
                  ? 'bg-[#0073ea] text-white shadow-xs font-semibold'
                  : 'text-[#676879] hover:bg-[#f5f6f8] hover:text-[#323338] border border-transparent'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Shift Filter: [ All Shifts ] [ ☀ Day Only ] [ ☾ Night Only ] */}
        <div className="flex items-center gap-1 bg-[#f5f6f8] p-1 rounded-lg border border-[#e6e9ef] text-xs shrink-0">
          <button
            onClick={() => setShiftFilter('both')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              shiftFilter === 'both' ? 'bg-white text-[#323338] font-bold shadow-xs' : 'text-[#676879]'
            }`}
          >
            All Shifts
          </button>
          <button
            onClick={() => setShiftFilter('day')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              shiftFilter === 'day' ? 'bg-white text-[#b45309] font-bold shadow-xs' : 'text-[#676879]'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Day Only</span>
          </button>
          <button
            onClick={() => setShiftFilter('night')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              shiftFilter === 'night' ? 'bg-white text-[#4338ca] font-bold shadow-xs' : 'text-[#676879]'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-[#6366f1]" />
            <span>Night Only</span>
          </button>
        </div>
      </div>

      {/* Project Status Sections (Tables by Status) */}
      <div className="space-y-6">
        {categories.map((category) => {
          const groupProjects = projects.filter((p) => p.categoryId === category.id);
          const isCollapsed = !!collapsedGroups[category.id];
          const isLive = category.id === 'cat-live';
          const isPostTender = category.id === 'cat-post-tender';

          // Group totals
          const groupBudget = groupProjects.reduce((acc, p) => acc + (p.budgetHours || 0), 0);
          const groupVariation = groupProjects.reduce((acc, p) => acc + (p.variationHours || 0), 0);
          const groupTotalBudget = groupBudget + groupVariation;
          const groupConsumed = groupProjects.reduce((acc, p) => acc + (p.consumedHours || 0), 0);
          const groupRemaining = isLive ? groupTotalBudget - groupConsumed : 0;
          const isGroupOver = isLive && groupRemaining < 0;

          // Shift headcount sums for selected date
          let groupDayHeadcount = 0;
          let groupNightHeadcount = 0;
          groupProjects.forEach((p) => {
            const plan = p.schedule[selectedDate];
            if (plan) {
              groupDayHeadcount += plan.dayShift?.assignedPeople?.length || 0;
              groupNightHeadcount += plan.nightShift?.assignedPeople?.length || 0;
            }
          });

          return (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-[#e6e9ef] shadow-2xs overflow-hidden"
            >
              {/* Category Header Banner */}
              <div
                onClick={() => toggleGroup(category.id)}
                className="px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-[#fafbfd] transition-colors border-b border-[#f0f2f7]"
                style={{ borderLeftWidth: '5px', borderLeftColor: category.color }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[#676879] hover:text-[#323338] transition-colors">
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                  
                  <h3
                    className="font-bold text-sm tracking-tight flex items-center gap-2"
                    style={{ color: category.color }}
                  >
                    <span>{category.name.toUpperCase()}</span>
                  </h3>

                  <span className="text-xs text-[#808294] font-medium bg-[#f5f6f8] px-2 py-0.5 rounded-full">
                    {groupProjects.length} {groupProjects.length === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>

                {/* Category Group Summary KPIs */}
                <div className="flex items-center gap-4 text-xs font-mono text-[#676879]">
                  {isLive ? (
                    <>
                      <span className="hidden sm:inline">
                        Budget: <strong className="text-[#323338]">{groupTotalBudget.toLocaleString()}h</strong>
                      </span>
                      <span className="hidden sm:inline">
                        Consumed: <strong className="text-[#0073ea]">{groupConsumed.toLocaleString()}h</strong>
                      </span>
                      <span>
                        Remaining:{' '}
                        <strong className={isGroupOver ? 'text-[#e2445c]' : 'text-[#00c875]'}>
                          {isGroupOver
                            ? `-${Math.abs(groupRemaining).toLocaleString()}h`
                            : `+${groupRemaining.toLocaleString()}h`}
                        </strong>
                      </span>
                    </>
                  ) : (
                    <span>
                      Forecast Consumed: <strong className="text-[#0073ea]">{groupConsumed.toLocaleString()}h</strong>
                      <span className="text-[11px] text-[#808294] ml-1.5 font-normal">
                        ({isPostTender ? 'No budget required for Post Tender' : 'Staged Planning'})
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Category Table */}
              {!isCollapsed && (
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[1360px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#475569] font-bold uppercase tracking-wider text-[11px]">
                        {/* 1. Project Name (Only Sticky Column on Left with separator) - NEVER TRUNCATE */}
                        <th className="sticky left-0 z-20 bg-[#f8fafc] py-3 px-3.5 w-[320px] min-w-[300px] border-r border-[#e2e8f0] shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]">
                          <div className="flex items-center gap-1.5">
                            <HardHat className="w-3.5 h-3.5 text-[#0073ea]" />
                            <span>Project</span>
                          </div>
                        </th>

                        {/* 2. Builder (Scrollable Column) */}
                        <th className="py-3 px-3.5 min-w-[140px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#64748b]" />
                            <span>Builder</span>
                          </div>
                        </th>

                        {/* 3. Site Contact (Site Attendee from WPX) */}
                        <th className="py-3 px-3.5 min-w-[170px] whitespace-nowrap">
                          Site Contact
                        </th>

                        {/* 4. Budget Hours */}
                        <th className="py-3 px-3.5 text-right min-w-[110px] whitespace-nowrap">
                          Budget Hours
                        </th>

                        {/* 5. Variation Hours */}
                        <th className="py-3 px-3.5 text-right min-w-[105px] whitespace-nowrap">
                          Variation Hours
                        </th>

                        {/* 6. Consumed Hours */}
                        <th className="py-3 px-3.5 text-right min-w-[115px] whitespace-nowrap">
                          Consumed Hours
                        </th>

                        {/* 7. Remaining Hours */}
                        <th className="py-3 px-3.5 text-right min-w-[115px] whitespace-nowrap">
                          Remaining Hours
                        </th>

                        {/* 8. Day Shift Roster (8h) */}
                        {(shiftFilter === 'both' || shiftFilter === 'day') && (
                          <th className="py-3 px-3.5 min-w-[155px] text-[#b45309] whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Sun className="w-3.5 h-3.5 text-[#f59e0b]" />
                              <span>Day Shift (8h)</span>
                            </div>
                          </th>
                        )}

                        {/* 9. Night Shift Roster (8h) */}
                        {(shiftFilter === 'both' || shiftFilter === 'night') && (
                          <th className="py-3 px-3.5 min-w-[155px] text-[#4338ca] whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Moon className="w-3.5 h-3.5 text-[#6366f1]" />
                              <span>Night Shift (8h)</span>
                            </div>
                          </th>
                        )}

                        {/* 10. Notes */}
                        <th className="py-3 px-3.5 min-w-[220px]">
                          Latest Note
                        </th>

                        {/* 11. Actions */}
                        <th className="py-3 px-3.5 text-right min-w-[160px] whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#f0f2f7]">
                      {groupProjects.length === 0 ? (
                        <tr>
                          <td
                            colSpan={11}
                            className="p-8 text-center text-[#808294] text-xs space-y-1 bg-white"
                          >
                            <p className="font-semibold text-[#323338]">
                              No projects currently assigned to this status.
                            </p>
                            <p className="text-[11px]">
                              Projects ingest automatically from the WPX Project Register.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        groupProjects.map((project) => {
                          const plan = project.schedule[selectedDate];
                          const dayCount = plan?.dayShift?.assignedPeople?.length || 0;
                          const nightCount = plan?.nightShift?.assignedPeople?.length || 0;
                          const dayHours = dayCount * 8;
                          const nightHours = nightCount * 8;

                          const budget = project.budgetHours || 0;
                          const variation = project.variationHours || 0;
                          const totalBudgetHours = budget + variation;
                          const consumed = project.consumedHours || 0;
                          const remaining = totalBudgetHours - consumed;
                          const isOver = isLive && remaining < 0;

                          const latestNote =
                            project.notes && project.notes.length > 0 ? project.notes[0] : null;

                          return (
                            <tr
                              key={project.id}
                              className="group hover:bg-[#f8faff] transition-colors"
                            >
                              {/* 1. Project Name (Only Sticky Column on Left-0 with separator) - NEVER TRUNCATE */}
                              <td className="sticky left-0 z-10 bg-white group-hover:bg-[#f8faff] py-3.5 px-3.5 border-b border-[#f0f2f7] border-r border-[#e2e8f0] shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)] min-w-[300px]">
                                <div className="space-y-1">
                                  <div className="font-bold text-xs text-[#1e293b] leading-snug break-words" title={project.name}>
                                    {project.name}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-mono font-semibold text-[#0073ea] bg-[#eaf4fe] px-1.5 py-0.5 rounded inline-block">
                                      {project.code}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Builder (Scrollable Column) */}
                              <td className="py-3.5 px-3.5 border-b border-[#f0f2f7] whitespace-nowrap">
                                <span className="font-semibold text-xs text-[#1e293b]">
                                  {project.builder}
                                </span>
                              </td>

                              {/* 3. Site Contact (Site attendee from WPX) */}
                              <td className="py-3.5 px-3.5 border-b border-[#f0f2f7] whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                                    style={{ backgroundColor: getAvatarBg(project.projectManager) }}
                                    title={project.projectManager}
                                  >
                                    {getInitials(project.projectManager)}
                                  </div>
                                  <div>
                                    <div className="font-medium text-xs text-[#1e293b]">
                                      {project.projectManager}
                                    </div>
                                    {project.siteContactPhone && (
                                      <div className="text-[10px] font-mono text-[#808294]">
                                        {project.siteContactPhone}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* 4. Budget Hours */}
                              <td className="py-3.5 px-3.5 text-right font-mono text-xs border-b border-[#f0f2f7] whitespace-nowrap">
                                {isLive ? (
                                  editingBudgetId === project.id ? (
                                    <input
                                      type="number"
                                      autoFocus
                                      value={tempBudgetVal}
                                      onChange={(e) => setTempBudgetVal(Number(e.target.value))}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          onUpdateBudget(project.id, tempBudgetVal);
                                          setEditingBudgetId(null);
                                        } else if (e.key === 'Escape') {
                                          setEditingBudgetId(null);
                                        }
                                      }}
                                      onBlur={() => {
                                        onUpdateBudget(project.id, tempBudgetVal);
                                        setEditingBudgetId(null);
                                      }}
                                      className="w-18 text-right font-bold text-xs border border-[#0073ea] rounded px-1 py-0.5"
                                    />
                                  ) : (
                                    <span
                                      onClick={() => {
                                        setEditingBudgetId(project.id);
                                        setTempBudgetVal(budget);
                                      }}
                                      className="font-bold text-[#323338] hover:text-[#0073ea] cursor-pointer hover:underline"
                                      title="Click to manually update Budget Hours"
                                    >
                                      {budget.toLocaleString()}h
                                    </span>
                                  )
                                ) : (
                                  <span className="text-[#94a3b8]" title="No budget requirement for Post Tender">
                                    —
                                  </span>
                                )}
                              </td>

                              {/* 5. Variation Hours */}
                              <td className="py-3.5 px-3.5 text-right font-mono text-xs border-b border-[#f0f2f7] whitespace-nowrap">
                                {isLive ? (
                                  editingVariationId === project.id && onUpdateVariation ? (
                                    <input
                                      type="number"
                                      autoFocus
                                      value={tempVariationVal}
                                      onChange={(e) => setTempVariationVal(Number(e.target.value))}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          onUpdateVariation(project.id, tempVariationVal);
                                          setEditingVariationId(null);
                                        } else if (e.key === 'Escape') {
                                          setEditingVariationId(null);
                                        }
                                      }}
                                      onBlur={() => {
                                        onUpdateVariation(project.id, tempVariationVal);
                                        setEditingVariationId(null);
                                      }}
                                      className="w-16 text-right font-bold text-xs border border-[#0073ea] rounded px-1 py-0.5"
                                    />
                                  ) : (
                                    <span
                                      onClick={() => {
                                        if (onUpdateVariation) {
                                          setEditingVariationId(project.id);
                                          setTempVariationVal(variation);
                                        }
                                      }}
                                      className={`font-semibold cursor-pointer ${
                                        variation > 0 ? 'text-[#0073ea] hover:underline' : 'text-[#808294] hover:text-[#323338]'
                                      }`}
                                      title="Click to update Variation Hours"
                                    >
                                      {variation > 0 ? `+${variation.toLocaleString()}h` : '0h'}
                                    </span>
                                  )
                                ) : (
                                  <span className="text-[#94a3b8]">—</span>
                                )}
                              </td>

                              {/* 6. Consumed Hours (Calculated) */}
                              <td className="py-3.5 px-3.5 text-right font-mono font-bold text-xs text-[#0073ea] border-b border-[#f0f2f7] whitespace-nowrap">
                                {consumed.toLocaleString()}h
                              </td>

                              {/* 7. Remaining Hours (Budget - Consumed) */}
                              <td className="py-3.5 px-3.5 text-right font-mono text-xs border-b border-[#f0f2f7] whitespace-nowrap">
                                {isLive ? (
                                  isOver ? (
                                    <span
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ffebee] text-[#e2445c] font-bold border border-[#ffcdd2]"
                                      title={`Over budget by ${Math.abs(remaining).toLocaleString()}h`}
                                    >
                                      <AlertTriangle className="w-3 h-3 shrink-0" />
                                      <span>-{Math.abs(remaining).toLocaleString()}h</span>
                                    </span>
                                  ) : (
                                    <span className="font-bold text-[#00c875]">
                                      +{remaining.toLocaleString()}h
                                    </span>
                                  )
                                ) : (
                                  <span className="text-[#94a3b8]">—</span>
                                )}
                              </td>

                              {/* 8. Day Shift Roster (Clean headcount & hours WITHOUT names) */}
                              {(shiftFilter === 'both' || shiftFilter === 'day') && (
                                <td className="py-3.5 px-3.5 border-b border-[#f0f2f7] whitespace-nowrap">
                                  {dayCount > 0 ? (
                                    <button
                                      onClick={() => onOpenEditForecast(project, selectedDate, 'day')}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#fffdf7] border border-[#ffe082] hover:bg-[#fff9e6] transition-all cursor-pointer shadow-2xs group/pill"
                                      title={`Day Shift: ${dayCount} People = ${dayHours}h (Click to edit)`}
                                    >
                                      <Sun className="w-3.5 h-3.5 text-[#f59e0b]" />
                                      <span className="font-bold font-mono text-xs text-[#b45309]">
                                        {dayCount} {dayCount === 1 ? 'Person' : 'People'}
                                      </span>
                                      <span className="text-[10px] font-mono text-[#8d6e63]">
                                        • {dayHours}h
                                      </span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => onOpenEditForecast(project, selectedDate, 'day')}
                                      className="text-[11px] text-[#94a3b8] hover:text-[#0073ea] hover:bg-[#f0f7ff] px-2 py-0.5 rounded transition-colors cursor-pointer border border-transparent hover:border-[#b2d9fc]"
                                      title="Assign Day Shift"
                                    >
                                      + Day
                                    </button>
                                  )}
                                </td>
                              )}

                              {/* 9. Night Shift Roster (Clean headcount & hours WITHOUT names) */}
                              {(shiftFilter === 'both' || shiftFilter === 'night') && (
                                <td className="py-3.5 px-3.5 border-b border-[#f0f2f7] whitespace-nowrap">
                                  {nightCount > 0 ? (
                                    <button
                                      onClick={() => onOpenEditForecast(project, selectedDate, 'night')}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#faf8ff] border border-[#ddd6fe] hover:bg-[#f4f0ff] transition-all cursor-pointer shadow-2xs group/pill"
                                      title={`Night Shift: ${nightCount} People = ${nightHours}h (Click to edit)`}
                                    >
                                      <Moon className="w-3.5 h-3.5 text-[#6366f1]" />
                                      <span className="font-bold font-mono text-xs text-[#4338ca]">
                                        {nightCount} {nightCount === 1 ? 'Person' : 'People'}
                                      </span>
                                      <span className="text-[10px] font-mono text-[#5b21b6]">
                                        • {nightHours}h
                                      </span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => onOpenEditForecast(project, selectedDate, 'night')}
                                      className="text-[11px] text-[#94a3b8] hover:text-[#6366f1] hover:bg-[#faf8ff] px-2 py-0.5 rounded transition-colors cursor-pointer border border-transparent hover:border-[#ddd6fe]"
                                      title="Assign Night Shift"
                                    >
                                      + Night
                                    </button>
                                  )}
                                </td>
                              )}

                              {/* 10. Notes (with count badge & latest preview) */}
                              <td className="py-3.5 px-3.5 border-b border-[#f0f2f7]">
                                <div
                                  onClick={() => onOpenNotes(project)}
                                  className="flex items-start gap-1.5 cursor-pointer text-[#676879] hover:text-[#0073ea] transition-colors max-w-[280px]"
                                  title="Click to view all notes"
                                >
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#f5f6f8] text-[10px] font-mono font-bold text-[#475569] shrink-0 border border-[#e2e8f0] mt-0.5">
                                    <MessageSquare className="w-3 h-3 text-[#0073ea]" />
                                    {project.notes.length}
                                  </span>
                                  {latestNote ? (
                                    <span className="text-[11px] leading-tight line-clamp-2">
                                      {latestNote.content}
                                    </span>
                                  ) : (
                                    <span className="text-[11px] text-[#94a3b8] italic">
                                      + Note
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 11. Actions */}
                              <td className="py-3.5 px-3.5 text-right border-b border-[#f0f2f7] whitespace-nowrap">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => onOpenEditForecast(project, selectedDate, shiftFilter)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-[#0073ea] hover:bg-[#0060c0] rounded-lg shadow-2xs transition-colors cursor-pointer"
                                    title="Edit Day / Night Forecast for this date"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>

                                  <button
                                    onClick={() => onDuplicateShiftToNextDay(project.id, selectedDate)}
                                    className="p-1 text-[#676879] hover:text-[#0073ea] hover:bg-[#f0f7ff] rounded-md transition-colors cursor-pointer border border-transparent hover:border-[#b2d9fc]"
                                    title="Clone shift to next day in 1 click"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>

                    {/* Table Footer: Group Totals */}
                    {groupProjects.length > 0 && (
                      <tfoot>
                        <tr className="bg-[#f8fafc] border-t-2 border-[#e2e8f0] font-bold text-xs">
                          {/* 1. Sticky Project Summary (Only Sticky Column) */}
                          <td className="sticky left-0 z-10 bg-[#f8fafc] py-2.5 px-3.5 border-r border-[#e2e8f0] shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)] whitespace-nowrap min-w-[300px]">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[#475569] uppercase text-[10px] tracking-wider">Summary Total</span>
                              <span className="text-[#64748b] font-mono text-[11px] font-semibold">{groupProjects.length} Projects</span>
                            </div>
                          </td>

                          {/* 2. Builder Column (Scrollable) */}
                          <td className="py-2.5 px-3.5 text-[#808294] text-[10px] whitespace-nowrap">
                            —
                          </td>

                          {/* 3. Site Contact (Scrollable) */}
                          <td className="py-2.5 px-3.5 text-[#808294] text-[10px] whitespace-nowrap">
                            —
                          </td>

                          {/* Budget Sum */}
                          <td className="py-2.5 px-3.5 text-right font-mono text-[#323338] whitespace-nowrap">
                            {isLive ? `${groupBudget.toLocaleString()}h` : '—'}
                          </td>

                          {/* Variation Sum */}
                          <td className="py-2.5 px-3.5 text-right font-mono text-[#0073ea] whitespace-nowrap">
                            {isLive && groupVariation > 0 ? `+${groupVariation.toLocaleString()}h` : '—'}
                          </td>

                          {/* Consumed Sum */}
                          <td className="py-2.5 px-3.5 text-right font-mono text-[#0073ea] whitespace-nowrap">
                            {groupConsumed.toLocaleString()}h
                          </td>

                          {/* Remaining Sum */}
                          <td className="py-2.5 px-3.5 text-right font-mono whitespace-nowrap">
                            {isLive ? (
                              <span className={isGroupOver ? 'text-[#e2445c]' : 'text-[#00c875]'}>
                                {isGroupOver
                                  ? `-${Math.abs(groupRemaining).toLocaleString()}h`
                                  : `+${groupRemaining.toLocaleString()}h`}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>

                          {/* Day Shift Total */}
                          {(shiftFilter === 'both' || shiftFilter === 'day') && (
                            <td className="py-2.5 px-3.5 font-mono text-[11px] text-[#b45309] whitespace-nowrap">
                              {groupDayHeadcount} People ({groupDayHeadcount * 8}h)
                            </td>
                          )}

                          {/* Night Shift Total */}
                          {(shiftFilter === 'both' || shiftFilter === 'night') && (
                            <td className="py-2.5 px-3.5 font-mono text-[11px] text-[#4338ca] whitespace-nowrap">
                              {groupNightHeadcount} People ({groupNightHeadcount * 8}h)
                            </td>
                          )}

                          {/* Notes Empty */}
                          <td className="py-2.5 px-3.5 text-[#808294] text-[10px]">
                            —
                          </td>

                          {/* Actions Empty */}
                          <td className="py-2.5 px-3.5 text-right text-[#808294] text-[10px]">
                            —
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
