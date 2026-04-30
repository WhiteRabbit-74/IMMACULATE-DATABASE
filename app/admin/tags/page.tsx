"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Plus, Trash2, Edit3, Check, X, Hash, FileText, Loader2, AlertCircle } from "lucide-react";

interface TagItem {
  id: string;
  name: string;
  _count: { documents: number };
}

export default function TagManagerPage() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tags");
      const data = await res.json();
      setTags(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTags(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTag.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewTag("");
      fetchTags();
    } catch (err: any) {
      setError(err.message || "Failed to create tag");
    } finally {
      setCreating(false);
    }
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditingId(null);
      fetchTags();
    } catch (err: any) {
      setError(err.message || "Failed to rename tag");
    }
  };

  const handleDelete = async (id: string, name: string, docCount: number) => {
    if (docCount > 0 && !confirm(`Tag "#${name}" is used by ${docCount} document(s). Deleting it will REMOVE it from all documents. Continue?`)) return;
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setTags(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const totalDocs = tags.reduce((acc, t) => acc + t._count.documents, 0);

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="font-mono text-3xl font-black text-white tracking-tighter uppercase italic">
          Tag Taxonomy
        </h1>
        <p className="font-mono text-[10px] text-white/40 mt-1 uppercase tracking-widest">
          Custom Taxonomy Builder // {tags.length} tags // {totalDocs} document links
        </p>
      </div>

      {/* Create Tag */}
      <form onSubmit={handleCreate} className="flex gap-3">
        <div className="relative flex-1">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aa00ff]/60" />
          <input
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            placeholder="new-tag-name..."
            className="w-full bg-black/40 border border-[#aa00ff]/20 focus:border-[#aa00ff]/60 rounded-xl pl-9 pr-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#aa00ff]/20 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={creating || !newTag.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-[#aa00ff]/10 hover:bg-[#aa00ff]/20 border border-[#aa00ff]/30 hover:border-[#aa00ff]/60 text-[#aa00ff] font-mono text-xs rounded-xl uppercase tracking-widest transition-all disabled:opacity-40"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add_Tag
        </button>
      </form>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 font-mono text-xs text-red-400"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
            <button onClick={() => setError("")} className="ml-auto hover:text-red-300"><X className="w-3 h-3" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tag List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#aa00ff]/40" />
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <Tag className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="font-mono text-sm text-white/20 uppercase">No tags in taxonomy</p>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_120px] gap-4 px-6 py-3 border-b border-white/5 font-mono text-[9px] text-white/30 uppercase tracking-widest">
            <span>Tag Name</span>
            <span className="text-center">Documents</span>
            <span className="text-right">Actions</span>
          </div>
          <AnimatePresence>
            {tags.map((tag, i) => (
              <motion.div
                key={tag.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-[1fr_80px_120px] gap-4 px-6 py-4 border-b border-white/5 last:border-0 items-center hover:bg-white/[0.02] transition-colors group"
              >
                <div>
                  {editingId === tag.id ? (
                    <input
                      autoFocus
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleRename(tag.id); if (e.key === "Escape") setEditingId(null); }}
                      className="bg-black/60 border border-[#aa00ff]/40 rounded-lg px-3 py-1.5 font-mono text-sm text-white focus:outline-none w-full max-w-[240px]"
                    />
                  ) : (
                    <span className="font-mono text-sm text-white/80 flex items-center gap-2">
                      <span className="text-[#aa00ff]/60">#</span>{tag.name}
                    </span>
                  )}
                </div>

                <div className="text-center">
                  <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                    tag._count.documents > 0
                      ? "bg-[#00ff00]/10 text-[#00ff00]/70"
                      : "bg-white/5 text-white/20"
                  }`}>
                    <FileText className="w-2.5 h-2.5 inline mr-1" />
                    {tag._count.documents}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-1">
                  {editingId === tag.id ? (
                    <>
                      <button onClick={() => handleRename(tag.id)} className="p-1.5 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 rounded-lg text-[#00ff00] transition-all">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setEditingId(tag.id); setEditName(tag.name); }}
                        className="p-1.5 hover:bg-blue-500/10 rounded-lg text-white/30 hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100"
                        title="Rename"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id, tag.name, tag._count.documents)}
                        disabled={deletingId === tag.id}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-white/30 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        {deletingId === tag.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />
                        }
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
