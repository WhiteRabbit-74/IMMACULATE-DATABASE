"use client";

import { motion } from "framer-motion";
import { Terminal, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <div className="relative py-20 px-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-accent animate-scanline" />
      </div>

      <div className="max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-[1px] w-12 bg-accent/50" />
          <span className="font-mono text-xs tracking-widest text-accent uppercase">
            Access Authorized // Protocol 7-Delta
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 glitch-text leading-none"
        >
          CLASSIFIED<br />
          DATABASE
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <div className="space-y-6">
            <p className="text-white/60 text-lg leading-relaxed font-light">
              Secured intelligence repository containing declassified and classified assets from global security agencies. 
              Unauthorized access is strictly prohibited and monitored by system protocols.
            </p>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 font-mono text-[10px] text-accent/80 bg-accent/5 px-3 py-1.5 rounded border border-accent/20">
                <ShieldCheck className="w-3 h-3" />
                ENCRYPTED_CONNECTION
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-white/40">
                <Terminal className="w-3 h-3" />
                SESSION_TOKEN: {Math.random().toString(36).substring(7).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-lg border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="font-mono text-xs text-white/40 mb-4 uppercase tracking-widest">Archive_Statistics</h3>
            <div className="space-y-4 font-mono">
              <div className="flex justify-between items-end">
                <span className="text-xs text-white/60 italic">Total_Assets</span>
                <span className="text-2xl font-bold text-accent">12,842</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1.5, delay: 0.6 }}
                  className="h-full bg-accent"
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/40">
                <span>INDEXING_COMPLETE</span>
                <span>75% CAPACITY</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
