export type ShiftType = 'day' | 'night';

export interface WPXWorkspace {
  id: string;
  name: string;
  code: string;
  region: string;
  projectCount: number;
  totalPersonnel: number;
  lastWpxSync: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  description: string;
  isSystem: boolean; // Live Project, Post Tender are default
  color: string;
}

export interface WPXPerson {
  id: string;
  name: string;
  role: string;
  wpxUserId: string;
  trade: string;
  preferredShift: ShiftType;
  availableHoursPerDay: number;
  siteBadgeNumber: string;
}

export interface ForecastNote {
  id: string;
  projectId: string;
  author: string;
  role: string;
  timestamp: string;
  content: string;
  type: 'shift' | 'budget' | 'risk' | 'general';
}

export interface DailyShiftPlan {
  date: string; // YYYY-MM-DD
  dayShift: {
    assignedPeople: { personId: string; hours: number }[];
    shiftLeadId?: string;
  };
  nightShift: {
    assignedPeople: { personId: string; hours: number }[];
    shiftLeadId?: string;
  };
  notes?: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  categoryId: string;
  code: string;
  name: string;
  builder: string; // e.g. 'CPB Contractors', 'Multiplex', 'Lendlease'
  projectManager: string; // Site contact name
  siteContactPhone?: string; // Phone from WPX Project Register
  siteContactEmail?: string; // Email from WPX Project Register
  budgetHours?: number; // Configurable manually in Resource Forecast for Live Projects
  variationHours?: number; // Variation Hours
  consumedHours: number; // Sum of People × 8h (calculated, never manually entered)
  startDate: string;
  targetCompletionDate: string;
  schedule: Record<string, DailyShiftPlan>; // keyed by date (e.g. '2026-10-08')
  notes: ForecastNote[];
}

export interface ForecastSnapshot {
  id: string;
  workspaceId: string;
  version: string;
  createdAt: string;
  createdBy: string;
  summary: string;
  totalBudget: number;
  totalConsumed: number;
  totalRemaining: number;
  projectCount: number;
  projectsState: Project[];
}
