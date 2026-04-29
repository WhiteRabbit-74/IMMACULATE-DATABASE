"use client";

import { useStore } from "@/store/useStore";
import {
  Search, ShieldAlert, Terminal, Lock, Menu, X,
  Globe, AlertTriangle, BookOpen, Star, ChevronDown,
  Network, DollarSign, Target, Cpu, Dna, Zap
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/documents", label: "Archive" },
  { href: "/media", label: "Media" },
  { href: "/timeline", label: "Timeline" },
  { href: "/uap", label: "UAP / UFO", icon: Target },
  { href: "/projects", label: "Projects", icon: BookOpen },
  { href: "/nexus", label: "Nexus", icon: Network },
  { href: "/black-budget", label: "Black Budget", icon: DollarSign },
  { href: "/mj12", label: "MJ-12", icon: Star },
  { href: "/ebe", label: "E.B.E", icon: Dna },
  { href: "/advanced-intel", label: "Advanced Intel", icon: Zap },
  { href: "/forensics", label: "Forensics", icon: Cpu },
];

const DEFCON_LEVELS = [
  { level: 5, color: "#00ff00", label: "DEF 5" },
  { level: 4, color: "#00aaff", label: "DEF 4" },
  { level: 3, color: "#ffaa00", label: "DEF 3" },
  { level: 2, color: "#ff6600", label: "DEF 2" },
  { level: 1, color: "#ff0000", label: "DEF 1" },
];

const TERMINAL_LINES = [
  "> SYSTEM ONLINE...",
  "> CLEARANCE: TOP SECRET",
  "> ARCHIVE v2.4.0 ACTIVE",
  "> ENCRYPTED CHANNEL OPEN",
  "> MONITORING 47 NODES...",
];

export function TopBar() {
  const { setSearchQuery, isTerminalVisible, toggleTerminal } = useStore();
  const [currentTime, setCurrentTime] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<string[]>(TERMINAL_LINES.slice(0, 3));
  const [defcon] = useState(4);
  const { data: session } = useSession();
  const pathname = usePathname();
  const terminalRef = useRef<HTMLDivElement>(null);

  const defconInfo = DEFCON_LEVELS.find((d) => d.level === defcon)!;

  const [agentIp, setAgentIp] = useState("0.0.0.0");

  useEffect(() => {
    setAgentIp(`192.168.4.${Math.floor(Math.random() * 89) + 10}`);
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close terminal when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (terminalRef.current && !terminalRef.current.contains(e.target as Node)) {
        setTerminalOpen(false);
      }
    };
    if (terminalOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [terminalOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="h-16 border-b border-white/10 bg-black/70 backdrop-blur-xl fixed top-0 w-full z-50 flex items-center justify-between px-4 gap-2">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 shrink-0">
        <div className="relative">
          <div className="absolute -inset-1.5 bg-[#00ff00]/20 blur-lg rounded-full" />
          <ShieldAlert className="w-5 h-5 text-[#00ff00] relative z-10" />
        </div>
        <div className="hidden sm:flex flex-col leading-none">
          <span className="font-mono text-[8px] text-[#00ff00]/50 tracking-widest uppercase">TOP SECRET</span>
          <span className="font-mono font-bold text-sm tracking-tighter">INTEL ARCHIVE</span>
        </div>
      </Link>

      {/* Nav (desktop) */}
      <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center overflow-x-auto">
        {NAV_LINKS.map((link) => {
          const Icon = (link as any).icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 whitespace-nowrap ${
                active
                  ? "text-[#00ff00] bg-[#00ff00]/10 border border-[#00ff00]/20"
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              {Icon && <Icon className="w-3 h-3 shrink-0" />}
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search */}
        <div className="hidden lg:block relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 group-focus-within:text-[#00ff00] transition-colors" />
          <input
            type="text"
            placeholder="SEARCH..."
            className="w-36 bg-white/5 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 font-mono text-xs focus:outline-none focus:border-[#00ff00]/50 focus:w-48 transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* DEFCON */}
        <div
          className="hidden md:flex items-center gap-1.5 bg-black/40 border border-white/5 rounded-lg px-2 py-1"
          title={`DEFCON ${defcon}`}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: defconInfo.color, boxShadow: `0 0 5px ${defconInfo.color}` }}
          />
          <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: defconInfo.color }}>
            {defconInfo.label}
          </span>
        </div>

        {/* Spoof IP & Identity */}
        <div className="hidden lg:flex flex-col items-end leading-none cursor-pointer group"
          onClick={() => {
            const newIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            setAgentIp(newIp);
          }}
        >
          <span className="font-mono text-[7px] text-white/20 tracking-widest group-hover:text-[#00ff00] transition-colors">SPOOFED_IP</span>
          <span className="font-mono text-[10px] text-white/60 tracking-widest tabular-nums group-hover:text-[#00ff00] transition-colors">
            {agentIp}
          </span>
        </div>

        {/* Mobile */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden p-2 hover:bg-white/5 rounded-lg">
          {mobileOpen ? <X className="w-4 h-4 text-white/60" /> : <Menu className="w-4 h-4 text-white/60" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-4 xl:hidden"
          >
            <div className="grid grid-cols-2 gap-1">
              {NAV_LINKS.map((link) => {
                const Icon = (link as any).icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 font-mono text-xs py-2 px-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 uppercase tracking-widest"
                  >
                    {Icon && <Icon className="w-3 h-3" />}
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-2 pt-2 border-t border-white/5">
              {session?.user?.role === "ADMIN" ? (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 font-mono text-xs py-2 px-3 rounded-lg text-red-400 uppercase tracking-widest hover:bg-red-500/10">
                  <Lock className="w-3 h-3" /> Admin Panel
                </Link>
              ) : (
                <Link href="/auth/signin" onClick={() => setMobileOpen(false)} className="block font-mono text-xs py-2 px-3 rounded-lg text-[#00ff00] uppercase tracking-widest">
                  SYS_LOGIN
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
