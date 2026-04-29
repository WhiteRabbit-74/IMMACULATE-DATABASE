"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, FileText } from "lucide-react";

// Dynamically import pdfjs only on client
let pdfjs: any = null;

interface Props {
  filePath: string;
}

export default function PDFViewer({ filePath }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renderKey, setRenderKey] = useState(0);

  // For now we embed the PDF via iframe (universal compatibility)
  // This avoids pdfjs worker issues in Next.js
  const pdfUrl = filePath;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 bg-black/40">
        <FileText className="w-12 h-12 text-white/10" />
        <p className="font-mono text-xs text-white/30">{error}</p>
      </div>
    );
  }

  // Check if we can show a real PDF (file exists on server)
  const isSeedDoc = filePath.startsWith("/uploads/") && !filePath.includes("blob:");
  
  return (
    <div className="bg-black/40">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-white/30" />
          <span className="font-mono text-[10px] text-white/40 truncate max-w-[200px]">
            {filePath.split("/").pop()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-white"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[10px] text-white/40 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(3, s + 0.25))}
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-white"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale(1.0)}
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PDF Display */}
      <div className="relative overflow-auto" style={{ maxHeight: "70vh" }}>
        {isSeedDoc ? (
          // Seed documents don't have real files — show placeholder
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="w-16 h-20 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center">
              <FileText className="w-8 h-8 text-white/10" />
            </div>
            <p className="font-mono text-xs text-white/20 text-center">
              DOCUMENT FILE NOT FOUND ON DISK
            </p>
            <p className="font-mono text-[10px] text-white/10">
              Seed documents reference placeholder paths.
              <br />Upload a real PDF to view it here.
            </p>
          </div>
        ) : (
          <iframe
            key={`${filePath}-${scale}`}
            src={`${pdfUrl}#zoom=${Math.round(scale * 100)}`}
            className="w-full border-0"
            style={{
              height: `${Math.round(70 * scale)}vh`,
              minHeight: "400px",
            }}
            title="PDF Viewer"
          />
        )}
      </div>
    </div>
  );
}
