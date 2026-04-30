"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Network, Building2, Shield, Zap, DollarSign, Database, Info, Link as LinkIcon } from "lucide-react";
import { useState, useMemo } from "react";

const NODES = [
  { id: "lockheed", name: "Lockheed Martin", type: "contractor", color: "#0088ff", contracts: "Black Budget: $4.2B // Project: TR-3B Hull" },
  { id: "boeing", name: "Boeing Phantom Works", type: "contractor", color: "#0088ff", contracts: "Black Budget: $1.8B // Project: Anti-Gravity Propulsion" },
  { id: "northrop", name: "Northrop Grumman", type: "contractor", color: "#0088ff", contracts: "Black Budget: $2.5B // Project: B-21 Stealth / Plasma Skin" },
  { id: "raytheon", name: "Raytheon Technologies", type: "contractor", color: "#0088ff", contracts: "Black Budget: $3.1B // Project: Next-Gen Sensor Arrays" },
  { id: "cia", name: "CIA", type: "agency", color: "#00ff00", contracts: "Operational Oversight // Psychological Warfare" },
  { id: "nsa", name: "NSA", type: "agency", color: "#00ff00", contracts: "Signal Intelligence // Cryptography" },
  { id: "doe", name: "Dept. of Energy", type: "agency", color: "#00ff00", contracts: "Nuclear Research // Zero-Point Energy Testing" },
  { id: "nro", name: "National Recon Office", type: "agency", color: "#00ff00", contracts: "Satellite Recon // Off-World Monitoring" },
  { id: "mj12", name: "MJ-12 Group", type: "secret", color: "#ff00ff", contracts: "Strategic Oversight // Direct NHI Interaction" },
  { id: "bigelow", name: "Bigelow Aerospace", type: "contractor", color: "#0088ff", contracts: "Storage of Recovered NHI Biologicals" },
  { id: "battelle", name: "Battelle Institute", type: "contractor", color: "#0088ff", contracts: "Materials Analysis // Memory Metal Research" },
  { id: "darpa", name: "DARPA", type: "agency", color: "#00ff00", contracts: "High-Risk Tech Development // Warp Drive Theory" },
  { id: "afrl", name: "AFRL (Air Force Research)", type: "agency", color: "#00ff00", contracts: "Atmospheric Anomaly Identification" },
  { id: "spacex", name: "SpaceX (Civilian Facade)", type: "contractor", color: "#0088ff", contracts: "Logistics Support // Low-Orbit Surveillance" },
  { id: "gendyn", name: "General Dynamics", type: "contractor", color: "#0088ff", contracts: "Sub-surface Detection Systems // USO Tracking" },
];

const CONNECTIONS = [
  { from: "lockheed", to: "cia", label: "Craft Recovery Logistics", value: "$850M", data: "Hardware Logistics" },
  { from: "lockheed", to: "mj12", label: "Primary Hardware Contractor", value: "$1.2B", data: "Reverse Engineering" },
  { from: "boeing", to: "nro", label: "Classified Satellite Deployment", value: "$600M", data: "Orbital Monitoring" },
  { from: "doe", to: "battelle", label: "Isotopic Ratio Analysis", value: "$120M", data: "Materials Research" },
  { from: "nsa", to: "raytheon", label: "Signal Processing Hardware", value: "$450M", data: "SIGINT Hardware" },
  { from: "mj12", to: "bigelow", label: "Biological Storage Protocols", value: "$300M", data: "Bio-Specimen Archiving" },
  { from: "cia", to: "mj12", label: "Operational Liaison", value: "$50M", data: "Intelligence Flow" },
  { from: "northrop", to: "doe", label: "Energy Source Integration", value: "$780M", data: "Compact Fusion R&D" },
  { from: "battelle", to: "lockheed", label: "Metallurgy Data Share", value: "N/A", data: "Technical Knowledge" },
  { from: "nro", to: "mj12", label: "Orbital Anomaly Reporting", value: "N/A", data: "Anomalous Telemetry" },
  { from: "darpa", to: "boeing", label: "Hypersonic Engine Testing", value: "$950M", data: "Propulsion Tech" },
  { from: "afrl", to: "lockheed", label: "Aura-Target Analysis", value: "$200M", data: "Signature Identification" },
  { from: "spacex", to: "nro", label: "Black-Launch Services", value: "$420M", data: "Surveillance Deployment" },
  { from: "gendyn", to: "cia", label: "Deep-Sea Anomaly Sensors", value: "$550M", data: "USO Tracking Data" },
];

export function AgencyNexusNetwork() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<typeof CONNECTIONS[0] | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<number | null>(null);

  const nodePositions = useMemo(() => {
    return NODES.reduce((acc, node, i) => {
      const angle = (i / NODES.length) * Math.PI * 2;
      const radius = 220;
      acc[node.id] = {
        x: Math.cos(angle) * radius + 400,
        y: Math.sin(angle) * radius + 250
      };
      return acc;
    }, {} as Record<string, { x: number, y: number }>);
  }, []);

  const activeNode = NODES.find(n => n.id === selectedNode);
  const activeConnections = CONNECTIONS.filter(c => c.from === selectedNode || c.to === selectedNode);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 h-full">
      <div className="relative bg-black/40 border border-white/5 rounded-3xl overflow-hidden min-h-[500px] flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
        
        <svg viewBox="0 0 800 500" className="w-full h-full relative z-10">
          {/* Connections (Spider Web) */}
          {CONNECTIONS.map((conn, i) => {
            const start = nodePositions[conn.from];
            const end = nodePositions[conn.to];
            const isRelated = selectedNode === conn.from || selectedNode === conn.to;
            const isHovered = hoveredNode === conn.from || hoveredNode === conn.to;
            const isSelectedLink = selectedConnection === conn;
            const isHoveredLink = hoveredConnection === i;

            return (
              <g key={`${conn.from}-${conn.to}-${i}`} className="cursor-pointer">
                <motion.line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={isSelectedLink ? "#ff3399" : (isHoveredLink || isRelated ? "#ff339990" : "white")}
                  strokeWidth={isSelectedLink ? 4 : (isHoveredLink ? 3 : (isRelated ? 1.5 : 0.5))}
                  strokeOpacity={isSelectedLink ? 1 : (isHoveredLink || isRelated ? 0.8 : 0.15)}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.05 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedConnection(conn);
                    setSelectedNode(null);
                  }}
                  onMouseEnter={() => setHoveredConnection(i)}
                  onMouseLeave={() => setHoveredConnection(null)}
                />
                {/* Invisible wider line for easier clicking */}
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="transparent"
                  strokeWidth={15}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedConnection(conn);
                    setSelectedNode(null);
                  }}
                  onMouseEnter={() => setHoveredConnection(i)}
                  onMouseLeave={() => setHoveredConnection(null)}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => {
            const pos = nodePositions[node.id];
            const isSelected = selectedNode === node.id;
            const isHovered = hoveredNode === node.id;

            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedNode(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 10 : 6}
                  fill={isSelected ? "#ff3399" : node.color}
                  className="transition-all"
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 20 : 12}
                  fill="none"
                  stroke={isSelected ? "#ff3399" : node.color}
                  strokeWidth={1}
                  strokeOpacity={isSelected ? 0.5 : 0.1}
                  className={isSelected ? "animate-ping" : ""}
                />
                <text
                  x={pos.x}
                  y={pos.y + 25}
                  textAnchor="middle"
                  fill="white"
                  className="text-[8px] font-mono uppercase tracking-tighter opacity-40 pointer-events-none"
                >
                  {node.name}
                </text>
              </motion.g>
            );
          })}
        </svg>

        <div className="absolute bottom-6 left-6 flex items-center gap-4">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#0088ff]" />
             <span className="text-[8px] font-mono text-white/30 uppercase">Private_Contractors</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#00ff00]" />
             <span className="text-[8px] font-mono text-white/30 uppercase">Gov_Agencies</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#ff00ff]" />
             <span className="text-[8px] font-mono text-white/30 uppercase">Shadow_Groups</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          {selectedConnection ? (
            <motion.div
              key="connection-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="p-6 bg-white/5 border border-[#ff3399]/40 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                   <div className="font-mono text-[10px] text-[#ff3399] uppercase tracking-[0.3em] font-black">Transaction_Intel</div>
                   <button onClick={() => setSelectedConnection(null)} className="text-white/20 hover:text-white transition-colors text-xs">×</button>
                </div>
                
                <div className="flex items-center justify-center gap-4 py-4">
                   <div className="text-[10px] text-white font-bold uppercase">{NODES.find(n => n.id === selectedConnection.from)?.name}</div>
                   <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ff3399] to-transparent animate-pulse" />
                   <div className="text-[10px] text-white font-bold uppercase">{NODES.find(n => n.id === selectedConnection.to)?.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <div className="text-[8px] font-mono text-white/30 uppercase flex items-center gap-1">
                        <DollarSign className="w-2 h-2" /> Funds
                      </div>
                      <div className="text-xs text-[#00ff00] font-mono font-bold">{selectedConnection.value}</div>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <div className="text-[8px] font-mono text-white/30 uppercase flex items-center gap-1">
                        <Database className="w-2 h-2" /> Data_Type
                      </div>
                      <div className="text-xs text-[#ff3399] font-mono font-bold">{selectedConnection.data}</div>
                   </div>
                </div>

                <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                   <div className="text-[9px] font-mono text-white/40 uppercase">Operational_Summary</div>
                   <p className="text-[10px] text-white/70 leading-relaxed font-mono">"{selectedConnection.label}"</p>
                </div>
              </div>
            </motion.div>
          ) : activeNode ? (
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="p-6 bg-white/5 border border-[#ff3399]/20 rounded-2xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{activeNode.name}</h3>
                    <div className="font-mono text-[9px] text-[#ff3399] uppercase tracking-widest">{activeNode.type} // NODE_{activeNode.id.toUpperCase()}</div>
                  </div>
                  <Building2 className="w-6 h-6 text-[#ff3399]/40" />
                </div>
                
                <div className="p-4 bg-[#ff3399]/5 border border-[#ff3399]/20 rounded-xl space-y-2">
                   <div className="flex items-center gap-2 text-[9px] font-mono text-[#ff3399] uppercase tracking-widest">
                     <Database className="w-3 h-3" /> Technical_Dossier
                   </div>
                   <p className="text-[11px] text-white/70 leading-relaxed font-mono">"{activeNode.contracts}"</p>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-2 font-mono text-[10px] text-white/40 uppercase">
                   <LinkIcon className="w-4 h-4" /> Active Connections ({activeConnections.length})
                 </div>
                 <div className="space-y-2">
                    {activeConnections.map((conn, i) => {
                      const otherNodeId = conn.from === activeNode.id ? conn.to : conn.from;
                      const otherNode = NODES.find(n => n.id === otherNodeId);
                      return (
                        <div 
                          key={i} 
                          onClick={() => {
                            setSelectedConnection(conn);
                            setSelectedNode(null);
                          }}
                          className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all"
                        >
                           <div className="space-y-1">
                              <div className="text-[10px] text-white font-bold uppercase">{otherNode?.name}</div>
                              <div className="text-[8px] text-white/30 font-mono italic">{conn.label}</div>
                           </div>
                           <Zap className="w-3 h-3 text-[#ff3399] opacity-20 group-hover:opacity-100 transition-opacity" />
                        </div>
                      );
                    })}
                 </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-20 space-y-4">
               <Network className="w-16 h-16" />
               <div className="font-mono text-[10px] uppercase tracking-[0.3em]">Select a network node or connection line to visualize information flow and black budget distribution</div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
