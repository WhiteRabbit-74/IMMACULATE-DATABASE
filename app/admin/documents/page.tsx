"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText, Lock, Unlock, Trash2, Edit3, Eye,
  Search, Filter, ChevronDown, Plus, Download, Tag
} from "lucide-react";
import Link from "next/link";

interface Document {
  id: string;
  title: string;
  description?: string;
  year: number;
  status: string;
  isFoia: boolean;
  agency: { name: string; colorPrimary: string };
  tags: { name: string }[];
  fileSize?: number;
  createdAt: string;
}

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadDocs = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/documents?${params}`)
      .then((r) => r.json())
      .then((data) => { setDocs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(loadDocs, 300);
    return () => clearTimeout(t);
  }, [search, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document permanently?")) return;
    setDeleting(id);
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setDeleting(null);
    loadDocs();
  };

  const handleStatusToggle = async (doc: Document) => {
    const newStatus = doc.status === "classified" ? "declassified" : "classified";
    await fetch(`/api/documents/${doc.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    loadDocs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white">DOCUMENT REGISTRY</h1>
          <p className="font-mono text-xs text-white/40 mt-1">{docs.length} records in archive</p>
        </div>
        <Link
          href="/admin/upload"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 hover:border-[#00ff00]/60 text-[#00ff00] font-mono text-xs rounded-xl uppercase tracking-widest transition-all"
        >
          <Plus className="w-4 h-4" />
          Upload Document
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff00]/50 transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-all appearance-none pr-8"
          >
            <option value="">All Status</option>
            <option value="classified">Classified</option>
            <option value="declassified">Declassified</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_130px_90px_100px] gap-4 px-6 py-3 border-b border-white/5 font-mono text-[9px] text-white/30 uppercase tracking-widest">
          <span>Title / Agency</span>
          <span>Year</span>
          <span>Status</span>
          <span>Tags</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="space-y-0">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-14 bg-white/[0.02] border-b border-white/5 animate-pulse" />
            ))}
          </div>
        ) : docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FileText className="w-10 h-10 text-white/10 mb-3" />
            <p className="font-mono text-sm text-white/30">NO DOCUMENTS FOUND</p>
          </div>
        ) : (
          docs.map((doc) => (
            <motion.div
              key={doc.id}
              layout
              className="grid grid-cols-[1fr_100px_130px_90px_100px] gap-4 px-6 py-4 border-b border-white/5 last:border-0 items-center hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <div className="font-mono text-sm text-white truncate">{doc.title}</div>
                <div className="font-mono text-[10px] mt-0.5 flex items-center gap-2" style={{ color: doc.agency.colorPrimary }}>
                  {doc.agency.name}
                  {doc.isFoia && <span className="text-[9px] text-blue-400 border border-blue-400/30 px-1.5 rounded">FOIA</span>}
                </div>
              </div>
              <div className="font-mono text-sm text-white/60">{doc.year}</div>
              <div>
                <button
                  onClick={() => handleStatusToggle(doc)}
                  className={`flex items-center gap-1 font-mono text-[9px] px-2 py-1 rounded uppercase tracking-wider border transition-all hover:opacity-80 ${
                    doc.status === "classified"
                      ? "text-red-400 bg-red-500/10 border-red-500/20"
                      : "text-green-400 bg-green-500/10 border-green-500/20"
                  }`}
                >
                  {doc.status === "classified" ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                  {doc.status}
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {doc.tags.slice(0, 2).map((t) => (
                  <span key={t.name} className="font-mono text-[8px] bg-white/5 text-white/30 px-1.5 py-0.5 rounded">
                    #{t.name}
                  </span>
                ))}
                {doc.tags.length > 2 && (
                  <span className="font-mono text-[8px] text-white/20">+{doc.tags.length - 2}</span>
                )}
              </div>
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/documents/${doc.id}`}
                  className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-white"
                  title="View"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/admin/documents/${doc.id}`}
                  className="p-1.5 hover:bg-blue-500/10 rounded transition-colors text-white/40 hover:text-blue-400"
                  title="Edit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={deleting === doc.id}
                  className="p-1.5 hover:bg-red-500/10 rounded transition-colors text-white/40 hover:text-red-400"
                  title="Delete"
                >
                  {deleting === doc.id ? (
                    <div className="w-3.5 h-3.5 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
