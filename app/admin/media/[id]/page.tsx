"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Link as LinkIcon, Image as ImageIcon, Video, Music } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { key: "photo", label: "Photography" },
  { key: "satellite", label: "Satellite" },
  { key: "thermal", label: "Thermal / IR" },
  { key: "video", label: "Video" },
  { key: "audio", label: "Audio" },
  { key: "evidence", label: "Evidence" },
  { key: "artifact", label: "Artifacts" },
];

export default function EditMediaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/media/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load media asset");
        return res.json();
      })
      .then(data => {
        setItem({
          title: data.title || "",
          category: data.category || "photo",
          description: data.description || "",
          type: data.type || "image",
          year: data.year || new Date().getFullYear(),
          filePath: data.filePath || "",
          thumbnailPath: data.thumbnailPath || "",
          tags: data.tags || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
          country: data.country || "",
          sensor: data.sensor || "",
          source: data.source || "",
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/media/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!res.ok) throw new Error("Failed to update media asset");
      router.push("/admin/media");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#00ff00]" />
      </div>
    );
  }

  if (error && !item) {
    return <div className="text-red-400 p-4 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/media"
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-mono text-2xl font-bold text-white uppercase tracking-tight">EDIT MEDIA ASSET</h1>
          <p className="font-mono text-xs text-white/40 mt-1 uppercase tracking-widest">{params.id}</p>
        </div>
        <button
          onClick={async () => {
            if (!confirm("PURGE ASSET: Permanently delete this file from the vault?")) return;
            const res = await fetch(`/api/media/${params.id}`, { method: "DELETE" });
            if (res.ok) router.push("/admin/media");
            else alert("Purge failed");
          }}
          className="ml-auto px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-[10px] rounded-lg uppercase transition-all"
        >
          Purge_Asset
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 font-mono text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <div>
          <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
            Asset Title
          </label>
          <input
            type="text"
            required
            value={item.title}
            onChange={(e) => setItem({ ...item, title: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
              Category
            </label>
            <select
              value={item.category}
              onChange={(e) => setItem({ ...item, category: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.key} value={cat.key}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
              Media Type
            </label>
            <select
              value={item.type}
              onChange={(e) => setItem({ ...item, type: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
            Description
          </label>
          <textarea
            rows={3}
            value={item.description}
            onChange={(e) => setItem({ ...item, description: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
              Year
            </label>
            <input
              type="number"
              value={item.year}
              onChange={(e) => setItem({ ...item, year: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={item.tags}
              onChange={(e) => setItem({ ...item, tags: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={item.latitude}
              onChange={(e) => setItem({ ...item, latitude: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={item.longitude}
              onChange={(e) => setItem({ ...item, longitude: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
              Sensor Type
            </label>
            <input
              type="text"
              value={item.sensor}
              onChange={(e) => setItem({ ...item, sensor: e.target.value })}
              placeholder="e.g. ATFLIR"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
              Tracking Source
            </label>
            <input
              type="text"
              value={item.source}
              onChange={(e) => setItem({ ...item, source: e.target.value })}
              placeholder="e.g. USS Omaha"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
            Country / Region
          </label>
          <input
            type="text"
            value={item.country}
            onChange={(e) => setItem({ ...item, country: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-white/5">
          <div>
            <label className="block font-mono text-[10px] text-[#00ff00]/60 uppercase tracking-widest mb-2 flex items-center gap-2">
              <LinkIcon className="w-3 h-3" /> Source URL
            </label>
            <input
              type="text"
              required
              value={item.filePath}
              onChange={(e) => setItem({ ...item, filePath: e.target.value })}
              className="w-full bg-[#00ff00]/5 border border-[#00ff00]/20 rounded-lg px-4 py-2.5 font-mono text-sm text-[#00ff00] focus:outline-none focus:border-[#00ff00]/60 transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
              <LinkIcon className="w-3 h-3" /> Thumbnail URL (Optional)
            </label>
            <input
              type="text"
              value={item.thumbnailPath}
              onChange={(e) => setItem({ ...item, thumbnailPath: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 text-[#00ff00] font-mono text-sm rounded-xl uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "SAVING CHANGES..." : "SAVE MEDIA ASSET"}
          </button>
        </div>
      </form>
    </div>
  );
}
