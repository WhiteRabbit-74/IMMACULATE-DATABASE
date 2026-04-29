"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, Database, Cpu, HardDrive, Key, Loader2, Power } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LegacyOSPage() {
  const router = useRouter();
  const [booting, setBooting] = useState(true);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const [powerOn, setPowerOn] = useState(true);

  const BOOT_SEQUENCE = [
    "INTEL-ARCHIVE-SYSTEM v4.20 (c) 1982",
    "INITIALIZING KERNEL...",
    "RAM TEST: 640KB OK",
    "LOADING DISK CONTROLLER...",
    "ESTABLISHING MJ-12 SECURE LINK...",
    "ACCESS GRANTED: ADMIN_01",
    "READY_FOR_INPUT",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_SEQUENCE.length) {
        setTerminalLines(prev => [...prev, BOOT_SEQUENCE[i]]);
        i++;
      } else {
        clearInterval(interval);
        setBooting(false);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.toLowerCase().trim();
    setTerminalLines(prev => [...prev, `> ${command}`]);
    
    if (cmd === "help") {
      setTerminalLines(prev => [...prev, "AVAILABLE COMMANDS: DIR, READ, SCAN, STATUS, LOGOUT, CLEAR, REBOOT"]);
    } else if (cmd === "dir") {
      setTerminalLines(prev => [...prev, "DIRECTORY OF C:\\ARCHIVE", "1947_ROSWELL.PDF", "1954_TWINING.MEMO", "GATEWAY_PROTOCOL.DOC", "MJ12_ROSTER.BIN"]);
    } else if (cmd === "status") {
      setTerminalLines(prev => [...prev, "SYSTEM: STABLE", "NODES: 12 ACTIVE", "UPLINK: ENCRYPTED"]);
    } else if (cmd === "logout") {
       router.push("/admin");
    } else if (cmd === "clear") {
       setTerminalLines(["READY_FOR_INPUT"]);
    } else if (cmd === "reboot") {
       window.location.reload();
    } else {
      setTerminalLines(prev => [...prev, `UNKNOWN COMMAND: ${cmd}`]);
    }
    setCommand("");
  };

  if (!powerOn) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
         <button onClick={() => setPowerOn(true)} className="p-4 rounded-full border border-green-500/20 text-green-500/20 hover:text-green-500 transition-all">
            <Power className="w-12 h-12" />
         </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#001100] font-mono text-[#00ff00] overflow-hidden flex flex-col p-8 selection:bg-[#00ff00] selection:text-black">
      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      
      {/* Screen Glitch */}
      <div className="absolute inset-0 pointer-events-none z-40 opacity-[0.03] bg-[url('https://media.giphy.com/media/oEI9uWUic9V3W/giphy.gif')] bg-cover" />

      <div className="relative z-10 flex flex-col h-full max-w-5xl mx-auto w-full border-4 border-[#004400] bg-black p-10 shadow-[0_0_50px_rgba(0,255,0,0.1)]">
        
        {/* Top HUD */}
        <div className="flex justify-between items-center border-b-2 border-[#004400] pb-6 mb-8">
           <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 animate-pulse" />
              <div>
                 <div className="text-xl font-bold tracking-tighter">MAJESTIC_OS // v4.2</div>
                 <div className="text-[10px] opacity-50">DEPARTMENT OF DEFENSE // TOP SECRET</div>
              </div>
           </div>
           <div className="text-right flex items-center gap-6">
              <div className="hidden md:block">
                 <div className="text-[10px] opacity-50">CPU_TEMP: 42C</div>
                 <div className="text-[10px] opacity-50">DISK_IO: OK</div>
              </div>
              <button onClick={() => setPowerOn(false)} className="hover:text-red-500 transition-colors">
                 <Power className="w-5 h-5" />
              </button>
           </div>
        </div>

        {/* Terminal Area */}
        <div className="flex-grow overflow-y-auto scrollbar-hide space-y-1 mb-8">
           {terminalLines.map((line, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, x: -10 }} 
               animate={{ opacity: 1, x: 0 }} 
               transition={{ duration: 0.1 }}
               className="text-sm"
             >
               {line}
             </motion.div>
           ))}
           {booting && (
             <div className="flex items-center gap-2 mt-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs uppercase italic">Executing_Sequence...</span>
             </div>
           )}
        </div>

        {/* Command Input */}
        {!booting && (
          <form onSubmit={handleCommand} className="flex items-center gap-3 pt-6 border-t-2 border-[#004400]">
             <span className="text-xl font-black">{">"}</span>
             <input 
               type="text" 
               autoFocus
               value={command}
               onChange={(e) => setCommand(e.target.value)}
               className="bg-transparent border-none outline-none flex-grow text-xl font-mono text-[#00ff00] placeholder:text-[#004400]"
               placeholder="ENTER COMMAND (HELP FOR LIST)..."
             />
          </form>
        )}

        {/* Bottom Bar */}
        <div className="mt-8 flex justify-between text-[10px] opacity-30 uppercase tracking-widest">
           <div className="flex gap-4">
              <span>Memory: 640kb</span>
              <span>Bus: 8-bit</span>
           </div>
           <span>INTEL_GW_NODE_47</span>
        </div>
      </div>
    </div>
  );
}
