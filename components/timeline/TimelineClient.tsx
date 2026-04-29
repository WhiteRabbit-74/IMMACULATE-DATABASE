"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, ChevronRight, Calendar, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

interface Doc {
  id: string;
  title: string;
  description?: string | null;
  year: number;
  status: string;
  agency: { name: string; colorPrimary: string };
  tags: { name: string }[];
}

interface Props {
  documents: Doc[];
}

export function TimelineClient({ documents }: Props) {
  const byYear = useMemo(() => {
    const map: Record<number, Doc[]> = {};
    for (const doc of documents) {
      if (!map[doc.year]) map[doc.year] = [];
      map[doc.year].push(doc);
    }
    return map;
  }, [documents]);

  const years = useMemo(
    () => Object.keys(byYear).map(Number).sort((a, b) => a - b),
    [byYear]
  );

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [sliderIndex, setSliderIndex] = useState(Math.floor(years.length / 2));

  const VISIBLE = 9; // how many years visible in slider window
  const halfV = Math.floor(VISIBLE / 2);

  const windowStart = Math.max(0, sliderIndex - halfV);
  const windowEnd = Math.min(years.length - 1, windowStart + VISIBLE - 1);
  const windowYears = years.slice(windowStart, windowEnd + 1);

  const move = useCallback((dir: number) => {
    setSliderIndex((i) => Math.max(0, Math.min(years.length - 1, i + dir)));
  }, [years.length]);

  const activeYear = selectedYear ?? years[sliderIndex];
  const activeDocs = byYear[activeYear] ?? [];

  if (years.length === 0) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <Calendar className="w-12 h-12 text-[#00ff00]/20 mx-auto" />
          <h2 className="font-mono text-xl text-white uppercase font-black italic">Temporal_Vault_Empty</h2>
          <p className="font-mono text-xs text-white/40 leading-relaxed">
            The chronological archive has no records currently indexed. Please verify database connection or administrator clearance.
          </p>
          <Link href="/" className="inline-block font-mono text-[10px] text-[#00ff00] border border-[#00ff00]/30 px-4 py-2 rounded-lg hover:bg-[#00ff00]/10 transition-all uppercase">
            Return_to_Home
          </Link>
        </div>
      </div>
    );
  }

  const MIN_YEAR = years[0];
  const MAX_YEAR = years[years.length - 1];

  return (
    <div className="min-h-screen bg-[#030303] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#00ff00]/50" />
            <span className="font-mono text-[10px] text-[#00ff00]/60 uppercase tracking-widest">Temporal Index</span>
          </div>
          <h1 className="font-mono text-5xl font-black tracking-tighter text-white">TIMELINE</h1>
          <p className="text-white/40 mt-2 font-light text-sm">
            {documents.length} documents across {years.length} years — {MIN_YEAR}–{MAX_YEAR}
          </p>
        </motion.div>

        {/* ══ HORIZONTAL YEAR SLIDER ══ */}
        <div className="mb-10 relative">
          {/* Track bg - moved to bottom of labels */}
          <div className="absolute bottom-[22px] left-12 right-12 h-px bg-white/10 pointer-events-none" />

          <div className="flex items-center gap-3">
            {/* Prev */}
            <button
              onClick={() => move(-1)}
              disabled={windowStart === 0}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/30 hover:text-white transition-all disabled:opacity-20 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Years */}
            <div className="flex-1 flex items-end justify-around relative py-4">
              {windowYears.map((year) => {
                const count = byYear[year]?.length ?? 0;
                const isActive = year === activeYear;
                const barH = Math.min(48, 8 + count * 8);

                return (
                  <motion.button
                    key={year}
                    onClick={() => { setSelectedYear(year); setSliderIndex(years.indexOf(year)); }}
                    className="flex flex-col items-center gap-1.5 group"
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Document count bar */}
                    <motion.div
                      className="w-5 rounded-t-sm transition-colors"
                      animate={{ height: barH, backgroundColor: isActive ? "#00ff00" : "rgba(255,255,255,0.1)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                      style={{ boxShadow: isActive ? "0 0 8px #00ff00" : "none" }}
                    />

                    {/* Count indicators (tiny dots instead of ugly text) */}
                    {count > 1 && (
                      <div className="flex gap-0.5 mb-1">
                        {Array.from({ length: Math.min(count, 5) }).map((_, idx) => (
                          <div key={idx} className={`w-1 h-1 rounded-full ${isActive ? "bg-[#00ff00]" : "bg-white/20"}`} />
                        ))}
                        {count > 5 && <div className="w-1 h-1 rounded-full bg-white/20" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />}
                      </div>
                    )}

                    {/* Year label */}
                    <span className={`font-mono text-[10px] transition-colors ${isActive ? "text-[#00ff00] font-bold" : "text-white/30 group-hover:text-white/60"}`}>
                      {year}
                    </span>

                    {/* Active dot */}
                    {isActive && (
                      <motion.div layoutId="active-dot" className="w-1.5 h-1.5 rounded-full bg-[#00ff00] shadow-[0_0_6px_#00ff00]" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Next */}
            <button
              onClick={() => move(1)}
              disabled={windowEnd === years.length - 1}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/30 hover:text-white transition-all disabled:opacity-20 shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Year range hint */}
          <div className="flex justify-between font-mono text-[9px] text-white/15 px-12 mt-1">
            <span>{MIN_YEAR}</span>
            <span>{MAX_YEAR}</span>
          </div>
        </div>

        {/* ══ DOCUMENTS FOR SELECTED YEAR ══ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeYear}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Year heading */}
            <div className="flex items-center gap-4 mb-5">
              <div className="font-mono text-5xl font-black text-white/10">{activeYear}</div>
              <div>
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  {activeDocs.length} {activeDocs.length === 1 ? "document" : "documents"}
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="font-mono text-[9px] text-red-400/60">
                    {activeDocs.filter((d) => d.status === "classified").length} classified
                  </span>
                  <span className="font-mono text-[9px] text-green-400/60">
                    {activeDocs.filter((d) => d.status === "declassified").length} declassified
                  </span>
                </div>
              </div>
            </div>

            {/* Doc cards */}
            <div className="space-y-3">
              {activeDocs.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={`/documents/${doc.id}`}
                    className="group flex items-center justify-between bg-white/[0.03] border border-white/10 hover:border-white/25 rounded-xl px-5 py-4 transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Agency color stripe */}
                      <div className="w-0.5 h-10 rounded-full shrink-0" style={{ backgroundColor: doc.agency.colorPrimary }} />
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] mb-1" style={{ color: doc.agency.colorPrimary }}>
                          {doc.agency.name}
                        </div>
                        <div className="font-mono text-sm text-white group-hover:text-white/90 transition-colors line-clamp-1 font-medium">
                          {doc.title}
                        </div>
                        {doc.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {doc.tags.slice(0, 3).map((t) => (
                              <span key={t.name} className="font-mono text-[8px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded">
                                #{t.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`font-mono text-[8px] px-2 py-0.5 rounded flex items-center gap-1 border ${
                        doc.status === "classified"
                          ? "text-red-400 bg-red-500/10 border-red-500/20"
                          : "text-green-400 bg-green-500/10 border-green-500/20"
                      }`}>
                        {doc.status === "classified" ? <Lock className="w-2 h-2" /> : <Unlock className="w-2 h-2" />}
                        {doc.status.toUpperCase()}
                      </span>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {activeDocs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl">
                <FileText className="w-10 h-10 text-white/10 mb-3" />
                <p className="font-mono text-sm text-white/20">NO RECORDS FOR {activeYear}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* All years mini-map */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="font-mono text-[9px] text-white/20 uppercase tracking-widest mb-4">All Years</div>
          <div className="flex flex-wrap gap-2">
            {years.map((year) => {
              const isActive = year === activeYear;
              return (
                <button
                  key={year}
                  onClick={() => { setSelectedYear(year); setSliderIndex(years.indexOf(year)); }}
                  className={`font-mono text-[9px] px-2 py-1 rounded border transition-all flex items-center ${
                    isActive
                      ? "text-[#00ff00] bg-[#00ff00]/10 border-[#00ff00]/30"
                      : "text-white/25 border-white/5 hover:border-white/20 hover:text-white/50"
                  }`}
                >
                  {year}
                  {/* Subtle dots for volume */}
                  {byYear[year].length > 1 && (
                    <div className="flex gap-0.5 ml-2">
                      {Array.from({ length: Math.min(byYear[year].length, 3) }).map((_, idx) => (
                        <div key={idx} className={`w-0.5 h-0.5 rounded-full ${isActive ? "bg-[#00ff00]" : "bg-white/40"}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
