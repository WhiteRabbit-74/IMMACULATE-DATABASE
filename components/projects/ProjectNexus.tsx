"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Zap, Shield, Link as LinkIcon, AlertTriangle, Cpu, Globe, Database, Activity } from "lucide-react";
import { GlitchTitle } from "../effects/GlitchTitle";

interface Node {
  id: string;
  name: string;
  type: "core" | "project" | "subproject";
  initialX: number;
  initialY: number;
}

interface Connection {
  from: string;
  to: string;
  type: "control" | "data" | "funding";
}

const NODES: Node[] = [
  { id: "mj12", name: "MJ-12 Command", type: "core", initialX: 50, initialY: 50 },
  { id: "aquarius", name: "Project Aquarius", type: "project", initialX: 25, initialY: 25 },
  { id: "sigma", name: "Project Sigma", type: "project", initialX: 75, initialY: 25 },
  { id: "stargate", name: "Project Stargate", type: "project", initialX: 25, initialY: 75 },
  { id: "mkultra", name: "Project MKUltra", type: "project", initialX: 75, initialY: 75 },
  { id: "bluebook", name: "Project Blue Book", type: "project", initialX: 50, initialY: 15 },
  { id: "aatip", name: "AATIP / UAPTF", type: "project", initialX: 50, initialY: 85 },
  { id: "paperclip", name: "Op. Paperclip", type: "subproject", initialX: 10, initialY: 50 },
  { id: "mogul", name: "Project Mogul", type: "subproject", initialX: 90, initialY: 50 },
];

const CONNECTIONS: Connection[] = [
  { from: "mj12", to: "aquarius", type: "control" },
  { from: "mj12", to: "sigma", type: "control" },
  { from: "mj12", to: "stargate", type: "control" },
  { from: "mj12", to: "mkultra", type: "control" },
  { from: "aquarius", to: "bluebook", type: "data" },
  { from: "sigma", to: "bluebook", type: "data" },
  { from: "aatip", to: "mj12", type: "data" },
  { from: "aatip", to: "aquarius", type: "data" },
  { from: "aatip", to: "sigma", type: "data" },
  { from: "paperclip", to: "mj12", type: "funding" },
  { from: "paperclip", to: "stargate", type: "funding" },
  { from: "mogul", to: "mj12", type: "data" },
  { from: "mogul", to: "sigma", type: "data" },
  { from: "mogul", to: "paperclip", type: "funding" },
  { from: "mkultra", to: "stargate", type: "data" },
];

export const ProjectNexus = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track node positions in state to update connections
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number, y: number }>>(() => {
    const pos: Record<string, { x: number, y: number }> = {};
    NODES.forEach(n => {
      pos[n.id] = { x: n.initialX, y: n.initialY };
    });
    return pos;
  });

  const handleDrag = (id: string, info: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((info.point.x - rect.left) / rect.width) * 100;
    const y = ((info.point.y - rect.top) / rect.height) * 100;
    setNodePositions(prev => ({ ...prev, [id]: { x, y } }));
  };

  const selectedNode = useMemo(() => 
    NODES.find(n => n.id === selectedNodeId), [selectedNodeId]);

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-[#030303] rounded-2xl border border-white/5 overflow-hidden group select-none">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[length:40px_40px] opacity-20" />
      
      {/* HUD Overlays */}
      <div className="absolute top-4 left-6 flex items-center gap-3">
        <div className="w-2 h-2 bg-red-500 animate-pulse rounded-full" />
        <div className="font-mono text-[10px] text-red-500 uppercase tracking-[0.2em] font-bold">
          REAL_TIME_NEXUS_MESH // LIVE_TELEMETRY
        </div>
        <div className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded font-mono text-[8px] text-red-500 flex items-center gap-1">
          <Shield className="w-3 h-3" /> LOCKED_INTERFACE
        </div>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="nexus-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Connections */}
        {CONNECTIONS.map((conn, idx) => {
          const fromPos = nodePositions[conn.from];
          const toPos = nodePositions[conn.to];
          const color = conn.type === "control" ? "#ff0000" : conn.type === "funding" ? "#00ff00" : "#0088ff";
          const isActive = selectedNodeId === conn.from || selectedNodeId === conn.to;
          
          return (
            <React.Fragment key={`${conn.from}-${conn.to}`}>
              {/* Main Connection Line */}
              <motion.line
                x1={`${fromPos.x}%`}
                y1={`${fromPos.y}%`}
                x2={`${toPos.x}%`}
                y2={`${toPos.y}%`}
                stroke={color}
                strokeWidth={isActive ? "1.5" : "1"}
                strokeDasharray={conn.type === "data" ? "4 4" : "none"}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: isActive ? 0.8 : 0.3,
                  strokeWidth: isActive ? 1.5 : 1 
                }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Flow Particles */}
              <motion.circle
                r="1.5"
                fill={color}
                initial={{ offset: 0 }}
                animate={{ 
                  cx: [`${fromPos.x}%`, `${toPos.x}%`],
                  cy: [`${fromPos.y}%`, `${toPos.y}%`],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: idx * 0.5
                }}
              />
            </React.Fragment>
          );
        })}
      </svg>

      {/* Nodes */}
      {NODES.map((node) => (
        <motion.div
          key={node.id}
          className={`absolute cursor-pointer z-10 ${
            selectedNodeId === node.id ? "z-20" : ""
          }`}
          style={{ 
            left: `${nodePositions[node.id].x}%`, 
            top: `${nodePositions[node.id].y}%`,
            x: "-50%",
            y: "-50%"
          }}
          onClick={() => setSelectedNodeId(node.id)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="relative flex flex-col items-center group">
            {/* Connection Aura */}
            <AnimatePresence>
              {selectedNodeId === node.id && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 2, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#00ff00]/20 rounded-full blur-xl -z-10"
                />
              )}
            </AnimatePresence>

            {/* Node Point - Centered exactly on the coordinates */}
            <div className={`relative flex items-center justify-center ${
              node.type === "core" ? "w-8 h-8" : "w-6 h-6"
            }`}>
              <div className={`rounded-full border-2 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] ${
                node.type === "core" 
                  ? "bg-red-600 border-red-400 w-6 h-6 shadow-[0_0_30px_#ff0000]" 
                  : node.type === "project" 
                  ? "bg-[#00ff00] border-[#00ff00]/50 w-4 h-4" 
                  : "bg-white/40 border-white/40 w-3 h-3"
              } ${selectedNodeId === node.id ? "ring-4 ring-white/10 scale-125" : ""}`} />
            </div>
            
            {/* Label - Positioned below the point but outside the centering logic */}
            <div className="absolute top-full mt-1 px-2 py-0.5 rounded bg-black/60 border border-white/5 backdrop-blur-sm group-hover:border-[#00ff00]/30 transition-colors whitespace-nowrap">
              <GlitchTitle 
                text={node.name} 
                className={`font-mono text-[8px] uppercase tracking-[0.1em] ${
                  selectedNodeId === node.id ? "text-[#00ff00]" : "text-white/40"
                }`} 
              />
            </div>
          </div>
        </motion.div>
      ))}

      {/* Info Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute top-6 right-6 w-72 bg-black/90 border border-[#00ff00]/20 rounded-xl p-5 backdrop-blur-2xl z-30 shadow-[0_0_40px_rgba(0,255,0,0.05)]"
          >
            <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
              <div className="flex flex-col">
                <div className="font-mono text-[9px] text-[#00ff00] tracking-widest mb-1 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> NODE_ANALYSIS
                </div>
                <h3 className="font-mono text-sm font-black text-white uppercase italic tracking-tighter">
                  {selectedNode.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedNodeId(null)} 
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                  <div className="font-mono text-[8px] text-white/30 uppercase mb-1">Type</div>
                  <div className="font-mono text-[9px] text-[#00ff00] uppercase font-bold">{selectedNode.type}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                  <div className="font-mono text-[8px] text-white/30 uppercase mb-1">Status</div>
                  <div className="font-mono text-[9px] text-[#00ff00] uppercase font-bold">Operational</div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-[#00ff00]/5 rounded blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="relative font-mono text-[10px] text-white/60 leading-relaxed italic border-l-2 border-[#00ff00]/30 pl-3">
                  Node integrated into Nexus mesh. All telemetry and operational data redirected to MJ-12 core through secure SIGINT channels.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-mono text-[8px] text-white/30 uppercase flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" /> Active Data Links:
                </div>
                <div className="space-y-1">
                  {CONNECTIONS.filter(c => c.from === selectedNodeId || c.to === selectedNodeId).map(c => {
                    const otherId = c.from === selectedNodeId ? c.to : c.from;
                    const otherNode = NODES.find(n => n.id === otherId);
                    return (
                      <div key={`${c.from}-${c.to}`} className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5 hover:border-[#00ff00]/20 transition-all cursor-pointer group/link"
                        onClick={() => setSelectedNodeId(otherId)}>
                        <div className="font-mono text-[9px] text-white/50 group-hover/link:text-white transition-colors uppercase">
                          {otherNode?.name}
                        </div>
                        <div className={`font-mono text-[8px] uppercase font-bold ${
                          c.type === "control" ? "text-red-500" : c.type === "funding" ? "text-[#00ff00]" : "text-blue-500"
                        }`}>
                          {c.type}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-8 flex items-center gap-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
        <LegendItem color="#ff0000" label="Strategic Control" />
        <LegendItem color="#0088ff" label="Intelligence Flow" dashed />
        <LegendItem color="#00ff00" label="Black Budget" />
      </div>
    </div>
  );
};

const LegendItem = ({ color, label, dashed }: { color: string, label: string, dashed?: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={`w-6 h-[2px] ${dashed ? "border-t-2 border-dashed" : "bg-current shadow-[0_0_8px_currentColor]"}`} style={{ color }} />
    <span className="font-mono text-[9px] text-white/40 uppercase tracking-[0.1em]">{label}</span>
  </div>
);
