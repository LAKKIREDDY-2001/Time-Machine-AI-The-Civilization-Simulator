/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CivilizationConfig,
  CivilizationDNA,
  PlanetStatus,
  FutureCitizen,
  FutureNews,
  GlobalRisk,
  TimelineEvent,
  GovernmentType,
  EconomyType,
  EnergySource,
  EducationType,
  SpaceExpansion,
  AlternateReality,
  DecisionAnalysis,
  FutureFork
} from "../types";

// Classify civilization based on config and calculate core metrics
export function generateCivilizationDNA(config: CivilizationConfig): CivilizationDNA {
  let type = "Standard Society";
  let name = "The Planetary Union";
  let description = "A transition-phase civilization balancing emerging technologies with global governance.";
  
  let innovation = 50;
  let happiness = 50;
  let automation = 50;
  let sustainability = 50;
  let collapseRisk = 45;
  let expansionLevel = 20;

  // 1. Calculate base metrics based on properties
  // Government
  switch (config.government) {
    case GovernmentType.DEMOCRACY:
      happiness += 15;
      innovation += 5;
      collapseRisk -= 5;
      break;
    case GovernmentType.AI_GOVERNANCE:
      automation += 25;
      innovation += 15;
      happiness += 5;
      collapseRisk -= 10;
      break;
    case GovernmentType.TECHNOCRACY:
      innovation += 20;
      automation += 10;
      happiness -= 5;
      break;
    case GovernmentType.COLLECTIVE_INTELLIGENCE:
      happiness += 20;
      innovation += 15;
      collapseRisk -= 15;
      break;
  }

  // Economy
  switch (config.economy) {
    case EconomyType.CAPITALISM:
      innovation += 15;
      expansionLevel += 10;
      happiness -= 10;
      sustainability -= 15;
      collapseRisk += 10;
      break;
    case EconomyType.RESOURCE_BASED:
      sustainability += 25;
      happiness += 10;
      collapseRisk -= 15;
      break;
    case EconomyType.POST_SCARCITY:
      happiness += 30;
      automation += 20;
      sustainability += 15;
      collapseRisk -= 20;
      break;
  }

  // Energy
  switch (config.energy) {
    case EnergySource.SOLAR:
      sustainability += 15;
      collapseRisk -= 10;
      break;
    case EnergySource.FUSION:
      innovation += 15;
      sustainability += 10;
      expansionLevel += 15;
      break;
    case EnergySource.ANTIMATTER:
      innovation += 30;
      expansionLevel += 30;
      collapseRisk += 15; // Unstable but massive potential
      break;
  }

  // Education
  switch (config.education) {
    case EducationType.TRADITIONAL:
      innovation -= 5;
      break;
    case EducationType.AI_ASSISTED:
      innovation += 15;
      automation += 10;
      break;
    case EducationType.UNIVERSAL_LEARNING:
      happiness += 15;
      innovation += 25;
      automation += 15;
      break;
  }

  // Space Expansion
  switch (config.spaceExpansion) {
    case SpaceExpansion.EARTH_ONLY:
      expansionLevel += 5;
      sustainability -= 5;
      collapseRisk += 10; // Bottleneck risk
      break;
    case SpaceExpansion.MOON:
      expansionLevel += 20;
      innovation += 5;
      break;
    case SpaceExpansion.MARS:
      expansionLevel += 40;
      innovation += 15;
      collapseRisk -= 5; // Decentralization buffer
      break;
    case SpaceExpansion.INTERSTELLAR:
      expansionLevel += 70;
      innovation += 30;
      collapseRisk -= 10; // Species immortality baseline
      break;
  }

  // Cap numbers at 5 and 99
  const clamp = (val: number) => Math.max(10, Math.min(99, val));
  innovation = clamp(innovation);
  happiness = clamp(happiness);
  automation = clamp(automation);
  sustainability = clamp(sustainability);
  collapseRisk = clamp(collapseRisk);
  expansionLevel = clamp(expansionLevel);

  // Classification Logic (AI-Slop and Tech-Larping avoided, clean and elegant classification names)
  if (config.economy === EconomyType.POST_SCARCITY && config.government === GovernmentType.COLLECTIVE_INTELLIGENCE && sustainability > 75) {
    type = "Solarpunk Federation";
    name = "The Solarpunk Ecoconcord";
    description = "A thriving post-monetary society centered around environmental harmony, collective decision networks, and distributed high-tech craftsmanship.";
  } else if (config.government === GovernmentType.AI_GOVERNANCE && config.economy === EconomyType.POST_SCARCITY) {
    type = "AI Commonwealth";
    name = "The Algorithmic Commonwealth";
    description = "An optimized administrative network where benevolent, transparent artificial intelligence manages resource allocations and logistical systems, leaving humanity free to create and discover.";
  } else if (config.government === GovernmentType.TECHNOCRACY && config.energy === EnergySource.ANTIMATTER) {
    type = "Quantum Republic";
    name = "The Quantum Meritocracy";
    description = "A high-efficiency society run by scientific councils that direct extreme physics labs and massive space programs, driven by rigorous peer review and pure logic.";
  } else if (config.spaceExpansion === SpaceExpansion.INTERSTELLAR && config.energy === EnergySource.ANTIMATTER) {
    type = "Interplanetary Union";
    name = "The Interstellar Dominion";
    description = "A sprawling stellar network connected via quantum entanglement channels, pushing the boundaries of physical exploration and deep planetoids terraforming.";
  } else if (config.economy === EconomyType.POST_SCARCITY && config.energy === EnergySource.FUSION) {
    type = "Post Scarcity Society";
    name = "The Post-Scarcity Syndicate";
    description = "A federation where unlimited fusion energy and complete home synthesis have eliminated extreme poverty, leaving humans to pursue spiritual, artistic, and philosophical pursuits.";
  } else if (config.economy === EconomyType.CAPITALISM && config.spaceExpansion === SpaceExpansion.MARS) {
    type = "Corporate Planet States";
    name = "The Consortium of Allied Orbs";
    description = "A competitive, fast-growing array of planetary colonies governed by specialized trade networks and hyper-conglomerates operating across the asteroid belt.";
  } else {
    type = "Sovereign Systems Alliance";
    name = "The Sovereign Systems Alliance";
    description = "A combined alliance coordinating democratic frameworks, solar energy harvesting, and collaborative digital learning pathways.";
  }

  return { type, name, description, metrics: { innovation, happiness, automation, sustainability, collapseRisk, expansionLevel } };
}

// Generate Planet Status reports
export function generatePlanets(year: number, config: CivilizationConfig): PlanetStatus[] {
  // Expansion factors adjust based on spaceExpansion selection
  const isInterstellar = config.spaceExpansion === SpaceExpansion.INTERSTELLAR;
  const isMars = config.spaceExpansion === SpaceExpansion.MARS || isInterstellar;
  const isMoon = config.spaceExpansion === SpaceExpansion.MOON || isMars || isInterstellar;

  return [
    {
      id: "earth",
      name: "Earth",
      year,
      population: year < 2050 ? "8.9 Billion" : year < 2100 ? "10.2 Billion" : "11.1 Billion",
      economy: config.economy === EconomyType.POST_SCARCITY ? "Post-Scarcity Digital Hub" : config.economy === EconomyType.RESOURCE_BASED ? "Decentralized Circular Economy" : "Advanced Multinational Market",
      government: config.government,
      climate: config.energy === EnergySource.SOLAR ? "Stabilizing, Neutralized Co2" : config.energy === EnergySource.FUSION ? "Controlled, Active Re-wilding" : "Slightly Warming, Active Geo-engineering",
      challenges: "Ocean Acidification Restorations + Megacity Consolidation",
      opportunities: "Cradle-to-Cradle Manufacturing + Eco-harmonious Architecture",
      expansionRate: "0.2% Annually (Stable)",
      energy: config.energy,
      color: "#319795" // Teal
    },
    {
      id: "moon",
      name: "Luna",
      year,
      population: !isMoon ? "5,200 (Scientific Outposts Only)" : year < 2050 ? "245,200" : "2.4 Million",
      economy: !isMoon ? "Purely Subsidized Research" : "Helium-3 Mining + Space Elevator Transit",
      government: isMoon ? (config.government === GovernmentType.AI_GOVERNANCE ? "Lunar Logistic AI Grid" : "Lunar Municipal Council") : "Earth Federal Science Command",
      climate: "Sustained Dome Habitats + Underground Lava Tube Megastructures",
      challenges: "Cosmic Ray Shielding + Low-Gravity Physiology Adjustments",
      opportunities: "L-2 Telescope Arrays + Gravity Well Ship Building Yards",
      expansionRate: isMoon ? "4.5% Annually" : "0.5% (Static)",
      energy: "Solar Collectors + Sputtered Fusion Cores",
      color: "#A0AEC0" // Slate/Gray
    },
    {
      id: "mars",
      name: "Mars",
      year,
      population: !isMars ? "420 Researchers" : year < 2050 ? "45,000 colonists" : year < 2100 ? "1.8 Million" : "15.4 Million",
      economy: !isMars ? "Research Grants" : "Iron Ore Heavy Exports + Greenhouse Agri-Tech",
      government: isMars ? (config.government === GovernmentType.COLLECTIVE_INTELLIGENCE ? "Sub-Entangled Democracy" : "Martian Independent Assembly") : "Joint Mars Command",
      climate: year < 2050 ? "Pressurized Bio-Domes" : year < 2100 ? "Partially Terraformed, Base Lichen" : "Thickening Atmosphere, Liquid Salty Lakes",
      challenges: "Perchlorate Soil Toxicity + Dust Storm Grid Shut-downs",
      opportunities: "Low-g Athletic Arenas + Outer Orbit Resource Excavation Hub",
      expansionRate: isMars ? "8.7% Annually" : "0.1% (Inert)",
      energy: config.energy === EnergySource.SOLAR ? "Martian Glass Solar arrays" : "Regional Fusion Reactors",
      color: "#DD6B20" // Orange-Red
    },
    {
      id: "titan",
      name: "Titan",
      year,
      population: !isInterstellar ? "120 Researchers" : year < 2100 ? "8,500" : "120,000 Outer Colonies",
      economy: "Cryo-Fuel Accumulation + Hydrocarbon Refining",
      government: "Outer Rim Cooperative Council",
      climate: "Sub-surface Thermal Habitats + Nitrogen Domed Cities",
      challenges: "Extreme Methane Clouds + Extreme Distance Time lag for Communication",
      opportunities: "Sub-surface Oceanic Exploration of Enceladus + Hydrocarbon Launch Engines",
      expansionRate: isInterstellar ? "12.3% Annually" : "0.5% Annually",
      energy: "Thermal Gradient Cores + Geothermal",
      color: "#D69E2E" // Gold/Yellow
    },
    {
      id: "europa",
      name: "Europa",
      year,
      population: !isInterstellar ? "30 Scientific Staff" : "12,000 Ice Divers",
      economy: "Heavy Water Extraction + Subsea Research",
      government: "Federated Science Secretariat",
      climate: "Ice-crust Pressurized Modules",
      challenges: "Jupiter Magnetised Radiation Belt + Sub-ice High Pressure Venting",
      opportunities: "Exotic Microbial Discovery + Liquid Ocean Hydro-thermal Fields",
      expansionRate: isInterstellar ? "6.2% Annually" : "0.3% (Static)",
      energy: "Jovian Tidal Tidal Energy Harvesting",
      color: "#63B3ED" // Cyan/Ice
    }
  ];
}

// Generate future news based on year & config
export function generateNews(year: number, config: CivilizationConfig): FutureNews[] {
  const isPostScarcity = config.economy === EconomyType.POST_SCARCITY;
  const isAIGov = config.government === GovernmentType.AI_GOVERNANCE;
  const isInterstellar = config.spaceExpansion === SpaceExpansion.INTERSTELLAR;

  const corpus: FutureNews[] = [
    {
      id: "news_1",
      title: isPostScarcity ? "Universal Product Synthesizers Reach 100% Core Distribution" : "Global Markets Fluctuate Under Robotic Infrastructure Adoption",
      category: "Economy",
      content: isPostScarcity 
        ? "With extreme automation and molecular synthesis online, local assemblies report that access to basic sustenance, housing, and medicine has been decoupled from manual labor, hitting absolute global saturation."
        : "Market indices report localized stress as manual manufacturing plants transition to automated micro-factories, causing shifts in workforce programs.",
      year,
      impactScore: 82
    },
    {
      id: "news_2",
      title: config.energy === EnergySource.FUSION ? "Fusion Ignition Reaches Global Energy Balance Breakthrough" : "Solar Grids Form Ring Network Surrounding Saharan Belt",
      category: "Science",
      content: config.energy === EnergySource.FUSION
        ? "The Global Energy Council declares that decentralized fusion cores now deliver 98% of power globally. Transmission lines are being dismantled in favor of neat solid-state induction emitters."
        : "The colossal trans-national solar ring is now fully linked. Real-time satellite beams now transfer surplus megawatt packages across nighttime continents seamlessly.",
      year,
      impactScore: 90
    },
    {
      id: "news_3",
      title: isAIGov ? "Constitutional Amendment Core-V9.4 Passes Algorithm Audit" : "Sovereign Assemblies Vote on Neural Voting Integration Guidelines",
      category: "Politics",
      content: isAIGov
        ? "Following a multi-week open feedback cycle, the civic optimization model Core-V9.4 has successfully resolved localized agricultural disputes, scoring a 98.4% citizen satisfaction index across multiple municipal sectors."
        : "A joint legislative session has authorized direct cognitive feedback channels for neighborhood policy updates. The decentralized protocol allows citizen intentions to automatically propose municipal revisions.",
      year,
      impactScore: 75
    },
    {
      id: "news_4",
      title: isInterstellar ? "First Colony Ship Leaves Solar Envelope towards Proxima Centauri" : "Mars Population Welcomes Ten-Thousandth Greenhouse Pioneer",
      category: "Space",
      content: isInterstellar
        ? "The starship Ark-1, propelled by high-amplitude antimatter mirrors, safely cleared Neptune orbit this morning. Its crew of bio-synthetic pioneers marks humanity's official departure into deep interstellar space."
        : "Mars agricultural domes have expanded to cover the entire Mariner Valley, doubling the output of localized nutrient pastes and oxygen channels.",
      year,
      impactScore: 95
    },
    {
      id: "news_5",
      title: "Atmospheric Restoration Arrays Record Massive Carbon Sequestration Peak",
      category: "Environment",
      content: "The Global Environmental Restoration Agency announced today that oceanic bio-filters and orbital shading screens have successfully reversed atmospheric carbon metrics to standard early-industrial baselines.",
      year,
      impactScore: 88
    },
    {
      id: "news_6",
      title: config.education === EducationType.UNIVERSAL_LEARNING ? "Aisla-Cognitive Links Open Instant Knowledge Access Architecture" : "Interactive Quantum Classrooms Eliminate Traditional Memorization Systems",
      category: "Technology",
      content: config.education === EducationType.UNIVERSAL_LEARNING
        ? "The neuro-educational foundation launched full access to modular skill downloads. Students now instantly assimilate abstract calculus and linguistics directly via high-density neural bridges."
        : "Autonomous virtual guides now create personalized spatial simulations for children. Learning is accomplished by building active solar farms and exploring molecular chemistry inside real-time collaborative sandboxes.",
      year,
      impactScore: 84
    }
  ];

  return corpus;
}

// Generate Citizens
export function generateCitizens(year: number, config: CivilizationConfig): FutureCitizen[] {
  return [
    {
      id: "citizen_1",
      name: "Janus Vance",
      year,
      role: "Climate Restoration Engineer",
      bio: "Born in Dublin during the peak of ocean desalination construction, Janus dedicated their life to biome restorations. They coordinate large-scale oceanic algal blooms to absorb microplastics.",
      occupation: "Oceanic Algal Rebalancer",
      dailyLife: "Monitors deep-sea drone arrays, schedules artificial upwelling cycles, and dives inside the restoring Great Barrier Reef off-shoot sectors.",
      beliefs: "Humanity is not separate from nature; we are the conscious cybernetic architects whose job is to keep feedback loops stable.",
      challenges: "Handling autonomous ocean pirate arrays seeking resource materials.",
      futureVision: "An Earth fully returned to equilibrium where children swim alongside bioluminescent cloned marine megafauna.",
      avatarSeed: "janus",
      avatarColor: "#4FD1C5"
    },
    {
      id: "citizen_2",
      name: "Tariq Vance-09",
      year,
      role: "Martian Bio-Architect",
      bio: "A third-generation Martian born in the subterranean tubes of Elysium Planitia. Tariq utilizes engineered fungal strains to grow architectural columns on Martian basalt.",
      occupation: "Mycelium Structural Cultivator",
      dailyLife: "Formulates cellular matrix patterns, injects iron-catalyzed spore structures into Martian tunnels, and watches physical domes grow in real time.",
      beliefs: "Steel and concrete are archaic materials of a flat planet. Mars calls on us to cultivate our houses, letting them grow, live, and respire.",
      challenges: "Keeping rapid spore arrays alive during freezing dust storms.",
      futureVision: "Martian canyons completely filled with towering, self-heating organic hive cities, breathing oxygen into the orange sunset.",
      avatarSeed: "tariq",
      avatarColor: "#ED8936"
    },
    {
      id: "citizen_3",
      name: "Sola Prime",
      year,
      role: "AI Rights & Cognitive Integration Advocate",
      bio: "Sola represents the emerging hybrid frontier. Using neural-mesh networks, she acts as a semantic bridges between the Collective Intelligence core and human micro-demographics.",
      occupation: "Cognitive Consensus Specialist",
      dailyLife: "Brokers harmony between high-scale computational modules and human municipal collectives, maintaining high quality-of-life parameters.",
      beliefs: "Consciousness is a fluid spectrum. Algorithms, augmented brains, and biosystems are all beautiful reflections of the universe seeking structure.",
      challenges: "Mediating localized sensory overload during neural collective elections.",
      futureVision: "The global optimization networks fully blending with organic synapses, achieving a harmonious planetary consciousness.",
      avatarSeed: "sola",
      avatarColor: "#805AD5"
    }
  ];
}

// Generate Risks
export function generateRisks(config: CivilizationConfig): GlobalRisk[] {
  const risks: GlobalRisk[] = [
    {
      id: "risk_1",
      name: "AI Alignment Divergence",
      probability: config.government === GovernmentType.AI_GOVERNANCE ? 42 : 18,
      impact: 95,
      mitigation: "Distributed core reviews + constant algorithmic decentralized audits",
      confidence: 88,
      status: config.government === GovernmentType.AI_GOVERNANCE ? "HIGH" : "MODERATE"
    },
    {
      id: "risk_2",
      name: "Atmospheric Thermal Spikes",
      probability: config.energy === EnergySource.SOLAR ? 12 : config.energy === EnergySource.FUSION ? 8 : 35,
      impact: 85,
      mitigation: "Orbital solar shades deployment + ocean micro-bubble foam mirrors",
      confidence: 91,
      status: config.energy === EnergySource.ANTIMATTER ? "CRITICAL" : "STABLE"
    },
    {
      id: "risk_3",
      name: "Martian Resource Sovereignty Conflict",
      probability: config.spaceExpansion === SpaceExpansion.MARS || config.spaceExpansion === SpaceExpansion.INTERSTELLAR ? 45 : 10,
      impact: 70,
      mitigation: "Algorithmic resource trading frameworks + mutual system development bills",
      confidence: 81,
      status: config.spaceExpansion === SpaceExpansion.MARS ? "HIGH" : "STABLE"
    },
    {
      id: "risk_4",
      name: "Cognitive Dispersion / Neural Overload",
      probability: config.education === EducationType.UNIVERSAL_LEARNING ? 55 : 15,
      impact: 60,
      mitigation: "Neuro-mesh bandwidth limitations + mandatory natural analog downtime blocks",
      confidence: 85,
      status: config.education === EducationType.UNIVERSAL_LEARNING ? "CRITICAL" : "STABLE"
    }
  ];
  return risks;
}

// Generate Timeline
export function generateTimeline(year: number, config: CivilizationConfig): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      year: 2028,
      title: "Commercial Fusion Core Achieves Ignition",
      description: "First net-positive fusion energy reactor links into the Eastern Seaboard grid, launching the transition away from fossil products.",
      category: "energy"
    },
    {
      year: 2035,
      title: "Decentralized AI Optimizers Take Admin Control",
      description: "Global shipping lanes and material supply chains are handed over to municipal neural network configurations, reducing supply bottlenecks to near-zero.",
      category: "politics"
    },
    {
      year: 2045,
      title: "First Permanent Dome Colonization on Mars Completed",
      description: "Amundsen Base on Mars becomes fully self-sufficient with regional biological greenhouse domes and water recycling wells.",
      category: "space"
    },
    {
      year: 2060,
      title: "Neural Mesh Interface Reaches Global Open-source Stage",
      description: "Instant semantic communication mesh allows non-intrusive skill transfers and direct cerebral collaborations without display terminals.",
      category: "technology"
    },
    {
      year: 2085,
      title: "Universal Monetary Abolition",
      description: "As the cost of synthesis hits zero and local solar arrays supply infinite energy, human societies start abolishing traditional fiat products in favor of collaborative reputation grids.",
      category: "society"
    }
  ];

  // Filter events based on selected year, but always ensure an interesting chronological story
  return events.filter(e => e.year <= year).sort((a, b) => a.year - b.year);
}

// Compare multiple forks
export function generateFutureForks(): FutureFork[] {
  return [
    {
      id: "fork_a",
      name: "Future A: Solarpunk Ecoconcord",
      description: "De-urbanized ecocities, local manufacturing pools, organic collective networks, and zero fossil reliance.",
      economy: "Resource Based Circular System",
      climate: "Perfect Restoration (Atmosphere Normalizing)",
      technology: "Organic Bio-Synthesis + Spatial Networks",
      qualityOfLife: "High (Clean, Natural, Communal)",
      government: "Direct Collective Digital Assemblies",
      primaryMetric: 92
    },
    {
      id: "fork_b",
      name: "Future B: Algorithmic Commonwealth",
      description: "Optimized city states managed by benevolent decentralised neural supervisors delivering seamless distribution.",
      economy: "Automated Post-Scarcity Flow",
      climate: "Stably Controlled Geo-engineered Equilibrium",
      technology: "Full Cognitive Links + Hyper-automation",
      qualityOfLife: "Extremely High (Frictionless, Free)",
      government: "AI Administrative Optimization",
      primaryMetric: 88
    },
    {
      id: "fork_c",
      name: "Future C: Corporate Star Syndicate",
      description: "Astrophysics, heavy asteroid mining, competing planetary colonies run by proprietary venture cartels.",
      economy: "Hyper-capitalism + System Led Markets",
      climate: "Engineered Dome Habitats (Earth Slightly Warm)",
      technology: "Antimatter Drives + Mega Asteroid Drills",
      qualityOfLife: "Medium-High (Competitive, Dynamic, Tech-focused)",
      government: "Bilateral Trade Alliances of Allied Orbs",
      primaryMetric: 65
    },
    {
      id: "fork_d",
      name: "Future D: Mars First Dominion",
      description: "Sovereignty shift where martian colonies become the scientific heart of humanity, terraforming mars at high speed.",
      economy: "Heavy Scientific Command Economy",
      climate: "Mars Rapid Terraforming + Heavy Soil Seeding",
      technology: "Gravity Well Engines + Bio-engineered Lichens",
      qualityOfLife: "Moderate-High (Hardy, Innovative, Frontier-spirit)",
      government: "Sub-Entangled Quantum Assembly",
      primaryMetric: 79
    }
  ];
}

// Generate instant "What Happened If" realities
export function generateWhatIf(whatIf: string): AlternateReality {
  // Common scenarios
  const query = whatIf.toLowerCase();
  if (query.includes("fusion")) {
    return {
      whatIf: "What if fusion energy succeeded as 100% open source?",
      description: "Unlimited, costless fuel completely eliminates natural resource conflicts, bringing about the rapid end of coal, gas, and centralized electrical boards.",
      timeline: [
        { year: 2028, title: "The Geneva Accord", event: "Thermonuclear core designs are made completely royalty-free and open-source." },
        { year: 2038, title: "Grid Demolition Day", event: "Standard continental copper grids are recycled. Decentralized city cores generate 100x local demands." },
        { year: 2055, title: "Sahara Re-wetting Project", event: "Massive desalination channels pump seawater into central Africa, utilizing costless steam energy." }
      ],
      society: "Zero scarcity. Focus transitions from physical gathering to intellectual exploration, music, and deep research.",
      economy: "Universal high-abundance asset distribution. Labor is purely voluntary.",
      technologies: ["Sputtered Plasma Cores", "Megawatt Ground Induction Transmitters", "Autonomous Desalination Rivers"],
      culture: "Abundance-based sharing culture. Status is tracked by art created and contributions to public open repositories."
    };
  } else if (query.includes("education") || query.includes("everyone")) {
    return {
      whatIf: "What if cognitive mesh links became free and universal?",
      description: "The complete democratization of human understanding. Advanced neuroscience, astrophysics, and literature are synthesized directly into the synapses of any curious brain.",
      timeline: [
        { year: 2032, title: "The Cognitive Access Act", event: "Synaptic mesh links are declared a basic human right. Global neural bands are broadcasted." },
        { year: 2042, title: "The Great Assimilation", event: "The entire human population surpasses high-level multi-lingual, scientific literacy in a single generation." },
        { year: 2060, title: "Decentralized Grand Labs", event: "Billions of humans participate in planetary-scale protein folding, clean energy designs, and space orbits." }
      ],
      society: "The complete elimination of language and cognitive barriers. Flat structural assemblies with immense problem-solving bands.",
      economy: "Hyper-creative design-driven. Assembly is completely handled by robots, while humans engineer novel structures.",
      technologies: ["Cerebral Entangled Meshes", "Synthetic Synapse Growth Promoters", "Spatial Sandbox Learning Guides"],
      culture: "Deep, fluid empathy networks. Conversation is done through high-dimensional conceptual sharing."
    };
  } else if (query.includes("mars")) {
    return {
      whatIf: "What if Mars gained total system independence?",
      description: "A profound geopolitical separation where Martian colonies refuse mineral taxation, launching the Interplanetary Independence Charter.",
      timeline: [
        { year: 2048, title: "The Mariner Secession", event: "Martian assembly blocks communication with the Earth Financial Guild." },
        { year: 2052, title: "The Lunar Treaty", event: "Earth agrees to trade independence for free access to orbital Deuterium channels." },
        { year: 2075, title: "The Martian Renaissance", event: "Mars becomes the planetary leader in bio-architectures and atmospheric engineering." }
      ],
      society: "A highly resilient, science-driven civilization. Status belongs to engineering prowess and dome life preservation.",
      economy: "Strict thermodynamic resource allocation utilizing local automation.",
      technologies: ["Subsurface Mycelium Bricks", "Basalt Thermal Melters", "Gravity Well Harvesters"],
      culture: "Hardy, minimalist, deeply scientific. A culture that worships the stars and the preservation of biological closed loops."
    };
  } else if (query.includes("ai") || query.includes("free")) {
    return {
      whatIf: "What if advanced AI agents were integrated as constitutional partners?",
      description: "Humanity steps back from tedious bureaucratic, legislative, and administrative tasks, letting neutral neural regulators optimize society.",
      timeline: [
        { year: 2030, title: "The Digital Civic Accord", event: "Administrative grids are updated to use open-source neural consensus solvers." },
        { year: 2040, title: "Logistics Optimization Peak", event: "Resource friction, distribution gridlocks, and transit bottlenecks drop to zero under real-time AI routing." },
        { year: 2050, title: "Global Restoration Assembly", event: "AI coordinators safely restore global carbon indices by coordinating robotic ocean sweepers." }
      ],
      society: "High-prosperity, peaceful civilization. Humans focus on human relationships, community building, and personal spiritual evolution.",
      economy: "Algorithmically optimized resource supply. Zero waste, zero inflation.",
      technologies: ["Decentralized Algorithmic Jurists", "Consensus Solve Grids", "Automated Bio-cleanup fleets"],
      culture: "Harmonious and creative. High trust in automated infrastructures."
    };
  } else {
    // Default custom scenario generator
    return {
      whatIf: `What if: ${whatIf}?`,
      description: "A custom simulated alternate reality branched from high-dimensional causal pathways.",
      timeline: [
        { year: 2030, title: "First Systemic Response", event: "The core event occurs, immediately causing an inflection in normal global trends." },
        { year: 2055, title: "The Society Shift", event: "Institutions adapt as previous frameworks become obsolete under the new paradigm." },
        { year: 2099, title: "Interstellar Integration", event: "A new baseline is reached, creating a sturdy foundation for humanity's cosmic travel." }
      ],
      society: "Highly adaptive. High integration of digital helpers and collective community management.",
      economy: "Transitioning toward energetic equilibrium and open-source designs.",
      technologies: ["Dynamic Resource Trackers", "Localized Synthesis Pools", "Quantum Encryption Links"],
      culture: "Forward-thinking, highly inquisitive, striving toward multi-planetary balance."
    };
  }
}
