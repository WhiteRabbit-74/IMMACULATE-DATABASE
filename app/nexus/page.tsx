"use client";

import { ProjectNexus } from "@/components/projects/ProjectNexus";
import { GlitchTitle } from "@/components/effects/GlitchTitle";
import { motion } from "framer-motion";
import { Network, ShieldAlert, Cpu } from "lucide-react";

export default function NexusPage() {
  return (
    <div className="min-h-screen bg-[#030303] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#00ff00] font-mono text-xs uppercase tracking-[0.4em]">
              <Network className="w-4 h-4" /> System_Nexus_V8.1
            </div>
            <GlitchTitle 
              text="PROJECT CONNECTIVITY" 
              className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic" 
            />
            <p className="max-w-xl text-white/40 font-mono text-xs leading-relaxed italic">
              "Mapping the institutional cross-contamination of Special Access Programs. No project exists in isolation. Funding, personnel, and recovered materials circulate through this secret architecture."
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col items-center gap-2 min-w-[140px]">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <div className="font-mono text-[10px] text-white/30 uppercase">Node Grid</div>
              <div className="font-mono text-lg font-bold text-white">ACTIVE</div>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col items-center gap-2 min-w-[140px]">
              <Cpu className="w-5 h-5 text-blue-500" />
              <div className="font-mono text-[10px] text-white/30 uppercase">Encryption</div>
              <div className="font-mono text-lg font-bold text-white">AES-256</div>
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="h-[1px] flex-1 bg-white/5" />
             <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.5em]">REAL_TIME_NEXUS_MESH</span>
             <div className="h-[1px] flex-1 bg-white/5" />
          </div>
          <ProjectNexus />
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          <div className="space-y-3">
             <h4 className="font-mono text-[10px] text-[#00ff00] uppercase tracking-widest">Inter-Agency Data Flow</h4>
             <p className="font-mono text-[9px] text-white/40 leading-relaxed italic">
               Telemetry from Project Sigma (Signals) is filtered through Project Aquarius before being archived by MJ-12.
             </p>
          </div>
          <div className="space-y-3">
             <h4 className="font-mono text-[10px] text-blue-400 uppercase tracking-widest">Black Budget Routing</h4>
             <p className="font-mono text-[9px] text-white/40 leading-relaxed italic">
               Funding for Project Stargate is laundered through secondary aerospace contracts to maintain unacknowledged status.
             </p>
          </div>
          <div className="space-y-3">
             <h4 className="font-mono text-[10px] text-red-400 uppercase tracking-widest">Temporal Linkage</h4>
             <p className="font-mono text-[9px] text-white/40 leading-relaxed italic">
               Historical data from Op. Paperclip remains the foundational logic for modern anomalous propulsion research.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
