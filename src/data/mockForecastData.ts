import { WPXWorkspace, ProjectCategory, WPXPerson, Project, ForecastSnapshot } from '../types/resourceForecast';

export const INITIAL_WORKSPACES: WPXWorkspace[] = [
  {
    id: 'ws-metro-4a',
    name: 'Metro Rail Station Box (Package 4A)',
    code: 'WPX-MR-4A',
    region: 'Metropolitan Central',
    projectCount: 4,
    totalPersonnel: 38,
    lastWpxSync: 'Today, 08:30 AM',
  },
  {
    id: 'ws-north-port',
    name: 'North Port Maritime Terminal & Berths',
    code: 'WPX-NP-02',
    region: 'Eastern Seaboard',
    projectCount: 3,
    totalPersonnel: 26,
    lastWpxSync: 'Today, 07:15 AM',
  },
  {
    id: 'ws-energy-grid',
    name: 'High-Voltage Renewable Substation Phase 1',
    code: 'WPX-HV-09',
    region: 'Western Corridor',
    projectCount: 2,
    totalPersonnel: 19,
    lastWpxSync: 'Yesterday, 18:00 PM',
  },
];

export const INITIAL_CATEGORIES: ProjectCategory[] = [
  {
    id: 'cat-live',
    name: 'Live Project',
    description: 'Active contracted construction works with dedicated hour budgets and site personnel.',
    isSystem: true,
    color: '#3b82f6', // blue
  },
  {
    id: 'cat-post-tender',
    name: 'Post Tender',
    description: 'Awarded contracts in mobilization, procurement, and site establishment stage.',
    isSystem: true,
    color: '#8b5cf6', // purple
  },
  {
    id: 'cat-pre-con',
    name: 'Pre-Construction',
    description: 'Design finalization, site access permits, and early utility diversions.',
    isSystem: false,
    color: '#f59e0b', // amber
  },
  {
    id: 'cat-tender',
    name: 'Tender & Bidding',
    description: 'Estimating and resource staging prior to contractual commercial close.',
    isSystem: false,
    color: '#10b981', // emerald
  },
];

export const WPX_PERSONNEL_POOL: WPXPerson[] = [
  { id: 'p-1', name: 'Marcus Vance', role: 'Senior Site Superintendent', trade: 'Civil Management', preferredShift: 'day', availableHoursPerDay: 10, siteBadgeNumber: 'WPX-8801', wpxUserId: 'u_mvance' },
  { id: 'p-2', name: 'Elena Rostova', role: 'Night Shift Shift Boss', trade: 'Excavation & Tunneling', preferredShift: 'night', availableHoursPerDay: 10, siteBadgeNumber: 'WPX-8802', wpxUserId: 'u_erostova' },
  { id: 'p-3', name: 'Liam Davies', role: 'Lead Structural Engineer', trade: 'Structural Engineering', preferredShift: 'day', availableHoursPerDay: 8, siteBadgeNumber: 'WPX-8803', wpxUserId: 'u_ldavies' },
  { id: 'p-4', name: 'Siddharth Patel', role: 'Plant & Heavy Crane Operator', trade: 'Rigging & Heavy Lift', preferredShift: 'day', availableHoursPerDay: 10, siteBadgeNumber: 'WPX-8804', wpxUserId: 'u_spatel' },
  { id: 'p-5', name: 'Zoe Chen', role: 'Night Concrete Foreman', trade: 'Pours & Slipform', preferredShift: 'night', availableHoursPerDay: 10, siteBadgeNumber: 'WPX-8805', wpxUserId: 'u_zchen' },
  { id: 'p-6', name: 'Tariq Al-Mansoor', role: 'Electrical Services Supervisor', trade: 'High Voltage / MEP', preferredShift: 'day', availableHoursPerDay: 8, siteBadgeNumber: 'WPX-8806', wpxUserId: 'u_talmansoor' },
  { id: 'p-7', name: 'Chloe Dubois', role: 'Quality & Invariants Inspector', trade: 'QA/QC Compliance', preferredShift: 'day', availableHoursPerDay: 8, siteBadgeNumber: 'WPX-8807', wpxUserId: 'u_cdubois' },
  { id: 'p-8', name: 'Brendan O’Connor', role: 'Night Safety Lead', trade: 'HSE Coordinator', preferredShift: 'night', availableHoursPerDay: 10, siteBadgeNumber: 'WPX-8808', wpxUserId: 'u_boconnor' },
  { id: 'p-9', name: 'Ananya Roy', role: 'Survey & Geomatics Lead', trade: 'Laser Scanning & Survey', preferredShift: 'day', availableHoursPerDay: 8, siteBadgeNumber: 'WPX-8809', wpxUserId: 'u_aroy' },
  { id: 'p-10', name: 'Mateo Morales', role: 'Piling & Shoring Specialist', trade: 'Geotechnical Civils', preferredShift: 'night', availableHoursPerDay: 10, siteBadgeNumber: 'WPX-8810', wpxUserId: 'u_mmorales' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    workspaceId: 'ws-metro-4a',
    categoryId: 'cat-live',
    code: 'MR-LIVE-01',
    name: 'Station Cavern Deep Excavation & Piling',
    builder: 'CPB Contractors',
    projectManager: 'Marcus Vance',
    siteContactPhone: '+44 7911 123456',
    siteContactEmail: 'marcus.vance@cpbcontractors.com',
    budgetHours: 5200, // PRD State 1: 5,200h budget, 1,940h consumed, 3,260h remaining
    variationHours: 0,
    consumedHours: 1940,
    startDate: '2026-08-01',
    targetCompletionDate: '2026-12-15',
    schedule: {
      '2026-10-08': {
        date: '2026-10-08',
        dayShift: {
          assignedPeople: [
            { personId: 'p-1', hours: 8 },
            { personId: 'p-4', hours: 8 },
            { personId: 'p-9', hours: 8 },
          ], // 3 People = 24h
          shiftLeadId: 'p-1'
        },
        nightShift: {
          assignedPeople: [
            { personId: 'p-2', hours: 8 },
            { personId: 'p-10', hours: 8 },
            { personId: 'p-8', hours: 8 },
          ], // 3 People = 24h
          shiftLeadId: 'p-2'
        },
        notes: 'Need additional night crew from Thursday.'
      },
      '2026-10-09': {
        date: '2026-10-09',
        dayShift: {
          assignedPeople: [
            { personId: 'p-1', hours: 8 },
            { personId: 'p-4', hours: 8 },
            { personId: 'p-3', hours: 8 },
          ], // 3 People = 24h
        },
        nightShift: {
          assignedPeople: [
            { personId: 'p-2', hours: 8 },
            { personId: 'p-10', hours: 8 },
          ], // 2 People = 16h
        }
      },
      '2026-10-10': {
        date: '2026-10-10',
        dayShift: {
          assignedPeople: [
            { personId: 'p-4', hours: 8 },
            { personId: 'p-9', hours: 8 },
          ], // 2 People = 16h
        },
        nightShift: {
          assignedPeople: [
            { personId: 'p-5', hours: 8 },
            { personId: 'p-8', hours: 8 },
          ], // 2 People = 16h
        }
      }
    },
    notes: [
      {
        id: 'n-1',
        projectId: 'proj-1',
        author: 'Marcus Vance',
        role: 'Site Attendee',
        timestamp: 'Today',
        content: 'Need additional night crew from Thursday.',
        type: 'shift'
      },
      {
        id: 'n-2',
        projectId: 'proj-1',
        author: 'Liam Davies',
        role: 'Structural Lead',
        timestamp: 'Yesterday',
        content: 'Site access confirmed.',
        type: 'general'
      },
      {
        id: 'n-3',
        projectId: 'proj-1',
        author: 'Marcus Vance',
        role: 'Site Attendee',
        timestamp: 'Oct 5',
        content: 'Awaiting excavation sequence confirmation.',
        type: 'shift'
      }
    ]
  },
  {
    id: 'proj-2',
    workspaceId: 'ws-metro-4a',
    categoryId: 'cat-live',
    code: 'MR-LIVE-02',
    name: 'North Tunnel Portal Slipform Wall Pouring',
    builder: 'Multiplex',
    projectManager: 'Elena Rostova',
    siteContactPhone: '+44 7922 234567',
    siteContactEmail: 'elena.rostova@multiplex.global',
    budgetHours: 5200, // PRD State 3: Over budget condition (5,200h budget, 5,400h consumed, -200h remaining)
    variationHours: 0,
    consumedHours: 5400,
    startDate: '2026-09-01',
    targetCompletionDate: '2027-01-20',
    schedule: {
      '2026-10-08': {
        date: '2026-10-08',
        dayShift: {
          assignedPeople: [
            { personId: 'p-3', hours: 8 },
            { personId: 'p-7', hours: 8 },
          ], // 2 People = 16h
        },
        nightShift: {
          assignedPeople: [
            { personId: 'p-5', hours: 8 },
          ], // 1 Person = 8h
        }
      },
      '2026-10-09': {
        date: '2026-10-09',
        dayShift: {
          assignedPeople: [
            { personId: 'p-7', hours: 8 },
          ],
        },
        nightShift: {
          assignedPeople: [
            { personId: 'p-5', hours: 8 },
          ],
        }
      }
    },
    notes: [
      {
        id: 'n-4',
        projectId: 'proj-2',
        author: 'Elena Rostova',
        role: 'Site Attendee',
        timestamp: 'Today',
        content: 'Concrete slipform curing delayed due to ambient moisture; required additional overtime crew.',
        type: 'shift'
      }
    ]
  },
  {
    id: 'proj-3',
    workspaceId: 'ws-metro-4a',
    categoryId: 'cat-post-tender',
    code: 'MR-POST-01',
    name: 'Sub-Surface MEP Routing & Ventilation Shafts',
    builder: 'Lendlease',
    projectManager: 'Tariq Al-Mansoor',
    siteContactPhone: '+44 7933 345678',
    siteContactEmail: 'tariq.almansoor@lendlease.com',
    // Per PRD Section 14: Post Tender does NOT require Budget Hours. No budget requirement.
    consumedHours: 24, // 2 People day (16h) + 1 Person night (8h) = 24h
    startDate: '2026-10-15',
    targetCompletionDate: '2027-03-30',
    schedule: {
      '2026-10-08': {
        date: '2026-10-08',
        dayShift: {
          assignedPeople: [
            { personId: 'p-6', hours: 8 },
            { personId: 'p-9', hours: 8 },
          ], // PRD example: 2 People = 16h
        },
        nightShift: {
          assignedPeople: [
            { personId: 'p-10', hours: 8 },
          ], // PRD example: 1 Person = 8h
        }
      }
    },
    notes: [
      {
        id: 'n-5',
        projectId: 'proj-3',
        author: 'Tariq Al-Mansoor',
        role: 'Site Attendee',
        timestamp: 'Oct 6',
        content: 'Mobilization stage underway. Long-lead ventilation fans scheduled for arrival in Nov.',
        type: 'general'
      }
    ]
  },
  {
    id: 'proj-4',
    workspaceId: 'ws-metro-4a',
    categoryId: 'cat-pre-con',
    code: 'MR-PRE-01',
    name: 'Pedestrian Overpass Utility Diversion & Pavement Staging',
    builder: 'John Holland',
    projectManager: 'Chloe Dubois',
    siteContactPhone: '+44 7944 456789',
    siteContactEmail: 'chloe.dubois@johnholland.com',
    budgetHours: 900,
    consumedHours: 96,
    startDate: '2026-11-01',
    targetCompletionDate: '2027-02-15',
    schedule: {}, // State 8: No forecast entered for this date
    notes: []
  }
];

export const INITIAL_SNAPSHOTS: ForecastSnapshot[] = [
  {
    id: 'snap-v1.2',
    workspaceId: 'ws-metro-4a',
    version: 'v1.2 - Week 41 Baseline',
    createdAt: '2026-10-06 17:00',
    createdBy: 'Marcus Vance',
    summary: 'Adjusted night shift allocation for Cavern Piling to absorb 48h water pump contingency.',
    totalBudget: 8350,
    totalConsumed: 3435,
    totalRemaining: 4915,
    projectCount: 4,
    projectsState: JSON.parse(JSON.stringify(INITIAL_PROJECTS))
  },
  {
    id: 'snap-v1.1',
    workspaceId: 'ws-metro-4a',
    version: 'v1.1 - Mobilization Signoff',
    createdAt: '2026-09-28 16:30',
    createdBy: 'Liam Davies',
    summary: 'Initial project category establishment and live budget sign-off from WPX project director.',
    totalBudget: 7450,
    totalConsumed: 2200,
    totalRemaining: 5250,
    projectCount: 3,
    projectsState: JSON.parse(JSON.stringify(INITIAL_PROJECTS.slice(0, 3)))
  }
];
