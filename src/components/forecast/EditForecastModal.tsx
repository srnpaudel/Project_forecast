import React, { useState } from 'react';
import { Project, DailyShiftPlan } from '../../types/resourceForecast';
import { X, Sun, Moon, Plus, Minus, MessageSquare, Check, AlertCircle } from 'lucide-react';

interface EditForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  date: string;
  initialShift?: 'both' | 'day' | 'night';
  onSave: (
    projectId: string,
    date: string,
    dayCount: number,
    nightCount: number,
    noteText?: string
  ) => void;
}

export const EditForecastModal: React.FC<EditForecastModalProps> = ({
  isOpen,
  onClose,
  project,
  date,
  initialShift = 'both',
  onSave,
}) => {
  if (!isOpen || !project) return null;

  const currentPlan: DailyShiftPlan | undefined = project.schedule[date];
  const initialDayCount = currentPlan?.dayShift?.assignedPeople?.length || 0;
  const initialNightCount = currentPlan?.nightShift?.assignedPeople?.length || 0;

  const [activeShiftFilter, setActiveShiftFilter] = useState<'both' | 'day' | 'night'>(
    initialShift || 'both'
  );
  const [dayCount, setDayCount] = useState<number>(initialDayCount);
  const [nightCount, setNightCount] = useState<number>(initialNightCount);
  const [noteText, setNoteText] = useState<string>('');

  // Sync active shift filter if initialShift changes
  React.useEffect(() => {
    if (initialShift) {
      setActiveShiftFilter(initialShift);
    }
  }, [initialShift]);

  const dayHours = dayCount * 8;
  const nightHours = nightCount * 8;
  const totalForecastHours = dayHours + nightHours;

  const isLiveProject = project.categoryId === 'cat-live';
  const currentBudget = project.budgetHours || 0;

  // Format date helper
  const dateFormatted = React.useMemo(() => {
    try {
      const parts = date.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      }
    } catch {}
    return date;
  }, [date]);

  const handleSave = () => {
    onSave(project.id, date, dayCount, nightCount, noteText.trim() ? noteText.trim() : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white border border-[#e6e9ef] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f0f2f7] flex items-center justify-between bg-[#fafbfd]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono text-[#676879]">
              <span className="font-semibold text-[#0073ea]">{project.code}</span>
              <span>·</span>
              <span className="font-semibold text-[#323338]">{dateFormatted}</span>
              {isLiveProject && (
                <>
                  <span>·</span>
                  <span className="text-[#00c875] font-semibold">Budget: {currentBudget.toLocaleString()}h</span>
                </>
              )}
            </div>
            <h3 className="text-base font-bold text-[#1e293b] leading-tight">
              {project.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#676879] hover:text-[#323338] rounded-md hover:bg-[#f5f6f8] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Shift Mode Selector: All Shifts vs Day Only vs Night Only */}
          <div className="flex items-center justify-between pb-1 border-b border-[#f0f2f7]">
            <span className="text-xs font-semibold text-[#323338] flex items-center gap-1.5">
              <span>Shift Mode</span>
            </span>
            <div className="flex items-center gap-1 bg-[#f0f2f7] p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveShiftFilter('both')}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeShiftFilter === 'both'
                    ? 'bg-white text-[#323338] font-bold shadow-xs'
                    : 'text-[#676879] hover:text-[#323338]'
                }`}
              >
                All Shifts
              </button>
              <button
                type="button"
                onClick={() => setActiveShiftFilter('day')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeShiftFilter === 'day'
                    ? 'bg-white text-[#b45309] font-bold shadow-xs'
                    : 'text-[#676879] hover:text-[#b45309]'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>Day Only</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveShiftFilter('night')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  activeShiftFilter === 'night'
                    ? 'bg-white text-[#4338ca] font-bold shadow-xs'
                    : 'text-[#676879] hover:text-[#4338ca]'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-[#6366f1]" />
                <span>Night Only</span>
              </button>
            </div>
          </div>

          {/* Shift Cards Grid: Only shows Day card if day selected, only Night card if night selected, both if both */}
          <div className={`grid gap-4 ${activeShiftFilter === 'both' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            
            {/* ☀ DAY SHIFT CARD */}
            {(activeShiftFilter === 'both' || activeShiftFilter === 'day') && (
              <div className="p-4 rounded-xl border border-[#ffe082] bg-[#fffdf7] space-y-3 transition-all shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#b45309]">
                    <Sun className="w-4 h-4 text-[#f59e0b]" />
                    <span>DAY SHIFT</span>
                  </div>
                  <span className="text-[11px] text-[#8d6e63] font-mono">Standard 8h</span>
                </div>

                <div className="flex items-center justify-between bg-white border border-[#ffecb3] rounded-lg p-2.5">
                  <button
                    type="button"
                    onClick={() => setDayCount((c) => Math.max(0, c - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#fff8e1] hover:bg-[#ffe082] text-[#b45309] font-bold cursor-pointer transition-colors"
                    title="Decrease 1 person (-8h)"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="text-center px-4">
                    <div className="font-mono font-bold text-2xl text-[#323338] tabular-nums">
                      {dayCount}
                    </div>
                    <div className="text-[11px] text-[#8d6e63] font-medium">
                      {dayCount === 1 ? 'Person' : 'People'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDayCount((c) => c + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#fff8e1] hover:bg-[#ffe082] text-[#b45309] font-bold cursor-pointer transition-colors"
                    title="Increase 1 person (+8h)"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Calculated Day Hours Rule: People × 8 hours */}
                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#ffecb3]/60">
                  <span className="text-[#8d6e63]">Calculated Day Hours:</span>
                  <span className="font-bold text-[#b45309] text-sm">{dayHours}h</span>
                </div>
              </div>
            )}

            {/* ☾ NIGHT SHIFT CARD */}
            {(activeShiftFilter === 'both' || activeShiftFilter === 'night') && (
              <div className="p-4 rounded-xl border border-[#ddd6fe] bg-[#faf8ff] space-y-3 transition-all shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#4338ca]">
                    <Moon className="w-4 h-4 text-[#6366f1]" />
                    <span>NIGHT SHIFT</span>
                  </div>
                  <span className="text-[11px] text-[#5b21b6] font-mono">Standard 8h</span>
                </div>

                <div className="flex items-center justify-between bg-white border border-[#ddd6fe] rounded-lg p-2.5">
                  <button
                    type="button"
                    onClick={() => setNightCount((c) => Math.max(0, c - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#ede9fe] hover:bg-[#ddd6fe] text-[#4338ca] font-bold cursor-pointer transition-colors"
                    title="Decrease 1 person (-8h)"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="text-center px-4">
                    <div className="font-mono font-bold text-2xl text-[#323338] tabular-nums">
                      {nightCount}
                    </div>
                    <div className="text-[11px] text-[#5b21b6] font-medium">
                      {nightCount === 1 ? 'Person' : 'People'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNightCount((c) => c + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#ede9fe] hover:bg-[#ddd6fe] text-[#4338ca] font-bold cursor-pointer transition-colors"
                    title="Increase 1 person (+8h)"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Calculated Night Hours Rule: People × 8 hours */}
                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#ddd6fe]/60">
                  <span className="text-[#5b21b6]">Calculated Night Hours:</span>
                  <span className="font-bold text-[#4338ca] text-sm">{nightHours}h</span>
                </div>
              </div>
            )}

          </div>

          {/* Real-time Calculation Summary Banner */}
          <div className="p-3 bg-[#f5f6f8] rounded-xl border border-[#e6e9ef] flex items-center justify-between text-xs font-mono">
            <span className="text-[#676879]">
              {activeShiftFilter === 'day'
                ? 'Day Shift Allocation:'
                : activeShiftFilter === 'night'
                ? 'Night Shift Allocation:'
                : `Total Shift Allocation (${dateFormatted}):`}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#323338]">
                {activeShiftFilter === 'day'
                  ? `${dayCount} ${dayCount === 1 ? 'Person' : 'People'}`
                  : activeShiftFilter === 'night'
                  ? `${nightCount} ${nightCount === 1 ? 'Person' : 'People'}`
                  : `${dayCount + nightCount} People`}
              </span>
              <span className="text-[#808294]">·</span>
              <span className="font-bold text-[#0073ea]">
                {activeShiftFilter === 'day'
                  ? `${dayHours} Consumed Hours`
                  : activeShiftFilter === 'night'
                  ? `${nightHours} Consumed Hours`
                  : `${totalForecastHours} Consumed Hours`}
              </span>
            </div>
          </div>

          {/* Add Note Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#323338] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#0073ea]" />
              <span>Project Note for this Forecast</span>
            </label>
            <textarea
              rows={2}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Need additional night crew from Thursday / site access confirmed..."
              className="w-full px-3 py-2 text-xs bg-[#fafbfd] border border-[#d0d4e4] rounded-lg focus:outline-none focus:border-[#0073ea] focus:bg-white text-[#323338] transition-all resize-none"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#f0f2f7] bg-[#fafbfd] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#676879] hover:text-[#323338] hover:bg-[#f0f2f7] rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#0073ea] hover:bg-[#0060c0] rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Forecast</span>
          </button>
        </div>

      </div>
    </div>
  );
};
