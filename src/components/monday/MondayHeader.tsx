import React from 'react';
import { WPXWorkspace } from '../../types/resourceForecast';
import {
  ChevronDown,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon,
  Users,
  Calendar,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

interface MondayHeaderProps {
  workspace: WPXWorkspace;
  workspaces: WPXWorkspace[];
  onSelectWorkspace: (ws: WPXWorkspace) => void;
  totalBudget: number;
  totalConsumed: number;
  totalRemaining: number;
  dayHeadcount: number;
  nightHeadcount: number;
  selectedDate: string;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const MondayHeader: React.FC<MondayHeaderProps> = ({
  workspace,
  workspaces,
  onSelectWorkspace,
  totalBudget,
  totalConsumed,
  totalRemaining,
  dayHeadcount,
  nightHeadcount,
  selectedDate,
  isSidebarCollapsed = false,
  onToggleSidebar,
}) => {
  const burnPercent = totalBudget > 0 ? Math.round((totalConsumed / totalBudget) * 100) : 0;
  const isOverBudget = totalRemaining < 0;

  // Format date helper for header indicator
  const dateFormatted = {
    '2026-10-08': 'Wed, Oct 8',
    '2026-10-09': 'Thu, Oct 9',
    '2026-10-10': 'Fri, Oct 10',
    '2026-10-11': 'Sat, Oct 11',
    '2026-10-12': 'Sun, Oct 12',
  }[selectedDate] || selectedDate;

  return (
    <header className="bg-white border-b border-[#e6e9ef] sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="w-full px-5 py-2 flex items-center justify-between gap-4">
        
        {/* Left: Brand and Adjusted KPI Metrics (Budget, Consumed, Remaining, Shift Roster) */}
        <div className="flex items-center gap-3 overflow-x-auto py-0.5 max-w-[calc(100%-180px)] md:max-w-none">
          
          {/* Brand & Sidebar Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-1.5 rounded-lg text-[#676879] hover:text-[#0073ea] hover:bg-[#f0f7ff] transition-all cursor-pointer border border-transparent hover:border-[#b2d9fc]"
                title={isSidebarCollapsed ? "Expand sidebar navigation" : "Collapse sidebar navigation"}
                aria-label={isSidebarCollapsed ? "Expand sidebar navigation" : "Collapse sidebar navigation"}
              >
                {isSidebarCollapsed ? (
                  <PanelLeft className="w-4 h-4 text-[#0073ea]" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
            )}
            <div className="w-7 h-7 rounded-md bg-[#0073ea] flex items-center justify-center font-bold text-white text-xs shadow-2xs">
              RF
            </div>
            <div className="font-bold text-sm text-[#323338] tracking-tight whitespace-nowrap hidden sm:block">
              Resource Forecast
            </div>
          </div>

          <div className="h-5 w-px bg-[#e6e9ef] shrink-0" />

          {/* 1. Budget Hours on Header Left */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f9fafc] border border-[#e6e9ef] rounded-md text-xs shrink-0 hover:border-[#b2d9fc] transition-colors">
            <Clock className="w-3.5 h-3.5 text-[#0073ea]" />
            <span className="text-[#676879] font-medium text-[11px]">Budget:</span>
            <span className="font-mono font-bold text-[#323338] tabular-nums text-xs">
              {totalBudget.toLocaleString()}h
            </span>
          </div>

          {/* 2. Consumed Hours on Header Left */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f9fafc] border border-[#e6e9ef] rounded-md text-xs shrink-0 hover:border-[#b2d9fc] transition-colors">
            <TrendingUp className="w-3.5 h-3.5 text-[#0073ea]" />
            <span className="text-[#676879] font-medium text-[11px]">Consumed:</span>
            <span className="font-mono font-bold text-[#0073ea] tabular-nums text-xs">
              {totalConsumed.toLocaleString()}h
            </span>
            <span className="text-[10px] font-mono font-semibold text-[#0073ea] bg-[#eaf4fe] px-1 py-0.2 rounded border border-[#d0e5fc]">
              {burnPercent}%
            </span>
          </div>

          {/* 3. Remaining Hours on Header Left */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs shrink-0 border transition-colors ${
              isOverBudget
                ? 'bg-[#ffebee] border-[#ffcdd2] text-[#e2445c]'
                : 'bg-[#f0fbf4] border-[#c8e6c9] text-[#2e7d32]'
            }`}
          >
            {isOverBudget ? (
              <AlertTriangle className="w-3.5 h-3.5 text-[#e2445c]" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00c875]" />
            )}
            <span className="font-medium text-[11px]">Remaining:</span>
            <span className="font-mono font-bold tabular-nums text-xs">
              {isOverBudget
                ? `-${Math.abs(totalRemaining).toLocaleString()}h`
                : `+${totalRemaining.toLocaleString()}h`}
            </span>
          </div>

          {/* 4. Shift Roster on Header Left */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#f9fafc] border border-[#e6e9ef] rounded-md text-xs shrink-0 hover:border-[#d0d4e4] transition-colors">
            <div className="flex items-center gap-1 text-[#676879]">
              <Users className="w-3.5 h-3.5 text-[#a25ddc]" />
              <span className="font-medium text-[11px]">Roster:</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#fff8e1] text-[#b45309] border border-[#ffecb3]">
                <Sun className="w-3 h-3 text-[#f59e0b]" />
                <span>{dayHeadcount}</span>
                <span className="text-[10px] text-[#8d6e63] font-normal">Day</span>
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#ede9fe] text-[#4338ca] border border-[#ddd6fe]">
                <Moon className="w-3 h-3 text-[#6366f1]" />
                <span>{nightHeadcount}</span>
                <span className="text-[10px] text-[#5b21b6] font-normal">Night</span>
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Clean Active Date Indicator & Synced Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#f5f6f8] rounded-md text-xs font-mono text-[#676879] border border-[#e6e9ef]">
            <Calendar className="w-3.5 h-3.5 text-[#0073ea]" />
            <span>Horizon:</span>
            <span className="font-semibold text-[#323338]">{dateFormatted}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#808294] pl-2 border-l border-[#e6e9ef]">
            <span className="w-2 h-2 rounded-full bg-[#00c875]" />
            <span className="hidden sm:inline text-[#323338] font-medium">WPX Synced</span>
          </div>
        </div>

      </div>
    </header>
  );
};
