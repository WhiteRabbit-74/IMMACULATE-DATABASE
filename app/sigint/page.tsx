"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Zap, Activity, Terminal, Wifi, Volume2 } from "lucide-react";

// Simulated SIGINT intercepts
const INTERCEPT_TEMPLATES = [
  "FREQ {freq} MHz // ENCRYPTION: AES-{bits} // ORIGIN: {origin} // PRIORITY: {priority}",
  "SIGNAL BURST DETECTED — LAT {lat} LON {lon} — DURATION {dur}s",
  "ANOMALOUS TRANSMISSION — CARRIER WAVE MODULATION DETECTED — {agency}",
  "ENCRYPTED PACKET STREAM [{id}] — DECRYPTION PENDING — CLEARANCE REQ: LEVEL {level}",
  "UFO TELEMETRY SIGNAL — VELOCITY {vel}kts ALT {alt}ft — UNIDENTIFIED",
  "HF INTERCEPT {freq}kHz — MSG FRAGMENT: '{frag}'",
  "SATELLITE UPLINK DETECTED — TLE MISMATCH — UNAUTHORIZED TRANSMITTER",
  "BURST TRANSMISSION — DURATION 0.{ms}ms — BANDWIDTH {bw}MHz — CLASSIFIED",
];

const ORIGINS = ["SIBERIA", "NEVADA", "ANTARCTICA", "PACIFIC-BASIN", "MIDDLE-EAST", "UNKNOWN"];
const AGENCIES = ["NSA", "GCHQ", "FSB", "PLA-SSF", "UNKNOWN-ACTOR"];
const FRAGS = [
  "...CONTACT ESTABLISHED...",
  "...AWAIT EXTRACTION...",
  "...PATTERN ALPHA-7...",
  "...COORDINATES FOLLOW...",
  "...DO NOT ACKNOWLEDGE...",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateIntercept(): string {
  const template = randomFrom(INTERCEPT_TEMPLATES);
  return template
    .replace("{freq}", (Math.random() * 30000 + 1000).toFixed(2))
    .replace("{bits}", randomFrom(["128", "192", "256"]))
    .replace("{origin}", randomFrom(ORIGINS))
    .replace("{priority}", randomFrom(["FLASH", "URGENT", "ROUTINE", "PRIORITY"]))
    .replace("{lat}", (Math.random() * 180 - 90).toFixed(4))
    .replace("{lon}", (Math.random() * 360 - 180).toFixed(4))
    .replace("{dur}", Math.floor(Math.random() * 60 + 1).toString())
    .replace("{agency}", randomFrom(AGENCIES))
    .replace("{id}", Math.random().toString(36).substring(2, 10).toUpperCase())
    .replace("{level}", Math.floor(Math.random() * 5 + 1).toString())
    .replace("{vel}", Math.floor(Math.random() * 10000 + 500).toString())
    .replace("{alt}", Math.floor(Math.random() * 80000 + 1000).toString())
    .replace("{ms}", Math.floor(Math.random() * 999).toString())
    .replace("{bw}", (Math.random() * 100 + 1).toFixed(1))
    .replace("{frag}", randomFrom(FRAGS));
}

// Morse code encoder
const MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
  I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
  Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  " ": "/",
};

function toMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((c) => MORSE[c] || "")
    .join(" ");
}

interface Intercept {
  id: string;
  text: string;
  time: string;
  priority: string;
}

export default function SigintPage() {
  const [intercepts, setIntercepts] = useState<Intercept[]>([]);
  const [morseInput, setMorseInput] = useState("");
  const [morseOutput, setMorseOutput] = useState("");
  const [freqBars, setFreqBars] = useState<number[]>(Array(64).fill(0));
  const feedRef = useRef<HTMLDivElement>(null);

  // Generate intercepts
  useEffect(() => {
    const addIntercept = () => {
      const newIntercept: Intercept = {
        id: Math.random().toString(36).slice(2),
        text: generateIntercept(),
        time: new Date().toISOString().split("T")[1].slice(0, 8),
        priority: randomFrom(["FLASH", "URGENT", "ROUTINE", "PRIORITY"]),
      };
      setIntercepts((prev) => [newIntercept, ...prev.slice(0, 49)]);
    };

    addIntercept();
    const interval = setInterval(addIntercept, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll feed
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [intercepts.length]);

  // Frequency bars animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFreqBars((prev) =>
        prev.map(() => Math.random() * 100)
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const priorityColor: Record<string, string> = {
    FLASH: "#ff0000",
    URGENT: "#ff8800",
    PRIORITY: "#ffff00",
    ROUTINE: "#00ff00",
  };

  return (
    <div className="min-h-screen pt-16 bg-[#030303]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">
              <Radio className="w-3.5 h-3.5 text-[#00ff00] animate-pulse" />
              NSA // SIGNALS INTELLIGENCE DIVISION
            </div>
            <h1 className="font-mono text-3xl font-black text-white tracking-tight">
              SIGINT DASHBOARD
            </h1>
            <p className="font-mono text-xs text-white/40 mt-1">
              Live intercept feed — {intercepts.length} signals captured this session
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#00ff00]/5 border border-[#00ff00]/20 rounded-lg px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
            <span className="font-mono text-xs text-[#00ff00]">UPLINK ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Frequency Spectrum Analyzer */}
            <div className="bg-black/60 border border-[#00ff00]/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-xs text-[#00ff00] uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  SPECTRUM ANALYZER // 0–30 GHz
                </div>
                <div className="font-mono text-[9px] text-white/30">REAL-TIME</div>
              </div>
              <div className="flex items-end gap-0.5 h-24">
                {freqBars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all duration-100"
                    style={{
                      height: `${h}%`,
                      backgroundColor: h > 80 ? "#ff3333" : h > 60 ? "#ffaa00" : "#00ff00",
                      opacity: 0.7 + (h / 100) * 0.3,
                      boxShadow: h > 70 ? `0 0 4px currentColor` : "none",
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between font-mono text-[9px] text-white/20 mt-1">
                <span>0 Hz</span>
                <span>10 GHz</span>
                <span>20 GHz</span>
                <span>30 GHz</span>
              </div>
            </div>

            {/* Intercept Feed */}
            <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
                <Wifi className="w-4 h-4 text-[#00ff00]" />
                <span className="font-mono text-xs text-white uppercase tracking-widest">
                  LIVE INTERCEPT FEED
                </span>
              </div>
              <div
                ref={feedRef}
                className="h-96 overflow-y-auto p-4 space-y-2 font-mono text-xs scrollbar-thin"
              >
                <AnimatePresence>
                  {intercepts.map((intercept) => (
                    <motion.div
                      key={intercept.id}
                      initial={{ opacity: 0, x: -10, backgroundColor: "rgba(0,255,0,0.1)" }}
                      animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
                      className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0"
                    >
                      <span className="text-white/20 shrink-0">{intercept.time}</span>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded shrink-0 font-bold"
                        style={{
                          color: priorityColor[intercept.priority] || "#ffffff",
                          backgroundColor: `${priorityColor[intercept.priority]}15`,
                          border: `1px solid ${priorityColor[intercept.priority]}30`,
                        }}
                      >
                        {intercept.priority}
                      </span>
                      <span className="text-white/60 leading-relaxed">{intercept.text}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Morse Decoder */}
            <div className="bg-black/60 border border-amber-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
                  MORSE CODE ENCODER
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1.5">
                    Input Text
                  </label>
                  <input
                    value={morseInput}
                    onChange={(e) => {
                      setMorseInput(e.target.value);
                      setMorseOutput(toMorse(e.target.value));
                    }}
                    placeholder="TYPE TO ENCODE..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1.5">
                    Morse Output
                  </label>
                  <div className="bg-black/60 border border-white/5 rounded-lg px-3 py-3 font-mono text-xs text-amber-400 min-h-[60px] break-all leading-relaxed">
                    {morseOutput || (
                      <span className="text-white/20">-- --- .-. ... .</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Signal Stats */}
            <div className="bg-black/60 border border-white/10 rounded-2xl p-6">
              <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">
                Session Statistics
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "INTERCEPTS", value: intercepts.length, color: "#00ff00" },
                  {
                    label: "FLASH",
                    value: intercepts.filter((i: Intercept) => i.priority === "FLASH").length,
                    color: "#ff3333",
                  },
                  {
                    label: "URGENT",
                    value: intercepts.filter((i: Intercept) => i.priority === "URGENT").length,
                    color: "#ff8800",
                  },
                  {
                    label: "ENCRYPTED",
                    value: Math.floor(intercepts.length * 0.7),
                    color: "#0088ff",
                  },
                ].map((stat: any) => (
                  <div
                    key={stat.label}
                    className="bg-white/5 rounded-xl p-3 border border-white/5"
                  >
                    <div className="font-mono text-[9px] text-white/30 tracking-widest mb-1">
                      {stat.label}
                    </div>
                    <div
                      className="font-mono text-2xl font-black"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Command Hint */}
            <div className="bg-black/60 border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-3.5 h-3.5 text-white/30" />
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  Terminal Commands
                </span>
              </div>
              <div className="space-y-2 font-mono text-[10px]">
                {[
                  "scan --frequency 14.250",
                  "decode --protocol AES256",
                  "locate --signal BURST",
                  "access --doc [ID]",
                  "trace --origin UNKNOWN",
                ].map((cmd) => (
                  <div key={cmd} className="flex items-center gap-2 text-white/40">
                    <span className="text-[#00ff00]/60">$</span>
                    <span>{cmd}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
