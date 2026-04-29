"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Eye, EyeOff, Terminal, Lock, Zap, Scan } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const BOOT_LINES = [
  "INITIALIZING SECURE CONNECTION...",
  "BYPASSING FIREWALLS...",
  "LOADING ENCRYPTION AES-256-GCM...",
  "VERIFYING AGENT CLEARANCE...",
  "ACCESSING CLASSIFIED DATABASE...",
  "INTEL ARCHIVE SYSTEM ONLINE.",
];

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootDone, setBootDone] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setBootLines((prev) => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootDone(true), 400);
      }
    }, 320);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("ACCESS DENIED — INVALID CREDENTIALS");
      setGlitch(true);
      setTimeout(() => setGlitch(false), 500);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    /* Full screen — no pt-16 since TopBar is hidden on this page via min-h-screen */
    <div className="min-h-screen bg-[#030303] flex items-center justify-center relative overflow-hidden -mt-16">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.4) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.15)_2px,rgba(0,0,0,0.15)_4px)]" />
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ff00]/[0.04] rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 w-full max-w-md px-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div animate={glitch ? { x: [-2, 2, -1, 0], skewX: [-1, 1, 0] } : {}} transition={{ duration: 0.12 }}>
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute -inset-3 bg-[#00ff00]/15 blur-xl rounded-full" />
                <div className="relative z-10 w-16 h-16 border border-[#00ff00]/30 rounded-full flex items-center justify-center bg-black/60">
                  <ShieldAlert className="w-8 h-8 text-[#00ff00]" />
                </div>
              </div>
            </div>
            <h1 className="font-mono text-3xl font-black tracking-tighter text-white">INTEL ARCHIVE</h1>
            <p className="font-mono text-[10px] text-[#00ff00]/50 mt-1 tracking-[0.3em] uppercase">
              Secure Access Terminal // Level 5
            </p>
          </motion.div>
        </div>

        {/* Terminal Boot — fixed height so it doesn't push content */}
        <div className="mb-6 bg-black/70 border border-[#00ff00]/20 rounded-xl p-4 font-mono text-xs h-[130px] overflow-hidden relative">
          <div className="absolute top-2 left-3 flex items-center gap-1.5 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#00ff00]/60" />
            <span className="ml-2 text-white/20 text-[9px]">TERMINAL v2.4</span>
          </div>
          <div className="mt-5 space-y-1">
            {bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-[#00ff00]/60">›</span>
                <span className="text-[#00ff00]/80">{line}</span>
              </motion.div>
            ))}
            {bootDone && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <span className="text-[#00ff00]/60">›</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.7 }}
                  className="inline-block w-1.5 h-3 bg-[#00ff00]"
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Form */}
        <AnimatePresence>
          {bootDone && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-2">
                    Agent Identifier
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@intel.gov"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-2">
                    Access Key
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/10 transition-all pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-center gap-2"
                    >
                      <Lock className="w-3 h-3 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 hover:border-[#00ff00]/60 text-[#00ff00] font-mono text-sm py-3.5 rounded-xl transition-all uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="relative flex items-center justify-center w-5 h-5 overflow-hidden">
                        <Scan className="w-5 h-5 text-[#00ff00] absolute" />
                        <motion.div 
                          animate={{ y: ["-100%", "100%"] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          className="w-full h-0.5 bg-[#00ff00] absolute shadow-[0_0_8px_#00ff00]"
                        />
                      </div>
                      BIOMETRIC SCAN...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      REQUEST ACCESS
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-white/5 font-mono text-[9px] text-white/20 text-center tracking-widest uppercase">
                Unauthorized access is a federal offense — 18 U.S.C. § 1030
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 text-center font-mono text-[9px] text-white/10 uppercase tracking-widest">
          SYS v2.4.0 // AES-256-GCM // CLEARANCE: LEVEL 5
        </div>
      </motion.div>
    </div>
  );
}
