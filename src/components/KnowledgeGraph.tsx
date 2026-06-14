/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { Link2, Network, RefreshCw } from "lucide-react";
import { CivilizationConfig } from "../types";

interface Node {
  id: string;
  name: string;
  desc: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  value: string;
  radius: number;
  color: string;
}

interface Edge {
  source: string;
  target: string;
  label: string;
}

interface KnowledgeGraphProps {
  config: CivilizationConfig;
}

export default function KnowledgeGraph({ config }: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Maintain nodes list in mutable state/ref
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([
    { source: "tech", target: "econ", label: "Automates" },
    { source: "econ", target: "edu", label: "Funds" },
    { source: "edu", target: "soc", label: "Shapes" },
    { source: "soc", target: "env", label: "Impacts" },
    { source: "env", target: "qol", label: "Sustains" },
    { source: "tech", target: "env", label: "Mitigates" },
    { source: "econ", target: "qol", label: "Enables" }
  ]);

  // Handle building nodes based on current choices
  useEffect(() => {
    const sizeX = 500;
    const sizeY = 320;

    // Instantiate 6 core pillars of civilization
    nodesRef.current = [
      {
        id: "tech",
        name: "Technology Core",
        desc: "Drives mechanical efficiency and cosmic transport.",
        x: 100, y: 150,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        value: config.energy,
        radius: 36,
        color: "#63B3ED" // Blue
      },
      {
        id: "econ",
        name: "Economic Engine",
        desc: "Governs resource exchange and synthetics distribution.",
        x: 220, y: 80,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        value: config.economy,
        radius: 36,
        color: "#4FD1C5" // Teal
      },
      {
        id: "edu",
        name: "Cognitive Guild",
        desc: "Manages social learning schemes and cognitive mesh grids.",
        x: 340, y: 80,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        value: config.education,
        radius: 36,
        color: "#9F7AEA" // Purple
      },
      {
        id: "soc",
        name: "Civic Society",
        desc: "The demographic assembly type and public codes.",
        x: 420, y: 180,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        value: config.government,
        radius: 36,
        color: "#F687B3" // Pink
      },
      {
        id: "env",
        name: "Eco Equilibrium",
        desc: "Planetary biosphere indices, carbon filters, and terraforming.",
        x: 280, y: 240,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        value: "94% Stability Index",
        radius: 36,
        color: "#48BB78" // Green
      },
      {
        id: "qol",
        name: "Human Flourishing",
        desc: "Individual longevity, happiness, and spiritual pursuits.",
        x: 160, y: 240,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        value: "Post-Need Era",
        radius: 36,
        color: "#F6E05E" // Gold
      }
    ];
  }, [config]);

  // Main Canvas physics tick loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const tick = () => {
      // Clear with dark tech background
      ctx.fillStyle = "rgba(10, 15, 30, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      // 1. Particle spring forces & node bouncing
      // Attract connected nodes, repel overlapping ones
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        // Gravitate back to their resting orbits slightly so they don't drift off screen
        const targetX = n1.id === "tech" ? 100 : n1.id === "econ" ? 210 : n1.id === "edu" ? 310 : n1.id === "soc" ? 400 : n1.id === "env" ? 280 : 175;
        const targetY = n1.id === "tech" ? 140 : n1.id === "econ" ? 85 : n1.id === "edu" ? 85 : n1.id === "soc" ? 170 : n1.id === "env" ? 230 : 230;

        n1.vx += (targetX - n1.x) * 0.005;
        n1.vy += (targetY - n1.y) * 0.005;

        // Friction dampening
        n1.vx *= 0.94;
        n1.vy *= 0.94;

        // Apply velocity
        n1.x += n1.vx;
        n1.y += n1.vy;

        // Boundary collision
        if (n1.x - n1.radius < 5) { n1.x = 5 + n1.radius; n1.vx *= -0.5; }
        if (n1.x + n1.radius > canvas.width - 5) { n1.x = canvas.width - 5 - n1.radius; n1.vx *= -0.5; }
        if (n1.y - n1.radius < 5) { n1.y = 5 + n1.radius; n1.vy *= -0.5; }
        if (n1.y + n1.radius > canvas.height - 5) { n1.y = canvas.height - 5 - n1.radius; n1.vy *= -0.5; }
      }

      // Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = n1.radius + n2.radius + 15;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const forceX = (dx / (dist || 1)) * overlap * 0.015;
            const forceY = (dy / (dist || 1)) * overlap * 0.015;
            n1.vx -= forceX;
            n1.vy -= forceY;
            n2.vx += forceX;
            n2.vy += forceY;
          }
        }
      }

      // 2. Draw Connections / Edges (glowing fibers)
      edges.forEach((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);

        if (sourceNode && targetNode) {
          // Dynamic dash phase over time
          const dashOffset = (Date.now() / 80) % 20;

          ctx.strokeStyle = "rgba(45, 212, 191, 0.25)";
          ctx.setLineDash([6, 8]);
          ctx.lineDashOffset = -dashOffset;
          ctx.lineWidth = 1.2;

          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();

          ctx.setLineDash([]); // Reset line dash

          // Draw tiny mid-line relationship tag in micro-text
          const midX = (sourceNode.x + targetNode.x) / 2;
          const midY = (sourceNode.y + targetNode.y) / 2;
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.font = "8px monospace";
          ctx.textAlign = "center";
          ctx.fillText(edge.label.toUpperCase(), midX, midY - 3);
        }
      });

      // 3. Draw Nodes (glowing orbital spheres)
      nodes.forEach((node) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;

        // Outer glow aura
        const nodeGlow = ctx.createRadialGradient(node.x, node.y, node.radius * 0.8, node.x, node.y, node.radius * 1.3);
        nodeGlow.addColorStop(0, node.color + "0.25)");
        nodeGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = nodeGlow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Solid core rim
        ctx.strokeStyle = isSelected ? "#ffffff" : isHovered ? node.color : node.color + "0.6)";
        ctx.lineWidth = isSelected ? 2.5 : isHovered ? 2 : 1.2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Node fill
        ctx.fillStyle = "rgba(5, 7, 18, 0.85)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius - 1, 0, Math.PI * 2);
        ctx.fill();

        // Node Title text
        ctx.fillStyle = isSelected || isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.85)";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.name.split(" ")[0].toUpperCase(), node.x, node.y - 4);

        // Under-text dynamic metric values
        ctx.fillStyle = node.color;
        ctx.font = "7px sans-serif";
        ctx.fillText(node.value.length > 17 ? node.value.slice(0, 16) + ".." : node.value, node.x, node.y + 7);
      });

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [hoveredNode, selectedNode]);

  // Click / Hover interaction mechanics
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const matched = nodesRef.current.find((n) => Math.hypot(n.x - x, n.y - y) <= n.radius);
    setHoveredNode(matched || null);
  };

  const handleMouseClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const matched = nodesRef.current.find((n) => Math.hypot(n.x - x, n.y - y) <= n.radius);
    setSelectedNode(matched || null);

    // Apply quick kinetic impulse when clicking a node (bounces things nicely)
    if (matched) {
      matched.vx += (Math.random() - 0.5) * 5;
      matched.vy += (Math.random() - 0.5) * 5;
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col bg-slate-950/80 rounded border border-indigo-500/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs font-mono text-teal-400">
          <Network className="w-4 h-4 animate-pulse" />
          <span>FABRIC IQ - PILLARS OF CIVILIZATION KNOWLEDGE GRAPH</span>
        </div>
        <button
          onClick={() => {
            // Apply quick bounce to all
            nodesRef.current.forEach((n) => {
              n.vx = (Math.random() - 0.5) * 6;
              n.vy = (Math.random() - 0.5) * 6;
            });
          }}
          className="p-1 text-slate-400 hover:text-white rounded border border-slate-700/40 bg-slate-900 transition"
          title="Scramble Physics"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative flex-1 bg-slate-950 rounded border border-slate-800 overflow-hidden min-h-[260px]">
        <canvas
          ref={canvasRef}
          width={500}
          height={260}
          onMouseMove={handleMouseMove}
          onClick={handleMouseClick}
          className="w-full h-full cursor-pointer select-none"
        />

        {/* Hover / Selection HUD bubble overlay */}
        {(selectedNode || hoveredNode) && (
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 border border-teal-500/30 rounded p-2.5 backdrop-blur font-mono text-[10.5px] leading-relaxed text-slate-300">
            <div className="flex items-center gap-1 text-teal-400 font-bold mb-0.5">
              <Link2 className="w-3.5 h-3.5" />
              <span>{(selectedNode || hoveredNode)!.name.toUpperCase()}</span>
            </div>
            <div>{(selectedNode || hoveredNode)!.desc}</div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
              <span>CURRENT STATE PARAMETER:</span>
              <span className="text-white bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-bold">
                {(selectedNode || hoveredNode)!.value.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Auxiliary Micro labels */}
      <div className="mt-2 text-[9px] font-mono text-slate-500 text-center uppercase">
        Hover nodes to map cause-and-effect paths. Click to spark kinetic impulse loops.
      </div>
    </div>
  );
}
