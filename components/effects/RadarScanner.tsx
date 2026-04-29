"use client";

import React from "react";
import { motion } from "framer-motion";

export const RadarScanner = () => {
  return (
    <div className="relative w-40 h-40 rounded-full border border-[#00ff00]/20 bg-black overflow-hidden shadow-[0_0_20px_rgba(0,255,0,0.1)]">
      {/* Grid circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[80%] h-[80%] rounded-full border border-[#00ff00]/10" />
        <div className="w-[60%] h-[60%] rounded-full border border-[#00ff00]/10" />
        <div className="w-[40%] h-[40%] rounded-full border border-[#00ff00]/10" />
        <div className="w-[20%] h-[20%] rounded-full border border-[#00ff00]/10" />
      </div>
      
      {/* Crosshair */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#00ff00]/20" />
      <div className="absolute left-1/2 top-0 w-[1px] h-full bg-[#00ff00]/20" />
      
      {/* Sweeper */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-[150%] h-[150%] bg-[conic-gradient(from_0deg,#00ff0033_0%,transparent_20%)] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Random blips */}
      <Blip x={30} y={40} delay={1} />
      <Blip x={110} y={80} delay={2.5} />
      <Blip x={70} y={120} delay={0.5} />
      
      <div className="absolute bottom-2 left-0 w-full text-center font-mono text-[8px] text-[#00ff00]/40 uppercase tracking-[0.2em]">
        Scan_Active
      </div>
    </div>
  );
};

const Blip = ({ x, y, delay }: { x: number, y: number, delay: number }) => (
  <motion.div 
    className="absolute w-1.5 h-1.5 bg-[#00ff00] rounded-full shadow-[0_0_10px_#00ff00]"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0.5, 1.2, 0.5],
    }}
    transition={{ 
      duration: 4, 
      repeat: Infinity, 
      delay,
      times: [0, 0.1, 1]
    }}
  />
);
