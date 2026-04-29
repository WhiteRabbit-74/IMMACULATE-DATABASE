"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Fingerprint, Info, ShieldCheck, AlertCircle } from "lucide-react";

const WHISTLEBLOWERS = [
  { 
    id: "grusch", 
    name: "David Grusch", 
    claim: "UAP Crash Retrieval", 
    baseScore: 89,
    details: "Former NGA/RO intelligence officer. Claims multi-decade UAP crash retrieval and reverse engineering programs. High level of corroboration by IG.",
    image: "/media/foto/whistblower/David Grusch.webp"
  },
  { 
    id: "elizondo", 
    name: "Luis Elizondo", 
    claim: "AATIP Director", 
    baseScore: 92,
    details: "Former counter-intelligence special agent. Managed AATIP program. Released Nimitz/Gimbal/GoFast videos. High credibility through official documentation.",
    image: "/media/foto/whistblower/Luis Elizondo.jpg"
  },
  { 
    id: "fravor", 
    name: "David Fravor", 
    claim: "Tic-Tac Encounter", 
    baseScore: 96,
    details: "Commander of VFA-41 Black Aces. Witness to Tic-Tac UAP during Nimitz 2004 encounter. Radar and visual correlation confirmed by multiple assets.",
    image: "/media/foto/whistblower/David Fravor.webp"
  },
  { 
    id: "nell", 
    name: "Karl Nell", 
    claim: "Army Colonel", 
    baseScore: 94,
    details: "Retired Army Colonel and former member of the UAP Task Force. Corroborated David Grusch's claims regarding non-human intelligence under oath.",
    image: "/media/foto/whistblower/KARL NELL.jpg"
  },
  { 
    id: "lazar", 
    name: "Bob Lazar", 
    claim: "S4 Propulsion Systems", 
    baseScore: 42,
    details: "Claims work on S4 sector element 115 craft. Verification issues persist in academic background, but physical description of S4 remains highly specific.",
    image: "/media/foto/whistblower/Bob Lazar.jpg"
  },
  { 
    id: "mitchell", 
    name: "Edgar Mitchell", 
    claim: "Apollo 14 Astronaut", 
    baseScore: 88,
    details: "The 6th man on the moon. Openly stated that extraterrestrial intelligence is visiting Earth and that the government is concealing the truth.",
    image: "/media/foto/whistblower/Edgar Mitchell.jpg"
  },
  { 
    id: "hellyer", 
    name: "Paul Hellyer", 
    claim: "Canadian Defense Min.", 
    baseScore: 85,
    details: "Former Minister of National Defense. Testified that at least four species of extraterrestrials have been visiting Earth for decades.",
    image: "/media/foto/whistblower/PAUL HELLYER.jpg"
  },
  { 
    id: "cooper", 
    name: "Gordon Cooper", 
    claim: "Mercury 7 Astronaut", 
    baseScore: 82,
    details: "Project Mercury astronaut. Reported seeing multiple UAPs during his flights and while stationed at Edwards AFB. Testified to the UN.",
    image: "/media/foto/whistblower/Gordon Cooper.jpg"
  },
  { 
    id: "mellon", 
    name: "Chris Mellon", 
    claim: "Pentagon Intelligence", 
    baseScore: 94,
    details: "Former Deputy Assistant Secretary of Defense for Intelligence. Provided key testimony on UAP incursions into restricted airspace.",
    image: "/media/foto/whistblower/Chris Mellon.webp"
  },
  { 
    id: "walton", 
    name: "Travis Walton", 
    claim: "Sitgreaves Encounter", 
    baseScore: 78,
    details: "Forestry worker involved in a high-profile abduction case in 1975. Passed multiple polygraphs over 40 years. Highly consistent testimony.",
    image: "/media/foto/whistblower/TRAVIS WALTON.webp"
  },
  { 
    id: "hickson", 
    name: "Charles Hickson", 
    claim: "Pascagoula Abduction", 
    baseScore: 76,
    details: "Witness to a 1973 landing in Mississippi. Reported robotic entities with crab-like claws. Corroborated by secret recordings during police questioning.",
    image: "/media/foto/whistblower/Charles Hickson.jpg"
  },
  { 
    id: "uhouse", 
    name: "Bill Uhouse", 
    claim: "Area 51 Engineer", 
    baseScore: 38,
    details: "Claims to have worked on flight simulators for ET craft at Area 51. Claims interaction with a 'J-Rod' entity. Low physical evidence but consistent testimony.",
    image: "/media/foto/whistblower/Bill Uhouse.jpg"
  }
];

const CRITERIA = [
  { label: "Official Credentials", weight: 0.3 },
  { label: "Physical Evidence (Radar/Video)", weight: 0.3 },
  { label: "Corroboration (Internal/External)", weight: 0.2 },
  { label: "Academic/Service Record", weight: 0.2 },
];

export function WhistleblowerVeracity() {
  const [selectedAgent, setSelectedAgent] = useState<typeof WHISTLEBLOWERS[0]>(WHISTLEBLOWERS[0]);

  const status = useMemo(() => {
    const s = selectedAgent.baseScore;
    if (s > 80) return { label: "HIGHLY_CORROBORATED", color: "#00ff00" };
    if (s > 50) return { label: "PLAUSIBLE_DATA", color: "#0088ff" };
    if (s > 30) return { label: "LOW_CONFIDENCE", color: "#ffaa00" };
    return { label: "DISINFORMATION_RISK", color: "#ff0000" };
  }, [selectedAgent]);

  return (
    <div className="bg-black/60 border border-[#00ff00]/20 rounded-2xl p-6 font-mono">
      <div className="flex items-center gap-3 mb-6 border-b border-[#00ff00]/10 pb-4">
        <Fingerprint className="w-5 h-5 text-[#00ff00]" />
        <div className="flex flex-col">
          <div className="text-[10px] text-[#00ff00] uppercase tracking-[0.3em] font-bold">Forensic_Module // 08</div>
          <div className="text-sm text-white uppercase font-black italic tracking-tighter">Whistleblower_Veracity_Analyzer</div>
        </div>
      </div>

      {/* Agent Selection List - Compact Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
         {WHISTLEBLOWERS.map(agent => (
           <button
             key={agent.id}
             onClick={() => setSelectedAgent(agent)}
             className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${
               selectedAgent.id === agent.id ? "bg-[#00ff00]/10 border-[#00ff00]/40" : "bg-white/[0.02] border-white/5 hover:border-white/20 opacity-50 grayscale hover:opacity-100 hover:grayscale-0"
             }`}
           >
              <img src={encodeURI(agent.image)} alt={agent.name} className="w-full aspect-square rounded-lg object-cover" />
              <div className="text-center">
                 <div className="text-[8px] font-bold text-white uppercase tracking-tight truncate w-full">{agent.name}</div>
              </div>
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-8">
        {/* Analysis Details */}
        <div className="space-y-6">
           <div className="flex items-start gap-6">
              <img src={encodeURI(selectedAgent.image)} alt={selectedAgent.name} className="w-32 h-32 rounded-2xl object-cover border border-[#00ff00]/20" />
              <div>
                 <h3 className="text-xl font-black text-white uppercase italic">{selectedAgent.name}</h3>
                 <div className="text-[#00ff00] text-[10px] uppercase tracking-widest mb-4">{selectedAgent.claim}</div>
                 <p className="text-white/50 text-[10px] leading-relaxed italic">"{selectedAgent.details}"</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              {CRITERIA.map((c, i) => {
                 // Simulate a slightly varied score based on the base score for flavor
                 const score = Math.min(100, Math.max(0, selectedAgent.baseScore + (Math.random() * 10 - 5)));
                 return (
                   <div key={i} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[8px] text-white/30 uppercase">{c.label}</span>
                         <span className="text-[8px] text-[#00ff00]">{Math.round(score)}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${score}%` }}
                           transition={{ duration: 0.5, delay: i * 0.1 }}
                           className="h-full bg-[#00ff00]/40" 
                         />
                      </div>
                   </div>
                 );
              })}
           </div>
        </div>

        {/* Score Readout */}
        <div className="flex flex-col items-center justify-center p-8 bg-[#00ff00]/5 border border-[#00ff00]/20 rounded-2xl text-center">
           <div className="text-[10px] text-[#00ff00]/60 uppercase tracking-widest mb-2">VERACITY_SCORE</div>
           <div className="text-6xl font-black text-white italic tracking-tighter mb-4" style={{ color: status.color }}>
              {selectedAgent.baseScore}
           </div>
           <div className="text-[10px] font-bold uppercase tracking-widest p-2 rounded border" style={{ color: status.color, borderColor: `${status.color}40`, backgroundColor: `${status.color}10` }}>
              {status.label}
           </div>
           
           <div className="mt-8 pt-6 border-t border-white/10 w-full">
              <div className="text-[8px] text-white/20 uppercase mb-4">Core_Heuristics</div>
              <div className="space-y-2 text-left">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-[#00ff00]" />
                    <span className="text-[8px] text-white/40 uppercase">Credential Validation</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-[#00ff00]" />
                    <span className="text-[8px] text-white/40 uppercase">Temporal Alignment</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-[#00ff00]/40" />
                    <span className="text-[8px] text-white/40 uppercase">Contextual Risk: LOW</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
