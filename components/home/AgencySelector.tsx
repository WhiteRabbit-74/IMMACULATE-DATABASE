"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";

interface Agency {
  id: string;
  name: string;
  slug: string;
  colorPrimary: string;
  colorSecondary: string;
  logoPath?: string;
}

export function AgencySelector() {
  const { activeAgency, setActiveAgency } = useStore();
  const [agencies, setAgencies] = useState<Agency[]>([]);

  useEffect(() => {
    fetch("/api/agencies")
      .then((r) => r.json())
      .then((data) => setAgencies(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  if (agencies.length === 0) return null;

  return (
    <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3 overflow-x-auto scrollbar-none">
      <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest shrink-0">
        Filter by Agency:
      </span>

      <button
        onClick={() => setActiveAgency(null)}
        className={`shrink-0 px-3 py-1 rounded font-mono text-[10px] uppercase tracking-wider transition-all ${
          !activeAgency
            ? "bg-white/10 text-white border border-white/20"
            : "text-white/30 hover:text-white/60 hover:bg-white/5"
        }`}
      >
        ALL
      </button>

      {agencies.map((agency) => (
        <motion.button
          key={agency.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            setActiveAgency(activeAgency?.id === agency.id ? null : agency)
          }
          className={`shrink-0 flex items-center gap-2 px-3 py-1 rounded font-mono text-[10px] uppercase tracking-wider transition-all border ${
            activeAgency?.id === agency.id
              ? "border-[var(--a-color)] bg-[var(--a-color-bg)] text-white"
              : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/5"
          }`}
          style={
            {
              "--a-color": agency.colorPrimary,
              "--a-color-bg": `${agency.colorPrimary}15`,
            } as React.CSSProperties
          }
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: agency.colorPrimary }}
          />
          {agency.slug.toUpperCase()}
        </motion.button>
      ))}
    </div>
  );
}
