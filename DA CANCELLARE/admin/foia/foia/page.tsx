"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle2, XCircle, AlertCircle, ChevronDown, Shield, Trash2 } from "lucide-react";

interface FoiaRequest {
  id: string;
  name: string;
  email: string;
  organization?: string;
  subject: string;
  description: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#ffaa00",
  processing: "#0088ff",
  fulfilled: "#00ff00",
  denied: "#ff3333",
  partial: "#ff8800",
};

const STATUSES = ["pending", "processing", "fulfilled", "denied", "partial"];

export default function AdminFoiaPage() {
  const [requests, setRequests] = useState<FoiaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<FoiaRequest | null>(null);
  const [notes, setNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadRequests = () => {
    setLoading(true);
    fetch("/api/foia")
      .then((r) => r.json())
      .then((data) => { setRequests(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadRequests(); }, []);

  const handleUpdate = async () => {
    if (!selected) return;
    setUpdating(true);
    await fetch(`/api/foia/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus || selected.status, adminNotes: notes }),
    });
    setUpdating(false);
    setSelected(null);
    loadRequests();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FOIA request?")) return;
    await fetch(`/api/foia/${id}`, { method: "DELETE" });
    loadRequests();
  };

  const filtered = filter ? requests.filter((r) => r.status === filter) : requests;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">
          <Shield className="w-3.5 h-3.5 text-[#00ff00]" />
          Freedom of Information Act
        </div>
        <h1 className="font-mono text-2xl font-bold text-white">FOIA REQUEST REVIEW</h1>
        <p className="font-mono text-xs text-white/40 mt-1">
          {requests.filter((r) => r.status === "pending").length} pending requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(filter === s ? "" : s)}
            className={`text-center p-3 rounded-xl border transition-all ${filter === s ? "border-white/20 bg-white/10" : "border-white/5 bg-white/[0.02] hover:border-white/10"}`}
          >
            <div className="font-mono text-lg font-bold" style={{ color: STATUS_COLORS[s] }}>
              {requests.filter((r) => r.status === s).length}
            </div>
            <div className="font-mono text-[9px] text-white/30 uppercase tracking-wider mt-0.5">{s}</div>
          </button>
        ))}
      </div>

      <div className={`grid gap-6 ${selected ? "grid-cols-[1fr_380px]" : "grid-cols-1"}`}>
        {/* List */}
        <div className="space-y-3">
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl">
              <FileText className="w-10 h-10 text-white/10 mb-3" />
              <p className="font-mono text-sm text-white/30">NO REQUESTS FOUND</p>
            </div>
          ) : (
            filtered.map((req) => (
              <motion.div
                key={req.id}
                layout
                onClick={() => { setSelected(req); setNotes(req.adminNotes || ""); setNewStatus(req.status); }}
                className={`bg-white/[0.03] border rounded-xl p-5 cursor-pointer transition-all hover:border-white/20 ${selected?.id === req.id ? "border-white/20 bg-white/5" : "border-white/5"}`}
                style={{ borderColor: selected?.id === req.id ? STATUS_COLORS[req.status] + "60" : undefined }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border"
                        style={{ color: STATUS_COLORS[req.status], borderColor: `${STATUS_COLORS[req.status]}30`, backgroundColor: `${STATUS_COLORS[req.status]}10` }}
                      >
                        {req.status}
                      </span>
                      <span className="font-mono text-[9px] text-white/30">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-mono text-sm text-white font-bold truncate">{req.subject}</div>
                    <div className="font-mono text-[10px] text-white/40 mt-0.5">
                      {req.name} {req.organization && `— ${req.organization}`} — {req.email}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(req.id); }}
                    className="p-1.5 hover:bg-red-500/10 rounded transition-colors text-white/20 hover:text-red-400 ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 h-fit sticky top-24 space-y-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Case Details</span>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white">
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1">Subject</div>
              <div className="font-mono text-sm text-white">{selected.subject}</div>
            </div>

            <div>
              <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1">Requester</div>
              <div className="font-mono text-xs text-white/70">{selected.name}</div>
              <div className="font-mono text-[10px] text-white/40">{selected.email}</div>
            </div>

            <div>
              <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1">Description</div>
              <div className="font-mono text-xs text-white/60 leading-relaxed max-h-32 overflow-y-auto">
                {selected.description}
              </div>
            </div>

            <div>
              <label className="font-mono text-[9px] text-white/30 uppercase tracking-widest block mb-1.5">Update Status</label>
              <div className="relative">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-all appearance-none"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="font-mono text-[9px] text-white/30 uppercase tracking-widest block mb-1.5">Admin Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 font-mono text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff00]/50 transition-all resize-none"
                placeholder="Internal notes..."
              />
            </div>

            <button
              onClick={handleUpdate}
              disabled={updating}
              className="w-full py-3 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 hover:border-[#00ff00]/60 text-[#00ff00] font-mono text-xs rounded-xl uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {updating ? (
                <><div className="w-3.5 h-3.5 border border-[#00ff00]/30 border-t-[#00ff00] rounded-full animate-spin" />Updating...</>
              ) : (
                <><CheckCircle2 className="w-3.5 h-3.5" />Update Case</>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
