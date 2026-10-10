import React from 'react';
import { WPXWorkspace } from '../../types/resourceForecast';
import {
  Calendar,
  Layers,
  History,
  FileText,
  User,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface Section8TopHeaderProps {
  workspace: WPXWorkspace;
  activeView: 'board' | 'snapshots' | 'prd';
  onChangeView: (view: 'board' | 'snapshots' | 'prd') => void;
  snapshotCount: number;
}

export const Section8TopHeader: React.FC<Section8TopHeaderProps> = ({
  workspace,
  activeView,
  onChangeView,
  snapshotCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0f172a] text-white border-b border-[#1e293b] shadow-md">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity from Section 8 Wireframe */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0073ea] flex items-center justify-center font-bold text-white shadow-xs text-sm">
            RF
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">
                Resource Forecast
              </span>
              <span className="text-[10px] bg-white/10 text-slate-300 font-mono px-1.5 py-0.5 rounded uppercase">
                WPX ERP
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              PRD Section 8 UI/UX Specification · Zero Write-Back
            </span>
          </div>
        </div>

        {/* Center / Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white/[0.07] p-1 rounded-lg border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => onChangeView('board')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeView === 'board'
                ? 'bg-[#0073ea] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Forecast Board</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeView('snapshots')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeView === 'snapshots'
                ? 'bg-[#0073ea] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Snapshots ({snapshotCount})</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeView('prd')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeView === 'prd'
                ? 'bg-[#0073ea] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PRD Analysis</span>
          </button>
        </div>

        {/* Right: User Profile (from wireframe right side) */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-white leading-tight">
              srnpaudel777@gmail.com
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Senior Project Manager
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 border border-white/20 flex items-center justify-center font-bold text-xs text-white shadow-xs">
            SP
          </div>
        </div>

      </div>
    </header>
  );
};
