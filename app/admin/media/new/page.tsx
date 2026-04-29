"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Link as LinkIcon, Plus, Info, Film, Image as ImageIcon, Music, Satellite, Shield } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { key: "photo", label: "Photography", icon: ImageIcon, color: "#00ff00" },
  { key: "satellite", label: "Satellite Imagery", icon: Satellite, color: "#0088ff" },
  { key: "thermal", label: "Thermal / IR", icon: Shield, color: "#ff6600" },
  { key: "video", label: "Video Evidence", icon: Film, color: "#ff3399" },
  { key: "audio", label: "Signal Audio", icon: Music, color: "#aa00ff" },
  { key: "evidence", label: "Forensic Evidence", icon: Shield, color: "#ffaa00" },
  { key: "artifact", label: "Xeno-Artifact", icon: Plus, color: "#00ffaa" },
];

export default function NewMediaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [item, setItem] = useState({
    title: "",
    category: "photo",
    description: "",
    type: "image",
    year: new Date().getFullYear(),
    filePath: "",
    thumbnailPath: "",
    tags: "",
    sensor: "",
    source: "",
    country: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!res.ok) throw new Error("Failed to ingest media asset");
      
      router.push("/media");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
        <div className="flex items-center gap-6">
          <Link
            href="/media"
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="px-2 py-0.5 bg-[#00ff00]/20 text-[#00ff00] text-[8px] font-mono border border-[#00ff00]/30 rounded uppercase tracking-widest">Pipeline_Ready</span>
               <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Sector: Forensic_Media_Ingestion</span>
            </div>
            <h1 className="font-black text-4xl text-white tracking-tighter uppercase italic">Ingest_Asset</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-6">
              <div>
                <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
                  Asset_Codename
                </label>
                <input
                  type="text"
                  required
                  value={item.title}
                  onChange={(e) => setItem({ ...item, title: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                  placeholder="E.G. NIMITZ_FLIR_RECORDING_01"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
                  Intelligence_Context
                </label>
                <textarea
                  rows={5}
                  value={item.description}
                  onChange={(e) => setItem({ ...item, description: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors resize-none"
                  placeholder="Detailed description of the sighting or artifact context..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
                      Recon_Sensor
                    </label>
                    <input
                      type="text"
                      value={item.sensor}
                      onChange={(e) => setItem({ ...item, sensor: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                      placeholder="E.G. ATFLIR"
                    />
                 </div>
                 <div>
                    <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
                      Tracking_Source
                    </label>
                    <input
                      type="text"
                      value={item.source}
                      onChange={(e) => setItem({ ...item, source: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                      placeholder="E.G. USS NIMITZ"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                 <div>
                    <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
                      Geospatial_Origin
                    </label>
                    <input
                      type="text"
                      value={item.country}
                      onChange={(e) => setItem({ ...item, country: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                      placeholder="Country / Region"
                    />
                 </div>
                 <div>
                    <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={item.latitude}
                      onChange={(e) => setItem({ ...item, latitude: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                      placeholder="0.0000"
                    />
                 </div>
                 <div>
                    <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={item.longitude}
                      onChange={(e) => setItem({ ...item, longitude: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                      placeholder="0.0000"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                 <div>
                    <label className="block font-mono text-[10px] text-[#00ff00]/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <LinkIcon className="w-3 h-3" /> Secure_File_Path
                    </label>
                    <input
                      type="text"
                      required
                      value={item.filePath}
                      onChange={(e) => setItem({ ...item, filePath: e.target.value })}
                      className="w-full bg-[#00ff00]/5 border border-[#00ff00]/20 rounded-xl px-4 py-3 font-mono text-xs text-[#00ff00] focus:outline-none focus:border-[#00ff00]/60 transition-colors"
                      placeholder="https://... or /media/..."
                    />
                 </div>
                 <div>
                    <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <LinkIcon className="w-3 h-3" /> Thumbnail_Proxy
                    </label>
                    <input
                      type="text"
                      value={item.thumbnailPath}
                      onChange={(e) => setItem({ ...item, thumbnailPath: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white/70 focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                      placeholder="Static image for preview..."
                    />
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 text-[#00ff00] font-mono text-xs rounded-xl uppercase tracking-[0.2em] transition-all font-black disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,0,0.1)]"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  {saving ? "SYNCING..." : "COMMIT_TO_VAULT"}
                </button>
              </div>
           </form>
        </div>

        <div className="space-y-6">
           <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-6">
              <div>
                <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
                  Asset_Category
                </label>
                <div className="grid grid-cols-1 gap-2">
                   {CATEGORIES.map(cat => (
                     <button
                       key={cat.key}
                       type="button"
                       onClick={() => setItem({ ...item, category: cat.key })}
                       className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border font-mono text-[10px] uppercase tracking-widest transition-all ${
                         item.category === cat.key 
                           ? "bg-white/10 border-white/30 text-white" 
                           : "bg-transparent border-transparent text-white/30 hover:bg-white/5"
                       }`}
                       style={item.category === cat.key ? { color: cat.color, borderColor: `${cat.color}40`, backgroundColor: `${cat.color}10` } : {}}
                     >
                        <cat.icon className="w-3.5 h-3.5" />
                        {cat.label}
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div>
                   <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
                     Media_Format
                   </label>
                   <select
                     value={item.type}
                     onChange={(e) => setItem({ ...item, type: e.target.value })}
                     className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                   >
                     <option value="image">IMAGE / PHOTOGRAPH</option>
                     <option value="video">VIDEO / MOTION</option>
                     <option value="audio">SIGNAL / AUDIO</option>
                   </select>
                </div>
                <div>
                   <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
                     Year_of_Origin
                   </label>
                   <input
                     type="number"
                     value={item.year}
                     onChange={(e) => setItem({ ...item, year: parseInt(e.target.value) })}
                     className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                   />
                </div>
                <div>
                   <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
                     Tags
                   </label>
                   <input
                     type="text"
                     value={item.tags}
                     onChange={(e) => setItem({ ...item, tags: e.target.value })}
                     className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-[10px] text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                     placeholder="Separate with commas..."
                   />
                </div>
              </div>
           </div>

           <div className="p-6 bg-[#00ff00]/5 border border-[#00ff00]/10 rounded-2xl flex items-start gap-3">
              <Info className="w-4 h-4 text-[#00ff00] shrink-0 mt-0.5" />
              <p className="text-[9px] text-[#00ff00]/60 leading-relaxed font-mono uppercase tracking-tight">
                Warning: Asset ingestion triggers a global re-indexing of the forensic database. Ensure all metadata is verified before committing.
              </p>
           </div>
        </div>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-mono text-xs uppercase tracking-widest">
          SYNC_FAILURE: {error}
        </div>
      )}
    </div>
  );
}
