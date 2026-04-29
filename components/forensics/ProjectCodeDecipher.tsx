"use client";

import React, { useState } from "react";
import { Search, Hash, Shield, Terminal, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PROJECT_CODES = [
  { code: "149", name: "MK-ULTRA", agency: "CIA", description: "Behavioral modification and chemical interrogation." },
  { code: "P-12", name: "AQUARIUS", agency: "NSA/MJ-12", description: "Primary retrieval and analysis of extraterrestrial hardware." },
  { code: "1954-A", name: "SIGMA", agency: "NSA", description: "Signals intelligence from non-terrestrial sources." },
  { code: "SG-1", name: "LOOKING GLASS", agency: "DIA/USN", description: "Propulsion research utilizing temporal displacement." },
  { code: "02-301", name: "MOON DUST", agency: "USAF", description: "Field recovery of foreign or non-terrestrial debris." },
  { code: "SW-82", name: "SOLAR WARDEN", agency: "USN", description: "Orbital fleet and space-traffic control protocols." },
  { code: "BR-549", name: "BLUE BOOK", agency: "USAF", description: "Public-facing investigation of sightings (misdirection asset)." },
  { code: "MJ-CONTROL", name: "MAJESTIC", agency: "Executive", description: "Top-tier oversight and policy coordination." },
  { code: "GR-02", name: "GRUDGE", agency: "USAF", description: "Secondary study focused on psychological impacts of sightings." },
  { code: "GL-11", name: "GLEEM", agency: "CIA", description: "Atmospheric sampling of anomalous propulsion exhaust." }
];

export function ProjectCodeDecipher() {
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState(PROJECT_CODES);

  const handleSearch = (val: string) => {
    setSearch(val);
    const filtered = PROJECT_CODES.filter(p => 
      p.code.toLowerCase().includes(val.toLowerCase()) || 
      p.name.toLowerCase().includes(val.toLowerCase()) ||
      p.agency.toLowerCase().includes(val.toLowerCase())
    );
    setMatches(filtered);
  };

  return (
    <div className="bg-black/60 border border-[#00ff00]/20 rounded-2xl p-6 font-mono">
      <div className="flex items-center gap-3 mb-6 border-b border-[#00ff00]/10 pb-4">
        <Hash className="w-5 h-5 text-[#00ff00]" />
        <div className="flex flex-col">
          <div className="text-[10px] text-[#00ff00] uppercase tracking-[0.3em] font-bold">Forensic_Module // 04</div>
          <div className="text-sm text-white uppercase font-black italic tracking-tighter">Project_Code_Decipher</div>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          placeholder="ENTER_NUMERIC_CODE_OR_PROJECT_ID..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-all uppercase placeholder:text-white/10"
        />
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        <AnimatePresence mode="popLayout">
          {matches.map((p) => (
            <motion.div
              key={p.code}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-white/[0.02] border border-white/5 hover:border-[#00ff00]/30 p-4 rounded-xl transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="px-1.5 py-0.5 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded text-[9px] text-[#00ff00] font-bold">
                    CODE_{p.code}
                  </div>
                  <ArrowRight className="w-3 h-3 text-white/20" />
                  <div className="text-xs text-white font-bold uppercase tracking-tight">{p.name}</div>
                </div>
                <div className="text-[8px] text-white/40 uppercase tracking-widest">{p.agency}</div>
              </div>
              <p className="text-[10px] text-white/40 italic leading-relaxed line-clamp-2">
                "{p.description}"
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {matches.length === 0 && (
          <div className="text-center py-12 text-white/20 text-[10px] uppercase italic border border-dashed border-white/10 rounded-xl">
            NO_MATCHES_FOUND_IN_DECRYPTED_REGISTRY
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[8px] text-white/20 uppercase tracking-widest">
        <span>Verified_Records: {PROJECT_CODES.length}</span>
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3" /> Secure_Lookup_Active
        </span>
      </div>
    </div>
  );
}
