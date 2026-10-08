import React, { useState } from 'react';
import { WPXPerson, ShiftType, Project } from '../../types/resourceForecast';
import { X, Search, Sun, Moon, Plus, Clock } from 'lucide-react';

interface AssignPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  shiftType: ShiftType;
  date: string;
  availablePersonnel: WPXPerson[];
  alreadyAssignedIds: string[];
  onAssign: (personId: string, hours: number) => void;
}

export const AssignPersonModal: React.FC<AssignPersonModalProps> = ({
  isOpen,
  onClose,
  project,
  shiftType,
  date,
  availablePersonnel,
  alreadyAssignedIds,
  onAssign,
}) => {
  const [search, setSearch] = useState('');
  const [defaultHours, setDefaultHours] = useState(shiftType === 'night' ? 10 : 8);

  if (!isOpen || !project) return null;

  const filtered = availablePersonnel.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase()) ||
      p.trade.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white border border-[#e6e9ef] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f0f2f7] flex items-center justify-between bg-[#fafbfd]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono text-[#676879]">
              <span className="flex items-center gap-1 font-semibold text-[#323338]">
                {shiftType === 'day' ? (
                  <Sun className="w-3.5 h-3.5 text-[#f59e0b]" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-[#6366f1]" />
                )}
                {shiftType.toUpperCase()} SHIFT
              </span>
              <span aria-hidden="true">·</span>
              <span>{date}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#0073ea] font-medium">{project.code}</span>
            </div>
            <h3 className="text-base font-bold text-[#323338]">
              Assign Attendee to {project.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#676879] hover:text-[#323338] rounded-md hover:bg-[#f5f6f8] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Config Bar */}
        <div className="p-4 border-b border-[#f0f2f7] bg-[#f9fafc] flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search WPX attendees, roles, trades..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#d0d4e4] rounded-md text-[#323338] placeholder-[#808294] focus:outline-none focus:border-[#0073ea]"
            />
            <Search className="w-3.5 h-3.5 text-[#808294] absolute left-2.5 top-2.5 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 text-xs text-[#676879]">
            <Clock className="w-3.5 h-3.5 text-[#808294]" />
            <span>Shift Hours:</span>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-[#d0d4e4]">
              {[8, 10, 12].map((h) => (
                <button
                  key={h}
                  onClick={() => setDefaultHours(h)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                    defaultHours === h ? 'bg-[#0073ea] text-white font-semibold' : 'text-[#676879] hover:text-[#323338]'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Person List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-[#f0f2f7]">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-[#808294] text-xs">
              No matching WPX personnel found.
            </div>
          ) : (
            filtered.map((person) => {
              const isAssigned = alreadyAssignedIds.includes(person.id);

              return (
                <div
                  key={person.id}
                  className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#323338]">{person.name}</span>
                      <span className="text-[10px] font-mono text-[#808294]">
                        Badge #{person.siteBadgeNumber}
                      </span>
                      {person.preferredShift === shiftType && (
                        <span className="text-[10px] text-[#00c875] bg-[#eaf8ee] px-1.5 py-0.2 rounded font-mono font-medium">
                          Shift Match
                        </span>
                      )}
                    </div>
                    <div className="text-[#676879] text-[11px]">
                      {person.role} · <span className="text-[#808294]">{person.trade}</span>
                    </div>
                  </div>

                  <div>
                    {isAssigned ? (
                      <span className="px-2.5 py-1 text-[11px] text-[#808294] font-mono bg-[#f5f6f8] rounded">
                        On Shift
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onAssign(person.id, defaultHours);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-[#0073ea] hover:bg-[#0060c0] text-white font-semibold text-xs rounded transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Assign ({defaultHours}h)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#f0f2f7] bg-[#fafbfd] flex items-center justify-between text-xs text-[#808294]">
          <span>Synced from WPX attendee records.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-[#323338] hover:bg-[#f5f6f8] rounded border border-[#d0d4e4] cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
