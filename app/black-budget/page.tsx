"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Zap, Shield, AlertTriangle, TrendingUp, BarChart3, Database, FileSearch } from "lucide-react";
import { GlitchTitle } from "@/components/effects/GlitchTitle";

export default function BlackBudgetPage() {
  const [ticker, setTicker] = useState(21000000000000);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(t => t + Math.floor(Math.random() * 1000000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Unaccounted Funds (est.)", value: `$${(ticker / 1e12).toFixed(2)} Trillion`, icon: <DollarSign className="w-4 h-4 text-red-500" /> },
    { label: "Audit Failures", value: "21 Consecutive", icon: <FileSearch className="w-4 h-4 text-amber-500" /> },
    { label: "Deep State Projects", value: "1,240+", icon: <Zap className="w-4 h-4 text-blue-500" /> },
    { label: "Missing Assets", value: "REDACTED", icon: <Database className="w-4 h-4 text-[#00ff00]" /> },
  ];

  return (
    <div className="min-h-screen bg-[#030303] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
          >
            CONFIDENTIAL // FINANCIAL_LEAK
          </motion.div>
          <GlitchTitle text="THE BLACK BUDGET" className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic" />
          <p className="max-w-2xl text-white/40 font-mono text-sm leading-relaxed italic">
            "The Black Budget represents the shadow economy of the military-industrial complex. Trillions of dollars are diverted into Special Access Programs (SAPs) with zero congressional oversight."
          </p>
        </div>

        {/* Ticker Section */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl pointer-events-none" />
          <div className="font-mono text-[10px] text-white/20 uppercase tracking-[0.5em] mb-4">TOTAL_UNACCOUNTED_LIABILITIES</div>
          <div className="text-4xl md:text-7xl font-black text-white tabular-nums tracking-tighter">
            ${ticker.toLocaleString()}
          </div>
          <div className="mt-8 flex justify-center gap-12">
            <div className="flex flex-col items-center">
              <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">Rate of Leakage</span>
              <span className="font-mono text-xs text-[#00ff00] flex items-center gap-1"><TrendingUp className="w-3 h-3" /> $1.2M / SEC</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">Source Integrity</span>
              <span className="font-mono text-xs text-amber-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> UNSTABLE</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/5">{stat.icon}</div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[#00ff00] transition-colors" />
              </div>
              <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="font-mono text-lg font-bold text-white tracking-tight">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12">
          <div className="space-y-6">
            <h2 className="font-mono text-2xl font-bold text-white uppercase italic tracking-tighter flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-[#00ff00]" /> THE_FISCAL_VOID
            </h2>
            <div className="space-y-4 font-mono text-xs text-white/50 leading-relaxed">
              <p>
                In 2001, Secretary of Defense Donald Rumsfeld famously stated that the Pentagon could not account for $2.3 trillion in spending. Since then, the number has grown exponentially. Studies by Professor Mark Skidmore have identified over $21 trillion in "undocumented adjustments" on the accounts of the Department of Defense and HUD.
              </p>
              <p>
                Where does the money go? Intelligence leaks suggest it fuels the research, recovery, and reverse-engineering of non-human technology. This "Black Budget" sustains a parallel civilization of scientists and contractors operating outside the US Constitution.
              </p>
              <p>
                Primary funding channels include: Unacknowledged SAPs, illegal drug trafficking proceeds (alleged), and patent hijacking of alien technology.
              </p>
            </div>
          </div>
          <div className="bg-black/60 border border-white/5 rounded-3xl p-8 space-y-6 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
             <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-red-500" />
                <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">SAP_FUNDING_HIERARCHY</span>
             </div>
             <div className="space-y-4">
                {[
                  { name: "Project Aquarius (Core)", percentage: 34, color: "#ff0000" },
                  { name: "Lunar Base Operations", percentage: 22, color: "#0088ff" },
                  { name: "Biological Research", percentage: 18, color: "#00ff00" },
                  { name: "Signals Intelligence", percentage: 15, color: "#ffaa00" },
                  { name: "Public Disinfo Campaigns", percentage: 11, color: "#999999" },
                ].map(item => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[9px] text-white/40 uppercase">
                      <span>{item.name}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Forensic Source Registry */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mt-12">
          <div className="flex items-center gap-3 mb-8">
            <Database className="w-5 h-5 text-[#00ff00]" />
            <h2 className="font-mono text-xl font-bold text-white uppercase tracking-tighter">DATA SOURCE REGISTRY</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "LEAKED LEDGERS", source: "Cryptographic intercepts from Swiss-based private aerospace contractors.", detail: "Reveals 'off-book' procurement of exotic materials and specialized vacuum-welding equipment." },
              { title: "AUDIT ANOMALIES", source: "Publicly available FASAB 56 exemptions and GAO reporting discrepancies.", detail: "Identifies trillions in 'non-verified' transfers between DoD and Lockheed Martin / Boeing / Northrop Grumman." },
              { title: "WHISTLEBLOWER TESTIMONY", source: "Corroborated accounts from high-ranking defense logistics officers.", detail: "Consistent reports of 'special funds' allocated for crash retrieval and reverse-engineering SAPs." }
            ].map((item, idx) => (
              <div key={idx} className="bg-black/40 border border-white/5 p-5 rounded-xl space-y-3">
                <div className="font-mono text-[10px] text-[#00ff00] font-bold uppercase tracking-widest">{item.title}</div>
                <div className="font-mono text-[9px] text-white/60 leading-relaxed border-l border-white/20 pl-3 italic">
                  {item.source}
                </div>
                <p className="text-[10px] text-white/30 font-light leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
