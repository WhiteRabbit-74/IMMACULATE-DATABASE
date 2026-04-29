"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, FileSearch, Hash, Map, Users, Activity, 
  Database, ShieldAlert, Cpu, Globe, Link as LinkIcon,
  Crosshair, Zap, Eye, Terminal, Layers, Info, 
  AlertCircle, FileText, BarChart3
} from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: "analysis" | "forensics" | "intelligence" | "systems";
}

const TOOLS: Tool[] = [
  { id: "cross-ref", name: "Cross-Reference Engine", description: "Identify discrepancies between multi-agency reports on same incidents.", icon: FileSearch, category: "analysis" },
  { id: "metadata", name: "Metadata Forensic Scanner", description: "Extract hidden EXIF and filesystem metadata from leaked assets.", icon: Hash, category: "forensics" },
  { id: "redaction", name: "Redaction Context Analyzer", description: "Estimate redacted content based on character spacing and context.", icon: ShieldAlert, category: "forensics" },
  { id: "personnel", name: "Personnel Dossier Matcher", description: "Cross-link names across declassified documents and public records.", icon: Users, category: "intelligence" },
  { id: "hotspot", name: "Geospatial Hotspot Heatmap", description: "Visualize geographic clusters of sightings and base locations.", icon: Map, category: "intelligence" },
  { id: "signal", name: "Signal Pattern Analyzer", description: "Analyze radio frequency spikes recorded during UAP encounters.", icon: Activity, category: "analysis" },
  { id: "satellite", name: "Orbital Path Overlay", description: "Correlate sightings with known spy satellite trajectories.", icon: Globe, category: "systems" },
  { id: "financial", name: "Black Budget Leak Tracker", description: "Monitor unaccounted financial shifts in military spending sectors.", icon: BarChart3, category: "intelligence" },
  { id: "authenticity", name: "Document Authenticity Scorer", description: "AI analysis of document formatting, fonts, and bureaucratic terminology.", icon: FileText, category: "forensics" },
  { id: "disinfo", name: "Psy-Op Detection Filter", description: "Flag potential disinformation campaigns in leaked data sets.", icon: Eye, category: "intelligence" },
  { id: "isotope", name: "Material Isotope Catalog", description: "Reference database for recovered non-terrestrial alloys.", icon: Cpu, category: "analysis" },
  { id: "timeline", name: "Event Timeline Reconstructor", description: "Merge multiple sources into a single chronological master report.", icon: Layers, category: "analysis" },
  { id: "leak-pred", name: "Leak Probability Forecast", description: "Predict upcoming agency declassifications based on FOIA pressure.", icon: Zap, category: "intelligence" },
  { id: "acoustic", name: "Acoustic Signature Matcher", description: "Match reported craft sounds to known or unknown propulsion types.", icon: Activity, category: "forensics" },
  { id: "dead-drop", name: "Digital Dead-Drop Monitor", description: "Real-time monitoring of secure channels for new 'leaked' packets.", icon: Terminal, category: "systems" },
  { id: "inter-agency", name: "Agency Connectivity Graph", description: "Map data sharing protocols between SAPs and civilian agencies.", icon: LinkIcon, category: "intelligence" },
  { id: "red-alert", name: "Incursion Alert System", description: "Live monitoring of air traffic control anomalous flight paths.", icon: AlertCircle, category: "systems" },
  { id: "legacy", name: "Legacy Protocol Emulator", description: "Access archive data via simulated 1970s/80s terminal interfaces.", icon: Terminal, category: "systems" },
  { id: "mass-file", name: "Mass File Integrity Scanner", description: "Identify corrupted or 'scrubbed' sectors in massive data dumps.", icon: Database, category: "forensics" },
  { id: "target", name: "Strategic Asset Tracker", description: "Track movement of known recovery teams and research personnel.", icon: Crosshair, category: "intelligence" },
];

export const IntelligenceToolkit = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  const filteredTools = TOOLS.filter(t => activeCategory === "all" || t.category === activeCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Sidebar - Tool Selection */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">Filter_Categories</div>
          <div className="space-y-1">
            {["all", "analysis", "forensics", "intelligence", "systems"].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded font-mono text-[10px] uppercase transition-all ${
                  activeCategory === cat ? "bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30" : "text-white/40 hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-black border border-[#00ff00]/20 rounded-xl p-4 overflow-y-auto max-h-[500px] scrollbar-hide">
          <div className="font-mono text-[10px] text-[#00ff00]/40 uppercase tracking-widest mb-4">Available_Modules</div>
          <div className="space-y-2">
            {filteredTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setSelectedToolId(tool.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left group ${
                  selectedToolId === tool.id ? "bg-[#00ff00]/10 border-[#00ff00]/40" : "bg-white/5 border-white/5 hover:border-white/20"
                }`}
              >
                <tool.icon className={`w-4 h-4 ${selectedToolId === tool.id ? "text-[#00ff00]" : "text-white/20 group-hover:text-white/40"}`} />
                <span className={`font-mono text-[10px] uppercase tracking-tighter ${selectedToolId === tool.id ? "text-white" : "text-white/40"}`}>
                  {tool.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Area - Tool Execution */}
      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          {selectedToolId ? (
            <motion.div
              key={selectedToolId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full min-h-[600px] relative overflow-hidden"
            >
              {/* Background HUD elements */}
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Terminal className="w-64 h-64" />
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="font-mono text-[10px] text-[#00ff00] uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Cpu className="w-3 h-3" /> Module_Init // Active
                    </div>
                    <h2 className="font-mono text-2xl font-black text-white uppercase italic tracking-tighter">
                      {TOOLS.find(t => t.id === selectedToolId)?.name}
                    </h2>
                    <p className="font-mono text-xs text-white/40 mt-2 max-w-xl">
                      {TOOLS.find(t => t.id === selectedToolId)?.description}
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center min-w-[120px]">
                    <div className="font-mono text-[8px] text-white/20 uppercase mb-1">Status</div>
                    <div className="font-mono text-[10px] text-green-400 font-bold uppercase animate-pulse">Ready</div>
                  </div>
                </div>

                {/* Simulated Tool Interface */}
                <div className="flex-grow bg-black/40 rounded-xl border border-white/5 p-6 font-mono text-[11px] text-[#00ff00]/60 space-y-4 relative group">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.02)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none" />
                  
                  <div className="flex items-center gap-2 text-white/30">
                    <Terminal className="w-3 h-3" /> 
                    <span>Establishing secure connection to MJ-12 core...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">[SYSTEM]</span> 
                    <span>Accessing distributed database nodes...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">[SUCCESS]</span> 
                    <span>Module loaded into memory. Waiting for input parameters.</span>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="text-white/20 uppercase text-[9px] mb-4">Input_Terminal</div>
                    <div className="bg-white/5 border border-white/10 p-3 rounded flex items-center gap-3">
                      <span className="text-[#00ff00]">$</span>
                      <input 
                        type="text" 
                        placeholder="Enter criteria for analysis..."
                        className="bg-transparent border-none outline-none text-white w-full"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[9px] text-white/10 uppercase">
                    <span>Buffer: 1024KB</span>
                    <span>Encryption: AES-256-GCM</span>
                    <span>Node: INTEL-GW-04</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <button className="flex-grow bg-[#00ff00] text-black font-mono text-[10px] font-bold uppercase py-3 rounded-lg hover:bg-[#00ffaa] transition-all tracking-widest">
                    Execute Analysis
                  </button>
                  <button className="px-6 bg-white/5 border border-white/10 text-white/40 font-mono text-[10px] uppercase rounded-lg hover:bg-white/10 transition-all">
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center h-full min-h-[600px] text-center p-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Cpu className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="font-mono text-lg text-white/60 uppercase tracking-tighter mb-2">Select a module to begin</h3>
              <p className="font-mono text-xs text-white/20 max-w-sm">
                Choose an intelligence tool from the sidebar to initialize the forensic or analytical environment.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
