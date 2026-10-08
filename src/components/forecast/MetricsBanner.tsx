import React from 'react';
import { WPXWorkspace, Project } from '../../types/resourceForecast';
import { Clock, Users, Sun, Moon, AlertTriangle, CheckCircle2, TrendingUp, Building2 } from 'lucide-react';

interface MetricsBannerProps {
  workspace: WPXWorkspace;
  projects: Project[];
  selectedDate: string;
}

export const MetricsBanner: React.FC<MetricsBannerProps> = ({
  workspace,
  projects,
  selectedDate,
}) => {
  // Aggregate calculations
  const totalBudget = projects.reduce((acc, p) => acc + (p.budgetHours || 0), 0);
  const totalConsumed = projects.reduce((acc, p) => acc + (p.consumedHours || 0), 0);
  const totalRemaining = totalBudget - totalConsumed;
  const burnPercent = totalBudget > 0 ? Math.round((totalConsumed / totalBudget) * 100) : 0;

  // Active shift headcount for selected date
  let dayHeadcount = 0;
  let nightHeadcount = 0;

  projects.forEach((proj) => {
    const dayPlan = proj.schedule[selectedDate];
    if (dayPlan) {
      dayHeadcount += dayPlan.dayShift?.assignedPeople?.length || 0;
      nightHeadcount += dayPlan.nightShift?.assignedPeople?.length || 0;
    }
  });

  return (
    <div className="bg-white border-b border-[#e6e9ef] py-4 px-6 shadow-xs">
      <div className="max-w-7xl mx-auto space-y-3.5">
        
        {/* Workspace Subtitle Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#676879]">
            <Building2 className="w-3.5 h-3.5 text-[#0073ea]" />
            <span className="font-semibold text-[#323338]">{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span>Region: {workspace.region}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#808294]">{workspace.code}</span>
          </div>

          <div className="flex items-center gap-2 text-[#808294] font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#00c875] inline-block" />
            <span>WPX Ingestion Synced ({workspace.lastWpxSync})</span>
            <span aria-hidden="true">·</span>
            <span>Zero Write-Back</span>
          </div>
        </div>

        {/* 4 Clean Metric Cards (Monday.com Clean Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          
          {/* Card 1: Total Budget */}
          <div className="p-3.5 rounded-lg bg-[#fafbfd] border border-[#e6e9ef] space-y-1">
            <div className="text-xs text-[#676879] font-medium flex items-center justify-between">
              <span>Budget Hours</span>
              <Clock className="w-3.5 h-3.5 text-[#0073ea]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#323338] tracking-tight tabular-nums">
              {totalBudget.toLocaleString()} <span className="text-xs font-normal text-[#808294]">hrs</span>
            </div>
            <div className="text-[11px] text-[#808294]">
              Across {projects.length} WPX projects
            </div>
          </div>

          {/* Card 2: Consumed Hours */}
          <div className="p-3.5 rounded-lg bg-[#fafbfd] border border-[#e6e9ef] space-y-1">
            <div className="text-xs text-[#676879] font-medium flex items-center justify-between">
              <span>Consumed Hours</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#0073ea]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#0073ea] tracking-tight tabular-nums">
              {totalConsumed.toLocaleString()} <span className="text-xs font-normal text-[#808294]">hrs</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#676879]">
              <div className="flex-1 bg-[#e6e9ef] rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full ${burnPercent > 90 ? 'bg-[#e2445c]' : 'bg-[#0073ea]'}`}
                  style={{ width: `${Math.min(burnPercent, 100)}%` }}
                />
              </div>
              <span className="font-mono">{burnPercent}%</span>
            </div>
          </div>

          {/* Card 3: Remaining Hours */}
          <div className="p-3.5 rounded-lg bg-[#fafbfd] border border-[#e6e9ef] space-y-1">
            <div className="text-xs text-[#676879] font-medium flex items-center justify-between">
              <span>Remaining Hours</span>
              {totalRemaining >= 0 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00c875]" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-[#e2445c]" />
              )}
            </div>
            <div
              className={`font-mono text-2xl font-bold tracking-tight tabular-nums ${
                totalRemaining >= 0 ? 'text-[#00c875]' : 'text-[#e2445c]'
              }`}
            >
              {totalRemaining.toLocaleString()} <span className="text-xs font-normal text-[#808294]">hrs</span>
            </div>
            <div className="text-[11px] text-[#808294]">
              {totalRemaining >= 0 ? 'Within approved quota' : 'Budget overrun'}
            </div>
          </div>

          {/* Card 4: Shift Deployment on Selected Date */}
          <div className="p-3.5 rounded-lg bg-[#fafbfd] border border-[#e6e9ef] space-y-1">
            <div className="text-xs text-[#676879] font-medium flex items-center justify-between">
              <span>Shift Roster ({selectedDate})</span>
              <Users className="w-3.5 h-3.5 text-[#a25ddc]" />
            </div>
            <div className="flex items-center gap-3 pt-0.5">
              <div className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span className="font-mono text-xl font-bold text-[#323338] tabular-nums">
                  {dayHeadcount}
                </span>
                <span className="text-[11px] text-[#808294]">Day</span>
              </div>
              <div className="h-4 w-px bg-[#e6e9ef]" />
              <div className="flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-[#6366f1]" />
                <span className="font-mono text-xl font-bold text-[#323338] tabular-nums">
                  {nightHeadcount}
                </span>
                <span className="text-[11px] text-[#808294]">Night</span>
              </div>
            </div>
            <div className="text-[11px] text-[#808294] font-mono">
              Total active: {dayHeadcount + nightHeadcount} attendees
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
