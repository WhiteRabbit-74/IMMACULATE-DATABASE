"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare, Square, Lock, Unlock, Trash2, Shield,
  Search, Loader2, AlertCircle, CheckCircle2, FileText, ChevronDown
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  year: number;
  status: string;
  agency: { name: string; colorPrimary: string };
  tags: { name: string }[];
}

export default function BulkEditPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadDocs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/documents?${params}`);
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
      setSelected(new Set());
    } catch {
      showToast("Failed to load documents", "error");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(loadDocs, 300);
    return () => clearTimeout(t);
  }, [loadDocs]);

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(d => d.id)));
    }
  };

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkAction = async (action: "classified" | "declassified" | "delete") => {
    if (selected.size === 0) return;
    const ids = Array.from(selected);

    if (action === "delete") {
      if (!confirm(`PERMANENTLY delete ${ids.length} document(s)? This cannot be undone.`)) return;
    }

    setProcessing(true);
    try {
      const body = action === "delete"
        ? { ids, action: "delete" }
        : { ids, status: action };

      const res = await fetch("/api/documents/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast(
        action === "delete"
          ? `${data.count} document(s) deleted permanently`
          : `${data.count} document(s) set to ${action}`,
        "success"
      );
      loadDocs();
    } catch (err: any) {
      showToast(err.message || "Operation failed", "error");
    } finally {
      setProcessing(false);
    }
  };

  const filtered = docs.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.agency.name.toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = filtered.length > 0 && selected.size === filtered.length;
  const someSelected = selected.size > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-mono text-3xl font-black text-white tracking-tighter uppercase italic">
            Bulk Document Editor
          </h1>
          <p className="font-mono text-[10px] text-white/40 mt-1 uppercase tracking-widest">
            Mass Metadata Operations // {docs.length} records loaded
          </p>
        </div>

        {/* Bulk Action Bar */}
        <AnimatePresence>
          {someSelected && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2"
            >
              <span className="font-mono text-xs text-blue-400 mr-2 shrink-0">
                {selected.size} selected
              </span>
              <button
                onClick={() => bulkAction("classified")}
                disabled={processing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-mono text-[10px] rounded-lg uppercase tracking-widest transition-all disabled:opacity-40"
              >
                <Lock className="w-3 h-3" /> Classify
              </button>
              <button
                onClick={() => bulkAction("declassified")}
                disabled={processing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 font-mono text-[10px] rounded-lg uppercase tracking-widest transition-all disabled:opacity-40"
              >
                <Unlock className="w-3 h-3" /> Declassify
              </button>
              <button
                onClick={() => bulkAction("delete")}
                disabled={processing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 border border-red-900/40 text-red-500 font-mono text-[10px] rounded-lg uppercase tracking-widest transition-all disabled:opacity-40"
              >
                {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                Purge
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 font-mono text-xs border ${
              toast.type === "success"
                ? "bg-[#00ff00]/10 border-[#00ff00]/20 text-[#00ff00]"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {toast.type === "success"
              ? <CheckCircle2 className="w-4 h-4" />
              : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter documents..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none pr-8"
          >
            <option value="">All Status</option>
            <option value="classified">Classified</option>
            <option value="declassified">Declassified</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
        </div>
        <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest whitespace-nowrap">
          {filtered.length} records
        </span>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[40px_1fr_90px_130px_80px] gap-4 px-6 py-3 border-b border-white/5 font-mono text-[9px] text-white/30 uppercase tracking-widest">
          <button onClick={toggleAll} className="flex items-center justify-center">
            {allSelected
              ? <CheckSquare className="w-4 h-4 text-blue-400" />
              : <Square className="w-4 h-4 text-white/20 hover:text-white/50 transition-colors" />
            }
          </button>
          <span>Title / Agency</span>
          <span>Year</span>
          <span>Status</span>
          <span className="text-right">Tags</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400/40" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <FileText className="w-10 h-10 text-white/10" />
            <p className="font-mono text-sm text-white/30">NO DOCUMENTS MATCH CRITERIA</p>
          </div>
        ) : (
          filtered.map((doc) => (
            <motion.div
              key={doc.id}
              layout
              onClick={() => toggle(doc.id)}
              className={`grid grid-cols-[40px_1fr_90px_130px_80px] gap-4 px-6 py-4 border-b border-white/5 last:border-0 items-center cursor-pointer transition-colors ${
                selected.has(doc.id)
                  ? "bg-blue-500/5 hover:bg-blue-500/10"
                  : "hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-center" onClick={e => { e.stopPropagation(); toggle(doc.id); }}>
                {selected.has(doc.id)
                  ? <CheckSquare className="w-4 h-4 text-blue-400" />
                  : <Square className="w-4 h-4 text-white/20" />
                }
              </div>
              <div>
                <div className="font-mono text-sm text-white truncate">{doc.title}</div>
                <div className="font-mono text-[10px] mt-0.5" style={{ color: doc.agency.colorPrimary }}>
                  {doc.agency.name}
                </div>
              </div>
              <div className="font-mono text-sm text-white/60">{doc.year}</div>
              <div>
                <span className={`inline-flex items-center gap-1 font-mono text-[9px] px-2 py-1 rounded uppercase tracking-wider border ${
                  doc.status === "classified"
                    ? "text-red-400 bg-red-500/10 border-red-500/20"
                    : "text-green-400 bg-green-500/10 border-green-500/20"
                }`}>
                  {doc.status === "classified" ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                  {doc.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 justify-end">
                {doc.tags.slice(0, 2).map(t => (
                  <span key={t.name} className="font-mono text-[8px] bg-white/5 text-white/30 px-1.5 py-0.5 rounded">
                    #{t.name}
                  </span>
                ))}
                {doc.tags.length > 2 && (
                  <span className="font-mono text-[8px] text-white/20">+{doc.tags.length - 2}</span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer hint */}
      {!loading && filtered.length > 0 && (
        <p className="font-mono text-[9px] text-white/20 text-center uppercase tracking-widest">
          Click rows to select // Select all with checkbox header // Use action bar to apply bulk operations
        </p>
      )}
    </div>
  );
}
