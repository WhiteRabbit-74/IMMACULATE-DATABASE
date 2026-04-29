"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  Image as ImageIcon,
  Cpu,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Agency {
  id: string;
  name: string;
  colorPrimary: string;
}

type CoverMode = "manual" | "auto" | "ai";
type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function UploadPage() {
  const router = useRouter();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverMode, setCoverMode] = useState<CoverMode>("auto");
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    year: new Date().getFullYear().toString(),
    agencyId: "",
    status: "classified",
    tags: "",
    latitude: "",
    longitude: "",
    country: "",
  });

  useEffect(() => {
    fetch("/api/agencies")
      .then((r) => r.json())
      .then(setAgencies)
      .catch(() => {});
  }, []);

  // PDF dropzone
  const onDropPdf = useCallback((accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    if (!file.type.includes("pdf")) {
      setErrorMsg("Only PDF files are accepted");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg("File must be under 20MB");
      return;
    }
    setPdfFile(file);
    setPdfPreviewUrl(URL.createObjectURL(file));
    setErrorMsg("");
    if (coverMode === "auto") {
      generateAutoCover(file);
    }
  }, [coverMode]);

  const { getRootProps: getPdfProps, getInputProps: getPdfInput, isDragActive: pdfDrag } =
    useDropzone({ onDrop: onDropPdf, accept: { "application/pdf": [".pdf"] }, maxFiles: 1 });

  // Cover dropzone
  const onDropCover = useCallback((accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreviewUrl(URL.createObjectURL(file));
  }, []);

  const { getRootProps: getCoverProps, getInputProps: getCoverInput, isDragActive: coverDrag } =
    useDropzone({
      onDrop: onDropCover,
      accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
      maxFiles: 1,
    });

  // Auto-generate cover from PDF first page using pdfjs
  const generateAutoCover = async (file: File) => {
    try {
      const pdfjsLib = (await import("pdfjs-dist")).default;
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;

      await page.render({ canvasContext: ctx, viewport }).promise;
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCoverPreviewUrl(dataUrl);
    } catch (e) {
      console.error("Cover generation failed:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !form.title || !form.agencyId) {
      setErrorMsg("PDF file, title, and agency are required.");
      return;
    }

    setStatus("uploading");

    const fd = new FormData();
    fd.append("file", pdfFile);
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("year", form.year);
    fd.append("agencyId", form.agencyId);
    fd.append("status", form.status);
    fd.append("tags", form.tags);
    fd.append("latitude", form.latitude);
    fd.append("longitude", form.longitude);
    fd.append("country", form.country);
    fd.append("coverMode", coverMode);

    if (coverMode === "manual" && coverFile) {
      fd.append("cover", coverFile);
    } else if (coverMode === "auto" && coverPreviewUrl?.startsWith("data:")) {
      // Convert canvas data URL to blob and append
      const res = await fetch(coverPreviewUrl);
      const blob = await res.blob();
      fd.append("cover", blob, "auto-cover.jpg");
      fd.append("coverMode", "manual"); // treat as manual upload on server
    }

    try {
      console.log("[UPLOAD_INIT] Sending to API...");
      const res = await fetch("/api/documents/upload", { method: "POST", body: fd });
      const data = await res.json();
      
      if (!res.ok) {
        console.error("[UPLOAD_FAIL]", data);
        throw new Error(data.error || "Upload failed");
      }
      
      console.log("[UPLOAD_SUCCESS]", data);
      setStatus("success");
      setTimeout(() => router.push("/admin/documents"), 1500);
    } catch (err: any) {
      console.error("[UPLOAD_ERROR]", err);
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-white tracking-tight">UPLOAD DOCUMENT</h1>
        <p className="font-mono text-xs text-white/40 mt-1 uppercase tracking-widest">
          Secure File Ingestion // Protocol 7-Delta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PDF Drop Zone */}
        <div
          {...getPdfProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            pdfDrag
              ? "border-[#00ff00] bg-[#00ff00]/5"
              : pdfFile
              ? "border-[#00ff00]/40 bg-[#00ff00]/5"
              : "border-white/10 hover:border-white/30 bg-white/5"
          }`}
        >
          <input {...getPdfInput()} />
          <AnimatePresence mode="wait">
            {pdfFile ? (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-4"
              >
                <FileText className="w-8 h-8 text-[#00ff00]" />
                <div className="text-left">
                  <div className="font-mono text-sm text-white">{pdfFile.name}</div>
                  <div className="font-mono text-[10px] text-white/40">
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB // PDF
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPdfFile(null);
                    setPdfPreviewUrl(null);
                    setCoverPreviewUrl(null);
                  }}
                  className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Upload className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="font-mono text-sm text-white/40">
                  DROP PDF HERE or <span className="text-[#00ff00]">BROWSE</span>
                </p>
                <p className="font-mono text-[10px] text-white/20 mt-1">Max 20MB // PDF only</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cover Mode Selector */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">
            Cover Image Mode
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(["manual", "auto", "ai"] as CoverMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setCoverMode(mode);
                  if (mode === "auto" && pdfFile) generateAutoCover(pdfFile);
                }}
                className={`p-3 rounded-lg border font-mono text-xs uppercase tracking-wider transition-all ${
                  coverMode === mode
                    ? "border-[#00ff00]/50 bg-[#00ff00]/10 text-[#00ff00]"
                    : "border-white/10 text-white/40 hover:border-white/20"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {mode === "manual" ? (
                    <ImageIcon className="w-5 h-5" />
                  ) : mode === "auto" ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <Cpu className="w-5 h-5" />
                  )}
                  <span>
                    {mode === "manual" ? "Manual Upload" : mode === "auto" ? "Auto (PDF p.1)" : "AI Generate"}
                  </span>
                  {mode === "ai" && (
                    <span className="text-[8px] text-white/20">(COMING SOON)</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {coverMode === "manual" && (
            <div
              {...getCoverProps()}
              className={`mt-4 border border-dashed rounded-lg p-4 cursor-pointer transition-all ${
                coverDrag ? "border-[#00ff00]" : "border-white/10 hover:border-white/20"
              }`}
            >
              <input {...getCoverInput()} />
              {coverPreviewUrl ? (
                <div className="flex items-center gap-3">
                  <img src={coverPreviewUrl} alt="Cover" className="w-16 h-20 object-cover rounded" />
                  <div className="font-mono text-xs text-white/60">{coverFile?.name}</div>
                </div>
              ) : (
                <p className="font-mono text-xs text-white/30 text-center">
                  Drop cover image here
                </p>
              )}
            </div>
          )}

          {coverMode === "auto" && coverPreviewUrl && (
            <div className="mt-4 flex items-center gap-3">
              <img src={coverPreviewUrl} alt="Auto cover" className="w-16 h-20 object-cover rounded border border-white/10" />
              <div className="font-mono text-xs text-white/60">Auto-generated from page 1</div>
            </div>
          )}
        </div>

        {/* Hidden canvas for PDF rendering */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">
              Document Title *
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              placeholder="OPERATION BLUE BOOK..."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/20 transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Brief summary of document contents..."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">
              Year *
            </label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              required
              min="1900"
              max="2099"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/20 transition-all"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">
              Agency *
            </label>
            <div className="relative">
              <select
                value={form.agencyId}
                onChange={(e) => setForm((f) => ({ ...f, agencyId: e.target.value }))}
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/20 transition-all appearance-none"
              >
                <option value="">Select agency...</option>
                {agencies.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">
              Classification Status *
            </label>
            <div className="relative">
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/20 transition-all appearance-none"
              >
                <option value="classified">CLASSIFIED</option>
                <option value="declassified">DECLASSIFIED</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">
              Tags (comma-separated)
            </label>
            <input
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="ufo, surveillance, cold-war"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/20 transition-all"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
              placeholder="e.g. 38.8977"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/20 transition-all"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
              placeholder="e.g. -77.0365"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/20 transition-all"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">
              Country
            </label>
            <input
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              placeholder="USA, Brazil, etc."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/20 transition-all"
            />
          </div>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 font-mono text-xs">
            <AlertCircle className="w-4 h-4" />
            {errorMsg}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "uploading" || status === "success"}
          className="w-full py-3.5 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 hover:border-[#00ff00]/60 text-[#00ff00] font-mono text-sm rounded-xl uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === "uploading" ? (
            <>
              <div className="w-4 h-4 border-2 border-[#00ff00]/30 border-t-[#00ff00] rounded-full animate-spin" />
              UPLOADING TO ARCHIVE...
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              UPLOAD COMPLETE — REDIRECTING...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              SUBMIT TO ARCHIVE
            </>
          )}
        </button>
      </form>
    </div>
  );
}
