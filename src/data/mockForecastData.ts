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

// Helper to build a fortnight schedule map from Oct 12 to Oct 25 (and Oct 8-11)
function buildFortnightSchedule(pattern: {
  dayBase: number;
  nightBase: number;
  dayPersonnel: string[];
  nightPersonnel: string[];
  noteDays?: Record<string, string>;
}) {
  const dates = [
    '2026-10-08', '2026-10-09', '2026-10-10', '2026-10-11',
    '2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16',
    '2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21',
    '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25'
  ];

  const schedule: Record<string, any> = {};

  dates.forEach((date, i) => {
    // slight variation on weekend
    const isWeekend = i % 7 === 2 || i % 7 === 3;
    const dayCount = isWeekend ? Math.max(1, pattern.dayBase - 1) : pattern.dayBase + (i % 2 === 0 ? 0 : 1);
    const nightCount = isWeekend ? Math.max(0, pattern.nightBase - 1) : pattern.nightBase;

    schedule[date] = {
      date,
      dayShift: {
        assignedPeople: pattern.dayPersonnel.slice(0, dayCount).map(pId => ({ personId: pId, hours: 8 })),
        shiftLeadId: pattern.dayPersonnel[0]
      },
      nightShift: {
        assignedPeople: pattern.nightPersonnel.slice(0, nightCount).map(pId => ({ personId: pId, hours: 8 })),
        shiftLeadId: pattern.nightPersonnel[0]
      },
      notes: pattern.noteDays?.[date]
    };
  });

  return schedule;
}

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
    schedule: buildFortnightSchedule({
      dayBase: 3,
      nightBase: 2,
      dayPersonnel: ['p-1', 'p-4', 'p-9', 'p-3'],
      nightPersonnel: ['p-2', 'p-10', 'p-8'],
      noteDays: {
        '2026-10-08': 'Need additional night crew from Thursday.',
        '2026-10-12': 'Heavy crane staged at South Gate. Daylight lift only.',
        '2026-10-15': 'Shaft 2 geotechnical survey approved.',
        '2026-10-20': 'Night pour scheduled for 23:00.',
      }
    }),
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
    schedule: buildFortnightSchedule({
      dayBase: 2,
      nightBase: 2,
      dayPersonnel: ['p-3', 'p-7', 'p-6'],
      nightPersonnel: ['p-5', 'p-8', 'p-10'],
      noteDays: {
        '2026-10-08': 'Concrete slipform curing delayed due to ambient moisture; required additional overtime crew.',
        '2026-10-13': 'Over budget alert review with commercial lead.',
      }
    }),
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
    schedule: buildFortnightSchedule({
      dayBase: 2,
      nightBase: 1,
      dayPersonnel: ['p-6', 'p-9'],
      nightPersonnel: ['p-10'],
      noteDays: {
        '2026-10-08': 'Mobilization stage underway. Long-lead ventilation fans scheduled for arrival in Nov.',
        '2026-10-14': 'Early contractor involvement walk-through completed.'
      }
    }),
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
    variationHours: 0,
    consumedHours: 96,
    startDate: '2026-11-01',
    targetCompletionDate: '2027-02-15',
    schedule: buildFortnightSchedule({
      dayBase: 1,
      nightBase: 0,
      dayPersonnel: ['p-7', 'p-9'],
      nightPersonnel: [],
      noteDays: {
        '2026-10-16': 'Council traffic closure permit approved for weekend work.'
      }
    }),
    notes: [
      {
        id: 'n-6',
        projectId: 'proj-4',
        author: 'Chloe Dubois',
        role: 'QA Inspector',
        timestamp: 'Oct 7',
        content: 'Traffic permit lodged with city council.',
        type: 'general'
      }
    ]
  },
  // Projects for North Port workspace
  {
    id: 'proj-np-1',
    workspaceId: 'ws-north-port',
    categoryId: 'cat-live',
    code: 'NP-LIVE-01',
    name: 'Wharf Berth 4 Structural Deck Reconstruction',
    builder: 'McConnell Dowell',
    projectManager: 'Brendan O’Connor',
    siteContactPhone: '+44 7955 567890',
    siteContactEmail: 'brendan.oconnor@mcdgroup.com',
    budgetHours: 4200,
    variationHours: 200,
    consumedHours: 1800,
    startDate: '2026-07-15',
    targetCompletionDate: '2026-11-30',
    schedule: buildFortnightSchedule({
      dayBase: 3,
      nightBase: 1,
      dayPersonnel: ['p-1', 'p-4', 'p-8'],
      nightPersonnel: ['p-10'],
    }),
    notes: []
  },
  {
    id: 'proj-np-2',
    workspaceId: 'ws-north-port',
    categoryId: 'cat-post-tender',
    code: 'NP-POST-01',
    name: 'Harbor Basin Dredging & Silt Barrier Staging',
    builder: 'Van Oord Marine',
    projectManager: 'Mateo Morales',
    siteContactPhone: '+44 7966 678901',
    siteContactEmail: 'mateo.morales@vanoord.com',
    consumedHours: 48,
    startDate: '2026-10-20',
    targetCompletionDate: '2027-04-15',
    schedule: buildFortnightSchedule({
      dayBase: 2,
      nightBase: 0,
      dayPersonnel: ['p-3', 'p-9'],
      nightPersonnel: [],
    }),
    notes: []
  },
  // Projects for Renewable Grid workspace
  {
    id: 'proj-eg-1',
    workspaceId: 'ws-energy-grid',
    categoryId: 'cat-live',
    code: 'EG-LIVE-01',
    name: '500kV Transformer Foundation & Bund Wall Enclosure',
    builder: 'Downer EDI',
    projectManager: 'Siddharth Patel',
    siteContactPhone: '+44 7977 789012',
    siteContactEmail: 'siddharth.patel@downergroup.com',
    budgetHours: 3600,
    variationHours: 0,
    consumedHours: 1250,
    startDate: '2026-06-01',
    targetCompletionDate: '2026-12-01',
    schedule: buildFortnightSchedule({
      dayBase: 2,
      nightBase: 1,
      dayPersonnel: ['p-4', 'p-6'],
      nightPersonnel: ['p-5'],
    }),
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
    projectsState: JSON.parse(JSON.stringify(INITIAL_PROJECTS.filter(p => p.workspaceId === 'ws-metro-4a')))
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
    projectsState: JSON.parse(JSON.stringify(INITIAL_PROJECTS.filter(p => p.workspaceId === 'ws-metro-4a').slice(0, 3)))
  }
];
