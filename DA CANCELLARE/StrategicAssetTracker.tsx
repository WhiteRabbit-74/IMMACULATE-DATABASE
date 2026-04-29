"use client";

import React, { useState, useEffect } from "react";
import { Globe, Crosshair, Radio, Zap, AlertCircle, Satellite } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SATELLITES = [
  { id: "USA-245", name: "KH-11 KENNEN", type: "IMINT", status: "NOMINAL", lat: 34.05, lng: -118.24, alt: 420 },
  { id: "NROL-44", name: "ORION 10", type: "SIGINT", status: "NOMINAL", lat: 28.57, lng: -80.64, alt: 35786 },
  { id: "USA-193", name: "DECOMMISSIONED", type: "EXPERIMENTAL", status: "FRAGMENTED", lat: -10.43, lng: 105.16, alt: 0 },
  { id: "X-37B", name: "OTV-6", type: "CLASSIFIED", status: "IN_ORBIT", lat: 45.12, lng: 13.44, alt: 380 },
  { id: "ZUMA", name: "USA-276", type: "UNACKNOWLEDGED", status: "UNKNOWN", lat: 51.50, lng: -0.12, alt: 400 }
];

export function StrategicAssetTracker() {
  const [selectedSat, setSelectedSat] = useState(SATELLITES[0]);
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

  useEffect(() => {
    const timer = setInterval(() => setTimestamp(new Date().toISOString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black/60 border border-[#00ff00]/20 rounded-2xl p-6 font-mono overflow-hidden relative">
      <div className="flex items-center gap-3 mb-6 border-b border-[#00ff00]/10 pb-4">
        <Satellite className="w-5 h-5 text-[#00ff00]" />
        <div className="flex flex-col">
          <div className="text-[10px] text-[#00ff00] uppercase tracking-[0.3em] font-bold">Forensic_Module // 30</div>
          <div className="text-sm text-white uppercase font-black italic tracking-tighter">Strategic_Asset_Tracker // S.A.T.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orbital Visualization */}
        <div className="lg:col-span-8 bg-black/40 border border-white/10 rounded-xl relative aspect-video overflow-hidden group">
           {/* Grid Lines */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[length:30px_30px]" />
           
           {/* Scan Line */}
           <motion.div 
             animate={{ top: ["0%", "100%"] }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="absolute left-0 right-0 h-0.5 bg-[#00ff00]/20 z-10"
           />

           {/* World Map Background (SVG) */}
           <svg className="absolute inset-0 w-full h-full opacity-10 grayscale" viewBox="0 0 800 400">
             <path fill="currentColor" d="M150,100 L200,80 L250,120 L300,100 L350,150 L300,200 L200,180 L150,220 L100,200 Z" />
             <path fill="currentColor" d="M500,50 L600,80 L700,50 L750,150 L700,250 L600,280 L500,250 Z" />
           </svg>

           {/* Satellites */}
           {SATELLITES.map(sat => (
             <motion.button
               key={sat.id}
               onClick={() => setSelectedSat(sat)}
               className={`absolute w-3 h-3 rounded-full border flex items-center justify-center transition-all ${
                 selectedSat.id === sat.id ? "bg-[#00ff00] border-white scale-125 z-20" : "bg-white/20 border-white/10 hover:bg-white/40"
               }`}
               style={{ 
                 left: `${((sat.lng + 180) / 360) * 100}%`, 
                 top: `${((90 - sat.lat) / 180) * 100}%` 
               }}
               whileHover={{ scale: 1.5 }}
             >
               {selectedSat.id === sat.id && (
                  <motion.div 
                    layoutId="sat-ring"
                    className="absolute inset-[-8px] border border-[#00ff00]/50 rounded-full animate-ping" 
                  />
               )}
             </motion.button>
           ))}

           {/* HUD Crosshair */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-full h-[1px] bg-[#00ff00]" />
              <div className="h-full w-[1px] bg-[#00ff00]" />
           </div>
        </div>

        {/* Telemetry Panel */}
        <div className="lg:col-span-4 space-y-4">
           <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                 <div className="text-[10px] text-white/40 uppercase tracking-widest">Active_Telemetry</div>
                 <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              </div>
              
              <div className="space-y-3">
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] text-white/30 uppercase">Asset_ID</span>
                    <span className="text-[10px] text-white font-bold">{selectedSat.id}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] text-white/30 uppercase">Callsign</span>
                    <span className="text-[10px] text-[#00ff00] font-bold">{selectedSat.name}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] text-white/30 uppercase">Altitude</span>
                    <span className="text-[10px] text-white">{selectedSat.alt} KM</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] text-white/30 uppercase">Coord_N</span>
                    <span className="text-[10px] text-white">{selectedSat.lat.toFixed(4)}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] text-white/30 uppercase">Coord_E</span>
                    <span className="text-[10px] text-white">{selectedSat.lng.toFixed(4)}</span>
                 </div>
              </div>
           </div>

           <div className="p-4 bg-[#00ff00]/5 border border-[#00ff00]/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-[10px] text-[#00ff00] font-bold uppercase tracking-widest">
                 <Zap className="w-3 h-3" /> System_Time
              </div>
              <div className="text-[10px] text-white/60 font-mono tracking-tighter">
                {timestamp}
              </div>
           </div>

           <div className="flex gap-2">
              <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-mono text-[9px] text-white/40 uppercase tracking-widest transition-all">
                 Request_Intercept
              </button>
              <button className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                 <AlertCircle className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
