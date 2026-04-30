"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Info, Activity, Dna, Eye, User, FileText, AlertTriangle } from "lucide-react";

import { XENO_ENTITIES } from "@/components/intel/AdvancedTools";

export default function EbePage() {
  const [selected, setSelected] = useState(XENO_ENTITIES[0]);

  return (
    <div className="min-h-screen pt-24 bg-[#030303] px-6 py-10 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar - List */}
          <div className="w-full md:w-80 shrink-0 space-y-4">
             <div className="flex items-center gap-2 mb-6">
                <Dna className="w-5 h-5 text-purple-500" />
                <h1 className="font-mono text-2xl font-black text-white uppercase italic tracking-tighter">E.B.E_Registry</h1>
             </div>
             
             <div className="space-y-2">
                {XENO_ENTITIES.map((ebe: any) => (
                  <button
                    key={ebe.id}
                    onClick={() => setSelected(ebe)}
                    className={`w-full p-4 rounded-xl border text-left transition-all group ${
                      selected.id === ebe.id 
                        ? "bg-purple-500/10 border-purple-500/40 text-white" 
                        : "bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                       <span className="font-mono text-xs font-bold uppercase">{ebe.name}</span>
                       <Activity className={`w-3 h-3 ${selected.id === ebe.id ? "text-purple-400" : "text-white/10"}`} />
                    </div>
                  </button>
                ))}
             </div>

             <div className="mt-8 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                   <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                   <div>
                      <div className="text-[10px] text-red-500 font-bold uppercase mb-1">Warning: Biological Hazard</div>
                      <p className="text-[9px] text-white/40 leading-relaxed italic">
                        Contact with certain E.B.E types may result in acute radiation syndrome or temporal displacement. Protective gear required for all field encounters.
                      </p>
                   </div>
                </div>
             </div>
          </div>

          {/* Main Content - Detailed View */}
          <div className="flex-grow bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-md">
             <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                   <div className="flex flex-col lg:flex-row gap-10">
                      <div className="w-full lg:w-96 shrink-0">
                         <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-black relative group">
                            <img 
                               src={encodeURI(selected.img)} 
                               alt={selected.name} 
                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                               <div className="text-[10px] text-purple-400 font-mono uppercase mb-1">Visual_ID // Confirmed</div>
                               <div className="text-xl font-black text-white uppercase italic">{selected.name}</div>
                            </div>
                         </div>
                      </div>

                      <div className="flex-grow space-y-8">
                         <div className="grid grid-cols-2 gap-6">
                            <div>
                               <div className="text-[9px] text-white/30 uppercase tracking-[0.2em] mb-1">Origin_System</div>
                               <div className="text-sm font-mono text-white font-bold">{selected.origin}</div>
                            </div>
                            <div>
                               <div className="text-[9px] text-white/30 uppercase tracking-[0.2em] mb-1">Height_Spec</div>
                               <div className="text-sm font-mono text-white font-bold">{selected.stats.height}</div>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="flex items-center gap-2">
                               <div className="h-[1px] w-4 bg-purple-500/50" />
                               <div className="text-[9px] text-purple-400 uppercase tracking-widest">Biological_Profile</div>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed font-light italic">"{selected.bioInfo}"</p>
                         </div>

                         <div className="space-y-4">
                            <div className="flex items-center gap-2">
                               <div className="h-[1px] w-4 bg-purple-500/50" />
                               <div className="text-[9px] text-purple-400 uppercase tracking-widest">Intelligence_Assessment</div>
                            </div>
                            <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                               <p className="text-xs text-white/50 leading-relaxed font-mono">{selected.history}</p>
                            </div>
                         </div>

                         <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="px-3 py-1 rounded bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold tracking-widest uppercase">
                                  {selected.classification}
                               </div>
                            </div>
                            <button className="flex items-center gap-2 text-[10px] text-white/20 hover:text-white transition-colors uppercase font-mono">
                               <FileText className="w-3.5 h-3.5" />
                               View_Related_Documents
                            </button>
                         </div>
                      </div>
                   </div>

                   {/* Tech/Anatomical Specs Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                      {[
                        { icon: <Activity className="w-4 h-4" />, label: "Pulse_Modulation", val: "Non-Sinusoidal" },
                        { icon: <Eye className="w-4 h-4" />, label: "Visual_Spectrum", val: "IR / UV / X-Ray" },
                        { icon: <Shield className="w-4 h-4" />, label: "Dermal_Defense", val: "Bio-Synthetic" },
                      ].map(stat => (
                        <div key={stat.label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-4">
                           <div className="text-purple-400/50">{stat.icon}</div>
                           <div>
                              <div className="text-[8px] text-white/30 uppercase">{stat.label}</div>
                              <div className="text-xs font-mono text-white">{stat.val}</div>
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
             </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
