"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Globe,
  Lock,
  Unlock,
  AlertTriangle,
  Filter,
  Crosshair,
  Radio,
  MapPin,
} from "lucide-react";

// Dynamic import to avoid SSR issues with react-simple-maps
const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-black/40">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#00ff00]/20 border-t-[#00ff00] rounded-full animate-spin" />
        <span className="font-mono text-xs text-[#00ff00]/60">
          INITIALIZING GEOSPATIAL SYSTEM...
        </span>
      </div>
    </div>
  ),
});

interface MapDoc {
  id: string;
  title: string;
  status: string;
  latitude: number;
  longitude: number;
  country?: string;
  year: number;
  agency: { name: string; colorPrimary: string };
}

interface MapAnomaly {
  id: string;
  title: string;
  status: string;
  latitude: number;
  longitude: number;
  country?: string;
  severity: number;
  objectType?: string;
}

type LayerFilter = "all" | "classified" | "declassified" | "anomalies" | "media";

export default function MapPage() {
  const [documents, setDocuments] = useState<MapDoc[]>([]);
  const [anomalies, setAnomalies] = useState<MapAnomaly[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [layer, setLayer] = useState<LayerFilter>("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [stats, setStats] = useState({ docs: 0, anomalies: 0, media: 0, countries: 0 });

  useEffect(() => {
    fetch("/api/map-data")
      .then((r) => r.json())
      .then((data) => {
        setDocuments(data.documents || []);
        setAnomalies(data.anomalies || []);
        setMedia(data.media || []);
        const countries = new Set([
          ...(data.documents || []).map((d: MapDoc) => d.country).filter(Boolean),
          ...(data.anomalies || []).map((a: MapAnomaly) => a.country).filter(Boolean),
        ]);
        setStats({
          docs: (data.documents || []).length,
          anomalies: (data.anomalies || []).length,
          media: (data.media || []).length,
          countries: countries.size,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const visibleDocs =
    layer === "all"
      ? documents
      : layer === "classified"
      ? documents.filter((d) => d.status === "classified")
      : layer === "declassified"
      ? documents.filter((d) => d.status === "declassified")
      : [];

  const visibleAnomalies = layer === "all" || layer === "anomalies" ? anomalies : [];
  const visibleMedia = layer === "all" || layer === "media" ? media : [];

  const LAYERS: { key: LayerFilter; label: string; color: string; icon: React.ReactNode }[] = [
    { key: "all", label: "ALL SIGNALS", color: "#00ff00", icon: <Globe className="w-3.5 h-3.5" /> },
    { key: "classified", label: "CLASSIFIED", color: "#ff3333", icon: <Lock className="w-3.5 h-3.5" /> },
    { key: "declassified", label: "DECLASSIFIED", color: "#33ff99", icon: <Unlock className="w-3.5 h-3.5" /> },
    { key: "anomalies", label: "UAP ANOMALIES", color: "#ffaa00", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { key: "media", label: "INTELLIGENCE MEDIA", color: "#0088ff", icon: <MapPin className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="h-screen pt-16 flex flex-col bg-[#030303] overflow-hidden">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between bg-black/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-[#00ff00]/20 blur-md rounded-full" />
            <Globe className="w-5 h-5 text-[#00ff00] relative z-10" />
          </div>
          <div>
            <h1 className="font-mono text-sm font-bold text-white tracking-wider">
              GLOBAL INTELLIGENCE MAP
            </h1>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
              Geospatial Document & Anomaly Tracker — SIGINT Layer Active
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "DOCS", value: stats.docs, color: "#00ff00" },
            { label: "ANOMALIES", value: stats.anomalies, color: "#ffaa00" },
            { label: "NATIONS", value: stats.countries, color: "#0088ff" },
          ].map((s) => (
            <div key={s.label} className="text-right">
              <div className="font-mono text-[9px] text-white/30 tracking-widest">{s.label}</div>
              <div className="font-mono text-lg font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Layer Controls Sidebar */}
        <div className="w-56 shrink-0 border-r border-white/5 bg-black/40 backdrop-blur-xl p-4 space-y-6">
          <div>
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Filter className="w-3 h-3" />
              SIGNAL LAYERS
            </div>
            <div className="space-y-1">
              {LAYERS.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLayer(l.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-mono text-xs flex items-center gap-2 transition-all border ${
                    layer === l.key
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-transparent text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                  style={layer === l.key ? { color: l.color, borderColor: `${l.color}40` } : {}}
                >
                  <span style={{ color: l.color }}>{l.icon}</span>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div>
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
              LEGEND
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_6px_#ff3333]" />
                <span className="font-mono text-[10px] text-white/50">Classified Doc</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-[0_0_6px_#33ff99]" />
                <span className="font-mono text-[10px] text-white/50">Declassified Doc</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-[0_0_8px_#ffaa00]" />
                <span className="font-mono text-[10px] text-white/50">UAP Anomaly</span>
              </div>
            </div>
          </div>

          {/* Selected Info */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2"
              >
                <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest flex items-center gap-1">
                  <Crosshair className="w-3 h-3" />
                  SELECTED TARGET
                </div>
                <div className="font-mono text-xs text-white font-bold leading-tight">
                  {"title" in selected ? selected.title : ""}
                </div>
                {"agency" in selected && (
                  <div className="font-mono text-[10px]" style={{ color: selected.agency.colorPrimary }}>
                    {selected.agency.name}
                  </div>
                )}
                {"severity" in selected && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: i < selected.severity ? "#ffaa00" : "#333" }}
                      />
                    ))}
                    <span className="font-mono text-[9px] text-white/40 ml-1">SEVERITY</span>
                  </div>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="font-mono text-[9px] text-white/30 hover:text-white/60 transition-colors"
                >
                  CLEAR
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map */}
        <div className="flex-1 relative overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-[#00ff00]/20 border-t-[#00ff00] rounded-full animate-spin" />
                <span className="font-mono text-xs text-[#00ff00]/60 tracking-widest">
                  LOADING GEOSPATIAL DATA...
                </span>
              </div>
            </div>
          ) : (
            <WorldMap
              documents={visibleDocs}
              anomalies={visibleAnomalies}
              media={visibleMedia}
              onSelect={setSelected}
              selected={selected}
            />
          )}

          {/* Scan Line Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.01) 2px, rgba(0,255,0,0.01) 4px)",
            }}
          />

          {/* Corner decorations */}
          {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
            <div
              key={pos}
              className={`absolute ${pos} w-4 h-4 border-[#00ff00]/20 pointer-events-none`}
              style={{
                borderTopWidth: pos.includes("top") ? 1 : 0,
                borderBottomWidth: pos.includes("bottom") ? 1 : 0,
                borderLeftWidth: pos.includes("left") ? 1 : 0,
                borderRightWidth: pos.includes("right") ? 1 : 0,
              }}
            />
          ))}

          {/* Live status */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
            <span className="font-mono text-[9px] text-[#00ff00]/70 tracking-widest">SIGNAL ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
