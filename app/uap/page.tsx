"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Search, 
  FileText, 
  ArrowRight, 
  Layers, 
  Info,
  ExternalLink,
  Target,
  Activity,
  Lock
} from "lucide-react";
import Link from "next/link";
import { GlitchTitle } from "@/components/effects/GlitchTitle";

const UAP_TYPES = [
  {
    id: "tic-tac",
    name: "Tic-Tac",
    characteristics: "Oblong, smooth, no visible flight surfaces, extreme acceleration.",
    incidents: ["USS Nimitz (2004)", "Aguadilla (2013)"],
    relatedProjects: ["aatip"],
    imageUrl: "/media/foto/UFO_UAP/tictac.png",
    docs: [
      { title: "Executive Summary: Nimitz Incident", url: "/documents/cln4p1mzo0004v6e8x8y9z0w1" },
      { title: "AATIP Briefing Slide 9", url: "/documents/cln4p1mzo0005v6e8x8y9z0w2" }
    ]
  },
  {
    id: "triangle",
    name: "Large Triangle",
    characteristics: "Dark, massive, silent, often with three lights at corners and one in center.",
    incidents: ["Phoenix Lights (1997)", "Belgium Wave (1989-1990)"],
    relatedProjects: ["aurora", "mj12"],
    imageUrl: "/media/foto/UFO_UAP/triangle.png",
    docs: [
      { title: "TR-3B Technical Analysis", url: "/documents/cln4p1mzo0006v6e8x8y9z0w3" },
      { title: "Governor Symington Statement", url: "/documents/cln4p1mzo0007v6e8x8y9z0w4" }
    ]
  },
  {
    id: "saucer",
    name: "Disc / Saucer",
    characteristics: "Circular or elliptical, metallic, rotating motion reported.",
    incidents: ["Roswell (1947)", "McMinnville (1950)"],
    relatedProjects: ["bluebook", "sign"],
    imageUrl: "/media/foto/UFO_UAP/disc.png",
    docs: [
      { title: "Roswell RAAF Press Release", url: "/documents/cln4p1mzo0008v6e8x8y9z0w5" },
      { title: "Blue Book Special Report 14", url: "/documents/cln4p1mzo0009v6e8x8y9z0w6" }
    ]
  },
  {
    id: "cigar",
    name: "Cigar / Cylindrical",
    characteristics: "Elongated, massive, often seen as 'mother-ships'.",
    incidents: ["Chiles-Whitted (1948)", "Solar Warden Sightings"],
    relatedProjects: ["solar-warden", "horizon"],
    imageUrl: "/media/foto/UFO_UAP/cigar.png",
    docs: [
      { title: "McKinnon File Dump: Non-Terrestrial Officers", url: "/documents/cln4p1mzo0010v6e8x8y9z0w7" },
      { title: "USAF Project Horizon Feasibility", url: "/documents/cln4p1mzo0011v6e8x8y9z0w8" }
    ]
  },
  {
    id: "sphere",
    name: "Sphere / Orb",
    characteristics: "Glowing, translucent or metallic spheres, often small in size.",
    incidents: ["Foo Fighters (1944)", "Mosul Orb (2016)"],
    relatedProjects: ["moon-dust", "pounce"],
    imageUrl: "/media/foto/UFO_UAP/orb.png",
    docs: [
      { title: "Intelligence Report: Foo Fighters (1945)", url: "/documents/cln4p1mzo0012v6e8x8y9z0w9" },
      { title: "Operation Moon Dust Field Report", url: "/documents/cln4p1mzo0013v6e8x8y9z0w10" }
    ]
  },
  {
    id: "chandelier",
    name: "Chandelier",
    characteristics: "Ornate, multi-tiered structure with crystalline geometry. Anomalous luminosity.",
    incidents: ["Visual Intelligence Leak (2024)"],
    relatedProjects: ["mj12"],
    imageUrl: "/media/foto/UFO LEAK/leak12.jpg",
    comingSoon: true,
    docs: []
  },
  {
    id: "v-shaped",
    name: "V-Shaped",
    characteristics: "Boomerang-shaped craft with high-thermal signature and non-ballistic movement.",
    incidents: ["Visual Intelligence Leak (2024)"],
    relatedProjects: ["aatip"],
    imageUrl: "/media/foto/UFO LEAK/LEAK6.avif",
    comingSoon: true,
    docs: []
  },
  {
    id: "black-cube",
    name: "Black Cube",
    characteristics: "Geometric cube structure within a translucent sphere. Detected in US training ranges.",
    incidents: ["Visual Intelligence Leak (2024)"],
    relatedProjects: ["pounce"],
    imageUrl: "/media/foto/UFO LEAK/LEAK9.avif",
    comingSoon: true,
    docs: []
  },
  {
    id: "black-cross",
    name: "Black Cross",
    characteristics: "Cruciform morphology. Unusual structural rigidity and stealth properties.",
    incidents: ["Visual Intelligence Leak (2024)"],
    relatedProjects: ["sign"],
    imageUrl: "/media/foto/UFO LEAK/LEAK7.avif",
    comingSoon: true,
    docs: []
  }
];

export default function UAPPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [archiveSelectedType, setArchiveSelectedType] = useState<string | null>(null);

  const activeType = UAP_TYPES.find(t => t.id === selectedType);
  const activeArchiveType = UAP_TYPES.find(t => t.id === archiveSelectedType);

  return (
    <div className="min-h-screen bg-[#030303] pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[#00ff00] font-mono text-xs uppercase tracking-[0.4em]">
               <Target className="w-4 h-4" /> Identification_Manual_V2
             </div>
             <GlitchTitle 
               text="UAP CLASSIFICATION" 
               className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic" 
             />
             <p className="max-w-xl text-white/40 font-mono text-xs leading-relaxed italic">
               "Categorizing unidentified aerial phenomena by morphology and flight performance. Accessing declassified documents based on visual signatures."
             </p>
          </div>
        </div>

        {/* Categories Grid - Primary 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {UAP_TYPES.slice(0, 5).map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedType(type.id === selectedType ? null : type.id);
                setArchiveSelectedType(null);
              }}
              className={`relative overflow-hidden rounded-2xl border transition-all group ${
                selectedType === type.id 
                  ? "border-[#00ff00]/50 bg-[#00ff00]/5" 
                  : "border-white/10 bg-white/[0.02] hover:border-white/30"
              }`}
            >
              <div className="aspect-[4/5] relative">
                <img 
                  src={encodeURI(type.imageUrl)} 
                  alt={type.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                    selectedType === type.id ? "scale-110 opacity-60" : "opacity-30 group-hover:opacity-50"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute bottom-4 left-4 text-left">
                  <div className="font-mono text-[8px] text-white/40 uppercase tracking-widest mb-1">Morphology</div>
                  <div className="font-mono text-lg font-black text-white uppercase tracking-tighter">{type.name}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Primary Detail Section - Original UI restored */}
        <AnimatePresence mode="wait">
          {activeType && (
            <motion.div
              key={activeType.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden mb-12"
            >
              {/* Info Area */}
              <div className="p-8 md:p-12 space-y-8">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-[10px] text-[#00ff00] uppercase tracking-widest mb-2">Subject_Analysis</div>
                    <h2 className="font-mono text-4xl font-black text-white uppercase italic tracking-tighter">{activeType.name} Type</h2>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <Layers className="w-6 h-6 text-white/40" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="font-mono text-xs text-white uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                       <Info className="w-4 h-4 text-[#00ff00]" /> Characteristics
                    </div>
                    <p className="font-mono text-sm text-white/60 leading-relaxed italic">
                      "{activeType.characteristics}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="font-mono text-xs text-white uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                       <Target className="w-4 h-4 text-red-500" /> Key Incidents
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeType.incidents.map(incident => (
                        <div key={incident} className="bg-white/5 border border-white/10 p-3 rounded-lg font-mono text-[11px] text-white/50 flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
                          {incident}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="font-mono text-xs text-white uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                       <Shield className="w-4 h-4 text-blue-500" /> Associated Projects
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeType.relatedProjects.map(slug => (
                        <Link 
                          key={slug} 
                          href={`/projects/${slug}`}
                          className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] uppercase rounded hover:bg-blue-500/20 transition-all"
                        >
                          Project_{slug.toUpperCase()}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Document List */}
              <div className="bg-black/60 border-l border-white/10 p-8 md:p-12 space-y-6">
                 <div className="font-mono text-xs text-white uppercase tracking-widest border-b border-white/10 pb-4">
                   Related_Files
                 </div>
                 <div className="space-y-3">
                   {activeType.docs.map((doc, idx) => (
                     <Link 
                       key={idx} 
                       href={doc.url}
                       className="block group bg-white/5 border border-white/5 hover:border-[#00ff00]/30 p-4 rounded-xl transition-all"
                     >
                       <div className="flex items-center justify-between mb-2">
                         <FileText className="w-4 h-4 text-[#00ff00]/40 group-hover:text-[#00ff00] transition-colors" />
                         <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                       </div>
                       <div className="font-mono text-[11px] text-white/60 group-hover:text-white transition-colors uppercase leading-tight">
                         {doc.title}
                       </div>
                     </Link>
                   ))}
                 </div>
                 
                 <div className="mt-12 pt-8 border-t border-white/5">
                   <div className="font-mono text-[9px] text-white/20 uppercase tracking-[0.2em] mb-4">External_Database_Link</div>
                   <button className="w-full py-3 bg-white/5 border border-white/10 text-white/40 font-mono text-[10px] uppercase rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                     <ExternalLink className="w-3 h-3" /> Search_Global_Archive
                   </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tactical Briefing Section */}
        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
           <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-white/5" />
              <h3 className="font-mono text-xs text-[#00ff00] uppercase tracking-[0.6em]">Tactical_Briefing // Operational_Summary</h3>
              <div className="h-[1px] flex-1 bg-white/5" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="space-y-2">
                 <h4 className="text-white font-bold text-xs uppercase italic">Kinematic Variance</h4>
                 <p className="text-[10px] text-white/40 font-mono leading-relaxed">Objects exhibit instantaneous acceleration and transmedium travel (air-to-water) without visible turbulence or thermal exhaust signatures.</p>
              </div>
              <div className="space-y-2">
                 <h4 className="text-white font-bold text-xs uppercase italic">Observability Matrix</h4>
                 <p className="text-[10px] text-white/40 font-mono leading-relaxed">Multi-sensor confirmation (FLIR, Radar, Visual) consistently validates the physical reality of these craft across multiple decades of data.</p>
              </div>
              <div className="space-y-2">
                 <h4 className="text-white font-bold text-xs uppercase italic">Strategic Implications</h4>
                 <p className="text-[10px] text-white/40 font-mono leading-relaxed">The presence of unacknowledged technology in restricted airspace poses a persistent challenge to national security and aerospace integrity.</p>
              </div>
           </div>
        </div>

        {/* Detailed Archive Grid - All 9 */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs text-white/30 uppercase tracking-widest">Full_Forensic_Archive</h3>
              <span className="font-mono text-[9px] text-[#00ff00]/40">9_IDENTIFIED_MORPHOLOGIES</span>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2">
              {UAP_TYPES.map((type) => (
                <button
                  key={`archive-${type.id}`}
                  onClick={() => {
                    setArchiveSelectedType(type.id === archiveSelectedType ? null : type.id);
                    setSelectedType(null);
                  }}
                  className={`relative overflow-hidden rounded-lg border transition-all group ${
                    archiveSelectedType === type.id 
                      ? "border-[#00ff00]/50 bg-[#00ff00]/10" 
                      : "border-white/5 bg-white/[0.01] hover:border-white/20"
                  }`}
                >
                  <div className="aspect-square relative">
                    {type.comingSoon && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md pointer-events-none p-1 rounded-lg">
                        <Shield className="w-4 h-4 text-red-500/60" />
                        <div className="font-mono text-[5px] text-red-500/80 uppercase mt-1">RESTRICTED</div>
                      </div>
                    )}
                    <img 
                      src={encodeURI(type.imageUrl)} 
                      alt={type.name}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                        type.comingSoon ? "blur-xl grayscale" : "opacity-40 group-hover:opacity-80"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-1 left-1 right-1 text-left">
                      <div className="font-mono text-[7px] text-white truncate font-bold uppercase">{type.name}</div>
                    </div>
                  </div>
                </button>
              ))}
           </div>
        </div>

        {/* Archive Detail Section - Deep Dive */}
        <AnimatePresence mode="wait">
          {activeArchiveType && (
            <motion.div
              key={`deep-${activeArchiveType.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 bg-white/[0.03] border border-[#00ff00]/20 rounded-3xl overflow-hidden mt-12 shadow-[0_0_50px_rgba(0,255,0,0.05)]"
            >
              <div className="p-8 md:p-12 space-y-8">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-[10px] text-[#00ff00] uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Activity className="w-3 h-3" /> EXTREME_DETAIL_PROTOCOL
                    </div>
                    <h2 className="font-mono text-5xl font-black text-white uppercase italic tracking-tighter">{activeArchiveType.name} Deep Dive</h2>
                  </div>
                  <div className="p-4 bg-[#00ff00]/10 border border-[#00ff00]/20 rounded-2xl">
                    <Shield className="w-8 h-8 text-[#00ff00]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="font-mono text-xs text-white uppercase border-b border-white/10 pb-2">Technical Specs</div>
                      <div className="space-y-2">
                         <div className="flex justify-between font-mono text-[10px]">
                            <span className="text-white/30">Velocity</span>
                            <span className="text-white">Mach 20+ (Calculated)</span>
                         </div>
                         <div className="flex justify-between font-mono text-[10px]">
                            <span className="text-white/30">Luminance</span>
                            <span className="text-white">4500 Lumens / Core</span>
                         </div>
                         <div className="flex justify-between font-mono text-[10px]">
                            <span className="text-white/30">Signature</span>
                            <span className="text-white">Low-Freq Pulsar</span>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="font-mono text-xs text-white uppercase border-b border-white/10 pb-2">Analysis Notes</div>
                      <p className="font-mono text-[10px] text-white/40 leading-relaxed italic">
                        "{activeArchiveType.characteristics} Intelligence indicates this craft utilizes gravity-well displacement for propulsion."
                      </p>
                   </div>
                </div>

                <div className="space-y-4 pt-4">
                   <div className="font-mono text-xs text-white uppercase border-b border-white/10 pb-2">Confirmed Incidents</div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeArchiveType.incidents.map(inc => (
                        <div key={inc} className="p-4 bg-white/5 border border-white/5 rounded-xl font-mono text-[11px] text-white group hover:border-[#00ff00]/30 transition-all cursor-crosshair">
                           {inc}
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="bg-black/60 border-l border-white/10 p-8 md:p-12 space-y-6">
                 <div className="font-mono text-xs text-[#00ff00] uppercase tracking-widest border-b border-[#00ff00]/20 pb-4">
                   FORENSIC_FILES
                 </div>
                 <div className="space-y-3">
                   {activeArchiveType.docs.length > 0 ? activeArchiveType.docs.map((doc, idx) => (
                     <Link 
                       key={idx} 
                       href={doc.url}
                       className="block group bg-white/5 border border-white/5 hover:border-[#00ff00]/30 p-4 rounded-xl transition-all"
                     >
                       <div className="font-mono text-[11px] text-white/60 group-hover:text-white transition-colors uppercase">
                         {doc.title}
                       </div>
                     </Link>
                   )) : (
                     <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center">
                        <Lock className="w-8 h-8 text-white/10 mx-auto mb-2" />
                        <div className="font-mono text-[9px] text-white/20 uppercase">No Files Decrypted</div>
                     </div>
                   )}
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
