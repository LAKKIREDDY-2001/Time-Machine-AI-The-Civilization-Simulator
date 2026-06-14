/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Clock,
  Compass,
  Sliders,
  Sparkles,
  Users,
  Newspaper,
  GitFork,
  HelpCircle,
  Award,
  AlertTriangle,
  Activity,
  Network,
  Calendar,
  Settings as SettingsIcon,
  Send,
  Zap,
  Globe2,
  Lock,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  Eye,
  Minimize2,
  Maximize2
} from "lucide-react";

import { motion, AnimatePresence } from "motion/react";
import ThreeDEarth from "./components/ThreeDEarth";
import CivRadarChart from "./components/CivRadarChart";
import KnowledgeGraph from "./components/KnowledgeGraph";

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
} from "./types";

import {
  generateCivilizationDNA,
  generatePlanets,
  generateNews,
  generateCitizens,
  generateRisks,
  generateTimeline,
  generateFutureForks,
  generateWhatIf
} from "./utils/localSimulator";

export default function App() {
  // 1. Core State
  const [activeTab, setActiveTab] = useState<string>("future_explorer"); // Sidebar active view
  const [rightPanelTab, setRightPanelTab] = useState<string>("overview"); // Right HUD active tab
  
  const [selectedYear, setSelectedYear] = useState<number>(2100);
  const [yearInput, setYearInput] = useState<string>("2100");
  
  // Custom Civ Configurations
  const [config, setConfig] = useState<CivilizationConfig>({
    government: GovernmentType.AI_GOVERNANCE,
    economy: EconomyType.POST_SCARCITY,
    energy: EnergySource.FUSION,
    education: EducationType.UNIVERSAL_LEARNING,
    spaceExpansion: SpaceExpansion.MARS
  });

  // Generated Datastreams (Dual engines: AI + local procedural fallback)
  const [dna, setDna] = useState<CivilizationDNA>(generateCivilizationDNA(config));
  const [planets, setPlanets] = useState<PlanetStatus[]>(generatePlanets(selectedYear, config));
  const [news, setNews] = useState<FutureNews[]>(generateNews(selectedYear, config));
  const [citizens, setCitizens] = useState<FutureCitizen[]>(generateCitizens(selectedYear, config));
  const [risks, setRisks] = useState<GlobalRisk[]>(generateRisks(config));
  const [timeline, setTimeline] = useState<TimelineEvent[]>(generateTimeline(selectedYear, config));
  
  // Custom AI Modules state
  const [alternateReality, setAlternateReality] = useState<AlternateReality | null>(null);
  const [whatIfInput, setWhatIfInput] = useState<string>("What if AI was invented in 1980?");
  const [decisionQuery, setDecisionQuery] = useState<string>("Should humanity adopt AI governance?");
  const [decisionResult, setDecisionResult] = useState<DecisionAnalysis | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStatusMsg, setSimStatusMsg] = useState<string>("");

  // Planet monitor selection
  const [focusedPlanetId, setFocusedPlanetId] = useState<string>("earth");

  // Citizen chat state
  const [selectedCitizenId, setSelectedCitizenId] = useState<string>("citizen_1");
  const [chatLog, setChatLog] = useState<{ sender: "user" | "citizen"; text: string }[]>([
    { sender: "citizen", text: "Greetings traveler. I am Janus. Ask me anything about our orbital algae systems or how our post-scarcity economy works here." }
  ]);
  const [userChatInput, setUserChatInput] = useState<string>("");
  const [isCitizenTyping, setIsCitizenTyping] = useState<boolean>(false);

  // Ask Humanity state
  const [humanityQuery, setHumanityQuery] = useState<string>("What was the biggest turning point in history?");
  const [humanityReply, setHumanityReply] = useState<string>("");
  const [isAskingHumanity, setIsAskingHumanity] = useState<boolean>(false);

  // Future Forks Compare
  const forks: FutureFork[] = generateFutureForks();

  // Cinematic Timeline documentary movie player state
  const [isMoviePlaying, setIsMoviePlaying] = useState<boolean>(false);
  const [movieYear, setMovieYear] = useState<number>(2025);
  const [movieEventDescription, setMovieEventDescription] = useState<string>("The AI Revolution begins, reforming communication.");
  const [movieSubtopic, setMovieSubtopic] = useState<string>("DECENTRALIZED COMPUTING TRANSITION");

  // Telemetry offline warning banner state
  const [isTelemetryModeAI, setIsTelemetryModeAI] = useState<boolean>(false);
  const [isCustomYearRequested, setIsCustomYearRequested] = useState<boolean>(false);

  // Sync state whenever Year or Configuration alters procedurally
  useEffect(() => {
    const updatedDna = generateCivilizationDNA(config);
    setDna(updatedDna);
    setPlanets(generatePlanets(selectedYear, config));
    setNews(generateNews(selectedYear, config));
    setCitizens(generateCitizens(selectedYear, config));
    setRisks(generateRisks(config));
    setTimeline(generateTimeline(selectedYear, config));
  }, [selectedYear, config]);

  // Initial local message when swapping citizen
  useEffect(() => {
    const sc = citizens.find(c => c.id === selectedCitizenId);
    if (sc) {
      setChatLog([
        { sender: "citizen", text: `Hello, I'm ${sc.name}. As a ${sc.role} in ${selectedYear}, my days are filled with ${sc.occupation}. What can I share with you about our reality?` }
      ]);
    }
  }, [selectedCitizenId]);

  // Cinematic Timeline Movie Simulation runner
  useEffect(() => {
    let interval: any = null;
    if (isMoviePlaying) {
      interval = setInterval(() => {
        setMovieYear((prevYear) => {
          if (prevYear >= 2100) {
            setIsMoviePlaying(false);
            return 2100;
          }
          const nextYear = prevYear + 15;
          // Set descriptions for the points in time
          if (nextYear === 2040) {
            setMovieSubtopic("GRID FUSION CORES LINKED");
            setMovieEventDescription("Unlimited fusion power achieves worldwide equilibrium, completely dismantling old copper distribution boards.");
          } else if (nextYear === 2055) {
            setMovieSubtopic("COLONIZATION AT SCALE");
            setMovieEventDescription("Mars domes expand past Elysium Planitia, introducing iron and ore launch transits.");
          } else if (nextYear === 2070) {
            setMovieSubtopic("POST SCARCITY SYNDICATION");
            setMovieEventDescription("Decentralized synthesis machines eliminate extreme scarcity. Creative design blooms globally.");
          } else if (nextYear === 2085) {
            setMovieSubtopic("SYSTEM CONCORD SECTOR SECURED");
            setMovieEventDescription("Starship fleets establish antimatter drives, charting tracks towards proximate stellar envelopes.");
          } else if (nextYear === 2100) {
            setMovieSubtopic("KARDASHEV STAGE 1 CIVILIZATION");
            setMovieEventDescription("The planetary collective achieves full coordination of light beams and clean orbital arrays, uniting humanity.");
          }
          return nextYear;
        });
      }, 4000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isMoviePlaying]);

  // 2. Interactive API dispatchers
  // Simulation Creator Call
  const handleSimulateCivilization = async () => {
    setIsSimulating(true);
    setSimStatusMsg("Synthesizing structural configurations... Spinning quantum cores...");
    
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: selectedYear, config, isCustomYearRequest: isCustomYearRequested })
      });
      const resData = await response.json();
      
      if (resData.success) {
        setIsTelemetryModeAI(resData.mode === "ai");
        if (resData.mode === "ai") {
          // AI results returned
          const d = resData.data;
          setDna({
            type: d.civilizationDnaName,
            name: d.civilizationDnaName,
            description: d.civilizationDescription,
            metrics: d.metrics
          });
          // map planet status
          const mappedPlanets = planets.map((p, idx) => {
            const up = d.planetaryUpdates.find((itm: any) => itm.planet.toLowerCase() === p.name.toLowerCase());
            if (up) {
              return { ...p, population: up.population, economy: up.economy, government: up.government, climate: up.climate, challenges: up.challenges, opportunities: up.opportunities };
            }
            return p;
          });
          setPlanets(mappedPlanets);

          // map news
          const mappedNews = d.newsArticles.map((n: any, idx: number) => ({
            id: `news_ai_${idx}`,
            title: n.title,
            category: n.category,
            content: n.content,
            year: selectedYear,
            impactScore: 80 + idx * 5
          }));
          setNews(mappedNews);
        } else {
          // Offline mode loaded local arrays
          const offlineDna = generateCivilizationDNA(config);
          setDna(offlineDna);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        setIsSimulating(false);
      }, 1000);
    }
  };

  // Time Travel Dispatcher
  const handleTimeTravel = (yearStr: string) => {
    const yr = parseInt(yearStr);
    if (!isNaN(yr) && yr >= 2025 && yr <= 3000) {
      setSelectedYear(yr);
      setIsCustomYearRequested(true);
      handleSimulateCivilization();
    }
  };

  // Chat Citizen Input sender
  const handleCitizenChat = async () => {
    if (!userChatInput.trim()) return;
    const msg = userChatInput;
    setUserChatInput("");
    setChatLog(prev => [...prev, { sender: "user", text: msg }]);
    setIsCitizenTyping(true);

    const activeCitizen = citizens.find(c => c.id === selectedCitizenId);
    
    try {
      const response = await fetch("/api/chat-citizen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizen: activeCitizen,
          year: selectedYear,
          config,
          messageHistory: chatLog,
          userMessage: msg
        })
      });
      const resData = await response.json();
      if (resData.success) {
        setIsTelemetryModeAI(resData.mode === "ai");
        setChatLog(prev => [...prev, { sender: "citizen", text: resData.reply }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCitizenTyping(false);
    }
  };

  // Ask Humanity caller
  const handleAskHumanity = async () => {
    if (!humanityQuery.trim()) return;
    setIsAskingHumanity(true);
    
    try {
      const response = await fetch("/api/ask-humanity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: selectedYear, config, query: humanityQuery })
      });
      const resData = await response.json();
      if (resData.success) {
        setIsTelemetryModeAI(resData.mode === "ai");
        setHumanityReply(resData.answer);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAskingHumanity(false);
    }
  };

  // Decision Lab forecaster
  const handleRunDecisionLab = async () => {
    if (!decisionQuery.trim()) return;
    setIsSimulating(true);
    setSimStatusMsg("Projecting probability outcomes and socio-cultural impacts...");

    try {
      const response = await fetch("/api/decision-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: decisionQuery, config, year: selectedYear })
      });
      const resData = await response.json();
      if (resData.success) {
        setIsTelemetryModeAI(resData.mode === "ai");
        setDecisionResult(resData.prognosis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  // Scenario Launcher
  const handleLaunchScenario = (scName: string) => {
    setWhatIfInput(`What if ${scName}?`);
    const sc = generateWhatIf(scName);
    setAlternateReality(sc);
  };

  return (
    <div className="relative min-h-screen bg-[#05070A] text-white flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* Background Atmosphere Glows from Recipe 7 */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900 rounded-full blur-[150px]"></div>
      </div>

      {/* 1. Header Navigation Profile Banner (Recipe 7 themed) */}
      <header className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-md px-6 py-4 sticky top-0 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Clock className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase">
              Time Machine <span className="text-cyan-400 font-mono">AI</span>
            </h1>
            <p className="text-[10px] text-cyan-400/60 font-mono tracking-widest uppercase">
              Civ-Simulation Engine v4.0.2
            </p>
          </div>
        </div>

        {/* Global Stats bar themed with Recipe 7 elements */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[9px] text-white/40 font-mono uppercase tracking-widest">TEMPORAL COORDINATE</div>
            <div className="text-xl font-mono text-cyan-400 font-bold">{selectedYear} AD</div>
          </div>
          <div className="w-px h-8 bg-white/20 hidden sm:block"></div>
          
          <div className="hidden md:flex flex-col text-right">
            <div className="text-[9px] text-white/40 font-mono uppercase tracking-widest">DNA SPECTRUM</div>
            <div className="text-xs font-mono text-indigo-400 font-bold uppercase">{dna.type}</div>
          </div>
          <div className="w-px h-8 bg-white/20 hidden md:block"></div>

          <div className={`px-3 py-1 bg-green-500/10 border ${isTelemetryModeAI ? "border-emerald-500/50 text-emerald-400" : "border-cyan-500/50 text-cyan-400"} rounded text-[10px] font-mono tracking-wider uppercase`}>
            {isTelemetryModeAI ? "STABLE AI ENGINE" : "STABLE PREDICTED"}
          </div>
        </div>
      </header>

      {/* 2. Main Workstation Area split screen Layout */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT SIDEBAR (15 Items list, themed to Recipe 7) */}
        <nav className="w-full lg:w-60 border-r border-white/10 bg-black/20 backdrop-blur-sm flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto shrink-0 p-3 gap-1">
          
          <div className="text-[10px] text-white/30 font-bold tracking-widest mb-3 px-2 uppercase hidden lg:block">
            Core Modules
          </div>

          {[
            { id: "future_explorer", name: "Future Explorer", num: "01", icon: Clock },
            { id: "solar_system", name: "Solar System", num: "02", icon: Globe2 },
            { id: "civ_simulator", name: "Civ Simulator", num: "03", icon: Sliders },
            { id: "civ_dna", name: "Civilization DNA", num: "04", icon: Award },
            { id: "alternate_reality", name: "Alternate Reality", num: "05", icon: GitFork },
            { id: "future_citizens", name: "Future Citizens", num: "06", icon: Users },
            { id: "future_news", name: "Future News", num: "07", icon: Newspaper },
            { id: "tech_tree", name: "Tech Tree", num: "08", icon: Zap },
            { id: "decision_lab", name: "Decision Lab", num: "09", icon: Compass },
            { id: "scenario_builder", name: "Scenario Builder", num: "10", icon: Sparkles },
            { id: "planet_monitor", name: "Planet Monitor", num: "11", icon: Activity },
            { id: "knowledge_graph", name: "Knowledge Graph", num: "12", icon: Network },
            { id: "my_timeline", name: "My Timeline", num: "13", icon: Calendar },
            { id: "global_risks", name: "Global Risks", num: "14", icon: AlertTriangle },
            { id: "settings", name: "Settings Hub", num: "15", icon: SettingsIcon }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2 text-xs font-mono rounded transition shrink-0 lg:w-full select-none ${
                  isActive
                    ? "bg-white/10 border-l-2 border-cyan-400 text-white font-bold"
                    : "text-white/60 hover:bg-white/5"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] border ${
                  isActive ? "bg-cyan-400/20 border-cyan-400 text-cyan-300" : "border-white/20 text-white/40"
                }`}>
                  {item.num}
                </span>
                <span>{item.name}</span>
              </button>
            );
          })}

          <div className="mt-auto hidden lg:block pt-3">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <p className="text-[9px] text-indigo-300 font-mono mb-1 tracking-wider uppercase">CIV DNA FOUNDRY</p>
              <p className="text-xs text-white/90 truncate font-semibold">{dna.name}</p>
            </div>
          </div>
        </nav>

        {/* CENTER PRIMARY INTERACTIVE SCREEN */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-transparent border-r border-white/10 relative">
          
          {/* Quick Year jump banner (Recipe 7 styling) */}
          <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-[10px] text-white/40 font-mono block uppercase tracking-widest">Select Temporal Coordinate</span>
                <span className="text-sm font-semibold text-white/90">Time-Coordinate Quantum Jump</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[2030, 2050, 2100, 2200, 2500].map((yr) => (
                <button
                  key={yr}
                  onClick={() => {
                    setYearInput(String(yr));
                    handleTimeTravel(String(yr));
                  }}
                  className={`px-3 py-1.5 rounded font-mono text-xs transition cursor-pointer select-none ${
                    selectedYear === yr
                      ? "bg-cyan-400 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                      : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {yr}
                </button>
              ))}
              <div className="flex items-center gap-1.5 border border-white/10 rounded-lg bg-black/60 p-1 pl-3">
                <span className="text-[9px] font-mono text-white/40 tracking-wider">CUSTOM:</span>
                <input
                  type="number"
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  className="w-16 bg-transparent text-xs text-white font-mono focus:outline-none placeholder-white/20"
                  min="2025"
                  max="3000"
                />
                <button
                  onClick={() => handleTimeTravel(yearInput)}
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded text-[9px] font-mono text-cyan-400 uppercase font-bold transition-colors"
                >
                  Shift
                </button>
              </div>
            </div>
          </div>

          {/* SIMULATION LOADER (Recipe 7 with pulsing glow) */}
          {isSimulating && (
            <div className="mb-6 bg-cyan-950/20 border border-cyan-500/30 p-4 rounded-xl flex items-center gap-4 animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <div className="w-6 h-6 border-2 border-t-cyan-400 border-r-cyan-400 border-b-transparent border-l-transparent rounded-full animate-spin" />
              <div className="flex-1">
                <span className="text-xs font-mono text-cyan-400 block font-bold uppercase tracking-wider">RESOLVING SPECULATIVE TIMELINE MATRIX...</span>
                <span className="text-[10px] text-white/60 font-mono">{simStatusMsg}</span>
              </div>
            </div>
          )}

          {/* DYNAMIC SCREEN SWITCHER */}
          <AnimatePresence mode="wait">
            
            {/* View 1: Future Explorer */}
            {activeTab === "future_explorer" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="future_explorer_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Future Explorer
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Temporal Index: Observation Node. Coordinate: Lat 14.15 // Elev 4022m
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="h-[340px] bg-black/40 backdrop-blur rounded-xl border border-white/10 p-4 flex items-center justify-center relative overflow-hidden">
                    <ThreeDEarth activePlanetId="earth" />
                    {/* Atmospheric tag overlay from Recipe 7 */}
                    <div className="absolute bottom-3 left-3 p-2 bg-black/80 rounded border border-white/5 text-[9px] font-mono text-white/60">
                      SYS_GRID_ORB: ACTIVE
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-black/40 backdrop-blur p-5 rounded-xl border border-white/10 space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Globe2 className="w-4 h-4" />
                        <span className="text-[10px] font-bold font-mono uppercase tracking-widest">TEMPORAL PROGNOSIS</span>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{dna.name}</h3>
                      <p className="text-xs leading-relaxed text-white/60 font-mono">{dna.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <span className="text-[9px] text-white/40 tracking-wider">INNOVATION</span>
                        <div className="text-lg font-bold text-cyan-400">{dna.metrics.innovation}%</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <span className="text-[9px] text-white/40 tracking-wider">HAPPINESS INDEX</span>
                        <div className="text-lg font-bold text-rose-400">{dna.metrics.happiness}%</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <span className="text-[9px] text-white/40 tracking-wider">AUTOMATION CAPACITY</span>
                        <div className="text-lg font-bold text-purple-400">{dna.metrics.automation}%</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <span className="text-[9px] text-white/40 tracking-wider">CLIMATIC SUSTAINABILITY</span>
                        <div className="text-lg font-bold text-emerald-400">{dna.metrics.sustainability}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 backdrop-blur p-5 rounded-xl border border-white/10">
                  <h3 className="text-xs font-bold font-mono text-cyan-400 mb-4 uppercase tracking-widest">CHRONOLOGICAL LOG MATRIX</h3>
                  <div className="relative pl-6 border-l border-white/15 space-y-5">
                    {timeline.map((ev, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full border border-cyan-400 bg-[#05070A] shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        <div className="font-mono text-[10px] text-cyan-400 font-bold">{ev.year} AD</div>
                        <h4 className="text-xs font-bold text-white/90 mt-0.5 tracking-tight">{ev.title}</h4>
                        <p className="text-[11px] text-white/50 mt-1 leading-relaxed font-mono">{ev.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* View 2: Solar System Explorer (Recipe 7 styling) */}
            {activeTab === "solar_system" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="solar_system_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Solar System Explorer
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Exoplanetary colony index. Sol coordinates: Orbit 1.00 // Core stable solar radius.
                  </p>
                </div>

                {/* Horizontal celestial slider tabs */}
                <div className="flex border-b border-white/10 overflow-x-auto gap-2">
                  {planets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setFocusedPlanetId(p.id)}
                      className={`px-4 py-2 text-xs font-mono capitalize transition cursor-pointer select-none whitespace-nowrap ${
                        focusedPlanetId === p.id
                          ? "border-b-2 border-cyan-400 text-cyan-400 font-bold"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Planet graphic representation */}
                  <div className="md:col-span-1 h-[260px] bg-black/40 backdrop-blur rounded-xl border border-white/10 p-4 flex items-center justify-center relative">
                    <ThreeDEarth activePlanetId={focusedPlanetId} />
                    <div className="absolute top-2 right-2 text-[8px] font-mono text-white/30 uppercase">SPATIAL RENDER: OK</div>
                  </div>

                  {/* Planet status card overlay */}
                  <div className="md:col-span-2 bg-black/40 backdrop-blur p-5 rounded-xl border border-white/10 space-y-4">
                    {planets
                      .filter((p) => p.id === focusedPlanetId)
                      .map((p) => (
                        <div key={p.id} className="space-y-3">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="text-sm font-bold text-white font-mono tracking-tight">{p.name.toUpperCase()} SYSTEM STATUS</span>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20 uppercase tracking-wider">
                              {p.expansionRate} Exp.
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 font-mono">
                            <div>
                              <span className="text-[9px] text-white/40 block">COLONIAL POPULATION</span>
                              <p className="text-xs text-white font-bold">{p.population}</p>
                            </div>
                            <div>
                              <span className="text-[9px] text-white/40 block">ECONOMIC ENGINE</span>
                              <p className="text-xs text-white font-bold">{p.economy}</p>
                            </div>
                            <div>
                              <span className="text-[9px] text-white/40 block">GOVERNMENT MODEL</span>
                              <p className="text-xs text-white font-bold">{p.government}</p>
                            </div>
                            <div>
                              <span className="text-[9px] text-white/40 block">BIOPRESERVATION MATRIX</span>
                              <p className="text-xs text-white font-bold">{p.climate}</p>
                            </div>
                          </div>

                          <div className="bg-black/60 p-3 rounded-lg border border-white/5 text-[11px] font-mono leading-relaxed space-y-2">
                            <div>
                              <span className="text-amber-400 font-bold uppercase tracking-wide text-[9px]">[ CHRONO RISK CHALLENGES ]</span>
                              <p className="text-white/60 mt-0.5">{p.challenges}</p>
                            </div>
                            <div className="pt-2 border-t border-white/5">
                              <span className="text-cyan-400 font-bold uppercase tracking-wide text-[9px]">[ STRATEGIC PROJECTIONS ]</span>
                              <p className="text-white/60 mt-0.5">{p.opportunities}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* View 3: Civilization Simulator (The Core Dial) */}
            {activeTab === "civ_simulator" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="civ_simulator_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Civilization DNA Simulator
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Map the foundation parameters of human society. Spark custom mutations and calculate DNA patterns.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dial 1: Government */}
                  <div className="bg-black/40 backdrop-blur p-4 rounded-xl border border-white/10 space-y-2">
                    <span className="text-[10px] text-cyan-400 font-mono block font-bold uppercase tracking-wider">01 // GOVERNMENT STRUCTURE</span>
                    <select
                      value={config.government}
                      onChange={(e) => setConfig({ ...config, government: e.target.value as GovernmentType })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white/90 focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value={GovernmentType.DEMOCRACY}>Democracy (Direct Citizen Mesh Voting)</option>
                      <option value={GovernmentType.AI_GOVERNANCE}>AI Governance (Benevolent Logistics Optimization)</option>
                      <option value={GovernmentType.TECHNOCRACY}>Technocracy (Decision Making of Allied Academic Councils)</option>
                      <option value={GovernmentType.COLLECTIVE_INTELLIGENCE}>Collective Intelligence (Neural Consensus Network)</option>
                    </select>
                    <p className="text-[10px] text-white/40 font-mono">Modulates the core legislative structure and municipal control dynamics.</p>
                  </div>

                  {/* Dial 2: Economy */}
                  <div className="bg-black/40 backdrop-blur p-4 rounded-xl border border-white/10 space-y-2">
                    <span className="text-[10px] text-cyan-400 font-mono block font-bold uppercase tracking-wider">02 // RESOURCE ENGINE</span>
                    <select
                      value={config.economy}
                      onChange={(e) => setConfig({ ...config, economy: e.target.value as EconomyType })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white/90 focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value={EconomyType.CAPITALISM}>Capitalism (Free Interplanetary Stock Markets)</option>
                      <option value={EconomyType.RESOURCE_BASED}>Resource Based (Circular Real-time Reserve Balance)</option>
                      <option value={EconomyType.POST_SCARCITY}>Post Scarcity (Unified Synth Distribution Pools)</option>
                    </select>
                    <p className="text-[10px] text-white/40 font-mono">Impacts resource allocations, sustenance accessibility, and workforce modeling.</p>
                  </div>

                  {/* Dial 3: Energy */}
                  <div className="bg-black/40 backdrop-blur p-4 rounded-xl border border-white/10 space-y-2">
                    <span className="text-[10px] text-cyan-400 font-mono block font-bold uppercase tracking-wider">03 // ENERGY CORE HARNESS</span>
                    <select
                      value={config.energy}
                      onChange={(e) => setConfig({ ...config, energy: e.target.value as EnergySource })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white/90 focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value={EnergySource.SOLAR}>Solar Grid (Planetary Solar Collectors)</option>
                      <option value={EnergySource.FUSION}>Fusion Core (Decentralized Deuterium Burners)</option>
                      <option value={EnergySource.ANTIMATTER}>Antimatter (Deep Plasma Thrusters / Space Fuel)</option>
                    </select>
                    <p className="text-[10px] text-white/40 font-mono">Defines power supply thresholds, emission baselines, and exploratory bounds.</p>
                  </div>

                  {/* Dial 4: Education */}
                  <div className="bg-black/40 backdrop-blur p-4 rounded-xl border border-white/10 space-y-2">
                    <span className="text-[10px] text-cyan-400 font-mono block font-bold uppercase tracking-wider">04 // COGNITIVE INTEGRATIONS</span>
                    <select
                      value={config.education}
                      onChange={(e) => setConfig({ ...config, education: e.target.value as EducationType })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white/90 focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value={EducationType.TRADITIONAL}>Traditional (Universal Spatial Academies)</option>
                      <option value={EducationType.AI_ASSISTED}>AI Assisted (Spatial Reality Sandbox Tutors)</option>
                      <option value={EducationType.UNIVERSAL_LEARNING}>Universal Learning (Direct Neuro-Mesh Download Pools)</option>
                    </select>
                    <p className="text-[10px] text-white/40 font-mono">Sets core scientific output velocity and human collective capabilities.</p>
                  </div>

                  {/* Dial 5: Space Expansion */}
                  <div className="bg-black/40 backdrop-blur p-4 rounded-xl border border-white/10 col-span-1 md:col-span-2 space-y-2">
                    <span className="text-[10px] text-cyan-400 font-mono block font-bold uppercase tracking-wider">05 // CELESTIAL BOUNDARY LIMITS</span>
                    <select
                      value={config.spaceExpansion}
                      onChange={(e) => setConfig({ ...config, spaceExpansion: e.target.value as SpaceExpansion })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white/90 focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value={SpaceExpansion.EARTH_ONLY}>Earth Only (Planetary Core Focus)</option>
                      <option value={SpaceExpansion.MOON}>Luna Colony (L-2 Shipyard Complexes)</option>
                      <option value={SpaceExpansion.MARS}>Mars Settlement (subsurface lava tube architectures)</option>
                      <option value={SpaceExpansion.INTERSTELLAR}>Interstellar Frontier (Fibers across Alpha Centauri)</option>
                    </select>
                    <p className="text-[10px] text-white/40 font-mono">Determines geopolitical boundaries, resource access nodes, and species survival index.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSimulateCivilization}
                    className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-3.5 px-6 rounded-xl font-mono text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Spark Civilization Simulation</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* View 4: Civilization DNA Graph */}
            {activeTab === "civ_dna" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="civ_dna_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Civilization DNA Analyzer
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Multi-parameter societal diagnostics. Radar configuration maps structural focus vectors.
                  </p>
                </div>

                <div className="bg-black/40 backdrop-blur border border-white/10 p-5 rounded-xl space-y-4 relative">
                  <div className="absolute top-0 right-0 w-24 h-0.5 bg-cyan-400 animate-pulse" />
                  <div className="flex items-center gap-2 justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[9px] text-white/40 font-mono block tracking-widest uppercase">SPECIES SPECTRUM PROFILE</span>
                      <h3 className="text-lg font-mono font-bold text-cyan-400">{dna.name.toUpperCase()}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-400/10 px-2.5 py-1 rounded border border-cyan-400/20 uppercase font-bold tracking-wider">
                      {dna.type}
                    </span>
                  </div>

                  <p className="text-xs text-white/60 font-mono leading-relaxed">{dna.description}</p>
                </div>

                {/* Radar chart module */}
                <div className="bg-black/20 rounded-xl border border-white/10 p-4">
                  <CivRadarChart metrics={dna.metrics} />
                </div>
              </motion.div>
            )}

            {/* View 5: Alternate Reality "What-If" */}
            {activeTab === "alternate_reality" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="alternate_reality_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Alternate Reality Simulator
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Input a key "What If" prompt to generate completely alternative histories, culture adjustments, and technological timelines.
                  </p>
                </div>

                <div className="bg-black/40 backdrop-blur p-5 rounded-xl border border-white/10 space-y-4">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block tracking-widest">Input Temporal Shift Pivot Prompt</span>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={whatIfInput}
                      onChange={(e) => setWhatIfInput(e.target.value)}
                      placeholder="e.g. What if AI was invented in 1980?"
                      className="flex-1 bg-[#05070a] border border-white/10 rounded-lg p-2.5 px-4 text-xs focus:outline-none focus:border-cyan-400 text-white font-mono placeholder-white/25"
                    />
                    <button
                      onClick={() => handleLaunchScenario(whatIfInput)}
                      className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-6 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition cursor-pointer"
                    >
                      Branch Reality
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 items-center">
                    <span className="text-[9px] text-white/40 font-mono uppercase tracking-widest font-bold">PRESETS:</span>
                    {["dinosaurs survived", "AI invented in 1980", "internet never existed", "Mars gained independence"].map((prs) => (
                      <button
                        key={prs}
                        onClick={() => handleLaunchScenario(prs)}
                        className="bg-black/30 hover:bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] font-mono text-white/60 cursor-pointer transition-colors"
                      >
                        {prs}
                      </button>
                    ))}
                  </div>
                </div>

                {alternateReality && (
                  <div className="bg-black/30 backdrop-blur rounded-xl border border-cyan-500/20 p-5 space-y-4">
                    <div className="border-b border-white/10 pb-3">
                      <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest">CAUSAL INFLECTION: {alternateReality.whatIf.toUpperCase()}</span>
                      <p className="text-xs text-white/50 mt-1 font-mono">{alternateReality.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono leading-relaxed text-white/70">
                      <div className="space-y-1.5 p-3 rounded-lg bg-black/40 border border-white/5">
                        <div className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">ALTERNATIVE SOCIETY</div>
                        <p className="text-white/60 text-[11px] leading-relaxed">{alternateReality.society}</p>
                      </div>
                      <div className="space-y-1.5 p-3 rounded-lg bg-black/40 border border-white/5">
                        <div className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">ALTERNATIVE ECONOMY</div>
                        <p className="text-white/60 text-[11px] leading-relaxed">{alternateReality.economy}</p>
                      </div>
                      <div className="space-y-1.5 p-3 rounded-lg bg-black/40 border border-white/5">
                        <div className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">CULTURE ADJUSTMENTS</div>
                        <p className="text-white/60 text-[11px] leading-relaxed">{alternateReality.culture}</p>
                      </div>
                      <div className="space-y-1.5 p-3 rounded-lg bg-black/40 border border-white/5">
                        <div className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">NOVEL TECHNOLOGIES</div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {alternateReality.technologies.map((t, idx) => (
                            <span key={idx} className="bg-black/60 px-2 py-0.5 rounded border border-white/10 text-[10px] text-cyan-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                      <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase block mb-3">Timeline Inflection Points</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
                        {alternateReality.timeline.map((point, idx) => (
                          <div key={idx} className="bg-slate-950 p-3 rounded border border-slate-800 relative overflow-hidden">
                            <span className="absolute -right-3 -bottom-5 text-4xl text-slate-900/60 font-bold font-mono select-none">{idx+1}</span>
                            <div className="text-teal-400 font-bold text-[11px]">{point.year} AD</div>
                            <div className="text-slate-200 font-bold text-[11px] mt-0.5">{point.title}</div>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">{point.event}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* View 6: Future Citizens Chat room (Recipe 7 styling) */}
            {activeTab === "future_citizens" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="future_citizens_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Future Citizens Assembly
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Interact directly with simulated humans residing in current future timelines. Learn about their daily schedules, challenges, and beliefs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[440px]">
                  {/* Citizens roster list */}
                  <div className="bg-black/40 backdrop-blur rounded-xl border border-white/10 p-3.5 space-y-2 overflow-y-auto">
                    <span className="text-[9px] text-white/40 font-mono block uppercase px-1 tracking-widest font-bold">Roster Profiles ({selectedYear})</span>
                    {citizens.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCitizenId(c.id)}
                        className={`p-2.5 rounded-lg border cursor-pointer transition flex items-center gap-2.5 ${
                          selectedCitizenId === c.id
                            ? "bg-cyan-500/10 border-cyan-400/40"
                            : "border-white/5 hover:border-white/10 bg-black/20"
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-xs"
                          style={{ backgroundColor: c.avatarColor, color: "#000" }}
                        >
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                          <p className="text-[10px] text-white/40 truncate font-mono">{c.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Active Chat box inside right span */}
                  <div className="md:col-span-2 bg-black/40 backdrop-blur rounded-xl border border-white/10 overflow-hidden flex flex-col h-full">
                    {/* Header profile */}
                    {citizens
                      .filter(c => c.id === selectedCitizenId)
                      .map(sc => (
                        <div key={sc.id} className="bg-[#05070a]/60 p-3 border-b border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded font-mono font-bold text-xs flex items-center justify-center text-black"
                              style={{ backgroundColor: sc.avatarColor }}
                            >
                              {sc.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white">{sc.name.toUpperCase()}</h4>
                              <p className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase">{sc.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                    {/* Chat log segments */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/20 font-mono text-[11px] leading-relaxed">
                      {chatLog.map((chat, idx) => {
                        const isUser = chat.sender === "user";
                        return (
                          <div
                            key={idx}
                            className={`flex flex-col max-w-[85%] ${isUser ? "ml-auto items-end" : "mr-auto items-start"}`}
                          >
                            <span className="text-[8px] text-white/30 uppercase tracking-widest mb-1.5 font-bold">{isUser ? "Traveler" : "Citizen"}</span>
                            <div
                              className={`p-2.5 rounded-lg border ${
                                isUser
                                  ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300 rounded-tr-none"
                                  : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                              }`}
                            >
                              {chat.text}
                            </div>
                          </div>
                        );
                      })}
                      {isCitizenTyping && (
                        <div className="text-[9px] font-mono text-cyan-400 animate-pulse flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span className="tracking-widest uppercase">Synapse connection re-indexing reply...</span>
                        </div>
                      )}
                    </div>

                    {/* Input send bar */}
                    <div className="p-3.5 bg-[#05070a]/90 border-t border-white/10 flex gap-2">
                      <input
                        type="text"
                        value={userChatInput}
                        onChange={(e) => setUserChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCitizenChat()}
                        placeholder="Say something to the citizen..."
                        className="flex-1 bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        onClick={handleCitizenChat}
                        className="bg-cyan-400 hover:bg-cyan-300 px-4 rounded-lg text-black font-bold transition flex items-center justify-center cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* View 7: Future News newspaper board */}
            {activeTab === "future_news" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="future_news_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Future News Network
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Real-time newspaper stories generated dynamically based on chosen social, civic, and spatial parameters.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {news.map((n) => (
                    <div key={n.id} className="bg-black/40 backdrop-blur p-4 rounded-xl border border-white/10 space-y-3 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                        <span className="text-cyan-400 font-bold uppercase bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                          {n.category}
                        </span>
                        <span className="text-white/40">{n.year} AD REPORT</span>
                      </div>
                      <h4 className="text-sm font-bold text-white tracking-tight leading-snug">{n.title}</h4>
                      <p className="text-xs text-white/60 leading-normal font-mono">{n.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* View 8: Tech Tree progression */}
            {activeTab === "tech_tree" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="tech_tree"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Planetary Tech Tree
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Technology tier indexes that map physical exploration and computation capacity grids unlocked by species.
                  </p>
                </div>

                {/* Tech tiers grid */}
                <div className="space-y-6">
                  {[
                    {
                      tier: "Tier 1: Emerging Fusion Era (2030+)",
                      nodes: [
                        { name: "Sputtered Fusion Cores", status: "unlocked", desc: "Allows decentralised plasma containment generators." },
                        { name: "Alnico Agri-Greenhouses", status: "unlocked", desc: "Multiplies regional Martian biomass productivity." }
                      ]
                    },
                    {
                      tier: "Tier 2: Cognitive Mesh Integration (2060+)",
                      nodes: [
                        { name: "Cerebral Entangled Transceivers", status: selectedYear >= 2060 ? "unlocked" : "locked", desc: "Instant skill transmission networks." },
                        { name: "Molecular Synth Assemblies", status: selectedYear >= 2060 ? "unlocked" : "locked", desc: "Converts waste elements into organic matter." }
                      ]
                    },
                    {
                      tier: "Tier 3: Dyson Ringlets Assembly (2100+)",
                      nodes: [
                        { name: "Hale Antimatter Mirror Drives", status: selectedYear >= 2100 ? "unlocked" : "locked", desc: "Powers starships cleared for Centauri voyages." },
                        { name: "Planetary Geo-shading Screens", status: selectedYear >= 2100 ? "unlocked" : "locked", desc: "Regulates regional solar radiation curves." }
                      ]
                    }
                  ].map((level, idx) => (
                    <div key={idx} className="space-y-3">
                      <h4 className="text-[10px] font-mono font-bold text-cyan-400 border-b border-white/10 pb-1.5 uppercase tracking-widest">{level.tier}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {level.nodes.map((node, nidx) => (
                          <div
                            key={nidx}
                            className={`p-3.5 rounded-xl border transition space-y-1.5 ${
                              node.status === "unlocked"
                                ? "bg-black/40 backdrop-blur border-cyan-400/20"
                                : "bg-black/10 border-white/5 opacity-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold font-mono text-white/90">{node.name}</span>
                              <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                                node.status === "unlocked" ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20" : "bg-white/5 text-white/40 border border-white/10"
                              }`}>
                                {node.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-white/50 font-mono leading-normal">{node.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* View 9: Decision Lab */}
            {activeTab === "decision_lab" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="decision_id_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Decision Lab & Impact Prognosis
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Test potential civilization-altering questions. Calculate systemic Pros, Cons, and timeline changes before you act.
                  </p>
                </div>

                <div className="bg-black/40 backdrop-blur p-5 rounded-xl border border-white/10 space-y-4">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase tracking-widest">PROPOSE A LEGISLATIVE REVISION</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={decisionQuery}
                      onChange={(e) => setDecisionQuery(e.target.value)}
                      placeholder="e.g. Should Mars become independent?"
                      className="flex-grow bg-[#05070a] border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-400 text-white font-mono placeholder-white/20"
                    />
                    <button
                      onClick={handleRunDecisionLab}
                      className="bg-cyan-400 hover:bg-cyan-300 text-black px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition duration-200 cursor-pointer"
                    >
                      Project Analysis
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] text-white/40 font-mono items-center">
                    <span className="py-1 uppercase tracking-widest font-bold text-[9px]">SUGGESTIONS:</span>
                    {["Should AI regulate local markets?", "Should Mars become independent?", "Should fusion models be royalty-free?"].map(sug => (
                      <button
                        key={sug}
                        onClick={() => {
                          setDecisionQuery(sug);
                        }}
                        className="bg-black/45 hover:bg-white/5 border border-white/10 px-2.5 py-1 rounded text-white/60 cursor-pointer transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>

                {decisionResult && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/30 backdrop-blur border border-white/10 p-5 rounded-xl">
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block border-b border-white/10 pb-2 tracking-widest">POTENTIAL PROS</span>
                      <ul className="text-xs font-mono list-disc pl-4 space-y-2 text-white/70">
                        {decisionResult.pros.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-rose-400 font-bold uppercase block border-b border-white/10 pb-2 tracking-widest">POTENTIAL CONS</span>
                      <ul className="text-xs font-mono list-disc pl-4 space-y-2 text-white/70">
                        {decisionResult.cons.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="md:col-span-2 pt-4 border-t border-white/10 space-y-3 font-mono text-[11px] leading-relaxed">
                      <div>
                        <span className="text-cyan-400 font-bold block uppercase tracking-wider text-[10px]">[ GLOBAL EARTH IMPACT ]</span>
                        <p className="text-white/60 mt-0.5">{decisionResult.globalImpact}</p>
                      </div>
                      <div>
                        <span className="text-cyan-400 font-bold block uppercase tracking-wider text-[10px]">[ CHRONOLOGICAL TIMELINE PATH SHIFT ]</span>
                        <p className="text-white/60 mt-0.5">{decisionResult.timelineImpact}</p>
                      </div>
                      <div>
                        <span className="text-cyan-400 font-bold block uppercase tracking-wider text-[10px]">[ CIVILIZATIONAL LONG-RANGE OUTLOOK ]</span>
                        <p className="text-white/60 mt-0.5">{decisionResult.civilizationalImpact}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* View 10: Scenario Builder (One click) */}
            {activeTab === "scenario_builder" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="scenario_builder_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Scenario Launcher Node
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Instantly project complete species-evolution branches with a single click. Select template causal chains.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { title: "What if AI becomes free?", desc: "Automation values hit absolute limits instantly.", action: "What if advanced AI agents were integrated as constitutional partners?" },
                    { title: "What if fusion succeeds?", desc: "Clean power grids eliminate raw depletion limits.", action: "What if fusion energy succeeded as 100% open source?" },
                    { title: "What if mesh education universal?", desc: "Bypasses school grids, opening intellectual bursts.", action: "What if cognitive mesh links became free and universal?" },
                    { title: "What if Mars gained sovereignty?", desc: "Shifts spatial trade models off standard Earth.", action: "What if Mars gained total system independence?" }
                  ].map((sc, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveTab("alternate_reality");
                        handleLaunchScenario(sc.action);
                      }}
                      className="bg-black/40 backdrop-blur p-4 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 cursor-pointer space-y-2 group"
                    >
                      <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider group-hover:text-cyan-400 transition-colors">{sc.title}</h4>
                      <p className="text-[10px] text-white/50 font-mono leading-normal">{sc.desc}</p>
                      <div className="text-[9px] font-mono text-cyan-400 flex items-center justify-end gap-0.5 pt-1 font-bold uppercase tracking-wider">
                        <span>LAUNCH</span>
                        <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* View 11: Planet Monitor */}
            {activeTab === "planet_monitor" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="planet_monitor_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Live Planet Monitor
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Real-time structural telemetry comparifier. Map planetary expansion rate metrics across the Sol system.
                  </p>
                </div>

                <div className="overflow-x-auto bg-black/40 backdrop-blur border border-white/10 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-[#05070a]/60 border-b border-white/10 text-white/50 uppercase text-[9px] tracking-wider">
                        <th className="p-3.5">Celestial Orb</th>
                        <th className="p-3.5">Socio Population</th>
                        <th className="p-3.5">Economic Engine</th>
                        <th className="p-3.5">Climatic Verdict</th>
                        <th className="p-3.5">Energy Unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {planets.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5 font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                            <span>{p.name.toUpperCase()}</span>
                          </td>
                          <td className="p-3.5 font-mono text-white/70">{p.population}</td>
                          <td className="p-3.5 text-[11px] truncate max-w-[150px] text-white/60 font-mono" title={p.economy}>{p.economy}</td>
                          <td className="p-3.5 text-[11px] truncate max-w-[150px] text-white/60 font-mono" title={p.climate}>{p.climate}</td>
                          <td className="p-3.5 text-cyan-400 font-mono">{p.energy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* View 12: Knowledge Graph (Interactive Node system) */}
            {activeTab === "knowledge_graph" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="knowledge_graph_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Fabric IQ Civilization Knowledge Graph
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Visual network engine illustrating cause-and-effect mappings between Technology, Education, Environment, and Quality of Life.
                  </p>
                </div>

                <KnowledgeGraph config={config} />
              </motion.div>
            )}

            {/* View 13: My Timeline progression map */}
            {activeTab === "my_timeline" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="my_timeline_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    My Civilization Timeline
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Play the animated documentary history logs of humanity as simulated by the algorithm.
                  </p>
                </div>

                <div className="bg-black/40 backdrop-blur border border-white/10 p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">Chronological Documentary Player</span>
                    <button
                      onClick={() => {
                        if (!isMoviePlaying) {
                          setMovieYear(2025);
                        }
                        setIsMoviePlaying(!isMoviePlaying);
                      }}
                      className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-widest transition cursor-pointer"
                    >
                      {isMoviePlaying ? "PAUSE SIMULATION" : "PLAY TIMELINE MOVIE"}
                    </button>
                  </div>

                  <div className="bg-[#05070a]/80 p-6 rounded-lg relative overflow-hidden flex flex-col justify-between h-[180px] border border-white/10">
                    <div className="absolute top-2 right-2 text-[8px] font-mono text-white/30 tracking-widest uppercase">DOCUMENTARY_METE_STREAM: ACTIVE</div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest animate-pulse">{movieSubtopic}</span>
                      <h4 className="text-2xl font-bold text-white font-sans">{movieYear} AD</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-white/70 font-mono">{movieEventDescription}</p>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                        style={{ width: `${((movieYear - 2025) / 75) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* View 14: Global Risks board */}
            {activeTab === "global_risks" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="global_risks_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Live Risks Dashboard
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    Active monitors watching societal collapse vectors. Mitigation programs in progress listed below.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {risks.map((r) => (
                    <div key={r.id} className="bg-black/40 backdrop-blur p-4 rounded-xl border border-white/10 space-y-3 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-center justify-between font-mono text-[10px] border-b border-white/5 pb-2">
                        <span className="text-white font-bold uppercase tracking-wider">{r.name}</span>
                        <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] uppercase tracking-wider ${
                          r.status === "CRITICAL" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                          r.status === "HIGH" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        }`}>
                          {r.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 font-mono">
                        <div className="bg-[#05070a]/60 p-2.5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-white/40 font-mono block uppercase tracking-wider">PROBABILITY</span>
                          <div className="text-sm font-bold text-white mt-0.5">{r.probability}%</div>
                        </div>
                        <div className="bg-[#05070a]/60 p-2.5 rounded-lg border border-white/5">
                          <span className="text-[9px] text-white/40 font-mono block uppercase tracking-wider">SYSTEM IMPACT</span>
                          <div className="text-sm font-bold text-white mt-0.5">{r.impact}/100</div>
                        </div>
                      </div>

                      <div className="font-mono text-[10px] pt-1">
                        <span className="text-cyan-400 font-bold uppercase block tracking-wider text-[9px]">MITIGATION PROGRAM:</span>
                        <p className="text-white/60 mt-1 leading-normal">{r.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* View 15: Settings Hackathon Node Hub */}
            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="settings_screen"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Diagnostics & Node Settings
                  </h2>
                  <p className="text-xs text-white/50 font-mono mt-1">
                    System calibrations, developer profile node endpoints, environment configurations, and secrets logs.
                  </p>
                </div>

                <div className="bg-black/40 backdrop-blur border border-white/10 p-5 rounded-xl space-y-4 font-mono text-xs leading-relaxed text-white/70">
                  <h4 className="border-b border-white/10 pb-2 font-bold text-cyan-400 uppercase tracking-widest text-[10px]">DEVELOPMENT CREDENTIALS UNIFORM</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-bold tracking-wider">PLATFORM ADMIN:</span>
                      <p className="text-white font-bold select-all mt-0.5">MADHAVALR4321@gmail.com</p>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-bold tracking-wider">SYSTEM CONTAINER WORKPORT:</span>
                      <p className="text-white font-bold mt-0.5">3000 (INGRESS ACTIVE)</p>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-bold tracking-wider">ROUTING SYSTEM GATEWAY:</span>
                      <p className="text-white font-bold mt-0.5">express + vite unified client proxy</p>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-bold tracking-wider">QUALIFIED RUNTIME STACK:</span>
                      <p className="text-white font-bold mt-0.5">React 19 + TypeScript V5</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-[11px]">
                    <span className="text-amber-500 font-bold block mb-1 uppercase tracking-wider text-[9px]">INTERPLANETARY QUANTUM RE-INDEX NOTE:</span>
                    <p className="text-white/60 leading-normal">
                      Vegas Hackathon preview system initialized safely. API integrations are server-side proxies, hidden from DOM exposure to preserve key isolation systems.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* RIGHT DETAILS HUD PANEL */}
        <aside className="w-full lg:w-80 bg-black/40 backdrop-blur border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col shrink-0">
          
          {/* Tabs switch */}
          <div className="flex border-b border-white/10 bg-[#05070a]/80">
            {["overview", "timeline", "risks", "citizens", "news", "ask_future"].map((t) => (
              <button
                key={t}
                onClick={() => setRightPanelTab(t)}
                className={`flex-1 py-3 text-[9px] font-mono text-center transition tracking-wider select-none cursor-pointer ${
                  rightPanelTab === t
                    ? "bg-black/30 border-b-2 border-cyan-400 text-cyan-400 font-bold"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab content scroll space */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            
            {/* Overview Detail */}
            {rightPanelTab === "overview" && (
              <div className="space-y-4 font-mono text-xs">
                <div className="bg-[#05070a]/60 p-3 rounded-lg border border-white/10 space-y-2">
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">Foundry IQ Prognosis</span>
                  <p className="text-[11px] leading-relaxed text-white/70">
                    The {dna.name} illustrates a sustainability capacity rating of {dna.metrics.sustainability}% matching a collapse risk mitigation coefficient.
                  </p>
                </div>

                <div className="p-3 bg-black/20 border border-white/5 rounded-lg space-y-1">
                  <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold">SYSTEM EVIDENCE:</span>
                  <p className="text-[10px] text-white/50 italic leading-normal">
                    "Transition curves suggest deep industrial de-carbonization structures cleared by our {config.energy} power configurations."
                  </p>
                </div>

                <div className="bg-[#05070a]/60 p-3 rounded-lg border border-white/10">
                  <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold block mb-1.5">Confidence Score</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: "94%" }} />
                    </div>
                    <span className="text-[10.5px] font-bold text-cyan-400">94.8%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Outline */}
            {rightPanelTab === "timeline" && (
              <div className="space-y-3 font-mono text-xs">
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">PROGRESSED LOGS</span>
                {timeline.map((ev, idx) => (
                  <div key={idx} className="p-2.5 bg-[#05070a]/60 rounded-lg border border-white/10">
                    <span className="text-[9px] font-bold text-white/40">{ev.year} AD</span>
                    <h5 className="text-[11px] font-semibold text-white/90 mt-0.5 leading-tight">{ev.title}</h5>
                  </div>
                ))}
              </div>
            )}

            {/* Risks List */}
            {rightPanelTab === "risks" && (
              <div className="space-y-3 font-mono text-xs">
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">WARNING COEFFICIENTS</span>
                {risks.map((rk) => (
                  <div key={rk.id} className="p-2.5 bg-[#05070a]/60 rounded-lg border border-white/10 flex justify-between items-center">
                    <div>
                      <h5 className="text-[11px] font-semibold text-white/90 uppercase">{rk.name}</h5>
                      <span className="text-[9px] text-white/40">PROBABILITY: {rk.probability}%</span>
                    </div>
                    <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded tracking-wide border ${
                      rk.status === "CRITICAL" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {rk.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Citizens Roster Quick Panel */}
            {rightPanelTab === "citizens" && (
              <div className="space-y-3 font-mono text-xs">
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">COMMUNAL PROFILE ENTHUSIASTS</span>
                {citizens.map((cz) => (
                  <div key={cz.id} className="p-2.5 bg-[#05070a]/60 border border-white/10 rounded-lg space-y-1 select-none">
                    <span className="text-[10px] font-bold text-white block">{cz.name}</span>
                    <span className="text-[9px] text-cyan-400 uppercase tracking-wider">{cz.role}</span>
                  </div>
                ))}
              </div>
            )}

            {/* News Stream */}
            {rightPanelTab === "news" && (
              <div className="space-y-3 font-mono text-xs">
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">HEURISTIC TELEGRAM LINES</span>
                {news.map((nz) => (
                  <div key={nz.id} className="p-2.5 bg-[#05070a]/60 border border-white/10 rounded-lg space-y-1">
                    <span className="text-[9px] text-cyan-400 uppercase tracking-widest font-bold text-[8px]">{nz.category}</span>
                    <h5 className="text-[11px] font-bold text-white/95 leading-tight">{nz.title}</h5>
                  </div>
                ))}
              </div>
            )}

            {/* Ask Humanity tab */}
            {rightPanelTab === "ask_future" && (
              <div className="space-y-4 font-mono text-xs">
                <div className="bg-[#05070a]/60 p-3 rounded-lg border border-white/10 space-y-2">
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block">ASK HUMANITY CONSENSUS</span>
                  <p className="text-[10.5px] italic text-white/50">
                    Query the collective memory bank of the species at current simulation timelines.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={humanityQuery}
                      onChange={(e) => setHumanityQuery(e.target.value)}
                      placeholder="e.g. Why did poverty disappear?"
                      className="flex-1 bg-black/60 border border-white/10 rounded-lg p-2 text-[10.5px] text-white focus:outline-none focus:border-cyan-400 placeholder-white/20"
                    />
                    <button
                      onClick={handleAskHumanity}
                      className="bg-cyan-400 hover:bg-cyan-300 rounded-lg px-2.5 py-1 text-black font-mono font-bold uppercase text-[10px] tracking-wider transition cursor-pointer"
                    >
                      Ask
                    </button>
                  </div>
                </div>

                {isAskingHumanity && (
                  <div className="text-[9.5px] text-cyan-400 animate-pulse text-center tracking-widest font-mono py-2 uppercase">
                    COMPILING CONSENSUS FROM BILLIONS OF MEMORY NODES...
                  </div>
                )}

                {humanityReply && (
                  <div className="bg-black/30 backdrop-blur p-3 rounded-lg border border-white/10 space-y-1.5 leading-relaxed text-white/80 select-text font-mono">
                    <span className="text-[9px] text-cyan-400 font-bold block uppercase tracking-widest">HUMANITY ANSWER STATE:</span>
                    <p className="text-[10.5px] text-white/70">{humanityReply}</p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right panel static telemetry footer */}
          <footer className="p-3 bg-black/60 border-t border-white/10 text-[8.5px] font-mono text-white/30 uppercase text-center tracking-widest">
            SYS_CON: CONNECTED // REF: {selectedYear}_AD_D_LOG
          </footer>
        </aside>

      </div>

      {/* 3. Global Hackathon Status Footer banner */}
      <footer className="bg-[#05070a]/90 border-t border-white/10 p-4 text-center text-[10.5px] font-mono text-white/50 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="tracking-widest uppercase">TIME MACHINE AI v3.5 // CONTEXT ENVELOPE: PASS</span>
        </div>
        <div className="text-[10px] text-white/40 tracking-wider">
          Presented at Vegas AI Hackathon // Admin: MADHAVALR4321@gmail.com
        </div>
      </footer>

    </div>
  );
}
