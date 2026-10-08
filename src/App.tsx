import React, { useState } from 'react';
import {
  WPXWorkspace,
  ProjectCategory,
  WPXPerson,
  Project,
  ShiftType,
} from './types/resourceForecast';
import {
  INITIAL_WORKSPACES,
  INITIAL_CATEGORIES,
  WPX_PERSONNEL_POOL,
  INITIAL_PROJECTS,
} from './data/mockForecastData';
import { MondayHeader } from './components/monday/MondayHeader';
import { CategoryTreeSidebar } from './components/monday/CategoryTreeSidebar';
import { MondayGroupTable } from './components/monday/MondayGroupTable';
import { AssignPersonModal } from './components/forecast/AssignPersonModal';
import { ProjectNotesModal } from './components/forecast/ProjectNotesModal';
import { CategoryManagerModal } from './components/forecast/CategoryManagerModal';
import { EditForecastModal } from './components/forecast/EditForecastModal';

export default function App() {
  // Core state loaded from WPX ecosystem
  const [workspaces] = useState<WPXWorkspace[]>(INITIAL_WORKSPACES);
  const [activeWorkspace, setActiveWorkspace] = useState<WPXWorkspace>(INITIAL_WORKSPACES[0]);
  const [categories, setCategories] = useState<ProjectCategory[]>(INITIAL_CATEGORIES);
  const [personnel] = useState<WPXPerson[]>(WPX_PERSONNEL_POOL);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  
  // Date horizon state (e.g. Wed Oct 8)
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-08');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersonFilter, setSelectedPersonFilter] = useState('all');

  // Category Tree Selection Filter
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Active Modals
  const [editForecastModalData, setEditForecastModalData] = useState<{
    project: Project;
    date: string;
    initialShift?: 'both' | 'day' | 'night';
  } | null>(null);
  const [assignModalData, setAssignModalData] = useState<{
    project: Project;
    shiftType: ShiftType;
    date: string;
  } | null>(null);
  const [notesModalProject, setNotesModalProject] = useState<Project | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter projects for selected WPX workspace + search filter + attendee filter + category tree filter
  const currentWorkspaceProjects = projects.filter((p) => {
    if (p.workspaceId !== activeWorkspace.id) return false;

    // Tree Category Filter
    if (selectedCategoryId && p.categoryId !== selectedCategoryId) {
      return false;
    }

    // Tree Project Filter
    if (selectedProjectId && p.id !== selectedProjectId) {
      return false;
    }

    // Search query
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.projectManager.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Person filter
    if (selectedPersonFilter !== 'all') {
      const plan = p.schedule[selectedDate];
      const hasPersonInDay = plan?.dayShift?.assignedPeople?.some(
        (a) => a.personId === selectedPersonFilter
      );
      const hasPersonInNight = plan?.nightShift?.assignedPeople?.some(
        (a) => a.personId === selectedPersonFilter
      );
      if (!hasPersonInDay && !hasPersonInNight) return false;
    }

    return true;
  });

  // Categories to render on the main board (either all or filtered by tree selection)
  const displayedCategories = selectedCategoryId
    ? categories.filter((c) => c.id === selectedCategoryId)
    : categories;

  // 1. Enter Budget Hours for Live Projects (as required by PRD)
  const handleUpdateBudget = (projectId: string, newBudget: number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, budgetHours: newBudget } : p))
    );
    showToast(`Updated budget hours to ${newBudget.toLocaleString()}h`);
  };

  // 1b. Update Variation Hours
  const handleUpdateVariation = (projectId: string, newVariation: number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, variationHours: newVariation } : p))
    );
    showToast(`Updated variation hours to ${newVariation.toLocaleString()}h`);
  };

  // 1c. Edit People allocation on Day/Night Shifts (PRD Section 10 & 20: Consumed Hours = People × 8h)
  const handleSaveForecast = (
    projectId: string,
    date: string,
    dayCount: number,
    nightCount: number,
    noteText?: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;

        const currentSchedule = { ...p.schedule };
        const oldPlan = currentSchedule[date];
        const oldDayHours = (oldPlan?.dayShift?.assignedPeople?.length || 0) * 8;
        const oldNightHours = (oldPlan?.nightShift?.assignedPeople?.length || 0) * 8;
        const oldTotalShiftHours = oldDayHours + oldNightHours;

        // Create new daily shift plan with standard 8h per person allocations
        const newDayPeople = Array.from({ length: dayCount }, (_, idx) => ({
          personId: `p-${(idx % 10) + 1}`,
          hours: 8,
        }));
        const newNightPeople = Array.from({ length: nightCount }, (_, idx) => ({
          personId: `p-${((idx + 5) % 10) + 1}`,
          hours: 8,
        }));

        currentSchedule[date] = {
          date,
          dayShift: { assignedPeople: newDayPeople },
          nightShift: { assignedPeople: newNightPeople },
          notes: noteText,
        };

        const newDayHours = dayCount * 8;
        const newNightHours = nightCount * 8;
        const newTotalShiftHours = newDayHours + newNightHours;
        const hoursDelta = newTotalShiftHours - oldTotalShiftHours;

        // Add note if provided (newest note appears first as required by PRD Section 16)
        let updatedNotes = p.notes;
        if (noteText) {
          const newNote = {
            id: `n-${Date.now()}`,
            projectId: p.id,
            author: 'Marcus Vance',
            role: 'Site Attendee',
            timestamp: 'Today',
            content: noteText,
            type: 'shift' as const,
          };
          updatedNotes = [newNote, ...p.notes];
        }

        return {
          ...p,
          schedule: currentSchedule,
          consumedHours: Math.max(0, p.consumedHours + hoursDelta),
          notes: updatedNotes,
        };
      })
    );

    showToast(`Saved forecast for ${date}: Day ${dayCount}p (${dayCount * 8}h), Night ${nightCount}p (${nightCount * 8}h)`);
  };

  // 2. Plan People against Projects on Day/Night Shifts (as required by PRD)
  const handleAssignPerson = (personId: string, hours: number) => {
    if (!assignModalData) return;
    const { project, shiftType, date } = assignModalData;

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== project.id) return p;

        const currentSchedule = { ...p.schedule };
        const dayPlan = currentSchedule[date] || {
          date,
          dayShift: { assignedPeople: [] },
          nightShift: { assignedPeople: [] },
        };

        if (shiftType === 'day') {
          dayPlan.dayShift = {
            ...dayPlan.dayShift,
            assignedPeople: [
              ...(dayPlan.dayShift?.assignedPeople || []),
              { personId, hours },
            ],
          };
        } else {
          dayPlan.nightShift = {
            ...dayPlan.nightShift,
            assignedPeople: [
              ...(dayPlan.nightShift?.assignedPeople || []),
              { personId, hours },
            ],
          };
        }

        currentSchedule[date] = dayPlan;

        return {
          ...p,
          schedule: currentSchedule,
          consumedHours: p.consumedHours + hours,
        };
      })
    );

    setAssignModalData(null);
    showToast(`Assigned attendee to ${shiftType} shift (${hours}h).`);
  };

  // 3. Remove Person from Shift
  const handleRemovePersonFromShift = (
    projectId: string,
    date: string,
    shiftType: ShiftType,
    personId: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;

        const currentSchedule = { ...p.schedule };
        const dayPlan = currentSchedule[date];
        if (!dayPlan) return p;

        let hoursRemoved = 0;

        if (shiftType === 'day' && dayPlan.dayShift?.assignedPeople) {
          const target = dayPlan.dayShift.assignedPeople.find((a) => a.personId === personId);
          hoursRemoved = target?.hours || 0;
          dayPlan.dayShift.assignedPeople = dayPlan.dayShift.assignedPeople.filter(
            (a) => a.personId !== personId
          );
        } else if (shiftType === 'night' && dayPlan.nightShift?.assignedPeople) {
          const target = dayPlan.nightShift.assignedPeople.find((a) => a.personId === personId);
          hoursRemoved = target?.hours || 0;
          dayPlan.nightShift.assignedPeople = dayPlan.nightShift.assignedPeople.filter(
            (a) => a.personId !== personId
          );
        }

        return {
          ...p,
          schedule: currentSchedule,
          consumedHours: Math.max(0, p.consumedHours - hoursRemoved),
        };
      })
    );
  };

  // 4. Low-Click Duplicate Shifts to Next Day
  const handleDuplicateShiftToNextDay = (projectId: string, date: string) => {
    const nextDates: Record<string, string> = {
      '2026-10-08': '2026-10-09',
      '2026-10-09': '2026-10-10',
      '2026-10-10': '2026-10-11',
      '2026-10-11': '2026-10-12',
    };
    const nextDate = nextDates[date];
    if (!nextDate) {
      showToast('Reached final scheduling horizon date.');
      return;
    }

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const sourceDayPlan = p.schedule[date];
        if (!sourceDayPlan) return p;

        const currentSchedule = { ...p.schedule };
        currentSchedule[nextDate] = JSON.parse(JSON.stringify(sourceDayPlan));
        currentSchedule[nextDate].date = nextDate;

        const dayHours =
          sourceDayPlan.dayShift?.assignedPeople?.reduce((acc, a) => acc + a.hours, 0) || 0;
        const nightHours =
          sourceDayPlan.nightShift?.assignedPeople?.reduce((acc, a) => acc + a.hours, 0) || 0;

        return {
          ...p,
          schedule: currentSchedule,
          consumedHours: p.consumedHours + dayHours + nightHours,
        };
      })
    );

    showToast(`Cloned shift roster to ${nextDate}!`);
  };

  // 5. Add Forecast Note
  const handleAddNote = (
    projectId: string,
    note: { author: string; role: string; content: string; type: any }
  ) => {
    const newNote = {
      ...note,
      id: `n-${Date.now()}`,
      projectId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, notes: [newNote, ...p.notes] } : p
      )
    );
    showToast('Appended note to project record.');
  };

  // 6. Manage Categories (as required by PRD)
  const handleAddCategory = (catData: Omit<ProjectCategory, 'id' | 'isSystem'>) => {
    const newCat: ProjectCategory = {
      ...catData,
      id: `cat-${Date.now()}`,
      isSystem: false,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Registered new status: ${newCat.name}`);
  };

  // Aggregate workspace metrics for header
  const totalBudget = currentWorkspaceProjects.reduce(
    (acc, p) => acc + (p.budgetHours || 0) + (p.variationHours || 0),
    0
  );
  const totalConsumed = currentWorkspaceProjects.reduce(
    (acc, p) => acc + (p.consumedHours || 0),
    0
  );
  const totalRemaining = totalBudget - totalConsumed;

  let dayHeadcount = 0;
  let nightHeadcount = 0;
  currentWorkspaceProjects.forEach((proj) => {
    const plan = proj.schedule[selectedDate];
    if (plan) {
      dayHeadcount += plan.dayShift?.assignedPeople?.length || 0;
      nightHeadcount += plan.nightShift?.assignedPeople?.length || 0;
    }
  });

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#323338] font-sans flex flex-col selection:bg-[#0073ea] selection:text-white">
      
      {/* Clean Top Header with integrated KPI metrics (Budget, Consumed, Remaining, Shift Roster) */}
      <MondayHeader
        workspace={activeWorkspace}
        workspaces={workspaces}
        onSelectWorkspace={(ws) => {
          setActiveWorkspace(ws);
          setSelectedCategoryId(null);
          setSelectedProjectId(null);
          showToast(`Switched workspace to: ${ws.name}`);
        }}
        totalBudget={totalBudget}
        totalConsumed={totalConsumed}
        totalRemaining={totalRemaining}
        dayHeadcount={dayHeadcount}
        nightHeadcount={nightHeadcount}
        selectedDate={selectedDate}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Layout: Left Category Tree Sidebar + Right Forecast Board */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Category Tree with (+) icon at top as requested */}
        <CategoryTreeSidebar
          workspace={activeWorkspace}
          workspaces={workspaces}
          onSelectWorkspace={(ws) => {
            setActiveWorkspace(ws);
            setSelectedCategoryId(null);
            setSelectedProjectId(null);
            showToast(`Switched workspace to: ${ws.name}`);
          }}
          categories={categories}
          projects={projects.filter((p) => p.workspaceId === activeWorkspace.id)}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(catId) => {
            setSelectedCategoryId(catId);
            setSelectedProjectId(null);
          }}
          selectedProjectId={selectedProjectId}
          onSelectProject={(projId) => {
            setSelectedProjectId(projId);
          }}
          onOpenAddCategory={() => setCategoryModalOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Right Side: Main Clean Workspace Forecast Board */}
        <main className="flex-1 p-6 overflow-y-auto w-full space-y-6">
          {/* Active Filter Indicator if filtered by Category Tree */}
          {(selectedCategoryId || selectedProjectId) && (
            <div className="bg-white border border-[#b2d9fc] px-4 py-2 rounded-lg flex items-center justify-between text-xs shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#0073ea]">Active Filter:</span>
                {selectedCategoryId && (
                  <span className="bg-[#f0f7ff] text-[#0073ea] font-medium px-2 py-0.5 rounded border border-[#b2d9fc]">
                    Status: {categories.find((c) => c.id === selectedCategoryId)?.name}
                  </span>
                )}
                {selectedProjectId && (
                  <span className="bg-[#f0f7ff] text-[#0073ea] font-medium px-2 py-0.5 rounded border border-[#b2d9fc]">
                    Project: {projects.find((p) => p.id === selectedProjectId)?.name}
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedCategoryId(null);
                  setSelectedProjectId(null);
                }}
                className="text-xs text-[#676879] hover:text-[#0073ea] underline cursor-pointer"
              >
                Clear Filter (View All)
              </button>
            </div>
          )}

          <MondayGroupTable
            projects={currentWorkspaceProjects}
            categories={displayedCategories}
            personnelPool={personnel}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onOpenEditForecast={(proj, dt, shift) =>
              setEditForecastModalData({ project: proj, date: dt, initialShift: shift })
            }
            onOpenNotes={(proj) => setNotesModalProject(proj)}
            onUpdateBudget={handleUpdateBudget}
            onUpdateVariation={handleUpdateVariation}
            onDuplicateShiftToNextDay={handleDuplicateShiftToNextDay}
          />
        </main>

      </div>

      {/* Floating Fast Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#323338] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom duration-150">
          <span className="w-2 h-2 rounded-full bg-[#00c875]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Edit Forecast Modal (PRD Section 10 & 20: Stepper for Day & Night People -> Calculates Consumed Hours) */}
      {editForecastModalData && (
        <EditForecastModal
          isOpen={true}
          onClose={() => setEditForecastModalData(null)}
          project={editForecastModalData.project}
          date={editForecastModalData.date}
          initialShift={editForecastModalData.initialShift}
          onSave={handleSaveForecast}
        />
      )}

      {/* Assign Personnel Modal */}
      {assignModalData && (
        <AssignPersonModal
          isOpen={true}
          onClose={() => setAssignModalData(null)}
          project={assignModalData.project}
          shiftType={assignModalData.shiftType}
          date={assignModalData.date}
          availablePersonnel={personnel}
          alreadyAssignedIds={
            assignModalData.shiftType === 'day'
              ? assignModalData.project.schedule[assignModalData.date]?.dayShift
                  ?.assignedPeople?.map((a) => a.personId) || []
              : assignModalData.project.schedule[assignModalData.date]?.nightShift
                  ?.assignedPeople?.map((a) => a.personId) || []
          }
          onAssign={handleAssignPerson}
        />
      )}

      {/* Project Notes Modal */}
      {notesModalProject && (
        <ProjectNotesModal
          isOpen={true}
          onClose={() => setNotesModalProject(null)}
          project={notesModalProject}
          onAddNote={handleAddNote}
        />
      )}

      {/* Category Manager Modal (Opened by clicking the (+) icon at top of left sidebar) */}
      <CategoryManagerModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
      />

      {/* Clean Bottom Status Bar */}
      <footer className="bg-white border-t border-[#e6e9ef] py-2.5 px-6 text-xs text-[#808294] font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#0073ea]">WPX Ecosystem</span>
          <span>·</span>
          <span>Resource Forecast</span>
          <span>·</span>
          <span>Projects Ingested from WPX (Zero Write-Back)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00c875]" />
          <span className="text-[#323338]">Directory Synced</span>
        </div>
      </footer>

    </div>
  );
}
