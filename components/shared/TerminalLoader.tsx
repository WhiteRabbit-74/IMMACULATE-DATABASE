"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X } from "lucide-react";

const LINES = [
  "INIT CLASSIFIED PROTOCOLS...",
  "BYPASSING FIREWALLS...",
  "DECRYPTING ARCHIVES...",
  "SYSTEM READY.",
];

export function TerminalLoader() {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check session storage — only show once per session
    if (sessionStorage.getItem("terminal-shown")) {
      setVisible(false);
      setDismissed(true);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < LINES.length) {
        setLines((prev) => [...prev, LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        // Auto-dismiss after 1.5s when done
        setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem("terminal-shown", "1");
        }, 1500);
      }
    }, 380);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-5 left-5 z-[200] w-72 bg-black/90 backdrop-blur-xl border border-[#00ff00]/20 rounded-xl shadow-[0_0_20px_rgba(0,255,0,0.08)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#00ff00]/10">
            <div className="flex items-center gap-2">
              <Terminal className="w-3 h-3 text-[#00ff00]/60" />
              <span className="font-mono text-[9px] text-[#00ff00]/50 uppercase tracking-widest">
                SECURE TERMINAL
              </span>
            </div>
            <button
              onClick={() => { setVisible(false); sessionStorage.setItem("terminal-shown", "1"); }}
              className="text-white/20 hover:text-white/60 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Lines */}
          <div className="p-3 space-y-1 font-mono text-[10px]">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5"
              >
                <span className="text-[#00ff00]/50">›</span>
                <span className={done && i === lines.length - 1 ? "text-[#00ff00]" : "text-[#00ff00]/70"}>
                  {line}
                </span>
              </motion.div>
            ))}
            {!done && lines.length < LINES.length && (
              <div className="flex items-center gap-1.5">
                <span className="text-[#00ff00]/50">›</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="inline-block w-1 h-2.5 bg-[#00ff00]"
                />
              </div>
            )}
          </div>

          {/* Progress bar */}
          <motion.div
            className="h-0.5 bg-[#00ff00]/40"
            initial={{ width: "0%" }}
            animate={{ width: done ? "100%" : `${(lines.length / LINES.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
