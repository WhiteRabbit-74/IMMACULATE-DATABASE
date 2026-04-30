"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, ArrowLeft, Download, FileText, Tag, Calendar, Building2, Star } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-black/40 rounded-xl border border-white/10">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#00ff00] rounded-full animate-spin" />
        <div className="font-mono text-xs text-white/30">LOADING DOCUMENT...</div>
      </div>
    </div>
  ),
});

interface DocData {
  id: string;
  title: string;
  description?: string;
  year: number;
  status: string;
  filePath: string;
  coverPath?: string;
  autoCoverPath?: string;
  fileSize?: number;
  agency: { name: string; colorPrimary: string; colorSecondary: string };
  tags: { name: string }[];
  stars?: number;
  createdAt: string;
}

export function DocumentViewer({ document: doc }: { document: DocData }) {
  const { data: session } = useSession();
  const [accessGranted, setAccessGranted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(doc.status === "classified");
  const [glitchPhase, setGlitchPhase] = useState(0); // 0=stamp, 1=glitch, 2=granted, 3=done

  useEffect(() => {
    if (doc.status !== "classified") {
      setAccessGranted(true);
      setShowOverlay(false);
      return;
    }

    // Overlay sequence
    const timers = [
      setTimeout(() => setGlitchPhase(1), 1000),
      setTimeout(() => setGlitchPhase(2), 1600),
      setTimeout(() => {
        setGlitchPhase(3);
        setTimeout(() => {
          setShowOverlay(false);
          setAccessGranted(true);
        }, 800);
      }, 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [doc.status]);

  const coverUrl = doc.coverPath || doc.autoCoverPath;

  return (
    <div className="min-h-screen pt-16">
      {/* Classified Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <ClassifiedOverlay
            phase={glitchPhase}
            agencyColor={doc.agency.colorPrimary}
          />
        )}
      </AnimatePresence>

      {/* Document Content */}
      {(accessGranted || doc.status === "declassified") && (
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/documents"
              className="flex items-center gap-2 text-white/40 hover:text-white font-mono text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO ARCHIVE
            </Link>

            {(session?.user?.role === "ADMIN" || session?.user?.email === "admin@intel.gov") && (
              <Link
                href={`/admin/documents/${doc.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs rounded-xl uppercase tracking-widest transition-all"
                title="Only visible to Admins"
              >
                <FileText className="w-4 h-4" />
                EDIT RECORD (ADMIN)
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Left: Metadata */}
            <div className="space-y-4">
              {/* Cover */}
              <div className="relative aspect-[3/4] bg-black/40 rounded-xl overflow-hidden border border-white/10">
                {coverUrl ? (
                  <img src={coverUrl} alt={doc.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <FileText className="w-12 h-12 text-white/10" />
                    <div className="font-mono text-[10px] text-white/20">NO COVER AVAILABLE</div>
                  </div>
                )}

                {/* Status Badge on cover */}
                <div className={`absolute top-3 right-3 flex items-center gap-1 font-mono text-[9px] px-2 py-1 rounded-full backdrop-blur-sm ${
                  doc.status === "classified"
                    ? "bg-red-500/80 text-white border border-red-400/50"
                    : "bg-green-500/80 text-white border border-green-400/50"
                }`}>
                  {doc.status === "classified" ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                  {doc.status.toUpperCase()}
                </div>
              </div>

              {/* Metadata Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                <div>
                  <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Agency
                  </div>
                  <div className="font-mono text-sm font-bold" style={{ color: doc.agency.colorPrimary }}>
                    {doc.agency.name}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Year
                  </div>
                  <div className="font-mono text-sm text-white">{doc.year}</div>
                </div>

                {doc.fileSize && (
                  <div>
                    <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-1">File Size</div>
                    <div className="font-mono text-sm text-white">
                      {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                )}

                <div>
                  <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Tags
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((t) => (
                      <span key={t.name} className="font-mono text-[9px] bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded">
                        #{t.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Star className="w-3 h-3" /> Asset_Rating
                  </div>
                  <StarRating docId={doc.id} initialStars={doc.stars || 0} />
                </div>
              </div>

              {/* Interactive Download/Export */}
              <ExportDossierButton filePath={doc.filePath} title={doc.title} />
            </div>

            {/* Right: Document Content */}
            <div className="space-y-6">
              <div>
                <div
                  className="font-mono text-[10px] uppercase tracking-widest mb-2"
                  style={{ color: doc.agency.colorPrimary }}
                >
                  {doc.agency.name} // {doc.year}
                </div>
                <h1 className="font-bold text-3xl md:text-4xl text-white leading-tight tracking-tight">
                  {doc.title}
                </h1>
                {doc.description && (
                  <p className="text-white/60 mt-4 leading-relaxed font-light text-lg">
                    {doc.description}
                  </p>
                )}
              </div>

              {/* PDF Viewer */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <PDFViewer filePath={doc.filePath} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StarRating({ docId, initialStars }: { docId: string; initialStars: number }) {
  const [stars, setStars] = useState(initialStars);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const voted = localStorage.getItem(`voted_${docId}`);
    if (voted) setHasVoted(true);
  }, [docId]);

  const handleVote = async () => {
    if (hasVoted || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/documents/${docId}/star`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setStars(data.stars);
        setHasVoted(true);
        localStorage.setItem(`voted_${docId}`, "true");
      }
    } catch (err) {
      console.error("VOTE_ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <Star 
          className={`w-4 h-4 transition-all ${
            hasVoted ? "fill-yellow-500 text-yellow-500" : "text-white/20"
          }`}
        />
        <span className="font-mono text-xs text-white">{stars}</span>
      </div>
      <button
        onClick={handleVote}
        disabled={hasVoted || loading}
        className={`px-3 py-1 rounded-md font-mono text-[9px] uppercase tracking-widest transition-all ${
          hasVoted 
            ? "text-yellow-500/50 cursor-default" 
            : "text-white/40 hover:text-white hover:bg-white/5"
        }`}
      >
        {loading ? "..." : hasVoted ? "STARRED" : "STAR"}
      </button>
    </div>
  );
}

function ClassifiedOverlay({
  phase,
  agencyColor,
}: {
  phase: number;
  agencyColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,0,0,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.2) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Phase 0+1: CLASSIFIED Stamp */}
        {phase < 3 && (
          <motion.div
            initial={{ scale: 3, opacity: 0, rotate: -20 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: -8,
              x: phase === 1 ? [0, -4, 3, -2, 0] : 0,
              filter: phase === 1
                ? ["blur(0px)", "blur(2px)", "blur(0px)", "blur(3px)", "blur(0px)"]
                : "blur(0px)",
            }}
            transition={{ duration: 0.6 }}
            className="border-8 border-red-600 px-16 py-6 relative"
          >
            <div className="absolute inset-0 bg-red-600/10" />
            <span
              className="font-mono text-6xl md:text-8xl font-black text-red-600 tracking-[0.2em] select-none"
              style={{
                textShadow: phase === 1 ? "3px 0 #ff00c1, -3px 0 #00fff9" : "none",
              }}
            >
              CLASSIFIED
            </span>
          </motion.div>
        )}

        {/* Phase 2: ACCESS GRANTED */}
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono text-2xl font-bold text-[#00ff00] tracking-[0.3em]"
          >
            ACCESS GRANTED
          </motion.div>
        )}

        {/* Sub text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.4 }}
          className="font-mono text-xs text-red-400/60 tracking-widest uppercase"
        >
          {phase < 2 ? "RESTRICTED FILE — LEVEL 5 CLEARANCE REQUIRED" : "DECRYPTING SECURE DOCUMENT..."}
        </motion.div>
      </div>
    </motion.div>
  );
}

function ExportDossierButton({ filePath, title }: { filePath: string; title: string }) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = () => {
    if (exporting) return;
    setExporting(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setExporting(false);
            setProgress(0);
            
            // Trigger actual download
            const link = document.createElement("a");
            link.href = filePath;
            link.download = `${title.replace(/\s+/g, "_")}_Dossier.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }, 500);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className={`relative overflow-hidden flex items-center justify-center gap-2 w-full py-3 border rounded-xl font-mono text-xs uppercase tracking-widest transition-all ${
        exporting 
          ? "bg-[#00ff00]/10 border-[#00ff00]/40 text-[#00ff00]" 
          : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-white"
      }`}
    >
      {exporting ? (
        <>
          <div className="absolute left-0 top-0 bottom-0 bg-[#00ff00]/20 transition-all duration-200" style={{ width: `${Math.min(progress, 100)}%` }} />
          <div className="w-3 h-3 border-2 border-[#00ff00]/30 border-t-[#00ff00] rounded-full animate-spin relative z-10" />
          <span className="relative z-10">COMPILING {Math.min(progress, 100)}%</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          EXPORT DOSSIER
        </>
      )}
    </button>
  );
}
