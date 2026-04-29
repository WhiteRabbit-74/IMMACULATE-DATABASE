"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  MapPin,
  Plus,
  X,
  ChevronDown,
  Crosshair,
  Globe,
  Clock,
} from "lucide-react";

interface Anomaly {
  id: string;
  title: string;
  description?: string;
  date: string;
  latitude: number;
  longitude: number;
  country?: string;
  severity: number;
  witnesses: number;
  status: string;
  objectType?: string;
  source?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  unverified: "#ffaa00",
  confirmed: "#00ff00",
  debunked: "#666666",
  classified: "#ff3333",
};

const OBJECT_TYPES = ["disc", "triangle", "orb", "cylinder", "rectangle", "chevron", "unknown"];
const STATUSES = ["unverified", "confirmed", "debunked", "classified"];

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    latitude: "",
    longitude: "",
    country: "",
    severity: "3",
    witnesses: "0",
    status: "unverified",
    objectType: "unknown",
    source: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadAnomalies = () => {
    setLoading(true);
    fetch("/api/anomalies")
      .then((r) => r.json())
      .then((data) => {
        setAnomalies(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadAnomalies(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/anomalies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setShowForm(false);
      setForm({
        title: "", description: "", date: new Date().toISOString().split("T")[0],
        latitude: "", longitude: "", country: "", severity: "3", witnesses: "0",
        status: "unverified", objectType: "unknown", source: "",
      });
      loadAnomalies();
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = filter
    ? anomalies.filter((a) => a.status === filter)
    : anomalies;

  const inputClass =
    "w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/20 transition-all";

  return (
    <div className="min-h-screen pt-16 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              UAP/UFO TRACKING SYSTEM
            </div>
            <h1 className="font-mono text-3xl font-black text-white">ANOMALY TRACKER</h1>
            <p className="font-mono text-xs text-white/40 mt-1">
              {anomalies.length} incidents logged in the registry
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-amber-400 font-mono text-xs rounded-xl uppercase tracking-widest transition-all"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "Log Anomaly"}
          </button>
        </div>

        {/* Report Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <form
                onSubmit={handleSubmit}
                className="bg-white/[0.03] border border-amber-500/20 rounded-2xl p-8"
              >
                <div className="font-mono text-xs text-amber-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  New Anomaly Report
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1.5">Title *</label>
                    <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="INCIDENT DESIGNATION..." className={inputClass} required />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1.5">Date *</label>
                    <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={inputClass} required />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1.5">Latitude *</label>
                    <input value={form.latitude} onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))} placeholder="e.g. 36.0544" className={inputClass} required />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1.5">Longitude *</label>
                    <input value={form.longitude} onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))} placeholder="e.g. -114.9816" className={inputClass} required />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1.5">Country</label>
                    <input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} placeholder="USA" className={inputClass} />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1.5">Object Type</label>
                    <div className="relative">
                      <select value={form.objectType} onChange={(e) => setForm((f) => ({ ...f, objectType: e.target.value }))} className={`${inputClass} appearance-none`}>
                        {OBJECT_TYPES.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1.5">Status</label>
                    <div className="relative">
                      <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className={`${inputClass} appearance-none`}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1.5">Severity (1–5)</label>
                    <input type="number" min="1" max="5" value={form.severity} onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1.5">Witnesses</label>
                    <input type="number" min="0" value={form.witnesses} onChange={(e) => setForm((f) => ({ ...f, witnesses: e.target.value }))} className={inputClass} />
                  </div>
                  <div className="lg:col-span-3">
                    <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1.5">Description</label>
                    <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className={`${inputClass} resize-none`} placeholder="Incident description, witness accounts, sensor data..." />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-amber-400 font-mono text-sm rounded-xl uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <><div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />LOGGING...</>
                    ) : (
                      <><AlertTriangle className="w-4 h-4" />LOG INCIDENT</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Filter */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Filter:</span>
          {["", ...STATUSES].map((s) => (
            <button
              key={s || "all"}
              onClick={() => setFilter(s)}
              className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
                filter === s
                  ? "text-white border-white/30 bg-white/10"
                  : "text-white/30 border-white/5 hover:border-white/20 hover:text-white/60"
              }`}
              style={filter === s && s ? { color: STATUS_COLORS[s], borderColor: `${STATUS_COLORS[s]}40` } : {}}
            >
              {s || "ALL"}
            </button>
          ))}
        </div>

        {/* Anomaly Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-xl">
            <AlertTriangle className="w-12 h-12 text-white/10 mb-4" />
            <p className="font-mono text-sm text-white/30">NO_ANOMALIES_LOGGED</p>
            <p className="font-mono text-[10px] text-white/20 mt-1">
              The registry is empty. Report the first incident.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-xl p-5 transition-all group"
                  style={{ borderColor: `${STATUS_COLORS[a.status]}20` }}
                >
                  {/* Status + Type */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="font-mono text-[9px] uppercase px-2 py-0.5 rounded tracking-wider border"
                      style={{
                        color: STATUS_COLORS[a.status],
                        backgroundColor: `${STATUS_COLORS[a.status]}15`,
                        borderColor: `${STATUS_COLORS[a.status]}30`,
                      }}
                    >
                      {a.status}
                    </span>
                    {a.objectType && (
                      <span className="font-mono text-[9px] text-white/30 uppercase bg-white/5 px-2 py-0.5 rounded">
                        {a.objectType}
                      </span>
                    )}
                  </div>

                  <h3 className="font-mono font-bold text-sm text-white mb-2 line-clamp-1">{a.title}</h3>

                  {a.description && (
                    <p className="font-mono text-[10px] text-white/40 line-clamp-2 mb-3 leading-relaxed">
                      {a.description}
                    </p>
                  )}

                  {/* Severity */}
                  <div className="flex items-center gap-1.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full"
                        style={{
                          backgroundColor: i < a.severity ? STATUS_COLORS[a.status] : "rgba(255,255,255,0.1)",
                        }}
                      />
                    ))}
                    <span className="font-mono text-[9px] text-white/30 ml-1">SEV {a.severity}</span>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 font-mono text-[9px] text-white/30">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {a.country || `${a.latitude.toFixed(2)}, ${a.longitude.toFixed(2)}`}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {a.date}
                    </div>
                    {a.witnesses > 0 && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {a.witnesses}w
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
