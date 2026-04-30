"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Calendar, 
  MapPin, 
  RefreshCw,
  Eye,
  Loader2,
  Tag as TagIcon
} from "lucide-react";
import Link from "next/link";

interface MediaItem {
  id: string;
  type: string;
  category: string;
  title: string;
  description?: string;
  filePath: string;
  thumbnailPath?: string;
  year?: number;
  tags?: string;
}

export default function AdminMediaRegistry() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setMedia(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch media", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this intelligence asset?")) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMedia(media.filter(m => m.id !== id));
      }
    } catch (error) {
      alert("Failed to delete asset");
    }
  };

  const filtered = media.filter(m => 
    (m.title.toLowerCase().includes(search.toLowerCase()) || 
     m.tags?.toLowerCase().includes(search.toLowerCase())) &&
    (categoryFilter === "" || m.category === categoryFilter)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white uppercase tracking-tight">MEDIA ARCHIVE REGISTRY</h1>
          <p className="font-mono text-[10px] text-white/40 mt-1 uppercase tracking-widest">Global visual intelligence assets management</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={async () => {
              setLoading(true);
              try {
                const res = await fetch("/api/media/sync-all", { method: "POST" });
                const data = await res.json();
                if (data.success) {
                  alert(`INTEL_ARCHIVE_UPDATED: ${data.createdCount} new assets registered.`);
                  fetchMedia();
                } else {
                  alert(`SYNC_FAILURE: ${data.error}\nDetails: ${data.details || "None"}`);
                }
              } catch (e) {
                alert("CRITICAL_SYNC_ERROR");
              } finally {
                setLoading(false);
              }
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-mono text-xs rounded-xl uppercase tracking-widest transition-all disabled:opacity-50"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync_Filesystem
          </button>
          <Link
            href="/admin/media/new"
            className="flex items-center gap-2 px-6 py-3 bg-[#00ff00] hover:bg-[#00ff88] text-black font-mono text-xs font-bold rounded-xl uppercase tracking-widest transition-all"
          >
            <Plus className="w-4 h-4" />
            Ingest_New_Asset
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="Search by title or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50"
        >
          <option value="">All Categories</option>
          <option value="photo">Photography</option>
          <option value="satellite">Satellite</option>
          <option value="thermal">Thermal / IR</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="evidence">Evidence</option>
          <option value="artifact">Artifacts</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#00ff00]/40" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-[#00ff00]/30 transition-all flex flex-col">
              <div className="aspect-video relative bg-black/40 border-b border-white/5">
                {item.type === "image" ? (
                  <img src={item.thumbnailPath || item.filePath} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {item.type === "video" ? <Video className="w-12 h-12 text-white/10" /> : <Music className="w-12 h-12 text-white/10" />}
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 border border-white/10 rounded font-mono text-[8px] text-white/60 uppercase tracking-widest">
                  {item.category}
                </div>
              </div>
              
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                  <span className="font-mono text-[9px] text-white/30 shrink-0 ml-2">{item.year}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags?.split(",").slice(0, 3).map(tag => (
                    <span key={tag} className="font-mono text-[8px] bg-white/5 text-white/30 px-1.5 py-0.5 rounded border border-white/5">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 pt-3 border-t border-white/5 mt-auto">
                  <Link 
                    href={`/media?id=${item.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg font-mono text-[10px] text-white/60 hover:text-white transition-all"
                  >
                    <Eye className="w-3 h-3" /> View
                  </Link>
                  <Link 
                    href={`/admin/media/${item.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#00ff00]/5 hover:bg-[#00ff00]/10 border border-[#00ff00]/10 rounded-lg font-mono text-[10px] text-[#00ff00]/60 hover:text-[#00ff00] transition-all"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg text-red-500/40 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="font-mono text-sm text-white/20 uppercase">No intelligence assets found matching criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
