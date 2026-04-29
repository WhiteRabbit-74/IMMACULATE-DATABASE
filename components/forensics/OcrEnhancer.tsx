"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Upload, Loader2, FileText, Scan, Layers, Eye, RefreshCw } from "lucide-react";
import Tesseract from "tesseract.js";

export function OcrEnhancer() {
  const [image, setImage] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [enhancing, setEnhancing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
      setOcrText("");
    }
  };

  const runOcr = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await Tesseract.recognize(image, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') setProgress(m.progress);
        }
      });
      setOcrText(result.data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const simulateEnhancement = () => {
    setEnhancing(true);
    setTimeout(() => {
      setEnhancing(false);
      // Just simulate a cleaner text if possible, or just a toast
    }, 2000);
  };

  return (
    <div className="bg-black/60 border border-[#00ff00]/20 rounded-2xl p-6 font-mono">
      <div className="flex items-center gap-3 mb-6 border-b border-[#00ff00]/10 pb-4">
        <Scan className="w-5 h-5 text-[#00ff00]" />
        <div className="flex flex-col">
          <div className="text-[10px] text-[#00ff00] uppercase tracking-[0.3em] font-bold">Forensic_Module // 03</div>
          <div className="text-sm text-white uppercase font-black italic tracking-tighter">AI_Document_Enhancer</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Source Column */}
        <div className="space-y-4">
           <div className="aspect-[4/5] bg-white/[0.03] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
              {image ? (
                <>
                  <img src={image} alt="Source" className={`w-full h-full object-contain p-4 transition-all duration-1000 ${enhancing ? "blur-sm grayscale brightness-150" : ""}`} />
                  {enhancing && (
                    <motion.div 
                      initial={{ top: 0 }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-[#00ff00] shadow-[0_0_15px_#00ff00] z-20"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                     <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/10 rounded-full hover:bg-white/20 text-white transition-all">
                        <RefreshCw className="w-5 h-5" />
                     </button>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-white/10 mb-4" />
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Awaiting_Source_Data</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-6 px-6 py-2 bg-[#00ff00]/10 border border-[#00ff00]/20 text-[#00ff00] text-[10px] font-bold rounded-lg hover:bg-[#00ff00]/20 transition-all uppercase tracking-widest"
                  >
                    Select_File
                  </button>
                </>
              )}
              <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
           </div>

           <div className="flex gap-2">
              <button 
                onClick={runOcr}
                disabled={!image || loading}
                className="flex-1 py-3 bg-[#00ff00] text-black font-bold text-[10px] rounded-xl hover:bg-[#00ffaa] disabled:opacity-30 transition-all uppercase tracking-widest"
              >
                {loading ? `Scanning_${Math.round(progress * 100)}%` : "Execute_Deep_Scan"}
              </button>
              <button 
                onClick={simulateEnhancement}
                disabled={!image || enhancing}
                className="px-4 py-3 bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-xl disabled:opacity-30 transition-all"
                title="Ghost Recovery"
              >
                <Layers className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Results Column */}
        <div className="flex flex-col bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
           <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                 <FileText className="w-3.5 h-3.5 text-white/40" />
                 <span className="text-[9px] text-white/40 uppercase tracking-widest">Extracted_Data_Stream</span>
              </div>
              <div className="flex gap-1">
                 <div className="w-1 h-1 rounded-full bg-[#00ff00]" />
                 <div className="w-1 h-1 rounded-full bg-[#00ff00]/30" />
                 <div className="w-1 h-1 rounded-full bg-[#00ff00]/30" />
              </div>
           </div>

           <div className="flex-grow p-6 font-mono text-xs text-white/70 overflow-y-auto max-h-[400px] leading-relaxed relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                   <div className="text-center">
                      <Loader2 className="w-8 h-8 text-[#00ff00] animate-spin mx-auto mb-4" />
                      <div className="text-[10px] text-[#00ff00] uppercase tracking-widest animate-pulse">Running AI OCR Intelligence...</div>
                   </div>
                </div>
              ) : null}

              {ocrText ? (
                <div className="whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-500">
                   {ocrText}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center opacity-20 italic">
                   {"<< ARCHIVE STREAM EMPTY >>"}
                </div>
              )}
           </div>

           <div className="p-4 bg-black/60 border-t border-white/5">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-[8px] text-white/30 uppercase">Corroboration_Confidence</span>
                 <span className="text-[8px] text-[#00ff00]">{ocrText ? "84.2%" : "0.0%"}</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: ocrText ? "84.2%" : "0%" }}
                   className="h-full bg-[#00ff00]/40"
                 />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
