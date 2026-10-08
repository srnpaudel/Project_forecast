export type AccentColor = 'cobalt' | 'vermilion' | 'amber' | 'emerald';
export type RadiusScale = 'sharp' | 'subtle' | 'smooth' | 'rounded';
export type SurfaceTheme = 'dark' | 'light';
export type DensityMode = 'comfortable' | 'compact';

export interface DesignTokens {
  accent: AccentColor;
  accentHex: string;
  radius: RadiusScale;
  radiusPx: string;
  theme: SurfaceTheme;
  density: DensityMode;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  role: string;
  disciplines: string[];
  summary: string;
  heroImage: string;
  impactMetrics: {
    label: string;
    value: string;
    context: string;
  }[];
  challenge: string;
  solution: string;
  designDecisions: {
    title: string;
    description: string;
    principle: string;
  }[];
  tokensSample: {
    primaryType: string;
    bodyType: string;
    baseUnit: string;
    elevationLevel: string;
  };
}

export interface HeuristicItem {
  id: string;
  name: string;
  standard: string;
  description: string;
  appliedInStudio: string;
  auditPass: boolean;
}
