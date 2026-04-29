"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Link as LinkIcon, Shield, Tag, Building2, Calendar, FileText, Trash2, MapPin, Globe } from "lucide-react";
import Link from "next/link";

export default function EditDocumentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [agencies, setAgencies] = useState<any[]>([]);
  const [operations, setOperations] = useState<any[]>([]);
  const [doc, setDoc] = useState<any>({
    title: "",
    description: "",
    year: new Date().getFullYear(),
    status: "classified",
    filePath: "",
    coverPath: "",
    agencyId: "",
    operationId: "",
    tags: "",
    latitude: "",
    longitude: "",
    country: ""
  });

  useEffect(() => {
    // Load dependencies and document in parallel
    Promise.all([
      fetch("/api/agencies").then(r => r.json()),
      fetch("/api/operations").then(r => r.json()),
      fetch(`/api/documents/${params.id}`).then(r => r.json())
    ]).then(([agenciesData, opsData, docData]) => {
      setAgencies(agenciesData);
      setOperations(opsData);
      setDoc({
        title: docData.title || "",
        description: docData.description || "",
        year: docData.year || new Date().getFullYear(),
        status: docData.status || "classified",
        filePath: docData.filePath || "",
        coverPath: docData.coverPath || "",
        agencyId: docData.agencyId || "",
        operationId: docData.operationId || "",
        tags: docData.tags?.map((t: any) => t.name).join(", ") || "",
        latitude: docData.latitude || "",
        longitude: docData.longitude || "",
        country: docData.country || ""
      });
      setLoading(false);
    }).catch(err => {
      setError("Failed to load record data.");
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/documents/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...doc,
          year: parseInt(doc.year.toString()),
          tags: doc.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        }),
      });

      if (!res.ok) throw new Error("Failed to update document");
      router.push("/admin/documents");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("CONFIRM DELETION: This record will be permanently purged from the archive. Continue?")) return;
    try {
      const res = await fetch(`/api/documents/${params.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Purge failed");
      router.push("/documents");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#00ff00]" />
        <div className="font-mono text-[10px] text-[#00ff00] animate-pulse uppercase tracking-[0.3em]">Synchronizing Archive...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
        <div className="flex items-center gap-6">
          <Link
            href="/documents"
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[8px] font-mono border border-red-500/30 rounded">ADMIN_OVERRIDE_ACTIVE</span>
               <span className="font-mono text-[9px] text-white/20">UUID: {params.id}</span>
            </div>
            <h1 className="font-black text-4xl text-white tracking-tighter uppercase italic">Modify_Record</h1>
          </div>
        </div>

        <button 
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-[10px] rounded-xl transition-all uppercase tracking-widest"
        >
          <Trash2 className="w-3.5 h-3.5" /> Purge_Record
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Essential Info */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-6">
              <div>
                <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Record_Title
                </label>
                <input
                  type="text"
                  required
                  value={doc.title}
                  onChange={(e) => setDoc({ ...doc, title: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                  placeholder="E.G. PROJECT_MONARCH_EXECUTIVE_SUMMARY"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
                  Summary_Description
                </label>
                <textarea
                  rows={6}
                  value={doc.description}
                  onChange={(e) => setDoc({ ...doc, description: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors resize-none"
                  placeholder="Provide a detailed intelligence summary..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block font-mono text-[10px] text-[#00ff00]/60 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <LinkIcon className="w-3 h-3" /> File_Path
                    </label>
                    <input
                      type="text"
                      required
                      value={doc.filePath}
                      onChange={(e) => setDoc({ ...doc, filePath: e.target.value })}
                      className="w-full bg-[#00ff00]/5 border border-[#00ff00]/20 rounded-xl px-4 py-3 font-mono text-xs text-[#00ff00] focus:outline-none focus:border-[#00ff00]/60 transition-colors"
                    />
                 </div>
                 <div>
                    <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <LinkIcon className="w-3 h-3" /> Cover_Image_URL
                    </label>
                    <input
                      type="text"
                      value={doc.coverPath}
                      onChange={(e) => setDoc({ ...doc, coverPath: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white/70 focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Classification & Metadata */}
        <div className="space-y-6">
           <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-6">
              
              <div>
                <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Classification
                </label>
                <select
                  value={doc.status}
                  onChange={(e) => setDoc({ ...doc, status: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                >
                  <option value="classified">CLASSIFIED (RESTRICTED)</option>
                  <option value="declassified">DECLASSIFIED (PUBLIC)</option>
                  <option value="top_secret">TOP SECRET (SCI)</option>
                  <option value="foia_released">FOIA RELEASED</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Building2 className="w-3 h-3" /> Managing_Agency
                </label>
                <select
                  value={doc.agencyId}
                  onChange={(e) => setDoc({ ...doc, agencyId: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                >
                  <option value="">SELECT_AGENCY...</option>
                  {agencies.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Operational_Project
                </label>
                <select
                  value={doc.operationId}
                  onChange={(e) => setDoc({ ...doc, operationId: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                >
                  <option value="">UNASSIGNED (NONE)</option>
                  {operations.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={doc.latitude}
                    onChange={(e) => setDoc({ ...doc, latitude: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={doc.longitude}
                    onChange={(e) => setDoc({ ...doc, longitude: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Country
                  </label>
                  <input
                    type="text"
                    value={doc.country}
                    onChange={(e) => setDoc({ ...doc, country: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Year_of_Origin
                  </label>
                  <input
                    type="number"
                    value={doc.year}
                    onChange={(e) => setDoc({ ...doc, year: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Intelligence_Tags
                  </label>
                  <input
                    type="text"
                    value={doc.tags}
                    onChange={(e) => setDoc({ ...doc, tags: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-[10px] text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
                    placeholder="E.G. ufo, crash, recovery"
                  />
                  <p className="text-[8px] font-mono text-white/20 mt-1 uppercase">Separate with commas</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 text-[#00ff00] font-mono text-xs rounded-xl uppercase tracking-[0.2em] transition-all font-black disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,0,0.1)] hover:shadow-[0_0_30px_rgba(0,255,0,0.2)]"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {saving ? "COMMITTING..." : "COMMIT_CHANGES"}
                </button>
              </div>
           </div>
        </div>

      </form>

      {error && (
        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-mono text-xs uppercase tracking-widest animate-shake">
          CRITICAL_ERROR: {error}
        </div>
      )}
    </div>
  );
}
