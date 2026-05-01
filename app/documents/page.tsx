"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Search, Filter, Lock, Unlock, 
  ChevronRight, Tag, Star, ShieldAlert, 
  ShieldCheck, Eye, Globe, Target, Users,
  Box, Zap
} from "lucide-react";
import Link from "next/link";
import { BLACK_PROJECTS } from "@/components/intel/ProjectRegistry";

interface Document {
  id: string;
  title: string;
  description?: string;
  year: number;
  status: string;
  agency: { name: string; colorPrimary: string };
  tags: { name: string }[];
  stars: number;
}

interface Agency { id: string; name: string; colorPrimary: string; }
interface TagItem { id: string; name: string; _count: { documents: number }; }

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [agencyFilter, setAgencyFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [projectFocus, setProjectFocus] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "stars">("date");
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["usaf"]); // Default expanded

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId) 
        : [...prev, groupId]
    );
  };

  const handleStar = async (e: React.MouseEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/documents/${docId}/star`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setDocs(prev => prev.map(d => d.id === docId ? { ...d, stars: data.stars } : d));
      }
    } catch (err) {}
  };

  useEffect(() => {
    const t = new Date().getTime();
    fetch(`/api/agencies?_t=${t}`).then((r) => r.json()).then(setAgencies).catch(() => {});
    fetch(`/api/tags?_t=${t}`).then((r) => r.json()).then(setTags).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (statusFilter) params.set("status", statusFilter);
      if (agencyFilter) params.set("agencyId", agencyFilter);
      if (tagFilter) params.set("tag", tagFilter);
      if (projectFocus) params.set("project", projectFocus);
      setLoading(true);
      const timestamp = new Date().getTime();
      fetch(`/api/documents?${params}&_t=${timestamp}`)
        .then(async (r) => {
          if (!r.ok) throw new Error("VAULT_ACCESS_DENIED");
          return r.json();
        })
        .then((data) => { 
          setDocs(Array.isArray(data) ? data : []); 
          setLoading(false); 
        })
        .catch((err) => {
          console.error("SECURE_FETCH_ERROR:", err);
          setDocs([]);
          setLoading(false);
        });
    }, 300);
    return () => clearTimeout(t);
  }, [search, statusFilter, agencyFilter, tagFilter, projectFocus]);

  const sortedDocs = [...docs].sort((a, b) => {
    if (sortBy === "stars") return (b.stars || 0) - (a.stars || 0);
    return 0; // Default order from API
  });

  const classified = sortedDocs.filter((d) => d.status === "classified");
  const declassified = sortedDocs.filter((d) => d.status === "declassified");

  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar Filters */}
      <aside className="w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-white/5 p-6">
        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">Search</div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 font-mono text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff00]/50 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">Sort_Priority</div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setSortBy("date")}
                className={`text-left px-3 py-1.5 rounded font-mono text-[10px] uppercase transition-all ${sortBy === "date" ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5"}`}
              >
                Chronological
              </button>
              <button
                onClick={() => setSortBy("stars")}
                className={`text-left px-3 py-1.5 rounded font-mono text-[10px] uppercase transition-all flex items-center gap-2 ${sortBy === "stars" ? "bg-yellow-500/10 text-yellow-500" : "text-white/40 hover:bg-white/5"}`}
              >
                <Star className="w-3 h-3" />
                Top Rated
              </button>
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">Status</div>
            <div className="space-y-1">
              {["", "classified", "declassified"].map((s) => (
                <button
                  key={s || "all"}
                  onClick={() => setStatusFilter(s)}
                  className={`w-full text-left px-3 py-1.5 rounded font-mono text-xs flex items-center gap-2 transition-all ${
                    statusFilter === s
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  {s === "classified" ? (
                    <Lock className="w-3 h-3 text-red-400" />
                  ) : s === "declassified" ? (
                    <Unlock className="w-3 h-3 text-green-400" />
                  ) : (
                    <Filter className="w-3 h-3" />
                  )}
                  {s || "All Documents"}
                </button>
              ))}
            </div>
          </div>

          {/* Project Evolution Lineage (Accordion) */}
          <div>
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">Project_Evolution_Lineage</div>
            <div className="space-y-2 px-2">
              {[
                { 
                  id: 'usaf',
                  name: "USAF_EVOLUTION", 
                  projects: [
                    { id: "sign", label: "Sign", icon: Target, color: "#00aaff" },
                    { id: "grudge", label: "Grudge", icon: FileText, color: "#ffffff" },
                    { id: "bluebook", label: "Blue Book", icon: Star, color: "#00ff00" },
                  ] 
                },
                { 
                  id: 'mj12',
                  name: "MJ12_NEXUS", 
                  projects: [
                    { id: "gleem", label: "Gleem", icon: Target, color: "#ffff00" },
                    { id: "aquarius", label: "Aquarius", icon: Star, color: "#00ffaa" },
                    { id: "pounce", label: "Pounce", icon: Box, color: "#ff00ff" },
                  ] 
                },
                { 
                  id: 'mind',
                  name: "MIND_CONTROL_NEXUS", 
                  projects: [
                    { id: "bluebird", label: "Bluebird", icon: Lock, color: "#ffffff" },
                    { id: "artichoke", label: "Artichoke", icon: Eye, color: "#ffaa00" },
                    { id: "mk-ultra-v2", label: "MK-Ultra-X", icon: ShieldAlert, color: "#ff3333" },
                    { id: "stargate", label: "Stargate", icon: Zap, color: "#00ffff" },
                  ] 
                },
                { 
                  id: 'trans',
                  name: "TRANS_MEDIUM_OPS", 
                  projects: [
                    { id: "trident", label: "Trident (USO)", icon: Globe, color: "#00aaff" },
                    { id: "gossamer", label: "Gossamer", icon: Box, color: "#aaaaaa" },
                  ] 
                },
                {
                  id: 'deep',
                  name: "DEEP_BLACK_OPS",
                  projects: [
                    { id: "mj12", label: "MJ-12 Core", icon: ShieldAlert, color: "#ff3333" },
                    { id: "moon-dust", label: "Moon Dust", icon: Globe, color: "#ff6600" },
                    { id: "monarch", label: "Monarch", icon: Lock, color: "#aa00ff" },
                    { id: "aatip", label: "AATIP", icon: Zap, color: "#00ffff" },
                  ]
                }
              ].map((group) => {
                const isExpanded = expandedGroups.includes(group.id);
                const hasActiveProject = group.projects.some(p => p.id === projectFocus);
                
                return (
                  <div key={group.id} className="space-y-1">
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-mono text-[10px] uppercase transition-all border ${
                        isExpanded || hasActiveProject ? "bg-white/5 border-white/10 text-white" : "border-transparent text-white/30 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Box className={`w-3 h-3 ${isExpanded ? "text-blue-400" : "text-white/20"}`} />
                        {group.name}
                      </div>
                      <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </button>
                    
                    <AnimatePresence>
                      {(isExpanded || hasActiveProject) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-4 border-l border-white/5 ml-4 space-y-1"
                        >
                          {group.projects.map((p, idx) => (
                            <div key={p.id} className="flex flex-col">
                              <button
                                onClick={() => setProjectFocus(projectFocus === p.id ? "" : p.id)}
                                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase transition-all border ${
                                  projectFocus === p.id 
                                    ? "bg-white/10 border-white/20 text-white" 
                                    : "text-white/40 border-transparent hover:bg-white/5 hover:text-white/60"
                                }`}
                                style={projectFocus === p.id ? { color: p.color, borderColor: `${p.color}30`, backgroundColor: `${p.color}10` } : {}}
                              >
                                <p.icon className="w-3 h-3" />
                                {p.label}
                              </button>
                              {idx < group.projects.length - 1 && group.id !== "deep" && (
                                <div className="flex justify-center my-0.5">
                                  <div className="w-[1px] h-2 bg-white/10" />
                                </div>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">Document_Type</div>
            <div className="flex flex-col gap-1">
              {[
                { id: "memo", label: "Memo / Directive" },
                { id: "report", label: "Official Report" },
                { id: "manual", label: "Technical Manual" },
                { id: "photo", label: "Photographic Evidence" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTagFilter(tagFilter === t.id ? "" : t.id)}
                  className={`w-full text-left px-3 py-1.5 rounded font-mono text-xs transition-all flex items-center gap-2 ${tagFilter === t.id ? "bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30" : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"}`}
                >
                  <FileText className="w-3 h-3" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">Clearance_Level</div>
            <div className="flex flex-col gap-1">
              {[
                { id: "top-secret", label: "TOP SECRET", color: "text-orange-500" },
                { id: "majestic", label: "MAJESTIC", color: "text-blue-500" },
                { id: "ultra-top-secret", label: "ULTRA TOP SECRET", color: "text-red-500" },
                { id: "beyond-black", label: "BEYOND BLACK", color: "text-purple-500" }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setTagFilter(tagFilter === c.id ? "" : c.id)}
                  className={`w-full text-left px-3 py-1.5 rounded font-mono text-xs transition-all flex items-center gap-2 ${tagFilter === c.id ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}
                >
                  <Lock className={`w-3 h-3 ${c.color}`} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-x-hidden">
        {/* Quick Stats & Agency Selector Header */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="grid grid-cols-4 gap-4">
            {[
              { id: 'total', label: "Total_Records", value: docs.length, icon: FileText, color: "text-white", onClick: () => { setStatusFilter(""); setAgencyFilter(""); setProjectFocus(""); } },
              { id: 'classified', label: "Classified", value: classified.length, icon: Lock, color: "text-red-500", active: statusFilter === 'classified', onClick: () => setStatusFilter(statusFilter === 'classified' ? '' : 'classified') },
              { id: 'declassified', label: "Declassified", value: declassified.length, icon: Unlock, color: "text-[#00ff00]", active: statusFilter === 'declassified', onClick: () => setStatusFilter(statusFilter === 'declassified' ? '' : 'declassified') },
              { id: 'agencies', label: "Agencies", value: agencies.length, icon: Globe, color: "text-blue-400", onClick: () => {} },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={stat.onClick}
                className={`group relative bg-white/[0.02] border rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  stat.active ? "bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]" : "border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
                }`}
              >
                <stat.icon className={`w-4 h-4 mb-2 transition-transform group-hover:scale-110 ${stat.color}`} />
                <div className="font-mono text-xl font-bold text-white">{stat.value}</div>
                <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Integrated Agency Acronym Selector - Home Style Parity */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 overflow-hidden">
            <div className="flex flex-wrap items-center gap-3">
              <div className="font-mono text-[9px] text-white/20 uppercase tracking-[0.2em] mr-2">Agency_Nexus:</div>
              <button
                onClick={() => setAgencyFilter("")}
                className={`px-3 py-1 rounded font-mono text-[10px] transition-all border ${agencyFilter === "" ? "bg-white/10 border-white/20 text-white" : "text-white/30 border-transparent hover:text-white/60"}`}
              >
                ALL
              </button>
              {agencies.map((a: any) => (
                <motion.button
                  key={a.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAgencyFilter(a.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded font-mono text-[10px] uppercase tracking-wider transition-all border ${
                    agencyFilter === a.id
                      ? "bg-white/10 border-white/20 text-white"
                      : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/5"
                  }`}
                  style={agencyFilter === a.id ? { color: a.colorPrimary, borderColor: `${a.colorPrimary}40`, backgroundColor: `${a.colorPrimary}15` } : {}}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: a.colorPrimary }}
                  />
                  {(a.slug || a.id).toUpperCase()}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {projectFocus && (
          <div className="mb-8 p-4 bg-white/[0.02] border border-white/5 rounded-xl backdrop-blur-sm">
            {(() => {
              const project = BLACK_PROJECTS.find(p => p.id === projectFocus);
              if (!project) return null;
              const pred = BLACK_PROJECTS.find(p => p.id === project.predecessor);
              const succ = BLACK_PROJECTS.find(p => p.id === project.successor);
              
              return (
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <Target className="w-5 h-5 text-white/40" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">Project_Dossier_Active</div>
                      <h2 className="text-xl font-bold text-white tracking-tight">{project.name}</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono text-[10px]">
                    {pred && (
                      <button 
                        onClick={() => setProjectFocus(pred.id)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/5 hover:border-white/20 transition-all text-white/40 hover:text-white"
                      >
                        <ChevronRight className="w-3 h-3 rotate-180" />
                        PREV: {pred.name}
                      </button>
                    )}
                    {project.lineage && (
                      <div className="px-3 py-1.5 rounded bg-white/5 text-white/60 border border-white/10">
                        LINEAGE: {project.lineage}
                      </div>
                    )}
                    {succ && (
                      <button 
                        onClick={() => setProjectFocus(succ.id)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/5 hover:border-white/20 transition-all text-white/40 hover:text-white"
                      >
                        NEXT: {succ.name}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-56 bg-white/5 rounded-xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {!statusFilter || statusFilter === "classified" ? (
              <DocumentSection
                title="CLASSIFIED"
                color="#ff0000"
                docs={classified}
                icon={<Lock className="w-4 h-4" />}
                onStar={handleStar}
              />
            ) : null}

            {!statusFilter || statusFilter === "declassified" ? (
              <DocumentSection
                title="DECLASSIFIED"
                color="#00ff00"
                docs={declassified}
                icon={<Unlock className="w-4 h-4" />}
                onStar={handleStar}
              />
            ) : null}

            {docs.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-xl">
                <FileText className="w-12 h-12 text-white/10 mb-4" />
                <p className="font-mono text-sm text-white/30 tracking-widest">NO_RECORDS_FOUND_IN_THIS_SECTOR</p>
                <p className="font-mono text-[10px] text-white/10 mt-2">ACCESS_LEVEL: RESTRICTED</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function DocumentSection({
  title,
  color,
  docs,
  icon,
  onStar,
}: {
  title: string;
  color: string;
  docs: Document[];
  icon: React.ReactNode;
  onStar: (e: React.MouseEvent, docId: string) => void;
}) {
  if (docs.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2" style={{ color }}>
          {icon}
          <h2 className="font-mono text-sm font-bold uppercase tracking-[0.2em]">{title}</h2>
        </div>
        <div className="h-[1px] flex-1" style={{ backgroundColor: `${color}20` }} />
        <span className="font-mono text-xs text-white/30">{docs.length} records</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {docs.map((doc) => (
            <DocCard key={doc.id} doc={doc} onStar={(e) => onStar(e, doc.id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DocCard({ doc, onStar }: { doc: Document, onStar: (e: React.MouseEvent) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-xl p-5 flex flex-col transition-all cursor-pointer overflow-hidden"
    >
      <Link href={`/documents/${doc.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View Document</span>
      </Link>

      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ backgroundColor: doc.agency.colorPrimary }}
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
        style={{ backgroundColor: doc.agency.colorPrimary }} />

      <div className="flex items-start justify-between mb-3">
        <div className="font-mono text-[10px] text-white/30">
          <span style={{ color: doc.agency.colorPrimary }}>{doc.agency.name}</span>
          {" // "}
          {doc.year}
        </div>
        <span className={`font-mono text-[9px] px-2 py-0.5 rounded flex items-center gap-1 ${
          doc.status === "classified"
            ? "text-red-400 bg-red-500/10 border border-red-500/20"
            : "text-green-400 bg-green-500/10 border border-green-500/20"
        }`}>
          {doc.status === "classified" ? <Lock className="w-2 h-2" /> : <Unlock className="w-2 h-2" />}
          {doc.status.toUpperCase()}
        </span>
        <button
          onClick={onStar}
          className="relative z-20 flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/5 hover:bg-yellow-500/10 border border-yellow-500/20 rounded font-mono text-[9px] text-yellow-500 transition-all"
        >
          <Star className="w-2.5 h-2.5 fill-yellow-500/20" />
          {doc.stars || 0}
        </button>
      </div>

      <h3 className="font-bold text-sm text-white group-hover:text-white/90 leading-tight line-clamp-2 mb-2 flex-1">
        {doc.title}
      </h3>

      {doc.description && (
        <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mb-3">
          {doc.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mb-4">
        {doc.tags.slice(0, 4).map((t: any) => (
          <span key={t.name} className="font-mono text-[8px] bg-white/5 text-white/30 px-1.5 py-0.5 rounded">
            #{t.name}
          </span>
        ))}
      </div>

      <div
        className="flex items-center gap-1.5 font-mono text-[10px] text-white/30 group-hover:text-white transition-colors"
      >
        <span>ACCESS FILE</span>
        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.div>
  );
}
