import { CaseStudy, HeuristicItem } from '../types/design';

import fintechImg from '../assets/images/project_editorial_fintech_1791437503749.jpg';
import audioImg from '../assets/images/project_spatial_audio_1791437517143.jpg';
import studioImg from '../assets/images/hero_designer_studio_1791437489383.jpg';
import avatarImg from '../assets/images/avatar_principal_designer_1791437529007.jpg';

export { studioImg, avatarImg };

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'aethelgard',
    title: 'Aethelgard Wealth Terminal',
    subtitle: 'Institutional asset management workstation redesign',
    client: 'Aethelgard Capital Partners',
    year: '2025 – 2026',
    role: 'Staff Product Designer & Design Systems Lead',
    disciplines: ['Financial UX', 'Information Architecture', 'Design Systems', 'Micro-interactions'],
    heroImage: fintechImg,
    summary: 'Restructured a fragmented $4.2B multi-custody wealth management terminal into a high-density, low-latency financial workstation with zero pill clutter and 100% tabular alignment.',
    impactMetrics: [
      { label: 'Order Execution Latency', value: '-64%', context: 'Reduced operator cognitive dwell time from 14s to 5s' },
      { label: 'Trade Input Errors', value: '-82%', context: 'Eliminated catastrophic order slip with tactile confirmation' },
      { label: 'Design System Adoption', value: '100%', context: 'Unified 18 engineering pods across 4 global hubs' }
    ],
    challenge: 'Traders and portfolio managers were overwhelmed by visual noise: 40+ neon badge variations, flickering widgets, and arbitrary alert cards that obscured critical depth-of-book market movements.',
    solution: 'Designed an unboxed, monochrome-dominant interface anchored by Swiss typographical discipline, strict single-elevation containers, and high-frequency keyboard accessibility.',
    designDecisions: [
      {
        title: 'Tabular Figure Alignment',
        description: 'Enforced font-variant-numeric: tabular-nums across every numerical column, preventing jitter during 60fps tick updates.',
        principle: 'Scannability over ornament'
      },
      {
        title: 'Anti-Pill Metadata System',
        description: 'Replaced 12 colored status capsules with subtle typographic punctuation (· and /) plus accessible high-contrast icons for critical error states.',
        principle: 'Information density without friction'
      },
      {
        title: 'Two-Stage Tactile Intent Gate',
        description: 'Crafted a physical-feel slide-to-confirm interaction for eight-figure allocation rebalances, replacing jarring browser alert dialogs.',
        principle: 'Reversible safety affordances'
      }
    ],
    tokensSample: {
      primaryType: 'Instrument Serif 32px / 1.1',
      bodyType: 'Plus Jakarta Sans 14px / 1.5',
      baseUnit: '8px rhythmic grid',
      elevationLevel: 'Single hairline stroke (rgba(255,255,255,0.08))'
    }
  },
  {
    id: 'kroma-audio',
    title: 'Kroma Precision Spatial Engine',
    subtitle: 'Physical-to-digital acoustics calibration console',
    client: 'Kroma Sound Lab Zurich',
    year: '2025',
    role: 'Principal UI/UX Designer & Prototyper',
    disciplines: ['Audio Interface', 'Hardware-Software Parity', 'Tactile UI', 'Framer Motion'],
    heroImage: audioImg,
    summary: 'A sub-5ms latency visual control surface for spatial binaural mixing, marrying analog knurled hardware sensibilities with responsive WebGL spectrum visualization.',
    impactMetrics: [
      { label: 'Workflow Speed', value: '+42%', context: 'Studio sound engineers completed spatial mapping 18 min faster' },
      { label: 'Latency Budget', value: '< 6ms', context: 'GPU-accelerated compositing for ultra-responsive feedback' },
      { label: 'Soundstage Precision', value: '0.1 dB', context: 'Micro-step parameter resolution on multi-touch faders' }
    ],
    challenge: 'Audio engineers refused touchscreen software because flat digital sliders lack the tactile physical resistance, micro-detents, and spatial muscle memory of analog mixing consoles.',
    solution: 'Engineered a virtual haptic feedback paradigm using non-linear easing curves, kinetic momentum dampening, and high-contrast decibel readouts with immediate visual resonance.',
    designDecisions: [
      {
        title: 'Kinetic Dial Mechanics',
        description: 'Calibrated logarithmic rotational physics mimicking weighted CNC aluminum knobs with subtle haptic resistance thresholds.',
        principle: 'Tangible digital craftsmanship'
      },
      {
        title: 'Dynamic Luminance Scrims',
        description: 'Implemented multi-layered contrast scrims ensuring text legibility remains $\\ge$ 6.2:1 against high-luminance audio waveforms.',
        principle: 'Absolute visual accessibility'
      },
      {
        title: 'One-Row Control Contracts',
        description: 'Enforced zero horizontal clutter, reserving all toolbar interactions to single-line controls with instant shortcut triggers.',
        principle: 'Zero-latency muscle memory'
      }
    ],
    tokensSample: {
      primaryType: 'Instrument Serif 28px',
      bodyType: 'JetBrains Mono 13px (Telemetry)',
      baseUnit: '4px micro-increment',
      elevationLevel: 'Subtle ambient occlusion shadow'
    }
  },
  {
    id: 'verve-editorial',
    title: 'Verve Architectural Dispatches',
    subtitle: 'Bespoke publishing engine & longform reading environment',
    client: 'Verve Publications London',
    year: '2024 – 2025',
    role: 'Design Director & Frontend Architect',
    disciplines: ['Editorial Typography', 'Layout Geometry', 'Readability UX', 'Fluid Responsive Math'],
    heroImage: studioImg,
    summary: 'A literary journalism platform designed around reading calm: variable font optical compensation, dynamic marginalia, and zero advertising clutter.',
    impactMetrics: [
      { label: 'Average Read Depth', value: '78%', context: 'Up from 31% on legacy publishing CMS platforms' },
      { label: 'Perceived Load Time', value: '180ms', context: 'Optimized typography pipeline with zero layout shift (CLS: 0.00)' },
      { label: 'Subscriber Retention', value: '+34%', context: 'Direct reader conversion on quiet luxury memberships' }
    ],
    challenge: 'Digital editorial platforms treat prose like ad inventory, drowning long-form essays in floating newsletter modals, sticky banners, and jarring layout reflows.',
    solution: 'Created an unhurried, book-grade reading architecture inspired by classic Swiss typography, dynamic 65ch line measure, and responsive margin notes that slide into view without shifting prose.',
    designDecisions: [
      {
        title: 'Measure Lock at 68ch',
        description: 'Capped optimal line width strictly at 68 characters with 1.625 line height, drastically reducing saccadic eye fatigue.',
        principle: 'Ergonomic reading science'
      },
      {
        title: 'Optical Weight Compensation',
        description: 'Automatically shifts font optical weight by +0.02em in dark mode to prevent thin glyph bleaching on OLED displays.',
        principle: 'Surface-specific typographic physics'
      },
      {
        title: '15% Sticky Surface Governance',
        description: 'Strictly prevented headers or drawers from occupying more than 10% of viewport height during active reading scroll.',
        principle: 'Reader immersion sanctuary'
      }
    ],
    tokensSample: {
      primaryType: 'Instrument Serif 40px / 1.05',
      bodyType: 'Plus Jakarta Sans 16px / 1.65',
      baseUnit: '12px editorial rhythm',
      elevationLevel: 'Flat plane with 1px hairline dividers'
    }
  }
];

export const HEURISTIC_ITEMS: HeuristicItem[] = [
  {
    id: 'h1',
    name: 'Visibility of System Status',
    standard: 'Nielsen Heuristic #1',
    description: 'Keep users informed about what is going on through appropriate feedback within reasonable time.',
    appliedInStudio: 'Micro-interactions respond $\\le 120$ms; real-time token sliders recalculate and apply live CSS changes instantly.',
    auditPass: true
  },
  {
    id: 'h2',
    name: 'Match Between System & Real World',
    standard: 'Nielsen Heuristic #2',
    description: 'Speak users language using words, phrases, and concepts familiar to the user rather than internal jargon.',
    appliedInStudio: 'Natural editorial chapter titles, real typography scale ratios, and physical rotary feel without fake compiler tags.',
    auditPass: true
  },
  {
    id: 'h3',
    name: 'User Control & Freedom',
    standard: 'Nielsen Heuristic #3',
    description: 'Provide a clearly marked emergency exit to leave unwanted states without an extended dialogue.',
    appliedInStudio: 'Every modal, drawer, and token override features keyboard ESC dismiss, clear close affordance, and instant Reset Defaults.',
    auditPass: true
  },
  {
    id: 'h4',
    name: 'Consistency & Standards',
    standard: 'Nielsen Heuristic #4',
    description: 'Users should not have to wonder whether different words, situations, or actions mean the same thing.',
    appliedInStudio: 'Top Bar Contract strictly observed; single-elevation depth rule; identical radius math $r_{inner} = r_{outer} - padding$.',
    auditPass: true
  },
  {
    id: 'h5',
    name: 'Error Prevention & Anti-Slop',
    standard: 'Nielsen Heuristic #5',
    description: 'Carefully prevent problems from occurring in the first place, with clear constraints and confirmations.',
    appliedInStudio: 'Zero pill metadata discipline; ban on floating fake telemetry tickers; strict 60-30-10 color math.',
    auditPass: true
  },
  {
    id: 'h6',
    name: 'Recognition Rather Than Recall',
    standard: 'Nielsen Heuristic #6',
    description: 'Minimize user memory load by making elements, actions, and options visible and contextual.',
    appliedInStudio: 'Live visual previews for type scales, contrast ratios, and layout switches with real sample content.',
    auditPass: true
  },
  {
    id: 'h7',
    name: 'Flexibility & Efficiency of Use',
    standard: 'Nielsen Heuristic #7',
    description: 'Accelerators unseen by novice users that speed up interaction for experts.',
    appliedInStudio: 'One-click token export in JSON/CSS/Tailwind formats; keyboard-driven navigation; fast copy actions.',
    auditPass: true
  },
  {
    id: 'h8',
    name: 'Aesthetic & Minimalist Design',
    standard: 'Nielsen Heuristic #8',
    description: 'Interfaces should not contain information that is irrelevant or rarely needed.',
    appliedInStudio: 'Zero decorative line icons; uncluttered typography; measured whitespace rhythm between sections.',
    auditPass: true
  }
];
