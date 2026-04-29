"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Folder } from "lucide-react";
import Link from "next/link";

export default function EditOperationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [op, setOp] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/operations/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load operation");
        return res.json();
      })
      .then(data => {
        setOp({
          name: data.name || "",
          codename: data.codename || "",
          description: data.description || "",
          startYear: data.startYear || "",
          endYear: data.endYear || "",
          status: data.status || "active",
          agency: data.agency || "",
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
      const res = await fetch(`/api/operations/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(op),
      });

      if (!res.ok) throw new Error("Failed to update operation");
      router.push("/admin/operations");
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

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/operations"
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-mono text-2xl font-bold text-white uppercase tracking-tight">EDIT OPERATION</h1>
          <p className="font-mono text-xs text-white/40 mt-1 uppercase tracking-widest">{op?.codename}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <div>
          <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Project Name</label>
          <input
            type="text"
            required
            value={op.name}
            onChange={(e) => setOp({ ...op, name: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Codename</label>
          <input
            type="text"
            required
            value={op.codename}
            onChange={(e) => setOp({ ...op, codename: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Lead Agency</label>
            <input
              type="text"
              value={op.agency}
              onChange={(e) => setOp({ ...op, agency: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Status</label>
            <select
              value={op.status}
              onChange={(e) => setOp({ ...op, status: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            >
              <option value="active">Active</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Start Year</label>
            <input
              type="number"
              value={op.startYear}
              onChange={(e) => setOp({ ...op, startYear: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">End Year (Optional)</label>
            <input
              type="number"
              value={op.endYear}
              onChange={(e) => setOp({ ...op, endYear: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">Operational Description</label>
          <textarea
            rows={4}
            value={op.description}
            onChange={(e) => setOp({ ...op, description: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 transition-colors resize-none"
          />
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
            {saving ? "UPDATING DOSSIER..." : "SAVE OPERATION CHANGES"}
          </button>
        </div>
      </form>
    </div>
  );
}
