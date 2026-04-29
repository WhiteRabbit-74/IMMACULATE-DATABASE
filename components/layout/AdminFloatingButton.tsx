"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ShieldAlert, Terminal, Lock, User, LogOut, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { signOut } from "next-auth/react";

export function AdminFloatingButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) {
    return (
      <Link
        href="/auth/signin"
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-6 py-3 bg-[#00ff00] text-black font-mono text-xs font-black rounded-full shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest group"
      >
        <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        SYS_LOGIN
      </Link>
    );
  }

  const isAdmin = (session.user as any)?.role === "ADMIN" || session.user.email === "admin@intel.gov";

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-4 w-64 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,0,0.05)_0%,transparent_100%)]" />
            
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                   <User className="w-4 h-4 text-white/40" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-white font-bold truncate max-w-[140px]">{session.user.name || "Agent"}</span>
                   <span className="text-[8px] text-[#00ff00] font-mono uppercase tracking-widest">{isAdmin ? "Clearance: LEVEL 5" : "Clearance: LEVEL 1"}</span>
                </div>
              </div>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 w-full p-3 bg-[#00ff00]/10 border border-[#00ff00]/20 rounded-xl text-[#00ff00] hover:bg-[#00ff00]/20 transition-all group"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest">ADMIN_DASHBOARD</span>
                </Link>
              )}

              <Link
                href="/admin/media"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                <Terminal className="w-4 h-4" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">AGENT_WORKSPACE</span>
              </Link>

              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="flex items-center gap-3 w-full p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest">TERMINATE_SESSION</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs font-black shadow-2xl transition-all uppercase tracking-widest hover:scale-105 active:scale-95 border ${
          isOpen 
            ? "bg-white text-black border-white" 
            : "bg-black/80 text-white border-white/20 backdrop-blur-xl"
        }`}
      >
        <div className={`w-2 h-2 rounded-full animate-pulse ${isAdmin ? "bg-red-500" : "bg-[#00ff00]"}`} />
        {isOpen ? "CLOSE_MENU" : (isAdmin ? "ADMIN_DESK" : "AGENT_DESK")}
      </button>
    </div>
  );
}
