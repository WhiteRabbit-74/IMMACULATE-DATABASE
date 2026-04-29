"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Building2, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

interface Agency {
  id: string;
  name: string;
  slug: string;
  colorPrimary: string;
  colorSecondary: string;
  description?: string;
  country?: string;
  _count?: { documents: number };
}

export default function AdminAgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    colorPrimary: "#00ff00",
    colorSecondary: "#000000",
    description: "",
    country: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchAgencies = async () => {
    setLoading(true);
    const res = await fetch("/api/agencies");
    const data = await res.json();
    setAgencies(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchAgencies(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (logo) fd.append("logo", logo);
    const res = await fetch("/api/agencies", { method: "POST", body: fd });
    if (res.ok) {
      setSuccess(true);
      setShowForm(false);
      setForm({ name: "", slug: "", colorPrimary: "#00ff00", colorSecondary: "#000000", description: "", country: "" });
      setLogo(null);
      fetchAgencies();
    } else {
      const d = await res.json();
      setError(d.error || "Failed to create agency");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this agency? All associated documents will be affected.")) return;
    await fetch(`/api/agencies/${id}`, { method: "DELETE" });
    setAgencies((a) => a.filter((ag) => ag.id !== id));
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold text-white tracking-tight">AGENCIES</h1>
          <p className="font-mono text-xs text-white/40 mt-1 uppercase tracking-widest">
            {agencies.length} registered agencies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAgencies} className="p-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
            <RefreshCw className="w-4 h-4 text-white/40" />
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 hover:border-[#00ff00]/60 text-[#00ff00] font-mono text-xs rounded-lg transition-all uppercase"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Agency
          </button>
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-white/5 border border-[#00ff00]/20 rounded-xl p-6">
              <div className="font-mono text-xs text-[#00ff00]/60 uppercase tracking-widest mb-4">New Agency Record</div>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
                <input required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Agency name *" className="input-style" />
                <input required value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} placeholder="slug (e.g. cia) *" className="input-style" />
                <input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className="input-style" />
                <input value={form.country} onChange={(e) => setForm(f => ({ ...f, country: e.target.value }))} placeholder="Country code (e.g. USA)" className="input-style" />
                <div className="flex items-center gap-3">
                  <label className="font-mono text-[10px] text-white/40">Primary Color</label>
                  <input type="color" value={form.colorPrimary} onChange={(e) => setForm(f => ({ ...f, colorPrimary: e.target.value }))} className="w-10 h-8 rounded cursor-pointer border-0 bg-transparent" />
                  <span className="font-mono text-xs text-white/40">{form.colorPrimary}</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="font-mono text-[10px] text-white/40">Logo (optional)</label>
                  <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="font-mono text-xs text-white/40" />
                </div>
                {error && <div className="col-span-2 flex items-center gap-2 text-red-400 text-xs font-mono"><AlertCircle className="w-3 h-3" />{error}</div>}
                <div className="col-span-2 flex gap-2">
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] font-mono text-xs rounded-lg uppercase hover:border-[#00ff00]/60 transition-all disabled:opacity-50">
                    {submitting ? "Saving..." : "Create Agency"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-white/5 border border-white/10 text-white/40 font-mono text-xs rounded-lg uppercase hover:bg-white/10 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {success && (
        <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 font-mono text-xs mb-4">
          <CheckCircle2 className="w-3 h-3" /> Agency created successfully
        </div>
      )}

      {/* Agency Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {agencies.map((agency) => (
              <motion.div
                key={agency.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: agency.colorPrimary }} />
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${agency.colorPrimary}20` }}>
                      <Building2 className="w-4 h-4" style={{ color: agency.colorPrimary }} />
                    </div>
                    <div>
                      <div className="font-mono text-sm font-bold text-white">{agency.name}</div>
                      <div className="font-mono text-[10px] text-white/30">{agency.slug}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(agency.id)} className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all text-white/30 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {agency.description && (
                  <p className="font-mono text-[10px] text-white/40 mb-2 line-clamp-2">{agency.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[10px] text-white/30">{agency.country}</div>
                  <div className="font-mono text-[10px] text-white/40">
                    {agency._count?.documents || 0} docs
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      <style jsx>{`
        .input-style {
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.5rem;
          padding: 0.625rem 1rem;
          font-family: monospace;
          font-size: 0.875rem;
          color: white;
          width: 100%;
          outline: none;
          transition: all 0.2s;
        }
        .input-style:focus {
          border-color: rgba(0,255,0,0.5);
          box-shadow: 0 0 0 1px rgba(0,255,0,0.2);
        }
        .input-style::placeholder {
          color: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
