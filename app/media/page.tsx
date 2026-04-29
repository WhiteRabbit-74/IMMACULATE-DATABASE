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
  { key: "satellite", label: "Satellite", emoji: "🛰️" },
  { key: "thermal", label: "Thermal / IR", emoji: "🌡️" },
  { key: "video", label: "Video", emoji: "📹" },
  { key: "audio", label: "Audio", emoji: "🎙️" },
  { key: "evidence", label: "Evidence", emoji: "🔍" },
  { key: "artifact", label: "Artifacts", emoji: "🛸" },
];

const CATEGORY_COLORS: Record<string, string> = {
  photo: "#00ff00",
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
    .filter((m) => {
      const matchesSearch = !search || 
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.tags?.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
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
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-12 right-0 flex items-center gap-4">
                {(session?.user?.role === "ADMIN" || session?.user?.email === "admin@intel.gov") && (
                  <Link
                    href={`/admin/media/${lightbox.id}`}
                    className="p-2 text-red-400/60 hover:text-red-400 transition-colors flex items-center gap-2 font-mono text-xs border border-red-500/20 bg-red-500/5 rounded-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                    EDIT (ADMIN)
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleStar(e, lightbox)}
                    className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-2 font-mono text-xs border border-yellow-500/20 bg-yellow-500/5 rounded-lg"
                  >
                    <span className="text-sm">★</span>
                    {lightbox.stars || 0}
                  </button>
                  <button
                    onClick={() => setLightbox(null)}
                    className="p-2 text-white/60 hover:text-white transition-colors flex items-center gap-2 font-mono text-xs"
                  >
                    <X className="w-5 h-5" />
                    CLOSE
                  </button>
                </div>
              </div>

              {lightbox.type === "image" ? (
                <img
                  src={lightbox.filePath}
                  alt={lightbox.title}
                  className="w-full max-h-[70vh] object-contain rounded-xl border border-white/10"
                />
              ) : lightbox.type === "video" ? (
                <video
                  src={lightbox.filePath}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] rounded-xl border border-white/10"
                />
              ) : (
                <div className="bg-black/60 border border-white/10 rounded-xl p-8 flex flex-col items-center gap-4">
                  <Music className="w-16 h-16 text-purple-400" />
                  <audio src={lightbox.filePath} controls className="w-full" />
                </div>
              )}

              <div className="mt-6 flex flex-col md:flex-row items-start justify-between gap-6 border-t border-white/5 pt-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="font-mono text-xl font-bold text-white uppercase tracking-tight">{lightbox.title}</div>
                    {lightbox.description && (
                      <p className="font-mono text-xs text-white/50 mt-2 leading-relaxed max-w-2xl italic">
                        "{lightbox.description}"
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {lightbox.sensor && (
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="font-mono text-[9px] text-[#00ff00]/60 uppercase tracking-widest mb-1">Recon_Sensor</div>
                        <div className="font-mono text-xs text-white uppercase">{lightbox.sensor}</div>
                      </div>
                    )}
                    {lightbox.source && (
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="font-mono text-[9px] text-blue-400/60 uppercase tracking-widest mb-1">Tracking_Source</div>
                        <div className="font-mono text-xs text-white uppercase">{lightbox.source}</div>
                      </div>
                    )}
                    {lightbox.country && (
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="font-mono text-[9px] text-amber-400/60 uppercase tracking-widest mb-1">Geospatial_Origin</div>
                        <div className="font-mono text-xs text-white uppercase">{lightbox.country}</div>
                      </div>
                    )}
                    {lightbox.year && (
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="font-mono text-[9px] text-purple-400/60 uppercase tracking-widest mb-1">Temporal_Stamp</div>
                        <div className="font-mono text-xs text-white uppercase">{lightbox.year}</div>
                      </div>
                    )}
                  </div>

                  {lightbox.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {lightbox.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                        <span key={t} className="font-mono text-[9px] bg-white/5 text-white/40 px-2 py-0.5 rounded border border-white/5">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3 min-w-[140px]">
                  <span
                    className="font-mono text-[10px] px-3 py-1.5 rounded uppercase tracking-wider border font-bold"
                    style={{
                      color: CATEGORY_COLORS[lightbox.category] || "#fff",
                      borderColor: `${CATEGORY_COLORS[lightbox.category]}30` || "#fff3",
                      backgroundColor: `${CATEGORY_COLORS[lightbox.category]}10` || "#fff1",
                    }}
                  >
                    {lightbox.category}
                  </span>
                  <div className="text-right">
                    <div className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Asset_ID</div>
                    <div className="font-mono text-[10px] text-white/40 uppercase">{lightbox.id.slice(-12)}</div>
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
                onClick={() => setCategory(cat.key)}
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
                      className="font-mono text-[8px] px-1.5 py-0.5 rounded uppercase backdrop-blur-sm border"
                      style={{
                        color: CATEGORY_COLORS[item.category] || "#fff",
                        borderColor: `${CATEGORY_COLORS[item.category]}40` || "#fff2",
                        backgroundColor: "rgba(0,0,0,0.7)",
                      }}
                    >
                      {item.category}
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
