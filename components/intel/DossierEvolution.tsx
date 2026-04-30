"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, Link, Calendar, Target, ShieldCheck, Activity, Lock } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { BLACK_PROJECTS, BlackProject } from "./ProjectRegistry";

export function DossierEvolution() {
  const [selectedOp, setSelectedOp] = useState<BlackProject | null>(null);
  const [showConnections, setShowConnections] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getClearanceColor = (clearance: string) => {
    switch (clearance) {
      case "BEYOND BLACK": return { text: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" };
      case "READ AND DESTROY": return { text: "text-red-600", bg: "bg-red-600/10", border: "border-red-600/40" };
      case "ULTRA TOP SECRET": return { text: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" };
      case "COSMIC": return { text: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30" };
      case "MAJESTIC": return { text: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" };
      case "UMBRA": return { text: "text-fuchsia-500", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/30" };
      default: return { text: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" };
    }
  };

  return (
    <div className="flex h-full bg-[#050505] rounded-3xl border border-white/5 overflow-hidden">
      {/* LEFT SIDEBAR: PROJECT LIST */}
      <div className="w-[300px] shrink-0 flex flex-col border-r border-white/10 bg-white/[0.02]">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <FileText className="w-5 h-5 text-yellow-500" />
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Select_Operation</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {BLACK_PROJECTS.map((op) => {
            const colors = getClearanceColor(op.clearance);
            const isSelected = selectedOp?.id === op.id;
            return (
              <button
                key={op.id}
                onClick={() => { setSelectedOp(op); setShowConnections(false); }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 ${
                  isSelected 
                    ? `${colors.bg} ${colors.border}` 
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className={`font-mono text-[10px] uppercase font-black tracking-widest ${isSelected ? colors.text : "text-white/60"}`}>
                  {op.codename}
                </div>
                <div className="font-mono text-[8px] text-white/30 uppercase truncate">
                  ID: {op.id.toUpperCase()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 relative flex overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedOp ? (
            <motion.div
              key={selectedOp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex"
            >
              {/* LEFT SIDE: 3D SCROLL HISTORY */}
              <div className="flex-1 relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#ffff00,transparent_70%)] pointer-events-none" />
                
                {/* 3D SCROLL VIEWPORT */}
                <div 
                  className="flex-1 perspective-1000 overflow-y-auto custom-scrollbar relative z-10"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex flex-col items-center space-y-16 py-32 px-12">
                    {/* TOP TITLE CARD (NEW) */}
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="w-full max-w-xl p-12 bg-yellow-500/5 border border-yellow-500/20 rounded-3xl text-center space-y-6 mb-24"
                    >
                       <div className="w-16 h-1px bg-yellow-500 mx-auto" />
                       <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">{selectedOp.codename}</h3>
                       <div className="font-mono text-xs text-yellow-500/60 tracking-widest uppercase">Operational Lineage // {selectedOp.id}</div>
                       <p className="text-[10px] text-white/40 font-mono italic leading-relaxed uppercase">
                         Engaging deep-history reconstruction... <br />
                         Resolving unacknowledged operational rebranding patterns...
                       </p>
                    </motion.div>
                    {selectedOp.history.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ rotateX: 60, opacity: 0, z: -300, y: 100 }}
                        whileInView={{ rotateX: 15, opacity: 1, z: 0, y: 0 }}
                        viewport={{ margin: "-50px" }}
                        className="p-8 bg-black/40 border border-yellow-500/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {/* Background Data Stream */}
                        <div className="absolute inset-0 opacity-[0.03] font-mono text-[6px] overflow-hidden pointer-events-none">
                           {Array(10).fill(0).map((_, j) => (
                             <div key={j} className="whitespace-nowrap">
                               0x{Math.random().toString(16).slice(2, 10)} // FREQ_HOP: {430 + Math.random()*20}MHz // COORDS: {Math.random()*90}N {Math.random()*180}W
                             </div>
                           ))}
                        </div>

                        <div className="absolute -top-3 -left-3 px-3 py-1 bg-yellow-500 text-black font-black font-mono text-[10px] shadow-lg">
                          {step.year}
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="font-mono text-xs text-yellow-500 uppercase font-black tracking-widest">{step.name}</div>
                              <div className="font-mono text-[8px] text-white/20">DIRECTOR: REDACTED</div>
                           </div>
                           <p className="text-white/80 text-sm leading-relaxed font-light border-l border-yellow-500/30 pl-4">
                             {step.event}
                           </p>
                           <div className="pt-4 flex items-center gap-4 border-t border-white/5">
                              <div className="flex flex-col">
                                 <span className="text-[7px] text-white/20 uppercase">Auth_Protocol</span>
                                 <span className="text-[8px] text-yellow-500/60 font-mono">X-RAY_DELTA_9</span>
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[7px] text-white/20 uppercase">Sig_Status</span>
                                 <span className="text-[8px] text-yellow-500/60 font-mono">ENCRYPTED</span>
                              </div>
                           </div>
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-5 group-hover:opacity-20 transition-opacity">
                          <ShieldCheck className="w-16 h-16" />
                        </div>
                      </motion.div>
                    ))}
                    {selectedOp.history.length === 0 && (
                       <div className="p-12 border border-dashed border-white/10 rounded-3xl opacity-20 text-center space-y-4">
                          <Lock className="w-12 h-12 mx-auto" />
                          <div className="font-mono text-[10px] uppercase">Data Encrypted // SEEDING REQUIRED</div>
                       </div>
                    )}
                  </div>
                </div>

                {/* SCROLL INDICATOR */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-30">
                  <div className="w-0.5 h-12 bg-gradient-to-b from-yellow-500 to-transparent" />
                  <span className="font-mono text-[8px] uppercase">Scroll_History</span>
                </div>
              </div>

              {/* RIGHT SIDE: DOSSIER SPECS */}
              <div className="w-[380px] shrink-0 border-l border-white/10 bg-white/[0.01] p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">Clearance_Level</span>
                       <span className={`font-mono text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${getClearanceColor(selectedOp.clearance).bg} ${getClearanceColor(selectedOp.clearance).text}`}>
                          {selectedOp.clearance}
                       </span>
                    </div>
                    <div className="pt-2">
                       <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{selectedOp.codename}</h2>
                       <div className="px-2 py-1 bg-white/10 border border-white/20 rounded font-mono text-[10px] text-white/60 inline-block mt-2">OP_ID: {selectedOp.id}</div>
                    </div>
                    <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl space-y-2 mt-2">
                       <div className="flex items-center gap-2 text-[9px] font-mono text-yellow-500 uppercase tracking-widest">
                         <Target className="w-3 h-3" /> Mission_Objective
                       </div>
                       <p className="text-[11px] text-white/70 leading-relaxed font-mono">{selectedOp.objective}</p>
                    </div>
                 </div>

                 <div className="space-y-6 flex-1">
                    <div className="space-y-3">
                       <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest border-b border-white/5 pb-1">Technical_Summary</div>
                       <p className="text-xs text-white/50 leading-relaxed italic">
                         {selectedOp.description}
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                        <div className="font-mono text-[8px] text-white/30 uppercase mb-1">Status</div>
                        <div className={`font-mono text-[10px] font-bold ${selectedOp.status === "ACTIVE" ? "text-green-500" : "text-red-500"}`}>{selectedOp.status}</div>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                        <div className="font-mono text-[8px] text-white/30 uppercase mb-1">Op_Type</div>
                        <div className="font-mono text-[10px] text-blue-400 font-bold">{selectedOp.type}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                       <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest border-b border-white/5 pb-1">Known_Facilities & Assets</div>
                       <ul className="space-y-2">
                         <li className="flex items-center gap-2 font-mono text-[10px] text-white/40"><span className="w-1 h-1 bg-red-500 rounded-full"/> S4 Sector (Papoose Lake)</li>
                         <li className="flex items-center gap-2 font-mono text-[10px] text-white/40"><span className="w-1 h-1 bg-red-500 rounded-full"/> Wright-Patterson AFB</li>
                         <li className="flex items-center gap-2 font-mono text-[10px] text-white/40"><span className="w-1 h-1 bg-red-500 rounded-full"/> Deep Underground Base Alpha</li>
                       </ul>
                    </div>
                 </div>

                 {/* CONNECTIONS TRIGGER */}
                 <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                    <button
                      onClick={() => setShowConnections(!showConnections)}
                      className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 transition-all group"
                    >
                      <Link className={`w-4 h-4 ${showConnections ? "text-yellow-500" : "text-white/40"} transition-colors`} />
                      <span className="font-mono text-[10px] text-white uppercase tracking-widest">Show_Rebranding_Connections</span>
                    </button>

                    <AnimatePresence>
                      {showConnections && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden space-y-3"
                        >
                           <div className="relative pl-6 space-y-4">
                              <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-white/10" />
                              {selectedOp.history.map((step, i) => (
                                <div key={i} className="relative flex items-center gap-4">
                                   <div className="absolute -left-[1.3rem] w-2 h-2 rounded-full bg-yellow-500/40 border border-yellow-500" />
                                   <div className="flex flex-col">
                                      <span className="text-[8px] font-mono text-white/30">{step.year}</span>
                                      <span className="text-[10px] text-white font-bold uppercase">{step.name}</span>
                                   </div>
                                </div>
                              ))}
                           </div>
                           <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                              <Activity className="w-4 h-4 text-red-500" />
                              <span className="font-mono text-[8px] text-red-500 uppercase font-black">Identity_Shifting_Pattern_Detected</span>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 opacity-20 space-y-4">
               <Calendar className="w-16 h-16" />
               <div className="font-mono text-[10px] uppercase tracking-[0.4em]">Initialize operational lineage scan</div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
