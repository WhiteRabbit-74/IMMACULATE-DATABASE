"use client";

import { useState, useEffect } from "react";
import { 
  Folder, 
  Search, 
  Edit3, 
  Trash2, 
  Plus, 
  Loader2,
  Calendar,
  Building2,
  Eye
} from "lucide-react";
import Link from "next/link";

interface Operation {
  id: string;
  name: string;
  codename: string;
  description?: string;
  startYear?: number;
  endYear?: number;
  status: string;
  agency?: string;
  _count?: { documents: number };
}

export default function AdminOperationsRegistry() {
  const [ops, setOps] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOps = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/operations");
      const data = await res.json();
      setOps(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch operations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOps();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this operation? This will NOT delete associated documents, but they will no longer be linked to this project.")) return;
    try {
      const res = await fetch(`/api/operations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOps(ops.filter(o => o.id !== id));
      }
    } catch (error) {
      alert("Failed to delete operation");
    }
  };

  const filtered = ops.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) || 
    o.codename.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "completed": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "archived": return "text-white/40 bg-white/5 border-white/10";
      case "ongoing": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default: return "text-white/60 bg-white/5 border-white/10";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white uppercase tracking-tight">OPERATIONS REGISTRY</h1>
          <p className="font-mono text-[10px] text-white/40 mt-1 uppercase tracking-widest">Global intelligence project management</p>
        </div>
        <Link 
          href="/admin/operations/new" 
          className="flex items-center gap-2 px-4 py-2 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 text-[#00ff00] font-mono text-xs rounded-xl uppercase tracking-widest transition-all"
        >
          <Plus className="w-4 h-4" />
          Register New Project
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          placeholder="Search by name or codename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#00ff00]/40" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((op) => (
            <div key={op.id} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center gap-6">
              <div className="p-4 bg-white/5 rounded-2xl shrink-0 flex items-center justify-center">
                <Folder className="w-8 h-8 text-white/20" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="font-mono text-lg font-bold text-white uppercase tracking-tight">{op.codename}</h2>
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded uppercase tracking-widest border ${getStatusColor(op.status)}`}>
                    {op.status}
                  </span>
                  <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" /> {op.agency || "INTER-AGENCY"}
                  </div>
                </div>
                <h3 className="font-mono text-xs text-white/60 mb-2">{op.name}</h3>
                <p className="font-mono text-[11px] text-white/30 line-clamp-1 italic">
                  {op.description || "No operational description filed."}
                </p>
              </div>

              <div className="flex flex-wrap md:flex-col items-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> {op.startYear || "UNK"} — {op.endYear || "ONGOING"}
                </div>
                <div className="font-mono text-[10px] text-[#00ff00]/60 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3 h-3" /> {op._count?.documents || 0} Linked Records
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Link 
                    href={`/projects/${op.codename.toLowerCase()}`}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                    title="View Public Dossier"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link 
                    href={`/admin/operations/${op.id}`}
                    className="p-2 bg-[#00ff00]/5 hover:bg-[#00ff00]/10 border border-[#00ff00]/10 rounded-lg text-[#00ff00]/60 hover:text-[#00ff00] transition-colors"
                    title="Edit Operation"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(op.id)}
                    className="p-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-lg text-red-500/40 hover:text-red-500 transition-colors"
                    title="Delete Operation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="font-mono text-sm text-white/20 uppercase">No operations found in database</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FileText({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
    </svg>
  );
}
