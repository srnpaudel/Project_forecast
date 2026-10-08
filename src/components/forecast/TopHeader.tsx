import React from 'react';
import { WPXWorkspace } from '../../types/resourceForecast';
import {
  Layers,
  Camera,
  Plus,
  RefreshCw,
  FolderPlus,
  CheckCircle2,
  ChevronDown,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

interface TopHeaderProps {
  workspaces: WPXWorkspace[];
  activeWorkspace: WPXWorkspace;
  onSelectWorkspace: (ws: WPXWorkspace) => void;
  activeTab: 'matrix' | 'categories' | 'history' | 'prd';
  setActiveTab: (tab: 'matrix' | 'categories' | 'history' | 'prd') => void;
  onTakeSnapshot: () => void;
  onNewProject: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  workspaces,
  activeWorkspace,
  onSelectWorkspace,
  activeTab,
  setActiveTab,
  onTakeSnapshot,
  onNewProject,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d1117] border-b border-white/[0.08] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand & Workspace Selector */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              RF
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-medium text-white tracking-tight leading-none">
                Resource Forecast
              </span>
              <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase mt-0.5">
                WPX Ecosystem
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          {/* WPX Workspace Selector */}
          <div className="relative group">
            <select
              value={activeWorkspace.id}
              onChange={(e) => {
                const ws = workspaces.find((w) => w.id === e.target.value);
                if (ws) onSelectWorkspace(ws);
              }}
              className="appearance-none bg-[#161b22] hover:bg-[#1c2128] border border-white/10 text-zinc-100 text-xs font-medium py-1.5 pl-8 pr-8 rounded-md cursor-pointer transition-colors focus:outline-none focus:border-blue-500"
            >
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id} className="bg-[#161b22] text-zinc-200">
                  {ws.name} ({ws.code})
                </option>
              ))}
            </select>
            <Building2 className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Zone 2: Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#161b22] p-1 rounded-lg border border-white/[0.08]">
          {[
            { id: 'matrix' as const, label: 'Forecast Matrix' },
            { id: 'categories' as const, label: 'Project Categories' },
            { id: 'history' as const, label: 'Snapshots & History' },
            { id: 'prd' as const, label: 'PRD Spec & Analysis' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Fast Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onTakeSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-md transition-all cursor-pointer whitespace-nowrap"
            title="Create an immutable revision snapshot"
          >
            <Camera className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Save Snapshot</span>
          </button>

          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-all shadow-sm cursor-pointer whitespace-nowrap active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>

      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-white/[0.06] bg-[#12161c] px-4 py-2 text-xs">
        {[
          { id: 'matrix' as const, label: 'Matrix' },
          { id: 'categories' as const, label: 'Categories' },
          { id: 'history' as const, label: 'History' },
          { id: 'prd' as const, label: 'PRD Spec' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-1 px-2 rounded font-medium ${
              activeTab === tab.id ? 'text-blue-400 font-semibold' : 'text-zinc-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
