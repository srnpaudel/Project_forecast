import React, { useState } from 'react';
import { ProjectCategory, Project, WPXWorkspace } from '../../types/resourceForecast';
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Sparkles,
  Tag,
  PanelLeftClose,
  PanelLeftOpen,
  Briefcase
} from 'lucide-react';

interface CategoryTreeSidebarProps {
  workspace: WPXWorkspace;
  workspaces: WPXWorkspace[];
  onSelectWorkspace: (ws: WPXWorkspace) => void;
  categories: ProjectCategory[];
  projects: Project[];
  selectedCategoryId: string | null; // null or 'all' means all
  onSelectCategory: (catId: string | null) => void;
  selectedProjectId: string | null;
  onSelectProject: (projId: string | null) => void;
  onOpenAddCategory: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const CategoryTreeSidebar: React.FC<CategoryTreeSidebarProps> = ({
  workspace,
  workspaces,
  onSelectWorkspace,
  categories,
  projects,
  selectedCategoryId,
  onSelectCategory,
  selectedProjectId,
  onSelectProject,
  onOpenAddCategory,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  // Tree expanded states for categories (default all open)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'cat-live': true,
    'cat-post-tender': true,
    'cat-pre-con': true,
    'cat-tender': true,
  });

  const toggleExpand = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // If sidebar is collapsed, render the sleek compact icon rail
  if (isCollapsed) {
    return (
      <aside className="w-14 bg-white border-r border-[#e6e9ef] flex flex-col items-center py-3 shrink-0 select-none transition-all duration-200 ease-in-out">
        {/* Expand Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[#676879] hover:text-[#0073ea] hover:bg-[#f0f7ff] transition-all cursor-pointer border border-transparent hover:border-[#b2d9fc] mb-3"
          title="Expand sidebar navigation"
          aria-label="Expand sidebar navigation"
        >
          <PanelLeftOpen className="w-5 h-5 text-[#0073ea]" />
        </button>

        {/* Workspace Icon Indicator */}
        <div
          className="w-9 h-9 rounded-lg bg-[#f0f7ff] text-[#0073ea] flex items-center justify-center font-bold text-xs border border-[#b2d9fc] shadow-2xs mb-3 cursor-pointer"
          title={`Active Workspace: ${workspace.name} (${workspace.code})`}
        >
          <Briefcase className="w-4 h-4" />
        </div>

        <div className="w-8 border-t border-[#f0f2f7] my-1" />

        {/* Root: All Projects Icon */}
        <button
          onClick={() => {
            onSelectCategory(null);
            onSelectProject(null);
          }}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer relative my-1 ${
            selectedCategoryId === null && selectedProjectId === null
              ? 'bg-[#0073ea] text-white shadow-2xs'
              : 'text-[#676879] hover:bg-[#f5f6f8] hover:text-[#323338]'
          }`}
          title={`All Projects (${projects.length} total)`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 text-[9px] font-mono bg-[#323338] text-white rounded-full w-4 h-4 flex items-center justify-center">
            {projects.length}
          </span>
        </button>

        {/* Status Category Icons */}
        <div className="flex-1 space-y-2 mt-2">
          {categories.map((category) => {
            const catProjects = projects.filter((p) => p.categoryId === category.id);
            const isCatSelected = selectedCategoryId === category.id;

            return (
              <button
                key={category.id}
                onClick={() => {
                  onSelectCategory(category.id);
                  onSelectProject(null);
                }}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer relative ${
                  isCatSelected
                    ? 'ring-2 ring-[#0073ea] bg-[#eaf4fe]'
                    : 'hover:bg-[#f5f6f8]'
                }`}
                title={`${category.name} (${catProjects.length} projects)`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-2xs"
                  style={{ backgroundColor: category.color }}
                />
                {catProjects.length > 0 && (
                  <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-mono font-bold bg-[#f1f5f9] text-[#475569] rounded-full px-1 border border-[#cbd5e1]">
                    {catProjects.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add Status (+) Button in Rail */}
        <button
          onClick={onOpenAddCategory}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#f0f7ff] hover:bg-[#0073ea] text-[#0073ea] hover:text-white transition-all cursor-pointer border border-[#b2d9fc] hover:border-[#0073ea] shadow-2xs mt-auto"
          title="Add New Project Status"
        >
          <Plus className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  // Expanded Sidebar State
  return (
    <aside className="w-72 bg-white border-r border-[#e6e9ef] flex flex-col shrink-0 min-h-[calc(100vh-65px)] transition-all duration-200 ease-in-out">
      
      {/* Workspace Selector Box at Top of Side Nav Bar (above Project Status) */}
      <div className="p-3 border-b border-[#e6e9ef] bg-[#fafbfd]">
        <div className="text-[10px] uppercase font-bold text-[#64748b] tracking-wider mb-1.5 flex items-center justify-between">
          <span>Active Workspace</span>
          <span className="text-[10px] font-mono text-[#0073ea] bg-[#eaf4fe] px-1.5 py-0.2 rounded font-semibold">
            {workspace.code}
          </span>
        </div>
        <div className="relative">
          <select
            value={workspace.id}
            onChange={(e) => {
              const ws = workspaces.find((w) => w.id === e.target.value);
              if (ws) onSelectWorkspace(ws);
            }}
            className="w-full appearance-none bg-white hover:bg-[#fafbfd] text-[#1e293b] font-medium text-xs sm:text-[13px] py-2 pl-3 pr-8 rounded-lg cursor-pointer border border-[#c5d0e3] hover:border-[#0073ea] focus:outline-none focus:border-[#0073ea] focus:ring-1 focus:ring-[#0073ea] shadow-2xs transition-all truncate"
            title={workspace.name}
          >
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name} ({ws.code})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#676879] absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Category Tree Header with PROJECT STATUS title, (+) Icon, and Collapse Button */}
      <div className="px-4 py-2.5 border-b border-[#f0f2f7] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#0073ea]" />
          <span className="font-bold text-xs text-[#323338] tracking-tight">
            PROJECT STATUS
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Top (+) Icon to Add New Status */}
          <button
            onClick={onOpenAddCategory}
            className="w-7 h-7 flex items-center justify-center rounded-md bg-[#f0f7ff] hover:bg-[#0073ea] text-[#0073ea] hover:text-white transition-all cursor-pointer border border-[#b2d9fc] hover:border-[#0073ea] shadow-2xs"
            title="Add New Project Status"
            aria-label="Add New Project Status"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Collapse Sidebar Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="w-7 h-7 flex items-center justify-center rounded-md text-[#676879] hover:text-[#0073ea] hover:bg-[#f0f7ff] transition-all cursor-pointer border border-transparent hover:border-[#b2d9fc]"
              title="Collapse sidebar navigation"
              aria-label="Collapse sidebar navigation"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tree Content */}
      <div className="p-3 space-y-1.5 overflow-y-auto flex-1">
        {/* Root: All Projects Node */}
        <button
          onClick={() => {
            onSelectCategory(null);
            onSelectProject(null);
          }}
          className={`w-full px-3 py-2 rounded-md text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
            selectedCategoryId === null && selectedProjectId === null
              ? 'bg-[#eaf4fe] text-[#0073ea] font-bold border border-[#b2d9fc]'
              : 'text-[#323338] hover:bg-[#f5f6f8] font-medium'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>All Projects (Full Forecast)</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#e6e9ef] text-[#676879]">
            {projects.length}
          </span>
        </button>

        <div className="my-2 border-t border-[#f0f2f7]" />

        {/* Categories Tree Branches */}
        <div className="space-y-1">
          {categories.map((category) => {
            const isExpanded = !!expandedCategories[category.id];
            const catProjects = projects.filter((p) => p.categoryId === category.id);
            const isCatSelected = selectedCategoryId === category.id && selectedProjectId === null;

            return (
              <div key={category.id} className="space-y-0.5">
                {/* Category Folder Node */}
                <div
                  onClick={() => {
                    onSelectCategory(category.id);
                    onSelectProject(null);
                  }}
                  className={`group px-2.5 py-1.5 rounded-md text-xs transition-all cursor-pointer flex items-center justify-between ${
                    isCatSelected
                      ? 'bg-[#eaf4fe] text-[#0073ea] font-bold border border-[#b2d9fc]'
                      : 'text-[#323338] hover:bg-[#f5f6f8]'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {/* Expand/Collapse Chevron */}
                    <button
                      onClick={(e) => toggleExpand(category.id, e)}
                      className="p-0.5 text-[#676879] hover:text-[#323338] transition-colors rounded cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Category Color Tag & Name */}
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="truncate font-semibold text-xs">
                      {category.name}
                    </span>
                  </div>

                  {/* Project Count Badge */}
                  <span className="text-[10px] font-mono text-[#808294] bg-[#f5f6f8] group-hover:bg-white px-1.5 py-0.5 rounded shrink-0">
                    {catProjects.length}
                  </span>
                </div>

                {/* Sub-Tree for Projects under this Category */}
                {isExpanded && (
                  <div className="ml-5 pl-2.5 border-l-2 border-[#e6e9ef] space-y-1 my-1">
                    {catProjects.length === 0 ? (
                      <div className="text-[11px] text-[#808294] italic py-1 pl-2">
                        No projects in this status
                      </div>
                    ) : (
                      catProjects.map((proj) => {
                        const isProjSelected = selectedProjectId === proj.id;
                        const hasBudget = proj.budgetHours !== undefined && proj.budgetHours !== null;
                        const remaining = hasBudget ? (proj.budgetHours || 0) - proj.consumedHours : null;

                        return (
                          <div
                            key={proj.id}
                            onClick={() => {
                              onSelectCategory(category.id);
                              onSelectProject(proj.id);
                            }}
                            className={`p-2 rounded text-left text-xs transition-all cursor-pointer flex flex-col gap-0.5 ${
                              isProjSelected
                                ? 'bg-[#0073ea] text-white shadow-xs font-semibold'
                                : 'text-[#4b4d58] hover:bg-[#f5f6f8] hover:text-[#323338]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="truncate font-medium text-[11px]">
                                {proj.name}
                              </span>
                              {hasBudget && remaining !== null ? (
                                <span
                                  className={`text-[10px] font-mono shrink-0 ${
                                    isProjSelected
                                      ? 'text-white/80'
                                      : remaining >= 0
                                      ? 'text-[#00c875]'
                                      : 'text-[#e2445c]'
                                  }`}
                                >
                                  {remaining >= 0 ? `+${remaining}h` : `${remaining}h`}
                                </span>
                              ) : (
                                <span
                                  className={`text-[10px] font-mono shrink-0 ${
                                    isProjSelected ? 'text-white/80' : 'text-[#8b5cf6]'
                                  }`}
                                >
                                  {proj.consumedHours}h
                                </span>
                              )}
                            </div>

                            <div
                              className={`text-[10px] font-mono ${
                                isProjSelected ? 'text-white/70' : 'text-[#808294]'
                              }`}
                            >
                              {proj.code} · {proj.projectManager.split(' ')[0]}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tree Footer with Guidance */}
      <div className="p-3 border-t border-[#f0f2f7] bg-[#fcfdfe] text-[11px] text-[#808294] space-y-1 font-mono">
        <div className="flex items-center gap-1.5 text-[#323338] font-semibold">
          <Tag className="w-3.5 h-3.5 text-[#0073ea]" />
          <span>Project Status Tree</span>
        </div>
        <div>Click status or project to filter main forecast board.</div>
      </div>
    </aside>
  );
};
