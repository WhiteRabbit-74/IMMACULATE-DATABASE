"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Lock, Unlock, Filter, Search, ExternalLink, ArrowRight, Calendar, Building2 } from "lucide-react";
import Link from "next/link";
import { GlitchTitle } from "@/components/effects/GlitchTitle";

const CLASSIFICATIONS = ["All", "DECLASSIFIED", "TOP SECRET", "ULTRA TOP SECRET", "PARTIALLY DECLASSIFIED"];
const AGENCIES = ["All", "CIA", "NSA", "USAF", "DoD / DIA", "CIA / DIA"];

const CLASS_COLORS: Record<string, string> = {
  "DECLASSIFIED": "#00ff00",
  "TOP SECRET": "#ffaa00",
  "ULTRA TOP SECRET": "#ff3333",
  "PARTIALLY DECLASSIFIED": "#0088ff",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");

  useEffect(() => {
    fetch("/api/operations")
      .then(res => res.json())
      .then(data => {
        // Filter out placeholders and auto-indexed folders
        const filteredOps = data.filter((op: any) => 
          op.description && 
          !op.description.includes("Auto-indexed") &&
          !op.name.includes("SENZA PROGETTI") &&
          op.codename // Must have a codename
        );

        const mapped = filteredOps.map((op: any) => ({
          slug: op.codename.toLowerCase().replace(/\s+/g, "-"),
          name: op.name,
          codename: op.codename,
          agency: op.agency || "INTER-AGENCY",
          classification: op.status === "archived" ? "DECLASSIFIED" : "TOP SECRET",
          years: op.startYear ? `${op.startYear}–${op.endYear || "present"}` : "UNKNOWN",
          description: op.description || "Project documentation is classified.",
          tags: ["intel", op.codename.toLowerCase()],
          coverColor: "#000000",
        }));
        setProjects(mapped);
        setLoading(false);
      });
  }, []);

  const filtered = projects.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()) || p.tags.some((t: string) => t.includes(search.toLowerCase()));
    const matchClass = classFilter === "All" || p.classification === classFilter;
    return matchSearch && matchClass;
  });

  return (
    <div className="min-h-screen pt-16 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-2 font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Classified Intelligence Programs
          </div>
          <h1 className="font-mono text-5xl font-black tracking-tighter text-white">
            <GlitchTitle text="TOP SECRET PROJECTS" />
          </h1>
          <p className="text-white/40 mt-2 font-light max-w-2xl">
            Documented US and allied intelligence programs — from aerial phenomena investigations to consciousness research and signals intelligence. Filter by classification level or agency.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Programs", value: projects.length, color: "#00ff00" },
            { label: "Declassified", value: projects.filter((p: any) => p.classification === "DECLASSIFIED").length, color: "#00ff00" },
            { label: "Still Classified", value: projects.filter((p: any) => p.classification !== "DECLASSIFIED").length, color: "#ff3333" },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
              <div className="font-mono text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 transition-all" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {CLASSIFICATIONS.map((c) => (
              <button key={c} onClick={() => setClassFilter(c)}
                className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${classFilter === c ? "text-white border-white/30 bg-white/10" : "text-white/30 border-white/5 hover:border-white/20"}`}
                style={classFilter === c && c !== "All" ? { color: CLASS_COLORS[c], borderColor: `${CLASS_COLORS[c]}40`, backgroundColor: `${CLASS_COLORS[c]}10` } : {}}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((project, i) => (
              <motion.div key={project.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}>
                <Link href={`/projects/${project.slug}`} className="block group">
                  <div
                    className="relative bg-white/[0.03] border border-white/10 hover:border-white/25 rounded-2xl p-6 flex flex-col h-full transition-all overflow-hidden"
                    style={{ borderColor: `${CLASS_COLORS[project.classification] || "#ffffff"}20` }}
                  >
                    {/* Classification stripe */}
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: CLASS_COLORS[project.classification] || "#ffffff" }} />

                    {/* Hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity" style={{ backgroundColor: project.coverColor }} />

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest">{project.agency}</div>
                        <div className="font-mono text-[9px] text-white/20 mt-0.5">{project.years}</div>
                      </div>
                      <span className="font-mono text-[8px] px-2 py-0.5 rounded border uppercase tracking-wider shrink-0" style={{ color: CLASS_COLORS[project.classification] || "#fff", borderColor: `${CLASS_COLORS[project.classification] || "#fff"}30`, backgroundColor: `${CLASS_COLORS[project.classification] || "#fff"}10` }}>
                        {project.classification}
                      </span>
                    </div>

                    <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">CODENAME</div>
                    <h2 className="font-mono text-xl font-black text-white group-hover:text-white/90 tracking-tight mb-2">{project.codename}</h2>
                    <div className="font-mono text-xs text-white/50 mb-3 line-clamp-1">{project.name}</div>

                    <p className="text-xs text-white/40 leading-relaxed line-clamp-3 mb-4 flex-1 font-light">{project.description}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.slice(0, 4).map((t) => (
                        <span key={t} className="font-mono text-[8px] bg-white/5 text-white/30 px-1.5 py-0.5 rounded">#{t}</span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 font-mono text-[10px] text-white/30 group-hover:text-amber-400 transition-colors mt-auto">
                      <span>VIEW DOSSIER</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-xl">
            <BookOpen className="w-12 h-12 text-white/10 mb-4" />
            <p className="font-mono text-sm text-white/30">NO PROGRAMS MATCH QUERY</p>
          </div>
        )}
      </div>
    </div>
  );
}
