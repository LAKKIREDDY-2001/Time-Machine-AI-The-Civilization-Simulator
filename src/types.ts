/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum GovernmentType {
  DEMOCRACY = "Democracy",
  AI_GOVERNANCE = "AI Governance",
  TECHNOCRACY = "Technocracy",
  COLLECTIVE_INTELLIGENCE = "Collective Intelligence",
}

export enum EconomyType {
  CAPITALISM = "Capitalism",
  RESOURCE_BASED = "Resource Based",
  POST_SCARCITY = "Post Scarcity",
}

export enum EnergySource {
  SOLAR = "Solar Grid",
  FUSION = "Fusion Core",
  ANTIMATTER = "Antimatter Reactor",
}

export enum EducationType {
  TRADITIONAL = "Traditional",
  AI_ASSISTED = "AI Assisted",
  UNIVERSAL_LEARNING = "Universal AI Learning",
}

export enum SpaceExpansion {
  EARTH_ONLY = "Earth Only",
  MOON = "Lunar Colony",
  MARS = "Mars Settlement",
  INTERSTELLAR = "Interstellar Frontier",
}

export interface CivilizationConfig {
  government: GovernmentType;
  economy: EconomyType;
  energy: EnergySource;
  education: EducationType;
  spaceExpansion: SpaceExpansion;
}

export interface CivilizationDNA {
  type: string;
  name: string;
  description: string;
  metrics: {
    innovation: number;      // 0 - 100
    happiness: number;       // 0 - 100
    automation: number;      // 0 - 100
    sustainability: number;  // 0 - 100
    collapseRisk: number;    // 0 - 100
    expansionLevel: number;  // 0 - 100
  };
}

export interface PlanetStatus {
  id: string;
  name: string;
  year: number;
  population: string;
  economy: string;
  government: string;
  climate: string;
  challenges: string;
  opportunities: string;
  expansionRate: string;
  energy: string;
  color: string; // Tailwind hex or class-like color representation
}

export interface FutureCitizen {
  id: string;
  name: string;
  year: number;
  role: string;
  bio: string;
  occupation: string;
  dailyLife: string;
  beliefs: string;
  challenges: string;
  futureVision: string;
  avatarSeed: string;
  avatarColor: string;
}

export interface FutureNews {
  id: string;
  title: string;
  category: "Politics" | "Science" | "Economy" | "Environment" | "Space" | "Technology";
  content: string;
  year: number;
  impactScore: number;
}

export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  category: "politics" | "technology" | "space" | "energy" | "society";
}

export interface DecisionAnalysis {
  question: string;
  pros: string[];
  cons: string[];
  globalImpact: string;
  timelineImpact: string;
  civilizationalImpact: string;
}

export interface GlobalRisk {
  id: string;
  name: string;
  probability: number; // 0-100
  impact: number;      // 0-100
  mitigation: string;
  confidence: number;  // 0-100
  status: "CRITICAL" | "HIGH" | "MODERATE" | "STABLE";
}

export interface AlternateReality {
  whatIf: string;
  description: string;
  timeline: { year: number; title: string; event: string }[];
  society: string;
  economy: string;
  technologies: string[];
  culture: string;
}

export interface FutureFork {
  id: string;
  name: string;
  description: string;
  economy: string;
  climate: string;
  technology: string;
  qualityOfLife: string;
  government: string;
  primaryMetric: number; // For visualization
}

export interface SimulationResult {
  year: number;
  config: CivilizationConfig;
  dna: CivilizationDNA;
  planets: PlanetStatus[];
  news: FutureNews[];
  citizens: FutureCitizen[];
  risks: GlobalRisk[];
  timeline: TimelineEvent[];
}
