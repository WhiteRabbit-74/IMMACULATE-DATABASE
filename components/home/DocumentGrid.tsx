"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ArrowRight, Lock, Unlock } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Document {
  id: string;
  title: string;
  description: string;
  year: number;
  status: "classified" | "declassified";
  agency: { name: string; colorPrimary: string };
  tags: { name: string }[];
}

export function DocumentGrid() {
  const { searchQuery, activeAgency, yearFilter } = useStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (activeAgency) params.append("agencyId", activeAgency.id);
    if (yearFilter) params.append("year", yearFilter.toString());

    setLoading(true);
    fetch(`/api/documents?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => { setDocuments(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [searchQuery, activeAgency, yearFilter]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-6 py-12">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-72 rounded-xl bg-white/5 animate-pulse border border-white/10" />
        ))}
      </div>
    );
  }

  return (
    <div className="px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-mono text-xs text-white/30 uppercase tracking-[0.3em] shrink-0">
          Archive_Records ({documents.length})
        </h2>
        <div className="h-[1px] flex-1 bg-white/5" />
        <Link
          href="/documents"
          className="font-mono text-[10px] text-white/30 hover:text-[#00ff00] uppercase tracking-widest transition-colors flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-xl gap-4">
          <FileText className="w-12 h-12 text-white/10" />
          <p className="font-mono text-sm text-white/30">NO_RECORDS_FOUND</p>
          <p className="font-mono text-[10px] text-white/20">
            Upload documents via <Link href="/admin/upload" className="text-[#00ff00]/60 hover:text-[#00ff00]">/admin/upload</Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {documents.slice(0, 8).map((doc, i) => (
              <DocumentCard key={doc.id} doc={doc} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function DocumentCard({ doc, index }: { doc: Document; index: number }) {
  const isClassified = doc.status === "classified";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-white/20 flex flex-col transition-all"
    >
      {/* Clickable area covers everything */}
      <Link href={`/documents/${doc.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {doc.title}</span>
      </Link>

      {/* Agency color top bar */}
      <div
        className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ backgroundColor: doc.agency.colorPrimary }}
      />

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-2">
          <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest leading-tight">
            <span style={{ color: doc.agency.colorPrimary }}>{doc.agency.name}</span>
            {" // "}
            {doc.year}
          </span>

          {/* Status badge — subtle animation, not full glitch */}
          <span
            className={`flex items-center gap-1 font-mono text-[8px] px-2 py-0.5 rounded-sm border uppercase tracking-wider shrink-0 ${
              isClassified
                ? "text-red-400 bg-red-500/10 border-red-500/20"
                : "text-green-400 bg-green-500/10 border-green-500/20"
            }`}
          >
            {isClassified ? <Lock className="w-2 h-2" /> : <Unlock className="w-2 h-2" />}
            {doc.status}
          </span>
        </div>

        <h3 className="font-bold text-sm text-white leading-tight line-clamp-2 mb-2 flex-1 group-hover:text-white/90 transition-colors">
          {doc.title}
        </h3>

        {doc.description && (
          <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mb-3 font-light">
            {doc.description}
          </p>
        )}

        {/* Tags */}
        {doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {doc.tags.slice(0, 3).map((tag) => (
              <span key={tag.name} className="font-mono text-[8px] bg-white/5 text-white/30 px-1.5 py-0.5 rounded">
                #{tag.name}
              </span>
            ))}
            {doc.tags.length > 3 && (
              <span className="font-mono text-[8px] text-white/20">+{doc.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-1 font-mono text-[10px] text-white/30 group-hover:text-[#00ff00] transition-colors mt-auto">
          <span>ACCESS FILE</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity pointer-events-none"
        style={{ backgroundColor: doc.agency.colorPrimary }}
      />
    </motion.div>
  );
}
