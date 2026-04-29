"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal, Shield, Activity, Lock } from "lucide-react";
import { IntelligenceToolkit } from "@/components/workspace/IntelligenceToolkit";
import { GlitchTitle } from "@/components/effects/GlitchTitle";

export default function AgentDeskPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 rounded text-[9px] font-mono text-red-500 uppercase font-bold tracking-widest animate-pulse">
              Restricted_Access
            </div>
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em]">
              Agent Workspace // Desk_V4.2
            </div>
          </div>
          <h1 className="font-mono text-4xl font-black text-white italic tracking-tighter uppercase">
            <GlitchTitle text="AGENT DESK" />
          </h1>
        </div>

        <div className="flex items-center gap-6 bg-white/[0.02] border border-white/5 px-6 py-4 rounded-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center">
            <div className="font-mono text-[8px] text-white/20 uppercase mb-1">Clearance</div>
            <div className="font-mono text-xs text-[#00ff00] font-bold uppercase">Ω_PRIME</div>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <div className="font-mono text-[8px] text-white/20 uppercase mb-1">System</div>
            <div className="font-mono text-xs text-blue-400 font-bold uppercase">Nexus_Net</div>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <div className="font-mono text-[8px] text-white/20 uppercase mb-1">Secure</div>
            <Lock className="w-4 h-4 text-[#00ff00]" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Toolkit Component */}
        <IntelligenceToolkit />
        
        {/* Footer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
          <div className="flex items-center gap-4 text-white/30 font-mono text-[10px] uppercase tracking-widest">
            <Activity className="w-4 h-4" />
            Network Integrity: 99.8%
          </div>
          <div className="flex items-center gap-4 text-white/30 font-mono text-[10px] uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            Firewall Active: MJ-SHIELD
          </div>
          <div className="flex items-center gap-4 text-white/30 font-mono text-[10px] uppercase tracking-widest">
            <Terminal className="w-4 h-4" />
            Last Login: 02:52:28_LOCAL
          </div>
        </div>
      </div>
    </div>
  );
}
