import React, { useState } from 'react';
import {
  Project,
  ProjectCategory,
  WPXPerson,
  ShiftType,
} from '../../types/resourceForecast';
import {
  Sun,
  Moon,
  Plus,
  X,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Clock,
  Sparkles,
  Edit2
} from 'lucide-react';

interface ForecastMatrixProps {
  projects: Project[];
  categories: ProjectCategory[];
  personnelPool: WPXPerson[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenAssign: (project: Project, shiftType: ShiftType, date: string) => void;
  onOpenNotes: (project: Project) => void;
  onUpdateBudget: (projectId: string, newBudget: number) => void;
  onRemovePersonFromShift: (projectId: string, date: string, shiftType: ShiftType, personId: string) => void;
  onDuplicateShiftToNextDay: (projectId: string, date: string) => void;
}

export const ForecastMatrix: React.FC<ForecastMatrixProps> = ({
  projects,
  categories,
  personnelPool,
  selectedDate,
  setSelectedDate,
  onOpenAssign,
  onOpenNotes,
  onUpdateBudget,
  onRemovePersonFromShift,
  onDuplicateShiftToNextDay,
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [shiftFilter, setShiftFilter] = useState<'both' | 'day' | 'night'>('both');
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [tempBudgetValue, setTempBudgetValue] = useState<number>(0);

  // Available dates for navigation
  const dateOptions = [
    { date: '2026-10-08', label: 'Wed, Oct 8' },
    { date: '2026-10-09', label: 'Thu, Oct 9' },
    { date: '2026-10-10', label: 'Fri, Oct 10' },
    { date: '2026-10-11', label: 'Sat, Oct 11' },
    { date: '2026-10-12', label: 'Sun, Oct 12' },
  ];

  const currentDateIdx = dateOptions.findIndex((d) => d.date === selectedDate);

  const handlePrevDate = () => {
    if (currentDateIdx > 0) {
      setSelectedDate(dateOptions[currentDateIdx - 1].date);
    }
  };

  const handleNextDate = () => {
    if (currentDateIdx < dateOptions.length - 1) {
      setSelectedDate(dateOptions[currentDateIdx + 1].date);
    }
  };

  // Filter projects by category
  const filteredProjects = projects.filter((p) => {
    if (activeCategoryFilter === 'all') return true;
    return p.categoryId === activeCategoryFilter;
  });

  const getPerson = (id: string): WPXPerson | undefined => {
    return personnelPool.find((p) => p.id === id);
  };

  const getCategory = (catId: string): ProjectCategory | undefined => {
    return categories.find((c) => c.id === catId);
  };

  return (
    <div className="space-y-6">
      
      {/* Control Toolbar: Date Navigation + Filters (Single-Elevation, Low-Click) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141820] p-4 rounded-xl border border-white/[0.08]">
        
        {/* Date Selector Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#1a202c] rounded-lg border border-white/10 p-0.5">
            <button
              onClick={handlePrevDate}
              disabled={currentDateIdx <= 0}
              className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors cursor-pointer"
              title="Previous date"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {dateOptions.map((d) => (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-all cursor-pointer whitespace-nowrap ${
                    selectedDate === d.date
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextDate}
              disabled={currentDateIdx >= dateOptions.length - 1}
              className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors cursor-pointer"
              title="Next date"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters: Category & Shift Views */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Shift Mode Toggle */}
          <div className="flex items-center bg-[#1a202c] p-0.5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setShiftFilter('both')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                shiftFilter === 'both' ? 'bg-white/15 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Shifts
            </button>
            <button
              onClick={() => setShiftFilter('day')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                shiftFilter === 'day' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sun className="w-3 h-3 text-amber-400" />
              <span>Day Only</span>
            </button>
            <button
              onClick={() => setShiftFilter('night')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                shiftFilter === 'night' ? 'bg-indigo-500/20 text-indigo-300 font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Moon className="w-3 h-3 text-indigo-400" />
              <span>Night Only</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center bg-[#1a202c] p-0.5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeCategoryFilter === 'all'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Categories ({projects.length})
            </button>

            {categories.map((c) => {
              const count = projects.filter((p) => p.categoryId === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategoryFilter(c.id)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    activeCategoryFilter === c.id
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {c.name} ({count})
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* Main Resource Planning Grid */}
      <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-[#10141a]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            {/* Table Header */}
            <thead className="bg-[#141820] text-zinc-400 font-mono border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-4 font-medium w-72">PROJECT & CATEGORY</th>
                <th className="py-3 px-4 font-medium text-right w-28">BUDGET (H)</th>
                <th className="py-3 px-4 font-medium text-right w-28">CONSUMED</th>
                <th className="py-3 px-4 font-medium text-right w-28">REMAINING</th>
                
                {/* Dynamic Shift Columns */}
                {(shiftFilter === 'both' || shiftFilter === 'day') && (
                  <th className="py-3 px-4 font-medium min-w-[280px]">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Sun className="w-3.5 h-3.5" />
                      <span>DAY SHIFT ROSTER</span>
                    </div>
                  </th>
                )}

                {(shiftFilter === 'both' || shiftFilter === 'night') && (
                  <th className="py-3 px-4 font-medium min-w-[280px]">
                    <div className="flex items-center gap-1.5 text-indigo-400">
                      <Moon className="w-3.5 h-3.5" />
                      <span>NIGHT SHIFT ROSTER</span>
                    </div>
                  </th>
                )}

                <th className="py-3 px-4 font-medium text-right w-24">ACTIONS</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/[0.05]">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    No projects found for the selected category filter.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => {
                  const category = getCategory(project.categoryId);
                  const baseBudget = project.budgetHours ?? 0;
                  const remainingHours = baseBudget - project.consumedHours;
                  const isOverBudget = remainingHours < 0;
                  const dayShift = project.schedule[selectedDate]?.dayShift;
                  const nightShift = project.schedule[selectedDate]?.nightShift;

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-white/[0.015] transition-colors group"
                    >
                      {/* Column 1: Project Identity & Category */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white font-sans text-sm">
                              {project.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                            <span className="font-mono text-blue-400">{project.code}</span>
                            <span aria-hidden="true">·</span>
                            <span>Lead: {project.projectManager}</span>
                            <span aria-hidden="true">·</span>
                            <span
                              className="font-medium px-1.5 py-0.2 rounded text-[10px]"
                              style={{
                                backgroundColor: `${category?.color || '#3b82f6'}20`,
                                color: category?.color || '#3b82f6',
                              }}
                            >
                              {category?.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Budget Hours (Interactive Inline Editor) */}
                      <td className="py-3.5 px-4 text-right align-top font-mono tabular-nums">
                        {editingBudgetId === project.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              autoFocus
                              value={tempBudgetValue}
                              onChange={(e) => setTempBudgetValue(Number(e.target.value))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  onUpdateBudget(project.id, tempBudgetValue);
                                  setEditingBudgetId(null);
                                } else if (e.key === 'Escape') {
                                  setEditingBudgetId(null);
                                }
                              }}
                              className="w-20 px-1 py-0.5 text-xs bg-[#1a202c] border border-blue-500 rounded text-right text-white font-mono"
                            />
                            <button
                              onClick={() => {
                                onUpdateBudget(project.id, tempBudgetValue);
                                setEditingBudgetId(null);
                              }}
                              className="p-1 text-emerald-400 hover:text-emerald-300"
                            >
                              ✓
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingBudgetId(project.id);
                              setTempBudgetValue(project.budgetHours ?? 0);
                            }}
                            className="group/budget flex items-center justify-end gap-1.5 cursor-pointer hover:text-blue-400 text-zinc-100 font-medium"
                            title="Click to inline-edit budget hours"
                          >
                            <span>{(project.budgetHours ?? 0).toLocaleString()}h</span>
                            <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover/budget:opacity-100 text-zinc-500" />
                          </div>
                        )}
                        <span className="text-[10px] text-zinc-500 block">Baseline</span>
                      </td>

                      {/* Column 3: Consumed Hours */}
                      <td className="py-3.5 px-4 text-right align-top font-mono tabular-nums">
                        <span className="text-blue-400 font-medium">
                          {project.consumedHours.toLocaleString()}h
                        </span>
                        <div className="w-16 bg-zinc-800 rounded-full h-1 mt-1 ml-auto overflow-hidden">
                          <div
                            className={`h-full ${
                              (project.budgetHours ?? 0) > 0 &&
                              (project.consumedHours / (project.budgetHours || 1)) * 100 > 90
                                ? 'bg-rose-500'
                                : 'bg-blue-500'
                            }`}
                            style={{
                              width: `${Math.min(
                                (project.consumedHours / (project.budgetHours || 1)) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </td>

                      {/* Column 4: Remaining Hours */}
                      <td className="py-3.5 px-4 text-right align-top font-mono tabular-nums">
                        <span
                          className={`font-semibold ${
                            isOverBudget ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {remainingHours.toLocaleString()}h
                        </span>
                        <span className="text-[10px] text-zinc-500 block">
                          {isOverBudget ? 'Over Budget' : 'Available'}
                        </span>
                      </td>

                      {/* Column 5: Day Shift Roster */}
                      {(shiftFilter === 'both' || shiftFilter === 'day') && (
                        <td className="py-3.5 px-4 align-top">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {dayShift?.assignedPeople && dayShift.assignedPeople.length > 0 ? (
                                dayShift.assignedPeople.map((alloc) => {
                                  const person = getPerson(alloc.personId);
                                  if (!person) return null;

                                  return (
                                    <div
                                      key={alloc.personId}
                                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1c222c] border border-white/10 text-[11px] text-zinc-200 hover:border-white/20 transition-all group/chip"
                                    >
                                      <span className="font-medium">{person.name.split(' ')[0]}</span>
                                      <span className="font-mono text-[10px] text-amber-400 tabular-nums">
                                        ({alloc.hours}h)
                                      </span>
                                      <button
                                        onClick={() =>
                                          onRemovePersonFromShift(
                                            project.id,
                                            selectedDate,
                                            'day',
                                            alloc.personId
                                          )
                                        }
                                        className="opacity-60 hover:opacity-100 hover:text-rose-400 transition-opacity ml-0.5 cursor-pointer"
                                        title="Remove from shift"
                                      >
                                        <X className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  );
                                })
                              ) : (
                                <span className="text-zinc-600 text-[11px] italic">
                                  No day personnel
                                </span>
                              )}

                              {/* Fast Low-Click Assign (+) */}
                              <button
                                onClick={() => onOpenAssign(project, 'day', selectedDate)}
                                className="flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/20 cursor-pointer transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Day</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Column 6: Night Shift Roster */}
                      {(shiftFilter === 'both' || shiftFilter === 'night') && (
                        <td className="py-3.5 px-4 align-top">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {nightShift?.assignedPeople && nightShift.assignedPeople.length > 0 ? (
                                nightShift.assignedPeople.map((alloc) => {
                                  const person = getPerson(alloc.personId);
                                  if (!person) return null;

                                  return (
                                    <div
                                      key={alloc.personId}
                                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1c222c] border border-white/10 text-[11px] text-zinc-200 hover:border-white/20 transition-all group/chip"
                                    >
                                      <span className="font-medium">{person.name.split(' ')[0]}</span>
                                      <span className="font-mono text-[10px] text-indigo-400 tabular-nums">
                                        ({alloc.hours}h)
                                      </span>
                                      <button
                                        onClick={() =>
                                          onRemovePersonFromShift(
                                            project.id,
                                            selectedDate,
                                            'night',
                                            alloc.personId
                                          )
                                        }
                                        className="opacity-60 hover:opacity-100 hover:text-rose-400 transition-opacity ml-0.5 cursor-pointer"
                                        title="Remove from shift"
                                      >
                                        <X className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  );
                                })
                              ) : (
                                <span className="text-zinc-600 text-[11px] italic">
                                  No night personnel
                                </span>
                              )}

                              {/* Fast Low-Click Assign (+) */}
                              <button
                                onClick={() => onOpenAssign(project, 'night', selectedDate)}
                                className="flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded border border-indigo-500/20 cursor-pointer transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Night</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Column 7: Fast Actions (Notes & Duplicate to Next Day) */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenNotes(project)}
                            className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/5 relative cursor-pointer"
                            title="Forecast Notes"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {project.notes.length > 0 && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 text-white font-mono text-[9px] rounded-full flex items-center justify-center font-bold">
                                {project.notes.length}
                              </span>
                            )}
                          </button>

                          <button
                            onClick={() => onDuplicateShiftToNextDay(project.id, selectedDate)}
                            className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/5 cursor-pointer"
                            title="Duplicate shifts to next day (Low-Click shortcut)"
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
          </table>
        </div>

        {/* Quick Footer Summary with Tabular Alignment */}
        <div className="px-6 py-3.5 bg-[#141820] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span>SHOWING {filteredProjects.length} OF {projects.length} PROJECTS</span>
            <span aria-hidden="true">·</span>
            <span>SHIFTS ACTIVE FOR: {selectedDate}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>SHORTCUTS: CLICK BUDGET TO EDIT</span>
            <span aria-hidden="true">·</span>
            <span>COPY ICON CLONES TO TOMORROW</span>
          </div>
        </div>
      </div>

    </div>
  );
};
