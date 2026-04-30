"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, X, Image as ImageIcon, Video, Music,
  CheckCircle2, AlertCircle, Loader2, ChevronDown, Plus, Trash2
} from "lucide-react";

interface Agency {
  id: string;
  name: string;
  colorPrimary: string;
}

interface FileQueueItem {
  file: File;
  id: string;
  preview: string | null;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  // metadata
  title: string;
  category: string;
  tags: string;
  agencyId: string;
  year: string;
  country: string;
  sensor: string;
  source: string;
}

const ACCEPTED = {
  "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif", ".tiff"],
  "video/*": [".mp4", ".mov", ".avi", ".mkv"],
  "audio/*": [".mp3", ".wav", ".ogg", ".m4a"],
};

const CATEGORIES = ["photo", "satellite", "thermal", "video", "audio", "evidence", "artifact"];

function genId() { return Math.random().toString(36).slice(2, 9); }

export default function BatchMediaUploadPage() {
  const [queue, setQueue] = useState<FileQueueItem[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [uploading, setUploading] = useState(false);
  const [globalCategory, setGlobalCategory] = useState("photo");
  const [globalAgency, setGlobalAgency] = useState("");

  useEffect(() => {
    fetch("/api/agencies").then(r => r.json()).then(setAgencies).catch(() => {});
  }, []);

  const onDrop = useCallback((accepted: File[]) => {
    const newItems: FileQueueItem[] = accepted.map(file => ({
      file,
      id: genId(),
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      status: "pending",
      title: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
      category: globalCategory,
      tags: "",
      agencyId: globalAgency,
      year: new Date().getFullYear().toString(),
      country: "",
      sensor: "",
      source: "",
    }));
    setQueue(prev => [...prev, ...newItems]);
  }, [globalCategory, globalAgency]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    multiple: true,
  });

  const updateItem = (id: string, patch: Partial<FileQueueItem>) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, ...patch } : q));
  };

  const removeItem = (id: string) => {
    setQueue(prev => prev.filter(q => q.id !== id));
  };

  const applyGlobalToAll = () => {
    setQueue(prev => prev.map(q => ({
      ...q,
      category: globalCategory || q.category,
      agencyId: globalAgency || q.agencyId,
    })));
  };

  const uploadSingle = async (item: FileQueueItem): Promise<void> => {
    updateItem(item.id, { status: "uploading" });
    try {
      const fd = new FormData();
      fd.append("file", item.file);
      fd.append("title", item.title || item.file.name);
      fd.append("category", item.category);
      fd.append("tags", item.tags);
      fd.append("agencyId", item.agencyId);
      fd.append("year", item.year);
      fd.append("country", item.country);
      fd.append("sensor", item.sensor);
      fd.append("source", item.source);

      const res = await fetch("/api/media", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
      updateItem(item.id, { status: "success" });
    } catch (err: any) {
      updateItem(item.id, { status: "error", error: err.message });
    }
  };

  const uploadAll = async () => {
    const pending = queue.filter(q => q.status === "pending" || q.status === "error");
    if (pending.length === 0) return;
    setUploading(true);
    // Upload sequentially to avoid overwhelming the server
    for (const item of pending) {
      await uploadSingle(item);
    }
    setUploading(false);
  };

  const clearCompleted = () => {
    setQueue(prev => prev.filter(q => q.status !== "success"));
  };

  const pendingCount = queue.filter(q => q.status === "pending" || q.status === "error").length;
  const successCount = queue.filter(q => q.status === "success").length;

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("video/")) return Video;
    if (file.type.startsWith("audio/")) return Music;
    return ImageIcon;
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="font-mono text-3xl font-black text-white tracking-tighter uppercase italic">
          Batch Media Ingest
        </h1>
        <p className="font-mono text-[10px] text-white/40 mt-1 uppercase tracking-widest">
          Multi-Asset Upload Protocol // Drag &amp; Drop Multiple Files
        </p>
      </div>

      {/* Global Defaults */}
      <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-5">
        <p className="font-mono text-[10px] text-orange-400/60 uppercase tracking-widest mb-4">Global Defaults — Apply to all new files</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="font-mono text-[9px] text-white/30 uppercase tracking-widest block mb-1.5">Category</label>
            <div className="relative">
              <select
                value={globalCategory}
                onChange={e => setGlobalCategory(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 font-mono text-xs text-white focus:outline-none appearance-none pr-7"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="font-mono text-[9px] text-white/30 uppercase tracking-widest block mb-1.5">Agency</label>
            <div className="relative">
              <select
                value={globalAgency}
                onChange={e => setGlobalAgency(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 font-mono text-xs text-white focus:outline-none appearance-none pr-7"
              >
                <option value="">— none —</option>
                {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
            </div>
          </div>
          <button
            onClick={applyGlobalToAll}
            className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-mono text-[10px] rounded-lg uppercase tracking-widest transition-all"
          >
            Apply to All
          </button>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-orange-500 bg-orange-500/5"
            : "border-white/10 hover:border-orange-500/30 hover:bg-white/[0.02]"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragActive ? "text-orange-500" : "text-white/20"}`} />
        <p className="font-mono text-sm text-white/50">
          {isDragActive ? "DROP FILES HERE" : "DRAG & DROP MULTIPLE FILES"}
        </p>
        <p className="font-mono text-[10px] text-white/20 mt-2">
          Images (JPG, PNG, WEBP) · Video (MP4, MOV) · Audio (MP3, WAV) · No size limit
        </p>
        <button
          type="button"
          className="mt-4 px-6 py-2 bg-white/5 border border-white/10 text-white/50 font-mono text-[10px] rounded-lg uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          <Plus className="w-3 h-3 inline mr-1.5" />Browse Files
        </button>
      </div>

      {/* Queue */}
      {queue.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs text-white/40 uppercase tracking-widest">
              Queue: <span className="text-white">{queue.length}</span> files ·{" "}
              <span className="text-[#00ff00]">{successCount} done</span> ·{" "}
              <span className="text-orange-400">{pendingCount} pending</span>
            </div>
            <div className="flex gap-2">
              {successCount > 0 && (
                <button
                  onClick={clearCompleted}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/40 font-mono text-[9px] rounded-lg uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Clear Completed
                </button>
              )}
              <button
                onClick={uploadAll}
                disabled={uploading || pendingCount === 0}
                className="flex items-center gap-2 px-5 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-mono text-[10px] rounded-xl uppercase tracking-widest transition-all disabled:opacity-40"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? "Uploading..." : `Upload ${pendingCount} File(s)`}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {queue.map(item => {
                const Icon = getFileIcon(item.file);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`bg-white/[0.02] border rounded-2xl overflow-hidden transition-colors ${
                      item.status === "success" ? "border-[#00ff00]/20" :
                      item.status === "error" ? "border-red-500/20" :
                      item.status === "uploading" ? "border-orange-500/20" :
                      "border-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-4 p-4">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center">
                        {item.preview
                          ? <img src={item.preview} alt="" className="w-full h-full object-cover" />
                          : <Icon className="w-6 h-6 text-white/20" />
                        }
                      </div>

                      {/* Fields */}
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="col-span-2">
                          <input
                            value={item.title}
                            onChange={e => updateItem(item.id, { title: e.target.value })}
                            placeholder="Asset title..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 font-mono text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/40 transition-all"
                          />
                        </div>
                        <div className="relative">
                          <select
                            value={item.category}
                            onChange={e => updateItem(item.id, { category: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 font-mono text-xs text-white focus:outline-none appearance-none"
                          >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <input
                            value={item.year}
                            onChange={e => updateItem(item.id, { year: e.target.value })}
                            type="number" min="1900" max="2099"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-orange-500/40 transition-all"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            value={item.tags}
                            onChange={e => updateItem(item.id, { tags: e.target.value })}
                            placeholder="tags, comma-separated..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 font-mono text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/40 transition-all"
                          />
                        </div>
                        <div>
                          <input
                            value={item.country}
                            onChange={e => updateItem(item.id, { country: e.target.value })}
                            placeholder="Country..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 font-mono text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/40 transition-all"
                          />
                        </div>
                        <div>
                          <input
                            value={item.sensor}
                            onChange={e => updateItem(item.id, { sensor: e.target.value })}
                            placeholder="Sensor/Source..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 font-mono text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/40 transition-all"
                          />
                        </div>
                      </div>

                      {/* Status / Remove */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        {item.status === "success" && <CheckCircle2 className="w-5 h-5 text-[#00ff00]" />}
                        {item.status === "error" && <AlertCircle className="w-5 h-5 text-red-500" title={item.error} />}
                        {item.status === "uploading" && <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />}
                        {(item.status === "pending" || item.status === "error") && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 hover:bg-red-500/10 rounded-lg text-white/20 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {item.status === "error" && item.error && (
                      <div className="px-4 pb-3">
                        <p className="font-mono text-[9px] text-red-400/70 uppercase tracking-widest">
                          ERROR: {item.error}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
