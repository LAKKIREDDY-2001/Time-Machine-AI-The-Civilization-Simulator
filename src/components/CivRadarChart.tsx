/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Brain, AlertTriangle, ShieldCheck, TrendingUp, Cpu } from "lucide-react";

interface CivRadarChartProps {
  metrics: {
    innovation: number;
    happiness: number;
    automation: number;
    sustainability: number;
    collapseRisk: number;
    expansionLevel: number;
  };
}

export default function CivRadarChart({ metrics }: CivRadarChartProps) {
  // Ordered properties for the radar axes
  const axisDefinitions = [
    { key: "innovation", label: "Innovation", color: "text-emerald-400", icon: Sparkles },
    { key: "happiness", label: "Happiness", color: "text-rose-400", icon: Brain },
    { key: "automation", label: "Automation", color: "text-purple-400", icon: Cpu },
    { key: "sustainability", label: "Sustainability", color: "text-teal-400", icon: ShieldCheck },
    { key: "collapseRisk", label: "Collapse Risk", color: "text-amber-400", icon: AlertTriangle },
    { key: "expansionLevel", label: "Expansion Potential", color: "text-sky-400", icon: TrendingUp }
  ];

  const totalAxes = axisDefinitions.length;
  const size = 300;
  const rMax = 110; // Maximum radius within 300px box
  const center = size / 2;

  // Calculate coordinates for a metric at a specific index
  const getCoordinates = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2; // subtract 90deg to start at top
    const r = (value / 100) * rMax;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Concentric guideline rings (e.g. 25%, 50%, 75%, 100%)
  const guidelinePercentages = [25, 50, 75, 100];

  // Build polygon points for active DNA metrics
  const activePolygonPoints = axisDefinitions
    .map((axis, idx) => {
      const val = metrics[axis.key as keyof typeof metrics] || 50;
      const { x, y } = getCoordinates(idx, val);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-around gap-6 bg-slate-900/60 p-5 rounded-lg border border-slate-700/40 backdrop-blur">
      
      {/* 3D-feeling Glow SVG Radar Container */}
      <div className="relative w-[300px] h-[300px] flex items-center justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full select-none">
          {/* Radial grid gradient definer */}
          <defs>
            <radialGradient id="radarRadialGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(45, 212, 191, 0.02)" />
              <stop offset="70%" stopColor="rgba(20, 184, 166, 0.08)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
            </radialGradient>
            <linearGradient id="polyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.45" />
            </linearGradient>
            <filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Underlay glow circle */}
          <circle cx={center} cy={center} r={rMax} fill="url(#radarRadialGlow)" />

          {/* Guidelines polygons (concentric hexagons) */}
          {guidelinePercentages.map((p) => {
            const hexPoints = Array.from({ length: totalAxes })
              .map((_, idx) => {
                const { x, y } = getCoordinates(idx, p);
                return `${x},${y}`;
              })
              .join(" ");

            return (
              <polygon
                key={`guideline-${p}`}
                points={hexPoints}
                fill="none"
                stroke="rgba(255, 255, 255, 0.07)"
                strokeWidth="1.2"
                strokeDasharray={p === 100 ? "none" : "3, 2"}
              />
            );
          })}

          {/* Axis spoke lines radiating from center */}
          {Array.from({ length: totalAxes }).map((_, idx) => {
            const { x, y } = getCoordinates(idx, 100);
            return (
              <line
                key={`spoke-${idx}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* Axis concentric value marker lines */}
          {guidelinePercentages.map((p) => {
            const { x, y } = getCoordinates(0, p);
            return (
              <text
                key={`perText-${p}`}
                x={x + 3}
                y={y + 8}
                fill="rgba(255, 255, 255, 0.35)"
                fontSize="7"
                fontFamily="monospace"
              >
                {p}%
              </text>
            );
          })}

          {/* Core Solid Filled Metric Polyline Shape */}
          <polygon
            points={activePolygonPoints}
            fill="url(#polyGlow)"
            stroke="#2dd4bf"
            strokeWidth="2"
            filter="url(#neonFilter)"
            style={{ transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
          />

          {/* Individual glowing points/nodes on poly intersection */}
          {axisDefinitions.map((axis, idx) => {
            const val = metrics[axis.key as keyof typeof metrics] || 50;
            const { x, y } = getCoordinates(idx, val);
            return (
              <circle
                key={`nodepoint-${idx}`}
                cx={x}
                cy={y}
                r="4"
                fill="#ffffff"
                stroke="#3b82f6"
                strokeWidth="1.5"
                className="transition-all duration-700"
                style={{ transitionDelay: `${idx * 50}ms` }}
              />
            );
          })}

          {/* Category Outer Label Text */}
          {axisDefinitions.map((axis, idx) => {
            const { x, y } = getCoordinates(idx, 116);
            let textAnchor = "middle";
            let dx = 0;
            let dy = 4;

            // Offset adjustment depending on angular projection
            if (x < center - 30) {
              textAnchor = "end";
              dx = -4;
            } else if (x > center + 30) {
              textAnchor = "start";
              dx = 4;
            }
            if (y < center - 80) dy = -4;
            if (y > center + 80) dy = 10;

            return (
              <text
                key={`outerlabel-${idx}`}
                x={x + dx}
                y={y + dy}
                fill="rgba(255, 255, 255, 0.75)"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor={textAnchor}
              >
                {axis.label.toUpperCase()}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Metrics breakdown card */}
      <div className="flex-1 w-full grid grid-cols-2 gap-3 min-w-[200px]">
        {axisDefinitions.map((axis) => {
          const Icon = axis.icon;
          const val = metrics[axis.key as keyof typeof metrics] || 50;
          return (
            <div
              key={axis.key}
              className="px-3 py-2 bg-slate-950/60 rounded border border-slate-800 flex items-center gap-2.5 hover:border-slate-700 transition"
            >
              <div className={`p-1 bg-slate-900 rounded ${axis.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-mono capitalize">{axis.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-white font-mono">{val}</span>
                  <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        axis.key === "collapseRisk" ? (val > 60 ? "bg-amber-500" : "bg-teal-500") : "bg-teal-400"
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
