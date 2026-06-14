/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { Globe, Satellite, Compass } from "lucide-react";

interface ThreeDEarthProps {
  activePlanetId: string;
  onNodeClick?: (nodeName: string) => void;
}

export default function ThreeDEarth({ activePlanetId, onNodeClick }: ThreeDEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 320, height: 320 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Resize handler
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const size = Math.min(width, height) || 320;
        setDimensions({ width: size, height: size });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Canvas drawing loop for 3D rotating globe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    // Define color palette based on focused planet representation
    let primaryColor = "rgba(49, 151, 149, "; // Teal for Earth
    if (activePlanetId === "mars") primaryColor = "rgba(221, 107, 32, "; // Orange-red
    if (activePlanetId === "moon") primaryColor = "rgba(160, 174, 192, "; // Slate
    if (activePlanetId === "titan") primaryColor = "rgba(214, 158, 46, "; // Gold / Yellow
    if (activePlanetId === "europa") primaryColor = "rgba(99, 179, 237, "; // Cyan / Light Blue

    // Procedural generation of world point coordinates (longitude, latitude)
    // To make a neat dotted rotating globe
    const points: { x: number; y: number; z: number }[] = [];
    const numPoints = 180;
    for (let i = 0; i < numPoints; i++) {
      const theta = Math.acos(1 - (2 * i) / numPoints);
      const phi = Math.sqrt(numPoints * Math.PI) * theta;

      // Spherical to Cartesian coordinates (relative-radius 1.0)
      const x = Math.sin(theta) * Math.cos(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(theta);
      points.push({ x, y, z });
    }

    // Interactive node anchors to project on the rotating surface
    const surfaceNodes = [
      { name: "Orbital Grid A-1", lat: 30, lon: -40, label: "Eco Dome" },
      { name: "Main Communication Relay", lat: -10, lon: 100, label: "Telescope Terminal" },
      { name: "Deuterium Collector Core", lat: -45, lon: -60, label: "Antimatter Mine" }
    ];

    const radius = dimensions.width / 2.3;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      angle += 0.006; // Rotation speed

      // 1. Draw glowing atmosphere base background
      const radGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.7, centerX, centerY, radius * 1.1);
      radGrad.addColorStop(0, "rgba(13, 26, 45, 0)");
      radGrad.addColorStop(0.8, primaryColor + "0.12)");
      radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // 2. Draw outer grid orbit rings (glowing dash orbits)
      ctx.strokeStyle = primaryColor + "0.25)";
      ctx.lineWidth = 1.0;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.stroke();

      // Second inclined orbit
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(0.2);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.setLineDash([]); // Reset line dash

      // 3. Project & sort 3D points by z-index to support occlusion (back of sphere dimmer than front)
      const projectedPoints = points.map((p) => {
        // Rotate point around Y-axis (globe rotation)
        const cosY = Math.cos(angle);
        const sinY = Math.sin(angle);
        const xRot = p.x * cosY - p.z * sinY;
        const zRot = p.x * sinY + p.z * cosY;

        // Standard orthographic 3D projection
        const pX = xRot * radius + centerX;
        const pY = p.y * radius + centerY;
        const pZ = zRot; // Depth (-1 to +1)

        return { x: pX, y: pY, z: pZ };
      });

      // Draw background points (farthest z < 0) half-faded
      ctx.fillStyle = primaryColor + "0.3)";
      projectedPoints.forEach((p) => {
        if (p.z < 0) {
          const depthScale = (p.z + 1) / 2; // scale opacity with depth
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2 * depthScale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw shiny equator line
      ctx.strokeStyle = primaryColor + "0.15)";
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius, radius * 0.15, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Draw foreground points (z >= 0) full brightness
      projectedPoints.forEach((p) => {
        if (p.z >= 0) {
          const depthScale = (p.z + 1) / 2 + 0.3; // scale size and opacity with depth
          ctx.fillStyle = primaryColor + (0.5 + depthScale * 0.4) + ")";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.6 * depthScale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Project and Draw interactive Node points on the front hemisphere
      surfaceNodes.forEach((node, idx) => {
        // Convert lat/lon on revolving globe to Cartesian
        const radLat = (node.lat * Math.PI) / 180;
        const radLon = (node.lon * Math.PI) / 180 + angle; // Add revolving angle!

        const nx = Math.cos(radLat) * Math.cos(radLon);
        const ny = Math.sin(radLat);
        const nz = Math.cos(radLat) * Math.sin(radLon);

        if (nz > -0.2) { // Is visible on front hemisphere
          const projX = nx * radius + centerX;
          const projY = ny * radius + centerY;
          const opacity = (nz + 0.2) / 1.2;

          // Draw neon glowing ripple ring
          ctx.strokeStyle = primaryColor + (0.8 * opacity) + ")";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          const rippleRadius = 4 + (Date.now() / 250) % 6;
          ctx.arc(projX, projY, rippleRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Core node dot
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(projX, projY, 3, 0, Math.PI * 2);
          ctx.fill();

          // Draw small neat textual HUD labels in high-density mono text
          ctx.fillStyle = primaryColor + (0.9 * opacity) + ")";
          ctx.font = "bold 9px monospace";
          ctx.fillText(node.label, projX + 8, projY + 3);

          // Render connecting fine lines to satellite nodes
          ctx.strokeStyle = primaryColor + (0.2 * opacity) + ")";
          ctx.beginPath();
          ctx.moveTo(projX, projY);
          ctx.lineTo(centerX + Math.cos(angle * 2 + idx) * radius * 1.25, centerY + Math.sin(angle * 2 + idx) * radius * 1.2);
          ctx.stroke();
        }
      });

      // 5. Orbital HUD details in corners to avoid AI slop/fake terminal text but preserve high end aesthetics
      ctx.strokeStyle = primaryColor + "0.3)";
      ctx.lineWidth = 1;
      
      // Top-left crosshair tick
      ctx.beginPath();
      ctx.moveTo(10, 10); ctx.lineTo(25, 10);
      ctx.moveTo(10, 10); ctx.lineTo(10, 25);
      ctx.stroke();

      // Bottom-right crosshair tick
      ctx.beginPath();
      ctx.moveTo(dimensions.width - 10, dimensions.height - 10); ctx.lineTo(dimensions.width - 25, dimensions.height - 10);
      ctx.moveTo(dimensions.width - 10, dimensions.height - 10); ctx.lineTo(dimensions.width - 10, dimensions.height - 25);
      ctx.stroke();

      // Circular telemetry compass
      ctx.strokeStyle = primaryColor + "0.2)";
      ctx.beginPath();
      ctx.arc(20, dimensions.height - 20, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(20, dimensions.height - 25);
      ctx.lineTo(20, dimensions.height - 15);
      ctx.moveTo(15, dimensions.height - 20);
      ctx.lineTo(25, dimensions.height - 20);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, activePlanetId]);

  const handleNodeClick = (name: string) => {
    setSelectedNode(name);
    if (onNodeClick) onNodeClick(name);
    setTimeout(() => {
      setSelectedNode(null);
    }, 2000);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col items-center justify-center bg-transparent">
      {/* Absolute positioning of star background highlights */}
      <div className="absolute inset-0 bg-transparent overflow-hidden pointer-events-none rounded-full flex items-center justify-center">
        <div className={`absolute w-3/4 h-3/4 rounded-full blur-3xl opacity-10 bg-radial transition-all duration-700 ${
          activePlanetId === "mars" ? "from-orange-600" :
          activePlanetId === "moon" ? "from-slate-400" :
          activePlanetId === "titan" ? "from-yellow-500" :
          activePlanetId === "europa" ? "from-blue-400" : "from-teal-500"
        }`} />
      </div>

      {/* Orbiting satellites layered objects via CSS */}
      <div className="absolute w-5/6 h-5/6 rounded-full border border-dashed border-white/5 animate-[spin_40s_linear_infinite] pointer-events-none" />
      <div className="absolute w-11/12 h-11/12 rounded-full border border-dashed border-white/5 animate-[spin_60s_linear_infinite_reverse] pointer-events-none" />

      {/* Actual Planet Canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="relative z-10 select-none cursor-pointer"
        id="canvas_planet_display"
        onClick={() => {
          const names = ["Elysium Hub Sector", "Ares terraforming site", "Syrtis coordinate beta", "Copernicus lunar complex"];
          const randName = names[Math.floor(Math.random() * names.length)];
          handleNodeClick(randName);
        }}
      />

      {/* Floating HUD status indicator overlay */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 border border-teal-500/30 rounded px-3 py-1.5 backdrop-blur z-20 animate-pulse font-mono text-[10px] text-teal-400 text-center flex items-center justify-center gap-2">
          <Compass className="w-3.5 h-3.5 animate-spin" />
          <span>ESTABLISHING INTERPLANETARY TELEMETRY LINK TO: {selectedNode.toUpperCase()}</span>
        </div>
      )}

      {/* Static telemetry details beneath */}
      <div className="absolute top-2 right-4 text-[10px] font-mono text-slate-500 text-right space-y-0.5 select-none md:block hidden">
        <div>ORBITAL_VELOCITY: 29.8 KM/S</div>
        <div>COORD_LOCK: {activePlanetId.toUpperCase()}_SECTOR</div>
        <div>TRANS_BUFFER: ONLINE</div>
      </div>
    </div>
  );
}
