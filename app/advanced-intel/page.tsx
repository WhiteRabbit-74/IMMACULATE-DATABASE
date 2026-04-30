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
import { UndergroundBaseMap } from "@/components/intel/UndergroundBaseMap";
import { DossierEvolution } from "@/components/intel/DossierEvolution";
import { AgencyNexusNetwork } from "@/components/intel/AgencyNexusNetwork";
import { XenoBiologyScan, AlienLinguistics, UFO_DATA, XENO_ENTITIES } from "@/components/intel/AdvancedTools";
import { NHIMedical } from "@/components/intel/NHIMedical";
import { UAP3DViewer } from "@/components/intel/UAP3DViewer";

// --- DATASETS ---

const PATENT_SECRECY_DATA = [
  { 
    category: "Inertial Mass Reduction Device", 
    sub: "US Patent 10,144,532 B2 // Salvatore Pais", 
    status: "FROZEN", 
    order: "NAVY-SA-2018", 
    impact: "Utilizes high-frequency vibration of matter to reduce vacuum energy density, effectively neutralizing inertial mass for extreme acceleration without G-force impact.",
    count: 1
  },
  { 
    category: "High Frequency Gravitational Wave Generator", 
    sub: "US Patent 10,322,827 B2 // US Navy", 
    status: "FROZEN", 
    order: "NAVY-SA-2019", 
    impact: "Accelerated vibration of charged matter to generate high-power gravitational waves for propulsion and hyperspace communication.",
    count: 1
  },
  { 
    category: "Triangular Spacecraft", 
    sub: "US Patent 2006/0145019 A1 // TR-3B Protocol", 
    status: "ACTIVE_MONITOR", 
    order: "AF-SPEC-2006", 
    impact: "Circular accelerator for magnetic field disruption, creating a vertical electrostatic line charge for lift and horizontal propulsion.",
    count: 1
  },
  { 
    category: "Compact Fusion Reactor", 
    sub: "US Patent 2015/0216019 A1 // Lockheed Martin", 
    status: "ONGOING // SUPPRESSED", 
    order: "LM-SKUNK-2014", 
    impact: "Magnetic confinement fusion reactor (100MW) compact enough for aerospace deployment. Solves long-duration energy requirements for SAP craft.",
    count: 1
  },
  { 
    category: "Electromagnetic Wormhole Generator", 
    sub: "US Patent 2017/0312461 A1 // Spacetime Manip", 
    status: "CLASSIFIED", 
    order: "DOE-WARP-2017", 
    impact: "Creation of a traversable wormhole via high-intensity laser pulse interactions with vacuum energy states.",
    count: 1
  }
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

const SHADOW_TEXT_DATA = [
  { id: "ST-09-A", title: "Redacted Stargate Memo", recovery: 84, snippet: "The subject successfully [REDACTED] through the [REDACTED] using remote viewing protocols." },
  { id: "ST-12-B", title: "Anomalous Site-4 Survey", recovery: 62, snippet: "Underground structure at [REDACTED] exhibits non-terrestrial [REDACTED] signatures." },
  { id: "ST-04-C", title: "EBE Communication Log", recovery: 45, snippet: "Biometric feedback suggests [REDACTED] is not the primary [REDACTED] of the craft." },
];

const ADVANCED_TOOLS = [
  { 
    id: "ubm", 
    title: "Underground_Base_Map // v9.4", 
    desc: "Tactical mapping of subterranean and undersea non-terrestrial facilities. Monitoring Dulce, Pine Gap, and Bermuda anomalies.",
    icon: Map,
    status: "OPERATIONAL",
    color: "#00ff00"
  },
  { 
    id: "dossier-evolution", 
    title: "Intel_Evolution_Dossier // v9.4", 
    desc: "Infinite 3D historical scroll of operational rebranding. Tracking the lineage of black projects from 1947 to present.",
    icon: FileText,
    status: "ACTIVE_ARCHIVE",
    color: "#ffff00"
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
  { 
    id: "nhi-medical", 
    title: "NHI_Medical_Protocol // v9.4", 
    desc: "Forensic medical guide for NHI encounters. Tactical instructions for radiation exposure, biological contact, and psionic trauma.",
    icon: ShieldAlert,
    status: "EMERGENCY",
    color: "#00ff00"
  },
];

export default function AdvancedIntelPage() {
  const { data: session } = useSession();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [selectedUfo, setSelectedUfo] = useState(UFO_DATA[4]); // Default to Tic-Tac
  const [selectedXeno, setSelectedXeno] = useState(XENO_ENTITIES[0]); // Default to Anunnaki
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
                className="relative w-full max-w-[1600px] h-[90vh] bg-[#070707] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)] flex flex-col"
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
                    {activeTool === "ubm" && <UndergroundBaseMap />}
                    {activeTool === "dossier-evolution" && <DossierEvolution />}

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

                    {activeTool === "translator" && <AlienLinguistics />}

                    {activeTool === "d3-nexus" && <AgencyNexusNetwork />}
                    {activeTool === "three-3d" && (
                      <div className="flex flex-col gap-8 h-full">
                        <div className="flex-1 min-h-[500px]">
                          <UAP3DViewer ufoName={selectedUfo.name} />
                        </div>

                        {/* UFO Cards BELOW - Smaller */}
                        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-3">
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

                    {activeTool === "nhi-medical" && <NHIMedical />}

                    {activeTool === "xeno-bio" && <XenoBiologyScan />}

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

