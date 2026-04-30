"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Skull, ShieldAlert, HeartPulse, Dna, Syringe, Biohazard, Bone } from "lucide-react";

const PROTOCOLS = [
  { 
    id: "TYPE-I", 
    title: "EBE TYPE I (ZETA-RETICULI / GREY)", 
    icon: <Skull className="w-16 h-16" />, 
    status: "CRITICAL ISOLATION",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    steps: [
      "ESTABLISH LEVEL-4 BIO-CONTAINMENT FIELD AROUND SUBJECT.",
      "EXTRACT TRANSDERMAL NEURAL IMPLANT (CERVICAL SPINE) USING NON-MAGNETIC ALLOY SCALPEL.",
      "ADMINISTER 500cc SYNTHETIC OXYGENATED FLUOROCARBON TO STABILIZE CIRCULATORY COLLAPSE.",
      "DEPLOY CORTICAL SCRAMBLER TO PREVENT INVOLUNTARY POST-MORTEM TELEPATHIC BROADCASTS."
    ], 
    warn: "SUBJECT DERMAL LAYER SECRETES NEUROTOXIC AMMONIA VAPORS UPON CELLULAR DEATH." 
  },
  { 
    id: "TYPE-II", 
    title: "EBE TYPE II (ALPHA-DRACONIS / REPTILIAN)", 
    icon: <Biohazard className="w-16 h-16" />, 
    status: "LETHAL FORCE AUTHORIZED",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    steps: [
      "APPLY SUB-ZERO LIQUID NITROGEN TO SUPPRESS EXTREME CELLULAR REGENERATION (LIMB REGROWTH).",
      "PIERCE DERMAL SCALES USING TUNGSTEN-CARBIDE NEEDLE FOR INTRAVENOUS ACCESS.",
      "INJECT HEAVY-METAL ISOTOPES TO NEUTRALIZE CORROSIVE ACIDIC BLOOD COMPOUND.",
      "SEVER SPINAL CORD AT C1-C2 VERTEBRAE TO PREVENT REFLEXIVE PREDATORY STRIKES."
    ], 
    warn: "ACIDIC BLOOD EXPANSION RUPTURES STANDARD KEVLAR/HAZMAT SUITS." 
  },
  { 
    id: "TYPE-III", 
    title: "EBE TYPE III (PLEIADIAN / NORDIC)", 
    icon: <Dna className="w-16 h-16" />, 
    status: "DIPLOMATIC QUARANTINE",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    steps: [
      "SUBJECT BIOLOGY IS 98% HUMAN-COMPATIBLE. STANDARD TRIAGE PROCEDURES APPLY.",
      "ISOLATE SUBJECT IN FARADAY CAGE TO PREVENT ELECTROMAGNETIC ENERGY DISCHARGE.",
      "DO NOT ADMINISTER TERRESTRIAL ANESTHESIA (FATAL ALLERGIC REACTION PROBABLE).",
      "MONITOR FOR ACCELERATED CELLULAR MITOSIS AND UNEXPECTED RADIATION SPIKES."
    ], 
    warn: "SUBJECT CAN SURVIVE ZERO-OXYGEN ENVIRONMENT FOR 47 MINUTES VIA UNKNOWN INTERNAL METABOLIC LOOP." 
  }
];

export function NHIMedical() {
  const [step, setStep] = useState(0);
  const current = PROTOCOLS[step];

  // Simulated EKG Line effect
  const [ekg, setEkg] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setEkg(prev => prev === 0 ? 1 : 0), 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col p-8 bg-[#020502] border border-white/10 rounded-3xl relative overflow-hidden font-mono text-white/80">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 z-10 uppercase italic border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
           <Activity className={`w-8 h-8 ${current.color} ${ekg ? 'opacity-100' : 'opacity-30'} transition-opacity duration-75`} />
           <div>
              <h2 className="text-3xl font-black tracking-tighter">NHI_CLINICAL_VAULT</h2>
              <div className="text-[10px] tracking-[0.4em] text-white/40">PROTOCOL V9.4 // AUTHORIZED PERSONNEL ONLY</div>
           </div>
        </div>
        <div className="flex flex-col items-end">
           <div className={`px-4 py-1 ${current.bg} ${current.border} border rounded font-bold text-xs tracking-widest ${current.color} animate-pulse`}>
             {current.status}
           </div>
           <div className="text-[8px] text-white/30 mt-2 flex items-center gap-2">
             <HeartPulse className="w-3 h-3" /> EKG_MONITOR_ACTIVE
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-10 z-10">
        {/* LEFT NAV */}
        <div className="w-[300px] flex flex-col gap-4">
           <div className="text-[10px] uppercase text-white/30 tracking-widest mb-2 border-b border-white/10 pb-2">Select_Subject_Class</div>
           {PROTOCOLS.map((p, i) => (
             <button 
                key={i} 
                onClick={() => setStep(i)} 
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                  step === i 
                    ? `${p.bg} ${p.border} shadow-[0_0_20px_rgba(0,0,0,0.5)]` 
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
             >
                <div className={`${step === i ? p.color : "text-white/20"}`}>
                   {p.icon}
                </div>
                <div className="flex flex-col">
                   <div className={`font-black text-xs tracking-widest ${step === i ? p.color : "text-white/50"}`}>{p.id}</div>
                   <div className="text-[9px] text-white/40 uppercase mt-1">Species_Profile</div>
                </div>
             </button>
           ))}

           {/* VITALS MOCKUP */}
           <div className="mt-auto p-4 bg-black/50 border border-white/5 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-[10px]">
                 <span className="text-white/30">BPM</span>
                 <span className={`font-black ${current.color}`}>{step === 2 ? '42' : 'ERR'}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                 <span className="text-white/30">RADIOLOGICAL</span>
                 <span className={`font-black ${step === 0 ? 'text-red-500' : 'text-green-500'}`}>{step === 0 ? '450 mSv/h' : '0.02 mSv/h'}</span>
              </div>
           </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 bg-black/60 p-8 rounded-2xl border border-white/10 flex flex-col uppercase relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-32 h-32 ${current.bg} blur-[100px] pointer-events-none`} />
          
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
             <Syringe className={`w-5 h-5 ${current.color}`} />
             <div className="text-xl font-black tracking-widest">{current.title}</div>
          </div>
          
          <div className="space-y-6 flex-1 pr-4 overflow-y-auto custom-scrollbar">
            {current.steps.map((s, i) => (
              <motion.div 
                 key={`${step}-${i}`}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/5 items-start"
              >
                 <div className={`font-black text-lg ${current.color} opacity-50 w-6`}>0{i+1}.</div>
                 <p className="text-xs leading-relaxed text-white/70 tracking-wide">{s}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            key={`warn-${step}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 ${current.bg} border ${current.border} rounded-xl text-[10px] tracking-widest font-bold flex gap-4 items-center`}
          >
            <ShieldAlert className={`w-8 h-8 ${current.color} animate-pulse shrink-0`} />
            <div className="flex flex-col gap-1">
               <span className={`${current.color}`}>CRITICAL WARNING_</span>
               <span className="text-white/60 leading-relaxed">{current.warn}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
