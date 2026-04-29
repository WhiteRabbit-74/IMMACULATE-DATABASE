"use client";

import React, { useState } from "react";
import { Target, Zap, AlertTriangle, Calendar, MapPin, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NUCLEAR_EVENTS = [
  { id: "trinity", name: "TRINITY TEST", date: "1945-07-16", location: "New Mexico, USA", type: "TEST", yield: "25kt", correlation: 0.94 },
  { id: "bravo", name: "CASTLE BRAVO", date: "1954-03-01", location: "Bikini Atoll", type: "TEST", yield: "15mt", correlation: 0.88 },
  { id: "tsar", name: "TSAR BOMBA", date: "1961-10-30", location: "Novaya Zemlya", type: "TEST", yield: "50mt", correlation: 0.72 },
  { id: "malmstrom", name: "MALMSTROM AFB", date: "1967-03-16", location: "Montana, USA", type: "INCURSION", yield: "N/A", correlation: 0.99 },
  { id: "bentwaters", name: "RAF BENTWATERS", date: "1980-12-26", location: "Suffolk, UK", type: "INCURSION", yield: "N/A", correlation: 0.97 },
];

export function NuclearCorrelator() {
  const [selectedEvent, setSelectedEvent] = useState(NUCLEAR_EVENTS[0]);

  return (
    <div className="bg-black/60 border border-[#00ff00]/20 rounded-2xl p-6 font-mono">
      <div className="flex items-center gap-3 mb-6 border-b border-[#00ff00]/10 pb-4">
        <Target className="w-5 h-5 text-[#00ff00]" />
        <div className="flex flex-col">
          <div className="text-[10px] text-[#00ff00] uppercase tracking-[0.3em] font-bold">Forensic_Module // 19</div>
          <div className="text-sm text-white uppercase font-black italic tracking-tighter">Nuclear_Event_Correlator</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Event List */}
        <div className="space-y-2">
           <div className="text-[9px] text-white/20 uppercase tracking-widest mb-3 px-2">High_Correlation_Events</div>
           {NUCLEAR_EVENTS.map(event => (
             <button
               key={event.id}
               onClick={() => setSelectedEvent(event)}
               className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                 selectedEvent.id === event.id 
                   ? "bg-red-500/10 border-red-500/40 text-red-400" 
                   : "bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5"
               }`}
             >
                <div className="flex justify-between items-center mb-1">
                   <span className="text-[10px] font-bold uppercase">{event.name}</span>
                   <span className="text-[8px] opacity-40">{event.date.split("-")[0]}</span>
                </div>
                <div className="text-[8px] uppercase tracking-tighter opacity-60 flex items-center gap-1">
                   <MapPin className="w-2.5 h-2.5" /> {event.location}
                </div>
             </button>
           ))}
        </div>

        {/* Correlation Analysis */}
        <div className="space-y-6">
           <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl">
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">{selectedEvent.name}</h3>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-1.5 text-[9px] text-white/40 uppercase">
                          <Calendar className="w-3.5 h-3.5" /> {selectedEvent.date}
                       </div>
                       <div className="flex items-center gap-1.5 text-[9px] text-white/40 uppercase">
                          <Activity className="w-3.5 h-3.5" /> {selectedEvent.type}
                       </div>
                    </div>
                 </div>
                 
                 <div className="text-right">
                    <div className="text-[8px] text-white/20 uppercase mb-1">Correlation_Index</div>
                    <div className={`text-3xl font-black ${selectedEvent.correlation > 0.9 ? "text-red-500" : "text-[#00ff00]"}`}>
                       {(selectedEvent.correlation * 100).toFixed(1)}%
                    </div>
                 </div>
              </div>

              {/* Visualization Placeholder (Waveform) */}
              <div className="h-32 bg-black/40 border border-white/5 rounded-xl relative overflow-hidden flex items-end gap-1 px-4 pb-4">
                 {Array.from({ length: 40 }).map((_, i) => (
                   <motion.div
                     key={i}
                     initial={{ height: 2 }}
                     animate={{ height: [2, Math.random() * (selectedEvent.correlation * 80) + 10, 2] }}
                     transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                     className={`flex-1 rounded-full ${selectedEvent.correlation > 0.9 ? "bg-red-500/40" : "bg-[#00ff00]/40"}`}
                   />
                 ))}
                 <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                    <div className="h-px w-full bg-white/5" />
                    <div className="h-px w-full bg-white/5" />
                    <div className="h-px w-full bg-white/5" />
                 </div>
                 <div className="absolute top-2 right-4 text-[7px] text-white/20 font-mono uppercase">Anomalous_Signal_Sync</div>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                 <div className="text-[8px] text-white/20 uppercase tracking-widest">Yield_Analysis</div>
                 <div className="text-lg font-bold text-white uppercase">{selectedEvent.yield}</div>
                 <p className="text-[9px] text-white/40 leading-relaxed italic">
                    "High-yield atmospheric tests show a 78% correlation with immediate subspace disruptions."
                 </p>
              </div>
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl space-y-2">
                 <div className="text-[8px] text-red-400/40 uppercase tracking-widest">Risk_Assessment</div>
                 <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-bold text-red-400 uppercase">CRITICAL_OVERLAP</span>
                 </div>
                 <p className="text-[9px] text-red-400/40 leading-relaxed italic">
                    "Consistent pattern of UAP surveillance at nuclear storage sites confirms strategic interest."
                 </p>
              </div>
           </div>

           <button className="w-full py-4 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 text-[#00ff00] font-mono text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-3">
              <Zap className="w-4 h-4" /> GENERATE_TEMPORAL_HEATMAP
           </button>
        </div>
      </div>
    </div>
  );
}
