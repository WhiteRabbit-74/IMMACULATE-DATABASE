"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Search, 
  Layers, 
  Hash, 
  Fingerprint, 
  Satellite, 
  Terminal as TerminalIcon,
  ShieldAlert,
  Cpu,
  Database,
  Link2,
  Target,
  Star,
  Scan
} from "lucide-react";
import { GlitchTitle } from "@/components/effects/GlitchTitle";
import { RedactionRecovery } from "@/components/forensics/RedactionRecovery";
import { ProjectCodeDecipher } from "@/components/forensics/ProjectCodeDecipher";
import { WhistleblowerVeracity } from "@/components/forensics/WhistleblowerVeracity";
import { NuclearCorrelator } from "@/components/forensics/NuclearCorrelator";
import { PaperclipGraph } from "@/components/forensics/PaperclipGraph";
import { PropulsionSimulator } from "@/components/forensics/PropulsionSimulator";
import { OcrEnhancer } from "@/components/forensics/OcrEnhancer";

const MODULES = [
  { id: "ghost", name: "Ghost_Recovery", icon: Layers, component: RedactionRecovery, phase: 6 },
  { id: "ocr", name: "AI_OCR_Enhancer", icon: Scan, component: OcrEnhancer, phase: 6 },
  { id: "codes", name: "Code_Decipher", icon: Hash, component: ProjectCodeDecipher, phase: 6 },
  { id: "propulsion", name: "Propulsion_Sim", icon: Zap, component: PropulsionSimulator, phase: 8 },
  { id: "paperclip", name: "Paperclip_Graph", icon: Link2, component: PaperclipGraph, phase: 7 },
  { id: "nuclear", name: "Nuclear_Sync", icon: Target, component: NuclearCorrelator, phase: 7 },
];

export default function ForensicsHub() {
  const [activeModule, setActiveModule] = useState(MODULES[0].id);
  const [isLegacyMode, setIsLegacyMode] = useState(false);

  const ActiveComponent = MODULES.find(m => m.id === activeModule)?.component || RedactionRecovery;

  return (
    <div className={`min-h-screen bg-[#030303] pt-24 pb-20 px-6 transition-all duration-700 ${isLegacyMode ? "font-serif grayscale contrast-150" : "font-sans"}`}>
      {isLegacyMode && (
         <div className="fixed inset-0 pointer-events-none z-[100] bg-[repeating-linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0)_1px,rgba(0,255,0,0.05)_1px,rgba(0,255,0,0.05)_2px)] opacity-50" />
      )}

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#00ff00] font-mono text-xs uppercase tracking-[0.4em]">
              <Cpu className="w-4 h-4" /> Forensic_Lab_V4.2
            </div>
            <GlitchTitle 
              text="INTELLIGENCE FORENSICS" 
              className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic" 
            />
            <p className="max-w-xl text-white/40 font-mono text-xs leading-relaxed italic">
              "Extracting actionable intelligence from anomalous data streams. Utilize spectral filtering, cryptographic decryption, and veracity scoring to validate classified leaks."
            </p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setIsLegacyMode(!isLegacyMode)}
              className={`p-6 border rounded-2xl flex flex-col items-center gap-2 min-w-[140px] transition-all ${
                isLegacyMode ? "bg-[#00ff00]/20 border-[#00ff00] text-[#00ff00]" : "bg-white/[0.02] border-white/10 text-white/40 hover:border-white/30"
              }`}
            >
              <TerminalIcon className="w-5 h-5" />
              <div className="font-mono text-[10px] uppercase">1974_MODE</div>
              <div className="font-mono text-lg font-bold">{isLegacyMode ? "ACTIVE" : "OFF"}</div>
            </button>
            <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col items-center gap-2 min-w-[140px]">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <div className="font-mono text-[10px] text-white/30 uppercase">Auth_Status</div>
              <div className="font-mono text-lg font-bold text-white">LEVEL_7</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
             <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4 px-4">Available_Modules</div>
             {MODULES.map(module => (
               <button
                 key={module.id}
                 onClick={() => setActiveModule(module.id)}
                 className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all group ${
                   activeModule === module.id 
                     ? "bg-[#00ff00]/10 border-[#00ff00]/30 text-[#00ff00]" 
                     : "bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5 hover:border-white/20"
                 }`}
               >
                 <div className="flex items-center gap-3">
                    <module.icon className={`w-4 h-4 ${activeModule === module.id ? "text-[#00ff00]" : "text-white/20 group-hover:text-white/40"}`} />
                    <span className="font-mono text-xs uppercase tracking-tight">{module.name}</span>
                 </div>
                 <div className="text-[9px] font-bold opacity-30">P{module.phase}</div>
               </button>
             ))}
             
             <div className="mt-12 p-6 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
                <div className="flex items-center gap-2 text-white/20 font-mono text-[9px] uppercase mb-3">
                   <Database className="w-3 h-3" /> System_Logs
                </div>
                <div className="space-y-2">
                   <div className="text-[8px] font-mono text-white/20 uppercase animate-pulse">Scanning_Registry... OK</div>
                   <div className="text-[8px] font-mono text-white/20 uppercase">Encryption_Mesh... STABLE</div>
                   <div className="text-[8px] font-mono text-white/20 uppercase">Latent_Data_Detected... 4.2GB</div>
                </div>
             </div>
          </div>

          {/* Active Module Display */}
          <div className="lg:col-span-9">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                   <ActiveComponent />
                </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
