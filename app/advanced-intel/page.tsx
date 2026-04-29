"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Lock, ShieldAlert, Cpu, Shield,
  Search, Info, Database, Activity,
  ChevronRight, AlertTriangle, Terminal,
  Maximize2, Share2, Layers, Binary,
  Eye, FileSearch, Network, Boxes,
  Dna, Users, Fingerprint, Map, FileText,
  Target
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GlitchTitle } from "@/components/effects/GlitchTitle";
import { WhistleblowerVeracity } from "@/components/forensics/WhistleblowerVeracity";
import WorldMap from "@/components/map/WorldMap";

// --- DATASETS ---

const PATENT_SECRECY_DATA = [
  { 
    category: "Inertial Mass Reduction Device", 
    sub: "US Patent 10,144,532 B2 // Salvatore Pais", 
    status: "FROZEN", 
    order: "NAVY-SA-2018", 
    impact: "Utilizes high-frequency vibration to reduce vacuum energy density, allowing for extreme acceleration without G-force effects.",
    count: 1
  },
  { 
    category: "High Frequency Gravitational Wave Generator", 
    sub: "US Patent 10,322,827 B2 // US Navy", 
    status: "FROZEN", 
    order: "NAVY-SA-2019", 
    impact: "Generation of high-power gravitational waves for propulsion and directed energy applications.",
    count: 1
  },
  { 
    category: "Room Temperature Superconductor", 
    sub: "US Patent 10,135,366 B2 // Piezo-induced", 
    status: "RESTRICTED", 
    order: "NAVY-SA-2017", 
    impact: "Enables lossless energy transfer for high-output propulsion systems at terrestrial temperatures.",
    count: 1
  },
  { 
    category: "Triangular Spacecraft", 
    sub: "US Patent 2006/0145019 A1 // TR-3B Protocol", 
    status: "ACTIVE_MONITOR", 
    order: "AF-SPEC-2006", 
    impact: "A craft with a circular accelerator for the reduction of inertial mass via magnetic field disruption.",
    count: 1
  },
];

const INTEL_BRIEFINGS = [
  { id: 1, title: "Carrier Strike Group 11 (Nimitz)", status: "COMPLETED", detail: "Electronic warfare analysis of UAP jamming signatures completed." },
  { id: 2, title: "Roswell Debris Cataloging", status: "ONGOING", detail: "Analysis of isotopic ratios in recovered memory-metal fragments." },
  { id: 3, title: "Tic-Tac Propulsion Model", status: "TESTING", detail: "Simulating gravitational lensing effects near the craft's horizon." },
  { id: 4, title: "Operation Moon Dust", status: "ACTIVE", detail: "Recovery of anomalous atmospheric probe in North Africa." },
  { id: 5, title: "Inter-Agency Funding Shift", status: "MONITOR", detail: "Large-scale transfer of SAP funds from AFRL to Space Force." },
  { id: 6, title: "EBE-1 Autopsy Archive", status: "RESTRICTED", detail: "Reviewing original 1947 biological records for genetic markers." },
  { id: 7, title: "Malmstrom AFB Incident", status: "CLOSED", detail: "Nuclear silo shutdown correlation with anomalous aerial activity." },
  { id: 8, title: "Skinwalker Ranch Telemetry", status: "MONITOR", detail: "Gamma ray bursts detected during 'hitchhiker' effect episodes." },
  { id: 9, title: "Phoenix Lights // V-Craft", status: "ARCHIVED", detail: "Mass sighting triangulation confirms 1.5-mile wingspan." },
  { id: 10, title: "Project Stargate // RV", status: "ACTIVE", detail: "Remote Viewing protocols applied to off-world recovery sites." },
  { id: 11, title: "Eglin AFB Radar Glitch", status: "INVESTIGATING", detail: "Multi-point radar tracking of 'Dark Cube' within UAP training area." },
  { id: 12, title: "Oumuamua Trajectory", status: "THEORETICAL", detail: "Non-gravitational acceleration analysis suggests light-sail propulsion." },
  { id: 13, title: "Socorro Landing Site", status: "SAMPLED", detail: "Soil crystallization confirmed under landing strut imprints." },
  { id: 14, title: "Project Aquarius Update", status: "RESTRICTED", detail: "EBE communication transcriptions moved to deep storage." },
  { id: 15, title: "Majestic-12 Oversight", status: "MAJIC", detail: "Quarterly review of compartmented black project budgeting." },
  { id: 16, title: "Washington DC Flyover", status: "DECLASSIFIED", detail: "1952 radar-visual confirmation of UAP over restricted airspace." },
  { id: 17, title: "Varginha Incident", status: "BRAZIL-SPEC", detail: "Recovery of biological entities by joint US-Brazilian task force." },
  { id: 18, title: "Shag Harbour Recovery", status: "WATER-SPEC", detail: "Transmedium craft detected under-ice in Nova Scotia." },
  { id: 19, title: "Project Pounce", status: "SAP", detail: "Rapid response protocols for immediate craft recovery." },
  { id: 20, title: "EBEN Signal Intercept", status: "SIGINT", detail: "Low-frequency pulses detected from 35 light years out." },
  { id: 21, title: "AATIP Slide 9 Analysis", status: "MEDICAL", detail: "Biological effects of UAP proximity: cellular degeneration." },
  { id: 22, title: "Kecksburg Acorn", status: "RECOVERED", detail: "Bell-shaped object with hieroglyphic markings transported to WP." },
  { id: 23, title: "Rendlesham Forest // Binary", status: "DECODED", detail: "Tactile binary transmission from craft interface translated." },
  { id: 24, title: "Solar Warden Assets", status: "OPERATIONAL", detail: "Deep space patrolling craft status: Stealth Mode." },
  { id: 25, title: "Invention Secrecy Act", status: "LEGAL", detail: "94 new secrecy orders issued for energy-efficient propulsion." },
  { id: 26, title: "Project Blue Book 13", status: "MISSING", detail: "Locating the missing special report on hostile encounters." },
  { id: 27, title: "Pentagon UAP Task Force", status: "AARO", detail: "Consolidating all military UAP reports into single database." },
  { id: 28, title: "Battle of Los Angeles", status: "HISTORICAL", detail: "Ordnance resilience analysis of 1942 anomalous object." },
  { id: 29, title: "Gimbal/GoFast Footage", status: "VERIFIED", detail: "FLIR analysis confirms lack of thermal exhaust signature." },
  { id: 30, title: "Extraterrestrial Materials", status: "ISOTOPIC", detail: "Metamaterials exhibit atomic alignment impossible on Earth." },
];

const LINGUISTIC_DATA = [
  { symbol: "⎊", meaning: "Spacetime Anchor", probability: "94%", origin: "Roswell-1947" },
  { symbol: "◈", meaning: "Inertial Nullifier", probability: "81%", origin: "Socorro-1964" },
  { symbol: "≋", meaning: "Transmedium Field", probability: "89%", origin: "Aguadilla-2013" },
];

const NEXUS_DATA = [
  { node: "DOE (Dept. of Energy)", role: "Nuclear/Propulsion Secrets", access: "Q-Clearance" },
  { node: "NRO (National Recon)", role: "Satellite Intelligence", access: "TK-Clearance" },
  { node: "Lockheed Skunkworks", role: "Private R&D Contractor", access: "Compartmented" },
  { node: "MJ-12 Group", role: "Strategic Oversight", access: "MAJIC" },
];

const XENO_DATA = [
  { name: "Ebens", origin: "Zeta Reticuli", type: "Biological", stats: { dna: "98% Synthetic", brain: "Triple-Lobe", energy: "Photon-based" }, img: "/media/foto/EXTRATERRESTRI/ebens.png" },
  { name: "Flatwoods Monster", origin: "Braxton County", type: "Mechanical-Bio", stats: { dna: "N/A", brain: "Processing Unit", energy: "Nuclear/Oil" }, img: "/media/foto/EXTRATERRESTRI/flatwoods.png" },
  { name: "Grays", origin: "Zeta Reticuli", type: "Biological", stats: { dna: "Cloned Archive", brain: "Telepathic Hub", energy: "Bio-Synthesis" }, img: "/media/foto/EXTRATERRESTRI/grey.png" },
  { name: "Hopkinsville Goblins", origin: "Kentucky Event", type: "Biological", stats: { dna: "Amorphous", brain: "Instinctive", energy: "Unknown" }, img: "/media/foto/EXTRATERRESTRI/hopkinsville.png" },
  { name: "Mantis", origin: "Deep Space", type: "Insectoid", stats: { dna: "Ancestral", brain: "High-Logic", energy: "Psionic" }, img: "/media/foto/EXTRATERRESTRI/mantis.png" },
  { name: "Nordics", origin: "Pleiades Cluster", type: "Humanoid", stats: { dna: "99% Human", brain: "Enhanced", energy: "Atmospheric" }, img: "/media/foto/EXTRATERRESTRI/nordics.png" },
  { name: "Pascagoula Entities", origin: "Mississippi Encounter", type: "Unknown", stats: { dna: "Silicon-based", brain: "Decentralized", energy: "Kinetics" }, img: "/media/foto/EXTRATERRESTRI/pascagoula.png" },
  { name: "Reptilians", origin: "Draconian System", type: "Saurian", stats: { dna: "Apex Predatory", brain: "Aggressive", energy: "Thermal" }, img: "/media/foto/EXTRATERRESTRI/reptiians.png" },
  { name: "Valensole Humanoids", origin: "France Event", type: "Humanoid", stats: { dna: "Stasis-Locked", brain: "Dormant", energy: "Crystal-core" }, img: "/media/foto/EXTRATERRESTRI/valensole.png" },
];

const UFO_DATA = [
  { name: "Cylindrical", class: "Cigar Type", speed: "Mach 15", gForce: "800 Gs", fuel: "Zero Point", img: "/media/foto/UFO_UAP/cigar.png" },
  { name: "Saucer", class: "Disc Type", speed: "Mach 20+", gForce: "1,200 Gs", fuel: "Element 115", img: "/media/foto/UFO_UAP/disc.png" },
  { name: "Triangle", class: "Large Tactical", speed: "Silent/Stationary", gForce: "500 Gs", fuel: "Magnetic Disruption", img: "/media/foto/UFO_UAP/triangle.png" },
  { name: "Orb", class: "Sphere/Probe", speed: "Instantaneous", gForce: "Infinite", fuel: "Plasma Core", img: "/media/foto/UFO_UAP/orb.png" },
  { name: "Tic-Tac", class: "Fravor-Class", speed: "Transmedium", gForce: "1,500+ Gs", fuel: "Vacuum Energy", img: "/media/foto/UFO_UAP/tictac.png" },
  { name: "Chandelier", class: "COMING SOON", speed: "UNKNOWN", gForce: "UNKNOWN", fuel: "Anomalous", img: "/media/foto/UFO LEAK/leak12.jpg" },
  { name: "V-Shaped", class: "COMING SOON", speed: "UNKNOWN", gForce: "UNKNOWN", fuel: "Gravity Drive", img: "/media/foto/UFO LEAK/LEAK6.avif" },
  { name: "Black Cube", class: "COMING SOON", speed: "UNKNOWN", gForce: "UNKNOWN", fuel: "Dark Energy", img: "/media/foto/UFO LEAK/LEAK9.avif" },
  { name: "Black Cross", class: "COMING SOON", speed: "UNKNOWN", gForce: "UNKNOWN", fuel: "Spatial Warp", img: "/media/foto/UFO LEAK/LEAK7.avif" },
];

const ADVANCED_TOOLS = [
  { 
    id: "stargate", 
    title: "Project_Stargate // v9.4", 
    desc: "Geospatial Remote Viewing Interface. Accessing coordinates of anomalous underground structures and off-world signatures.",
    icon: Map,
    status: "OPERATIONAL",
    color: "#00ff00"
  },
  { 
    id: "patent", 
    title: "Frozen_Patents // v9.4", 
    desc: "Monitoring suppressed aerospace and energy technology. Accessing Navy/Air Force secrecy orders and inertial mass reduction device data.",
    icon: Shield,
    status: "RESTRICTED",
    color: "#ff6600"
  },
  { 
    id: "translator", 
    title: "Alien_Linguistics // v9.4", 
    desc: "Processing non-terrestrial logograms and binary telemetry. Decoding linguistic patterns from recovered artifacts.",
    icon: Binary,
    status: "SYNCING",
    color: "#0088ff"
  },
  { 
    id: "whistleblowers", 
    title: "Whistleblower_Veracity // v9.4", 
    desc: "Psychological and factual triage of high-clearance subjects. Evaluating the credibility of Lazar, Grusch, and Fravor.",
    icon: Eye,
    status: "ACTIVE_SCAN",
    color: "#aa00ff"
  },
  { 
    id: "intel-heatmap", 
    title: "Tactical_Intel_Map // v9.4", 
    desc: "Geospatial clustering of UAP activity and classified document origins. Pinging active hotspots globally.",
    icon: Map,
    status: "OPERATIONAL",
    color: "#00ff00"
  },
  { 
    id: "d3-nexus", 
    title: "Agency_Nexus_Network // v9.4", 
    desc: "Inter-agency relationship mapping. Visualizing the information flow between DOE, NRO, and MJ-12.",
    icon: Network,
    status: "CONNECTED",
    color: "#ff3399"
  },
  { 
    id: "xeno-bio", 
    title: "Xeno-Biology_Scan // v9.4", 
    desc: "Biological entity registry and genetic marker analysis for recovered non-human remains.",
    icon: Dna,
    status: "RESTRICTED",
    color: "#ff4444"
  },
  { 
    id: "three-3d", 
    title: "UAP_Identification // v9.4", 
    desc: "Multi-point radar reconstruction and morphology analysis. Cataloging identified and unverified craft types.",
    icon: Target,
    status: "ACTIVE",
    color: "#00ffaa"
  },
];

export default function AdvancedIntelPage() {
  const { data: session } = useSession();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [selectedUfo, setSelectedUfo] = useState(UFO_DATA[4]); // Default to Tic-Tac
  const [selectedXeno, setSelectedXeno] = useState(XENO_DATA[2]); // Default to Grays
  const [scannedMedia, setScannedMedia] = useState<{ xeno: string[], ufo: string[], whistblower: string[] } | null>(null);
  const [mapData, setMapData] = useState<{ docs: any[], anomalies: any[], media: any[] }>({ docs: [], anomalies: [], media: [] });

  useEffect(() => {
    fetch("/api/admin/scan-intelligence-media")
      .then(r => r.json())
      .then(data => setScannedMedia(data))
      .catch(() => {});

    // Fetch map data
    Promise.all([
      fetch("/api/documents").then(r => r.json()),
      fetch("/api/anomalies").then(r => r.json()),
      fetch("/api/media").then(r => r.json())
    ]).then(([docs, anomalies, media]) => {
      setMapData({
        docs: Array.isArray(docs) ? docs.filter((d: any) => d.latitude && d.longitude) : [],
        anomalies: Array.isArray(anomalies) ? anomalies.filter((a: any) => a.latitude && a.longitude) : [],
        media: Array.isArray(media) ? media.filter((m: any) => m.latitude && m.longitude) : []
      });
    }).catch(() => {});
  }, []);

  const activeToolData = ADVANCED_TOOLS.find(t => t.id === activeTool);

  // Lock body scroll when tool is active
  useEffect(() => {
    if (activeTool) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeTool]);

  return (
    <div className="min-h-screen bg-[#030303] pt-24 px-6 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00ff00]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="space-y-2 border-l-4 border-[#00ff00] pl-6">
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
            <GlitchTitle text="ADVANCED INTEL" />
          </h1>
          <p className="font-mono text-xs text-[#00ff00]/60 tracking-[0.3em] uppercase">
            Strategic Technology Monitoring // Clearance Level 5 Required
          </p>
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADVANCED_TOOLS.map((tool) => (
            <motion.div 
              key={tool.id}
              whileHover={{ scale: 1.02 }}
              className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setActiveTool(tool.id)}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(to bottom right, ${tool.color}15, transparent)` }}
              />
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <tool.icon className="w-6 h-6" style={{ color: tool.color }} />
                  </div>
                  <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-mono" style={{ color: tool.color }}>
                    {tool.status}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tighter leading-tight">{tool.title}</h3>
                  <p className="text-white/40 text-[10px] font-mono mt-1 leading-normal">
                    {tool.desc}
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-2 font-mono text-[10px] uppercase font-bold group-hover:translate-x-2 transition-transform" style={{ color: tool.color }}>
                  Launch Module <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full-Screen Tool Overlay */}
        <AnimatePresence>
          {activeTool && activeToolData && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
            >
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveTool(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
              />

              {/* Modal Card */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-6xl h-[90vh] bg-[#070707] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)] flex flex-col"
                style={{ borderColor: `${activeToolData.color}30` }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <activeToolData.icon className="w-5 h-5" style={{ color: activeToolData.color }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">{activeToolData.title} // v9.4</h2>
                      <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">TACTICAL INTERFACE // {activeToolData.status}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTool(null)}
                    className="group flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all font-mono text-[10px] uppercase"
                  >
                    DISCONNECT <span className="group-hover:translate-x-1 transition-transform">×</span>
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
                  <div className="h-full">
                    {activeTool === "intel-heatmap" && (
                      <div className="h-full min-h-[600px] flex flex-col gap-6">
                        <div className="flex-1 bg-black/40 border border-[#00ff00]/10 rounded-3xl overflow-hidden relative">
                           <WorldMap 
                             documents={mapData.docs} 
                             anomalies={mapData.anomalies} 
                             media={mapData.media}
                             onSelect={() => {}} 
                             selected={null}
                           />
                           {/* Legend Overlay */}
                           <div className="absolute bottom-6 left-6 p-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl space-y-3">
                              <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Tactical_Legend</div>
                              <div className="flex items-center gap-3">
                                 <div className="w-3 h-3 rounded-full bg-[#00ff00]" />
                                 <span className="text-[10px] text-white uppercase">Classified Docs</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="w-3 h-3 rotate-45 border border-[#ff0000] bg-[#ff0000]/20" />
                                 <span className="text-[10px] text-white uppercase">UAP Anomalies</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="w-3 h-3 bg-[#0088ff]" />
                                 <span className="text-[10px] text-white uppercase">Media Assets</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTool === "whistleblowers" && <WhistleblowerVeracity />}
                    
                    {activeTool === "patent" && (
                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                        <div className="space-y-4">
                          {PATENT_SECRECY_DATA.map((p) => (
                            <div key={p.order} className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="text-white font-bold text-lg uppercase tracking-tight">{p.category}</h3>
                                <span className="text-[10px] font-mono text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">{p.status}</span>
                              </div>
                              <p className="text-white/40 font-mono text-xs italic">{p.sub}</p>
                              <p className="text-white/60 font-mono text-xs border-t border-white/5 pt-3 leading-relaxed">
                                <span className="text-[#00ff00]/60 mr-2">SEC_ORDER:</span> {p.impact}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-6">
                           <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                              <h4 className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Invention Secrecy Act</h4>
                              <p className="text-xs text-white/60 leading-relaxed italic">Government power to suppress patents detrimental to national security. Current active orders: 6,122.</p>
                           </div>
                           <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/20 flex flex-col items-center text-center gap-4 group">
                              <div className="relative">
                                <div className="absolute -inset-2 bg-red-500/20 blur-md rounded-full group-hover:bg-red-500/40 transition-all" />
                                <AlertTriangle className="w-8 h-8 text-red-500 relative z-10" />
                              </div>
                              <div className="space-y-2">
                                <div className="font-mono text-[10px] text-red-500 uppercase tracking-[0.4em] font-black">FEDERAL_LAW_WARNING</div>
                                <p className="font-mono text-[8px] text-red-500/60 leading-relaxed uppercase tracking-tighter">
                                  UNAUTHORIZED DISCLOSURE OF THIS INFORMATION IS A VIOLATION OF THE INVENTION SECRECY ACT (35 U.S.C. 181-188). 
                                  PENALTIES INCLUDE MANDATORY IMPRISONMENT AND PERMANENT REVOCATION OF ALL CLEARANCE LEVELS.
                                </p>
                                <div className="font-mono text-[7px] text-red-500/30 uppercase mt-2">
                                  [ AGENT_ID: {session?.user?.id || "UNK"} // MONITORING_ACTIVE ]
                                </div>
                              </div>
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTool === "shadow-text" && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {SHADOW_TEXT_DATA.map(doc => (
                            <div key={doc.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 relative overflow-hidden">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-[10px] text-[#aa00ff]">{doc.id}</span>
                                <span className="font-mono text-[9px] text-white/30">{doc.recovery}% RECOVERED</span>
                              </div>
                              <h3 className="text-white font-bold uppercase tracking-tight text-sm">{doc.title}</h3>
                              <div className="bg-black/60 p-4 rounded-xl font-mono text-[10px] text-white/70 italic relative min-h-[80px]">
                                <span className="text-[#aa00ff] opacity-40 absolute top-2 right-2"><Eye className="w-3 h-3" /></span>
                                "{doc.snippet}"
                              </div>
                              <button className="w-full py-2 bg-[#aa00ff]/10 hover:bg-[#aa00ff]/20 border border-[#aa00ff]/20 rounded-lg font-mono text-[9px] text-[#aa00ff] uppercase transition-all">Deep_Contrast_Scan</button>
                            </div>
                          ))}
                        </div>
                        <div className="p-8 bg-[#aa00ff]/5 border border-[#aa00ff]/10 rounded-2xl flex items-center gap-8">
                           <Search className="w-12 h-12 text-[#aa00ff]/40" />
                           <div className="space-y-1">
                              <div className="font-mono text-xs text-white uppercase font-bold tracking-widest">Spectral Layer Analysis Operational</div>
                              <p className="text-xs text-white/40 leading-relaxed font-mono">Bypassing carbon-based redaction ink via high-frequency luminance mapping. Targeting: Project Stargate Archives.</p>
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTool === "translator" && (
                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] relative">
                           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#0088ff,transparent_70%)]" />
                           <Binary className="w-24 h-24 text-[#0088ff]/40 animate-pulse" />
                           <div className="mt-8 font-mono text-lg text-[#0088ff] animate-pulse uppercase tracking-[0.4em]">SYNCING_LOGOGRAMS...</div>
                        </div>
                        <div className="space-y-4">
                           {LINGUISTIC_DATA.map(item => (
                             <div key={item.symbol} className="p-5 bg-white/5 border border-white/5 rounded-xl flex items-center gap-6 group hover:border-[#0088ff]/30 transition-all">
                                <div className="text-4xl text-[#0088ff]">{item.symbol}</div>
                                <div className="space-y-1">
                                   <div className="font-mono text-[10px] text-white/30 uppercase">{item.origin}</div>
                                   <div className="text-white font-bold uppercase tracking-tight">{item.meaning}</div>
                                   <div className="font-mono text-[9px] text-[#0088ff]/60">CONFIDENCE: {item.probability}</div>
                                </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}

                    {activeTool === "d3-nexus" && (
                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 h-full">
                        <div className="bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center group/nexus">
                           <div className="absolute top-4 left-4 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-[#ff3399] animate-ping" />
                             <span className="font-mono text-[9px] text-[#ff3399] uppercase tracking-[0.3em] font-black">SECURE_LINK_ESTABLISHED</span>
                           </div>
                           <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-[#ff3399]/10 border border-[#ff3399]/30 rounded font-mono text-[8px] text-[#ff3399]">
                             <Lock className="w-3 h-3" /> READ_ONLY_ACCESS
                           </div>
                           <Network className="w-32 h-32 text-[#ff3399]/20 group-hover/nexus:text-[#ff3399]/40 transition-colors" />
                           <div className="mt-8 font-mono text-[10px] text-white/20 uppercase tracking-[0.5em] italic">Encrypted_Network_Mapping_Active</div>
                        </div>
                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                           {NEXUS_DATA.map(node => (
                             <div key={node.node} className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2 hover:border-[#ff3399]/30 transition-all group/node">
                                <div className="flex items-center justify-between">
                                   <h4 className="text-white font-bold text-[11px] uppercase group-hover/node:text-[#ff3399] transition-colors">{node.node}</h4>
                                   <span className="text-[8px] bg-[#ff3399]/10 text-[#ff3399] px-2 py-0.5 rounded border border-[#ff3399]/20 font-mono">{node.access}</span>
                                </div>
                                <p className="text-[10px] text-white/40 font-mono italic">{node.role}</p>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}

                    {activeTool === "three-3d" && (
                      <div className="flex flex-col gap-8">
                        {/* 3D Visualizer TOP */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 order-1">
                          <div className="bg-black rounded-3xl border border-white/10 aspect-video flex flex-col items-center justify-center relative overflow-hidden">
                             <div className="relative z-10 flex flex-col items-center gap-8 text-center px-6 w-full">
                                <motion.div 
                                  key={selectedUfo.name}
                                  initial={{ rotateY: 0, opacity: 0, scale: 0.8 }}
                                  animate={{ rotateY: 360, opacity: 1, scale: 1 }}
                                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                  className="perspective-1000"
                                >
                                   {selectedUfo.name === "Cylindrical" && (
                                     <svg width="200" height="60" viewBox="0 0 200 60" className="drop-shadow-[0_0_15px_#00ffaa]">
                                       <rect x="10" y="15" width="180" height="30" rx="15" fill="none" stroke="#00ffaa" strokeWidth="1.5" strokeDasharray="5 5" />
                                       <ellipse cx="100" cy="30" rx="90" ry="15" fill="none" stroke="#00ffaa" strokeWidth="0.5" opacity="0.3" />
                                     </svg>
                                   )}
                                   {selectedUfo.name === "Saucer" && (
                                     <svg width="200" height="100" viewBox="0 0 200 100" className="drop-shadow-[0_0_15px_#00ffaa]">
                                       <ellipse cx="100" cy="60" rx="90" ry="25" fill="none" stroke="#00ffaa" strokeWidth="1.5" strokeDasharray="8 4" />
                                       <path d="M10 60 Q100 10 190 60" fill="none" stroke="#00ffaa" strokeWidth="0.5" opacity="0.4" />
                                       <circle cx="100" cy="45" r="5" fill="#00ffaa" className="animate-pulse" />
                                     </svg>
                                   )}
                                   {selectedUfo.name === "Triangle" && (
                                     <svg width="180" height="160" viewBox="0 0 180 160" className="drop-shadow-[0_0_20px_#00ffaa]">
                                       <path d="M90 20 L160 140 L20 140 Z" fill="none" stroke="#00ffaa" strokeWidth="2" strokeDasharray="10 5" />
                                       <circle cx="90" cy="50" r="6" fill="#00ffaa" />
                                       <circle cx="45" cy="125" r="4" fill="#00ffaa" />
                                       <circle cx="135" cy="125" r="4" fill="#00ffaa" />
                                     </svg>
                                   )}
                                   {selectedUfo.name === "Black Cross" && (
                                      <svg width="180" height="180" viewBox="0 0 200 200" className="drop-shadow-[0_0_20px_#00ffaa]">
                                        <path d="M80 20 L120 20 L120 80 L180 80 L180 120 L120 120 L120 180 L80 180 L80 120 L20 120 L20 80 L80 80 Z" fill="none" stroke="#00ffaa" strokeWidth="1.5" strokeDasharray="4 4" />
                                        <circle cx="100" cy="100" r="10" fill="none" stroke="#00ffaa" strokeWidth="0.5" opacity="0.3" />
                                      </svg>
                                   )}
                                   {selectedUfo.name === "Black Cube" && (
                                      <svg width="150" height="150" viewBox="0 0 150 150" className="drop-shadow-[0_0_20px_#00ffaa]">
                                        <rect x="35" y="35" width="80" height="80" fill="none" stroke="#00ffaa" strokeWidth="2" strokeDasharray="4 2" />
                                        <circle cx="75" cy="75" r="65" fill="none" stroke="#00ffaa" strokeWidth="0.5" opacity="0.2" />
                                      </svg>
                                   )}
                                   {selectedUfo.name === "V-Shaped" && (
                                      <svg width="200" height="100" viewBox="0 0 200 100" className="drop-shadow-[0_0_20px_#00ffaa]">
                                        <path d="M20 20 L100 80 L180 20 L140 20 L100 50 L60 20 Z" fill="none" stroke="#00ffaa" strokeWidth="1.5" strokeDasharray="6 3" />
                                      </svg>
                                   )}
                                   {selectedUfo.name === "Chandelier" && (
                                      <svg width="180" height="180" viewBox="0 0 200 200" className="drop-shadow-[0_0_20px_#00ffaa]">
                                        <path d="M100 20 L100 180 M60 50 L140 50 M40 100 L160 100 M60 150 L140 150" stroke="#00ffaa" strokeWidth="1.5" strokeDasharray="2 2" />
                                        <path d="M100 20 L130 50 L100 80 L70 50 Z" fill="none" stroke="#00ffaa" strokeWidth="0.5" />
                                      </svg>
                                   )}
                                   {selectedUfo.name === "Orb" && (
                                     <svg width="150" height="150" viewBox="0 0 150 150" className="drop-shadow-[0_0_20px_#00ffaa]">
                                       <circle cx="75" cy="75" r="60" fill="none" stroke="#00ffaa" strokeWidth="1.5" strokeDasharray="4 4" />
                                       <circle cx="75" cy="75" r="45" fill="none" stroke="#00ffaa" strokeWidth="0.5" opacity="0.3" />
                                       <path d="M15 75 L135 75 M75 15 L75 135" stroke="#00ffaa" strokeWidth="0.5" opacity="0.2" />
                                     </svg>
                                   )}
                                   {selectedUfo.name === "Tic-Tac" && (
                                     <svg width="160" height="80" viewBox="0 0 160 80" className="drop-shadow-[0_0_15px_#00ffaa]">
                                       <rect x="20" y="20" width="120" height="40" rx="20" fill="none" stroke="#00ffaa" strokeWidth="2" />
                                       <path d="M40 40 L120 40" stroke="#00ffaa" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
                                     </svg>
                                   )}
                                </motion.div>
                                <div className="space-y-2">
                                   <div className="font-mono text-xs text-[#00ffaa] tracking-[0.3em] uppercase font-black">RECONSTRUCTION: {selectedUfo.name.toUpperCase()}</div>
                                   <p className="text-[9px] text-white/40 font-mono italic max-w-md mx-auto">
                                      "Analyzing multi-point radar telemetry. Resolving {selectedUfo.class} geometry via recursive signal processing."
                                   </p>
                                </div>
                             </div>
                          </div>
                          <div className="space-y-6">
                             <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                                <h4 className="font-mono text-xs text-white uppercase font-bold">Metrics: {selectedUfo.name}</h4>
                                <div className="space-y-3">
                                   <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                      <span className="text-[10px] text-white/40 font-mono uppercase">Acceleration</span>
                                      <span className="text-[10px] text-[#00ffaa] font-mono">{selectedUfo.gForce}</span>
                                   </div>
                                   <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                      <span className="text-[10px] text-white/40 font-mono uppercase">Velocity</span>
                                      <span className="text-[10px] text-[#00ffaa] font-mono">{selectedUfo.speed}</span>
                                   </div>
                                   <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                      <span className="text-[10px] text-white/40 font-mono uppercase">Energy Source</span>
                                      <span className="text-[10px] text-[#00ffaa] font-mono">{selectedUfo.fuel}</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                        </div>

                        {/* UFO Cards BELOW - Smaller */}
                        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-3 order-2">
                           {UFO_DATA.map(ufo => (
                               <div 
                                 key={ufo.name} 
                                 onClick={() => setSelectedUfo(ufo)}
                                 className={`group/ufo cursor-pointer rounded-xl overflow-hidden border transition-all ${
                                   selectedUfo.name === ufo.name ? "border-[#00ffaa] bg-[#00ffaa]/10" : "bg-white/5 border-white/10 hover:border-[#00ffaa]/50"
                                 }`}
                               >
                                  <div className="aspect-square relative overflow-hidden bg-black/40">
                                     {ufo.class === "COMING SOON" && (
                                       <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none p-2 text-center rounded-xl">
                                         <Lock className="w-4 h-4 text-red-500/60 mb-1" />
                                         <div className="font-mono text-[6px] text-red-500/80 uppercase tracking-widest font-black">RESTRICTED</div>
                                       </div>
                                     )}
                                     <img 
                                       src={encodeURI(ufo.img)} 
                                       alt={ufo.name} 
                                       className={`w-full h-full object-cover transition-all duration-700 ${ufo.class === "COMING SOON" ? "blur-2xl grayscale" : "group-hover/ufo:scale-110"}`} 
                                     />
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                                     <div className="absolute bottom-1.5 left-1.5 right-1.5 text-left">
                                        <div className="font-mono text-[8px] text-[#00ffaa] font-bold uppercase truncate">{ufo.name}</div>
                                        <div className="font-mono text-[6px] text-white/40 uppercase truncate">{ufo.class}</div>
                                     </div>
                                  </div>
                               </div>
                           ))}
                        </div>
                      </div>
                    )}

                    {activeTool === "xeno-bio" && (
                      <div className="space-y-8">
                         <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
                             {XENO_DATA.map(xeno => (
                                <div 
                                  key={xeno.name} 
                                  onClick={() => setSelectedXeno(xeno)}
                                  className={`group/xeno cursor-pointer rounded-lg overflow-hidden border transition-all ${
                                    selectedXeno.name === xeno.name ? "border-red-500 bg-red-500/10" : "bg-white/5 border-white/5 hover:border-red-500/50"
                                  }`}
                                >
                                   <div className="aspect-[3/4] relative overflow-hidden">
                                      <img 
                                        src={encodeURI(xeno.img)} 
                                        alt={xeno.name} 
                                        className="w-full h-full object-cover group-hover/xeno:scale-110 transition-transform duration-700" 
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                      <div className="absolute bottom-1 left-1 right-1 text-left">
                                         <div className="text-[7px] text-white font-bold uppercase truncate">{xeno.name}</div>
                                         <div className="text-[5px] text-white/40 uppercase truncate">{xeno.origin}</div>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                         <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                            <div className="space-y-4">
                               <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-8 relative overflow-hidden min-h-[300px]">
                                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#ff4444,transparent_70%)]" />
                                  
                                  {/* DNA Scroll Animation */}
                                  <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none opacity-20 overflow-hidden flex flex-col gap-1">
                                     {[...Array(20)].map((_, i) => (
                                       <motion.div 
                                         key={i}
                                         animate={{ x: i % 2 === 0 ? ["-100%", "100%"] : ["100%", "-100%"] }}
                                         transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
                                         className="whitespace-nowrap font-mono text-[8px] text-red-500/40 tracking-[1em]"
                                       >
                                         GATTACA_XENO_SEQ_PROTOCOL_INIT_AX_{i}_MARKER_B_DELTA_PHI
                                       </motion.div>
                                     ))}
                                  </div>

                                  <motion.div
                                    key={selectedXeno.name}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative z-10 space-y-6"
                                  >
                                     <Dna className="w-20 h-20 text-red-500/60 mx-auto animate-pulse" />
                                     <div>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">ANOMALOUS_GENOME_DATABASE</h3>
                                        <div className="font-mono text-[10px] text-red-500 uppercase tracking-[0.4em] mt-2">ID: {selectedXeno.name.toUpperCase()} // SCANNING...</div>
                                     </div>
                                     <p className="text-[10px] text-white/40 font-mono italic max-w-md mx-auto leading-relaxed">
                                        "Detected {selectedXeno.stats.dna} marker in {selectedXeno.type} structure. Neural index suggests {selectedXeno.stats.brain} capacity powered by {selectedXeno.stats.energy} modulations."
                                     </p>
                                  </motion.div>
                               </div>
                            </div>
                           <div className="space-y-6">
                               <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4 text-left">
                                  <h4 className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Analysis: {selectedXeno.name}</h4>
                                  <div className="space-y-3">
                                     <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span className="text-[9px] text-white/40 font-mono uppercase">DNA Type</span>
                                        <span className="text-[9px] text-red-500 font-mono">{selectedXeno.stats.dna}</span>
                                     </div>
                                     <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span className="text-[9px] text-white/40 font-mono uppercase">Neural Index</span>
                                        <span className="text-[9px] text-red-500 font-mono">{selectedXeno.stats.brain}</span>
                                     </div>
                                     <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span className="text-[9px] text-white/40 font-mono uppercase">Energy Modality</span>
                                        <span className="text-[9px] text-red-500 font-mono">{selectedXeno.stats.energy}</span>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Decor */}
                <div className="h-2 bg-white/5 w-full overflow-hidden">
                  <motion.div 
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="h-full w-1/4 skew-x-12"
                    style={{ backgroundColor: `${activeToolData.color}20` }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Briefing Section */}
      <div className="max-w-7xl mx-auto mt-24 space-y-12 pb-32">
        <div className="flex items-center gap-4 border-b border-white/5 pb-8">
           <Database className="w-8 h-8 text-white/20" />
           <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Strategic Intelligence Briefings</h2>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Global Field Operations // Real-Time Data Stream</p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {INTEL_BRIEFINGS.map(brief => (
             <div key={brief.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group">
                <div className="flex items-start justify-between mb-4">
                   <div className="font-mono text-[10px] text-white/20 tracking-tighter">REF_ID: {String(brief.id).padStart(3, '0')}</div>
                   <div className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-mono text-[#00ff00]/60 border border-[#00ff00]/10">{brief.status}</div>
                </div>
                <h4 className="text-white font-bold text-sm uppercase tracking-tight mb-2 group-hover:text-[#00ff00] transition-colors">{brief.title}</h4>
                <p className="text-white/40 text-[11px] font-mono leading-relaxed italic border-l border-white/10 pl-4">
                  "{brief.detail}"
                </p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

