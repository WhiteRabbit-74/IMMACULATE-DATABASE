"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Play, X, Film, Video, Music, Satellite, Thermometer, Search, Eye, Edit3, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface MediaItem {
  id: string;
  type: string;
  category: string;
  title: string;
  description?: string;
  filePath: string;
  thumbnailPath?: string;
  tags?: string;
  year?: number;
  mimeType?: string;
  sensor?: string;
  source?: string;
  country?: string;
  stars: number;
  createdAt: string;
}

const CATEGORIES = [
  { key: "", label: "All Assets", emoji: "🗂️" },
  { key: "photo", label: "Photography", emoji: "📷" },
  { key: "event", label: "Incursion Events", emoji: "🚨" },
  { key: "satellite", label: "Satellite", emoji: "🛰️" },
  { key: "thermal", label: "Thermal / IR", emoji: "🌡️" },
  { key: "video", label: "Video", emoji: "📹" },
  { key: "audio", label: "Audio", emoji: "🎙️" },
  { key: "evidence", label: "Evidence", emoji: "🔍" },
  { key: "artifact", label: "Artifacts", emoji: "🛸" },
];

const CATEGORY_COLORS: Record<string, string> = {
  photo: "#00ff00",
  event: "#ff0000",
  satellite: "#0088ff",
  thermal: "#ff6600",
  video: "#ff3399",
  audio: "#aa00ff",
  evidence: "#ffaa00",
  artifact: "#00ffaa",
};

export default function MediaPage() {
  const { data: session } = useSession();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const [search, setSearch] = useState("");
  const [subEvent, setSubEvent] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "stars">("date");

  const handleStar = async (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/media/${item.id}/star`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setMedia(prev => prev.map(m => m.id === item.id ? { ...m, stars: data.stars } : m));
        if (lightbox?.id === item.id) {
          setLightbox(prev => prev ? { ...prev, stars: data.stars } : null);
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    fetch(`/api/media?${params}`)
      .then((r) => r.json())
      .then((data) => { setMedia(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category]);

  const filtered = [...media]
    .filter((m: MediaItem) => {
      let matchesCategory = true;
      if (category) {
        if (category === "event") {
          // Special logic for events: search in tags or title
          matchesCategory = m.tags?.toLowerCase().includes("event") || 
                           ["roswell", "nimitz", "rendlesham", "gimbal", "mcminnville"].some(evt => m.title.toLowerCase().includes(evt));
        } else {
          matchesCategory = m.category === category;
        }
      }

      const matchesSearch = !search || 
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.tags?.toLowerCase().includes(search.toLowerCase());
      
      const matchesSubEvent = !subEvent || 
        m.tags?.toLowerCase().includes(subEvent.toLowerCase()) ||
        m.title.toLowerCase().includes(subEvent.toLowerCase());

      return matchesSearch && matchesSubEvent && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "stars") return (b.stars || 0) - (a.stars || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!lightbox || filtered.length <= 1) return;
    const currentIndex = filtered.findIndex(m => m.id === lightbox.id);
    const nextIndex = (currentIndex + 1) % filtered.length;
    setLightbox(filtered[nextIndex]);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!lightbox || filtered.length <= 1) return;
    const currentIndex = filtered.findIndex(m => m.id === lightbox.id);
    const prevIndex = (currentIndex - 1 + filtered.length) % filtered.length;
    setLightbox(filtered[prevIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox, filtered]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightbox]);

  return (
    <div className="min-h-screen pt-16">
      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setLightbox(null)}
          >
            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-white/80 hover:bg-white/5 rounded-full transition-all z-50"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-white/80 hover:bg-white/5 rounded-full transition-all z-50"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-7xl w-full h-auto max-h-[92vh] bg-[#030303]/98 backdrop-blur-3xl rounded-3xl border border-white/[0.08] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.9)] flex flex-col md:flex-row ring-1 ring-white/5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* LEFT TACTICAL SIDEBAR */}
              <div className="w-full md:w-[350px] border-b md:border-b-0 md:border-r border-white/10 bg-black/40 p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar shrink-0">
                {/* Identification */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30 font-black tracking-widest uppercase">
                      {lightbox.category}
                    </span>
                    <h3 className="font-mono text-2xl font-black text-white uppercase tracking-tighter leading-tight pt-2">{lightbox.title}</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="font-mono text-[10px] text-red-500 font-black tracking-[0.3em] uppercase">Security_Clearance</div>
                    <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                        <div className="font-mono text-lg text-red-500 font-black tracking-tighter">TOP_SECRET</div>
                        <div className="font-mono text-[8px] text-red-500/40 mt-1 uppercase">NODE_ID: {lightbox.id.slice(-12)}</div>
                    </div>
                  </div>
                </div>

                {/* Intel Description */}
                <div className="space-y-3 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                   <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Forensic_Analysis</div>
                   <p className="font-mono text-xs text-white/70 leading-relaxed italic">
                      "{lightbox.description}"
                   </p>
                </div>

                {/* Technical Parameters */}
                <div className="space-y-4">
                  <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest border-b border-white/5 pb-2">Technical_Parameters</div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {lightbox.sensor && (
                      <div className="space-y-1">
                        <div className="font-mono text-[9px] text-[#00ff00]/60 uppercase font-bold">Sensor</div>
                        <div className="font-mono text-[10px] text-white/90 uppercase truncate">{lightbox.sensor}</div>
                      </div>
                    )}
                    {lightbox.source && (
                      <div className="space-y-1">
                        <div className="font-mono text-[9px] text-blue-400/60 uppercase font-bold">Source</div>
                        <div className="font-mono text-[10px] text-white/90 uppercase truncate">{lightbox.source}</div>
                      </div>
                    )}
                    {lightbox.country && (
                      <div className="space-y-1">
                        <div className="font-mono text-[9px] text-amber-400/60 uppercase font-bold">Origin</div>
                        <div className="font-mono text-[10px] text-white/90 uppercase truncate">{lightbox.country}</div>
                      </div>
                    )}
                    {lightbox.year && (
                      <div className="space-y-1">
                        <div className="font-mono text-[9px] text-purple-400/60 uppercase font-bold">Stamp</div>
                        <div className="font-mono text-[10px] text-white/90 uppercase">{lightbox.year}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {lightbox.tags && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {lightbox.tags.split(",").map(t => t.trim()).filter(Boolean).map(t => (
                      <span key={t} className="font-mono text-[9px] text-[#00ff00]/30 hover:text-[#00ff00] transition-colors cursor-default">#{t}</span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-auto pt-6 space-y-3">
                  <button
                    onClick={(e) => handleStar(e, lightbox)}
                    className="w-full px-4 py-2.5 text-yellow-400 hover:text-yellow-300 transition-colors flex items-center justify-between font-mono text-[10px] border border-yellow-500/20 bg-yellow-500/5 rounded-xl font-black tracking-widest uppercase"
                  >
                    <span>Rating</span>
                    <span className="flex items-center gap-1">★ {lightbox.stars || 0}</span>
                  </button>
                  
                  {(session?.user?.role === "ADMIN" || session?.user?.email === "admin@intel.gov") && (
                    <Link
                      href={`/admin/media/${lightbox.id}`}
                      className="w-full px-4 py-2.5 text-red-400/80 hover:text-red-400 transition-colors flex items-center justify-center gap-3 font-mono text-[10px] border border-red-500/20 bg-red-500/5 rounded-xl font-black tracking-widest uppercase"
                    >
                      <Edit3 className="w-3 h-3" />
                      Modify_Record
                    </Link>
                  )}
                </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="flex-1 flex flex-col bg-black overflow-hidden relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
                  className="absolute top-6 right-6 z-[100] p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/40 hover:text-white transition-all backdrop-blur-md"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Asset Display */}
                <div className="w-full h-full flex items-center justify-center bg-black">
                  {lightbox.type === "image" ? (
                    <img
                      src={lightbox.filePath}
                      alt={lightbox.title}
                      className="w-full h-full object-contain"
                    />
                  ) : lightbox.type === "video" ? (
                    <video
                      src={lightbox.filePath}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-6">
                      <Music className="w-24 h-24 text-purple-400 animate-pulse" />
                      <audio src={lightbox.filePath} controls className="w-full max-w-md" />
                    </div>
                  )}

                  <div className="absolute bottom-6 right-6 font-mono text-[8px] text-[#00ff00]/40 uppercase tracking-[0.4em] bg-black/40 px-3 py-1 rounded border border-white/5">
                    SECURE_NODE // {lightbox.id.slice(-6)}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[1px] w-8 bg-[#00ff00]/50" />
              <span className="font-mono text-[10px] tracking-widest text-[#00ff00]/60 uppercase">
                Intelligence Media Archive
              </span>
            </div>
            <h1 className="font-mono text-5xl font-black tracking-tighter text-white">
              MEDIA VAULT
            </h1>
            <p className="text-white/40 mt-2 font-light">
              Visual intelligence assets — {media.length} files catalogued
            </p>
          </div>

          {(session?.user?.role === "ADMIN" || session?.user?.email === "admin@intel.gov") && (
            <Link 
              href="/admin/media/new"
              className="flex items-center gap-2 px-6 py-3 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 text-[#00ff00] font-mono text-xs rounded-xl uppercase tracking-widest transition-all font-bold"
            >
              <Plus className="w-4 h-4" />
              Ingest_New_Asset
            </Link>
          )}
        </motion.div>

        {/* Search + Sort */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff00]/50 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortBy("date")}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all border ${
                  sortBy === "date" ? "bg-white/10 text-white border-white/20" : "text-white/30 border-white/5 hover:border-white/10"
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setSortBy("stars")}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all border ${
                  sortBy === "stars" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "text-white/30 border-white/5 hover:border-white/10"
                }`}
              >
                ★ Top Rated
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key || "all"}
                onClick={() => {
                  setCategory(cat.key);
                  // Reset event filter if switching categories
                  if (cat.key !== "event") setSubEvent(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-all border ${
                  category === cat.key
                    ? "text-white border-white/30 bg-white/10"
                    : "text-white/40 border-white/5 hover:border-white/20 hover:text-white/70"
                }`}
                style={
                  category === cat.key && cat.key
                    ? {
                        color: CATEGORY_COLORS[cat.key],
                        borderColor: `${CATEGORY_COLORS[cat.key]}40`,
                        backgroundColor: `${CATEGORY_COLORS[cat.key]}10`,
                      }
                    : {}
                }
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sub-Event Filters (Only visible if 'event' is active) */}
          <AnimatePresence>
            {category === "event" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 py-3 border-t border-b border-white/5 mt-2">
                  <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] shrink-0">
                    Tactical_Operations:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                    {["Roswell", "Nimitz", "Rendlesham", "Gimbal", "McMinnville"].map((evt) => (
                      <button
                        key={evt}
                        onClick={() => setSubEvent(subEvent === evt ? null : evt)}
                        className={`px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest transition-all border ${
                          subEvent === evt
                            ? "bg-[#ff0000]/20 text-[#ff0000] border-[#ff0000]/40"
                            : "text-white/30 border-white/10 hover:border-white/20 hover:text-white/60"
                        }`}
                      >
                        {evt}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-xl gap-4">
            <ImageIcon className="w-12 h-12 text-white/10" />
            <p className="font-mono text-sm text-white/20">NO_MEDIA_IN_VAULT</p>
            <p className="font-mono text-[10px] text-white/10">
              {search ? "No results for your search" : "Upload assets via admin panel → Media Archive"}
            </p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  onClick={() => setLightbox(item)}
                  className="group relative aspect-square bg-black/40 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 cursor-pointer transition-all"
                >
                  {item.type === "image" ? (
                    <img
                      src={item.thumbnailPath || item.filePath}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : item.type === "video" ? (
                    <div className="w-full h-full relative">
                      <video 
                        src={`${item.filePath}#t=0.1`} 
                        preload="metadata"
                        muted
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition-colors">
                        <Video className="w-8 h-8 text-white/40 group-hover:scale-125 transition-transform" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-950/50 to-black">
                      <Music className="w-8 h-8 text-purple-400/60" />
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span
                      className="font-mono text-[9px] px-2 py-0.5 rounded uppercase backdrop-blur-md border font-black tracking-widest"
                      style={{
                        color: CATEGORY_COLORS[item.category] || "#fff",
                        borderColor: `${CATEGORY_COLORS[item.category]}40` || "#fff2",
                        backgroundColor: "rgba(0,0,0,0.8)",
                      }}
                    >
                      {item.category === "photo" ? "PHOTO" : item.category.toUpperCase()}
                    </span>
                    {(session?.user?.role === "ADMIN" || session?.user?.email === "admin@intel.gov") && (
                      <Link
                        href={`/admin/media/${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded text-red-400 transition-colors"
                        title="Edit Media"
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>

                  {/* Star count badge */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => handleStar(e, item)}
                      className="flex items-center gap-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm border border-yellow-500/30 rounded font-mono text-[9px] text-yellow-500 hover:bg-yellow-500/20 transition-all"
                    >
                      ★ {item.stars || 0}
                    </button>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="font-mono text-xs text-white font-bold line-clamp-1">{item.title}</div>
                    {item.year && <div className="font-mono text-[9px] text-white/50">{item.year}</div>}
                    <div className="flex items-center gap-1 mt-1">
                      <Eye className="w-3 h-3 text-white/40" />
                      <span className="font-mono text-[9px] text-white/40">VIEW</span>
                    </div>
                  </div>

                  {/* Tag line */}
                  {item.tags && (
                    <div className="absolute bottom-0 left-0 right-0 px-2 pb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="font-mono text-[8px] text-white/30 truncate">
                        {item.tags.split(",").slice(0, 3).join(" · ")}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
