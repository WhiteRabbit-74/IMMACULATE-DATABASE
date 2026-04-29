"use client";

import React, { useState, useRef } from "react";
import { Search, Eye, Maximize2, Zap, Layers, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

export function RedactionRecovery() {
  const [image, setImage] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    brightness: 1,
    contrast: 1,
    exposure: 0,
    gamma: 1,
    threshold: 0,
    invert: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-black/60 border border-[#00ff00]/20 rounded-2xl p-6 font-mono">
      <div className="flex items-center gap-3 mb-6 border-b border-[#00ff00]/10 pb-4">
        <Layers className="w-5 h-5 text-[#00ff00]" />
        <div className="flex flex-col">
          <div className="text-[10px] text-[#00ff00] uppercase tracking-[0.3em] font-bold">Forensic_Module // 03</div>
          <div className="text-sm text-white uppercase font-black italic tracking-tighter">Redaction_Ghost_Recovery</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* Workspace */}
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-black border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center group">
            {image ? (
              <motion.img 
                src={image} 
                alt="Forensic Target" 
                className="max-w-full max-h-full object-contain transition-all"
                style={{
                  filter: `
                    brightness(${filters.brightness}) 
                    contrast(${filters.contrast}) 
                    invert(${filters.invert ? 1 : 0})
                    ${filters.exposure > 0 ? `drop-shadow(0 0 ${filters.exposure}px rgba(255,255,255,0.5))` : ""}
                  `
                }}
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-white/20">
                <Search className="w-12 h-12" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest"
                >
                  LOAD_SCAN_FOR_ANALYSIS
                </button>
              </div>
            )}
            
            {/* Viewfinder Overlays */}
            <div className="absolute inset-0 pointer-events-none border border-white/5" />
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#00ff00]/40" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#00ff00]/40" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#00ff00]/40" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#00ff00]/40" />
            
            {image && (
               <div className="absolute bottom-4 right-6 font-mono text-[8px] text-[#00ff00] uppercase tracking-widest bg-black/60 px-2 py-1 rounded">
                 SENSITIVITY: {Math.round((filters.brightness + filters.contrast) * 50)}% // ANALYZING_INK_DEPTH
               </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {/* Filters Panel */}
        <div className="space-y-6">
           <div className="flex items-center gap-2 text-[10px] text-white/60 uppercase tracking-widest mb-4">
              <Settings2 className="w-3.5 h-3.5" /> Spectral_Filters
           </div>
           
           <div className="space-y-5">
              {[
                { label: "Gamma_Depth", key: "brightness" },
                { label: "Edge_Contrast", key: "contrast" },
                { label: "Luma_Exposure", key: "exposure" }
              ].map(f => (
                <div key={f.key} className="space-y-1.5">
                  <div className="flex justify-between text-[8px] uppercase tracking-widest text-white/30">
                    <span>{f.label}</span>
                    <span className="text-[#00ff00]">{(filters as any)[f.key].toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={f.key === "exposure" ? 0 : 0.1}
                    max={f.key === "exposure" ? 20 : 3}
                    step="0.01"
                    value={(filters as any)[f.key]}
                    onChange={(e) => setFilters({...filters, [f.key]: parseFloat(e.target.value)})}
                    className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#00ff00]"
                  />
                </div>
              ))}
              
              <div className="flex items-center gap-3 pt-4">
                 <button 
                   onClick={() => setFilters({...filters, invert: !filters.invert})}
                   className={`flex-1 py-2 rounded-lg border font-mono text-[9px] uppercase tracking-widest transition-all ${
                     filters.invert ? "bg-white text-black border-white" : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
                   }`}
                 >
                   {filters.invert ? "INVERT_ON" : "INVERT_OFF"}
                 </button>
                 <button 
                    onClick={() => setFilters({ brightness: 1, contrast: 1, exposure: 0, gamma: 1, threshold: 0, invert: false })}
                    className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                 </button>
              </div>
           </div>

           <div className="mt-8 space-y-3">
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 text-[#00ff00] font-mono text-[9px] rounded-xl uppercase tracking-widest transition-all">
                 <Eye className="w-3.5 h-3.5" /> Run_Latent_Scan
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 font-mono text-[9px] rounded-xl uppercase tracking-widest transition-all">
                 <Maximize2 className="w-3.5 h-3.5" /> Export_Enhanced
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
