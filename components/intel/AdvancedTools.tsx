"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Dna, ShieldAlert, Activity, Fingerprint, Info, Search, Upload, Binary, Languages, Lock, Target } from "lucide-react";

export const UFO_DATA = [
  { name: "Cylindrical", class: "Cigar Type", speed: "Mach 15", gForce: "800 Gs", fuel: "Zero Point", img: "/media/foto/UFO_UAP/cigar.png" },
  { name: "Saucer", class: "Disc Type", speed: "Mach 20+", gForce: "1,200 Gs", fuel: "Element 115", img: "/media/foto/UFO_UAP/disc.png" },
  { name: "Triangle", class: "Large Tactical", speed: "Silent/Stationary", gForce: "500 Gs", fuel: "Magnetic Disruption", img: "/media/foto/UFO_UAP/triangle.png" },
  { name: "Orb", class: "Sphere/Probe", speed: "Instantaneous", gForce: "Infinite", fuel: "Plasma Core", img: "/media/foto/UFO_UAP/orb.png" },
  { name: "Tic-Tac", class: "Fravor-Class", speed: "Transmedium", gForce: "1,500+ Gs", fuel: "Vacuum Energy", img: "/media/foto/UFO_UAP/tictac.png" },
  { name: "Chandelier", class: "Multidimensional // High-Luminance", speed: "STATIONARY // WARP", gForce: "UNKNOWN", fuel: "Stellar Resonance", img: "/media/foto/UFO_UAP/star stellar.png" },
  { name: "V-Shaped", class: "Heavy Tactical // Stealth", speed: "Mach 25", gForce: "1,800 Gs", fuel: "Gravity Drive", img: "/media/foto/UFO_UAP/v shaped.png" },
  { name: "Black Cube", class: "Cubic-Core // Spherical-Field", speed: "Mach 5 (Loiter)", gForce: "UNKNOWN", fuel: "Dark Energy Resonance", img: "/media/foto/UFO_UAP/cube.png" },
  { name: "Black Cross", class: "Quantum Interceptor", speed: "N/A // Non-Linear", gForce: "Infinite", fuel: "Spatial Warp", img: "/media/foto/UFO_UAP/sharp cross.png" },
];

export const XENO_ENTITIES = [
  {
    id: "anunnaki",
    name: "Anunnaki (The Shining Ones)",
    origin: "Nibiru",
    classification: "Class-A Progenitor // Interdimensional",
    stats: {
      height: "8.0 - 10.0 ft",
      weight: "350 - 500 lbs",
      skin: "Pale / Golden Glow",
      lifespan: "Thousands of cycles (S.A.R.S.)"
    },
    bioInfo: "Ancient progenitor race described in Sumerian cuneiform. Possesses a highly advanced genetic engineering capability. Proposed as the architects of the human genome (homo-sapiens) via hybridization of primitive hominids and their own DNA. Requires high atmospheric gold concentration for environmental stabilization.",
    history: "Directly linked to the construction of Giza and Mesopotamian ziggurats. Worshipped as gods in ancient Egypt; the 'Eye of Horus' is theorized to be an anatomical representation of their pineal-gland enhancement technology.",
    anomalies: [
      "Metallic gold detected in cellular structures",
      "Triple-strand DNA configuration",
      "High-frequency bio-luminescence"
    ],
    img: "/media/foto/EXTRATERRESTRI/Anunnaki (The Shining Ones).png"
  },
  {
    id: "eben",
    name: "Eben (EBE-1 / Serpo)",
    origin: "Zeta Reticuli",
    classification: "Biological // Diplomatic Status",
    stats: {
      height: "3.5 - 4.5 ft",
      weight: "50 - 70 lbs",
      skin: "Gray-tan // Chlorophyll-based",
      lifespan: "Estimated 350-400 years"
    },
    bioInfo: "Non-aggressive biological entities known from the 1947 Roswell crash and subsequent Project Serpo exchange. Lacks standard digestive systems; nourishment is absorbed through dermal pores. Their society is strictly hierarchical and based on total communal transparency.",
    history: "Subject of the first secret diplomatic treaty between the US government and NHI (Project Aquarius). Evidence suggests monitoring of human nuclear development since 1945.",
    anomalies: [
      "Total absence of external reproductive organs",
      "Centralized brain-heart organ (The Core)",
      "High resilience to ionizing radiation"
    ],
    img: "/media/foto/EXTRATERRESTRI/ebens.png"
  },
  {
    id: "nordic",
    name: "Nordic (Pleiadian)",
    origin: "Erra (Pleiades)",
    classification: "Humanoid // High-Vibration",
    stats: {
      height: "6.0 - 7.0 ft",
      weight: "160 - 200 lbs",
      skin: "Fair / High Luminescence",
      lifespan: "700+ years"
    },
    bioInfo: "Physically indistinguishable from humans except for height and ocular clarity. DNA is 99.8% match to terrestrial baseline but with active junk-DNA sequences (12-strand potential). Telepathic communicators who prioritize planetary ecology.",
    history: "Historically associated with 'angelic' sightings and Nordic/Viking mythology. Reports suggest they have been actively interfering to prevent terrestrial nuclear escalation.",
    anomalies: [
      "Dual circulatory system (Copper-based transition)",
      "Instantaneous cellular regeneration",
      "Psionic output exceeding 400Hz"
    ],
    img: "/media/foto/EXTRATERRESTRI/nordics.png"
  },
  {
    id: "gray",
    name: "Gray (Zeta Reticulant)",
    origin: "Zeta Reticuli",
    classification: "Cloned Archive // Biological Drone",
    stats: {
      height: "3.0 - 4.0 ft",
      weight: "40 lbs",
      skin: "Smooth Gray // Synthetic",
      lifespan: "N/A // Cloned cycles"
    },
    bioInfo: "Specialized biological workers. Central nervous system is linked to craft interfaces. Lack of individuality; function as a hive-mind unit. Primarily involved in genetic sampling and planetary reconnaissance.",
    history: "Most frequent entity reported in abduction cases (post-1961). Evidence suggests a mass-cloning operation based on a decaying original genome.",
    anomalies: [
      "Presence of non-terrestrial silicon implants",
      "Vestigial digestive and reproductive tracts",
      "Total telepathic synchronization"
    ],
    img: "/media/foto/EXTRATERRESTRI/grey.png"
  },
  {
    id: "reptilian",
    name: "Reptilian (Saurian / Alpha Draconian)",
    origin: "Alpha Draconis",
    classification: "Saurian // Hostile Threat Level",
    stats: {
      height: "7.0 - 9.0 ft",
      weight: "400 - 600 lbs",
      skin: "Scaled // Multi-tonal",
      lifespan: "Thousands of years"
    },
    bioInfo: "Aggressive apex predators with high-order intelligence. Capable of pigment manipulation for visual cloaking. Operates via cold-blooded logic and hierarchical dominance.",
    history: "Deeply embedded in ancient Egyptian, Mayan, and Asian mythologies as 'Serpent Gods.' Historical texts suggest a conflict between Reptilian and Anunnaki factions over terrestrial dominion.",
    anomalies: [
      "High-output telepathic suggestive capacity (Mind Control)",
      "Regenerative heart-tissue (dual chambers)",
      "Infrasound vocalization capacity"
    ],
    img: "/media/foto/EXTRATERRESTRI/reptiians.png"
  },
  {
    id: "mantis",
    name: "Mantis (Insectoid)",
    origin: "Unknown",
    classification: "Insectoid // Master Geneticists",
    stats: {
      height: "7.0 - 8.0 ft",
      weight: "120 lbs",
      skin: "Exoskeleton // Green-Brown",
      lifespan: "Unknown"
    },
    bioInfo: "Tall, thin beings with large black eyes and mantis-like features. Often seen in 'leadership' positions over Gray drones. Specialized in high-level genetic manipulation and soul-transfer technology.",
    history: "Extremely rare sightings. Usually reported in deep-state underground facilities during 'medical' procedures. Zero diplomatic contact recorded.",
    anomalies: [
      "Chitinous structure infused with carbon-nanotubes",
      "Compound vision capable of multi-dimensional tracking",
      "High-pitch acoustic communication frequency"
    ],
    img: "/media/foto/EXTRATERRESTRI/mantis.png"
  },
  {
    id: "arcturian",
    name: "Arcturian (The Guardians)",
    origin: "Arcturus",
    classification: "Class-A Etheric // Advanced",
    stats: {
      height: "3.0 - 4.5 ft",
      weight: "20 lbs (Variable)",
      skin: "Deep Blue // Translucent",
      lifespan: "Trans-dimensional // Infinite"
    },
    bioInfo: "Highly advanced spiritual and technological beings. Possesses a non-physical density that allows for interdimensional phasing. Their physiology is based on light-energy conversion rather than chemical nourishment.",
    history: "Reports suggest they oversee the security of the solar system against hostile NHI factions. Historically linked to the 'Blue Gods' of ancient India and Tibet.",
    anomalies: [
      "No measurable biological waste products",
      "Brain activity operating at 100% capacity",
      "Telepathic output capable of structural manipulation"
    ],
    img: "/media/foto/EXTRATERRESTRI/Arcturian (The Guardians).png"
  },
  {
    id: "sirian",
    name: "Sirian (Type-B Architects)",
    origin: "Sirius-B",
    classification: "Humanoid-Hybrid // Aquatic Roots",
    stats: {
      height: "6.5 - 7.5 ft",
      weight: "220 lbs",
      skin: "Matte Blue-Gray",
      lifespan: "500+ years"
    },
    bioInfo: "Amphibious humanoid hybrids with high lung capacity and specialized skin for deep-sea environments. Experts in crystalline technology and sacred geometry.",
    history: "Directly influenced the Dogon tribe of Mali and the Egyptian priesthood. Provided the mathematical blueprints for the alignments of the Giza plateau with Sirius.",
    anomalies: [
      "Webbed skeletal structure in extremities",
      "Third lung-like organ for nitrogen filtering",
      "High concentration of quartz in bone marrow"
    ],
    img: "/media/foto/EXTRATERRESTRI/Sirian (Type-B Architects).png"
  },
  {
    id: "andromedan",
    name: "Andromedan (The Analysts)",
    origin: "Andromeda Galaxy",
    classification: "Humanoid // High-Logic",
    stats: {
      height: "5.5 - 6.5 ft",
      weight: "140 lbs",
      skin: "Very Pale // High Contrast",
      lifespan: "800+ years"
    },
    bioInfo: "Extremely logical and peaceful humanoid race. Their society functions without currency or government, based on a collective ethical consensus. Highly advanced in bio-telemetry and time-dilation science.",
    history: "Frequently observed in a supervisory role over 'Contact' events. Known for providing the most accurate predictive timelines for human development.",
    anomalies: [
      "Optic nerves capable of seeing the infrared spectrum",
      "Absence of 'fight-or-flight' adrenal triggers",
      "Genetic stability index: 100%"
    ],
    img: "/media/foto/EXTRATERRESTRI/Andromedan (The Analysts).png"
  },
  {
    id: "flatwoods",
    name: "Flatwoods Monster",
    origin: "UNKNOWN // REDACTED",
    classification: "Techno-Organic // Suit-Encapsulated",
    stats: {
      height: "10.0 - 12.0 ft",
      weight: "Unknown",
      skin: "Metallic / Reddish Glow",
      lifespan: "N/A"
    },
    bioInfo: "Entity observed wearing a metallic, skirt-like exoskeleton with a spade-shaped cowl. Emits a pungent, sulfurous mist that causes immediate respiratory distress. Eyes glow with internal bioluminescence.",
    history: "Sightings limited to the 1952 Braxton County (West Virginia) event. Theorized to be a mechanical containment suit for a biological entity sensitive to Earth's atmosphere.",
    anomalies: [
      "High-output electromagnetic pulse emission",
      "Levitation capacity without visible propulsion",
      "Oil-like residue left at contact sites"
    ],
    img: "/media/foto/EXTRATERRESTRI/flatwoods.png"
  },
  {
    id: "hopkinsville",
    name: "Hopkinsville Goblins",
    origin: "UNKNOWN // DEEP SPACE",
    classification: "Biological // High-Resilience",
    stats: {
      height: "3.0 ft",
      weight: "40 lbs",
      skin: "Silver-Metallic",
      lifespan: "Unknown"
    },
    bioInfo: "Small, bipedal entities with large, bat-like ears and glowing yellow eyes. Hands are equipped with talons. Skin exhibits extreme resilience to small-arms fire (kinetic energy absorption).",
    history: "Involved in the 1955 'Kelly-Hopkinsville' (Kentucky) siege. Demonstrated playful but aggressive behavior and an immunity to standard terrestrial weaponry.",
    anomalies: [
      "Total kinetic energy deflection (Bulletproof skin)",
      "Low-gravity locomotion (Float-walking)",
      "High-pitch sonic communication"
    ],
    img: "/media/foto/EXTRATERRESTRI/hopkinsville.png"
  },
  {
    id: "valensole",
    name: "Valensole Humanoids",
    origin: "UNKNOWN // REDACTED",
    classification: "Humanoid // Recon-Unit",
    stats: {
      height: "3.5 ft",
      weight: "50 lbs",
      skin: "Smooth Gray",
      lifespan: "Unknown"
    },
    bioInfo: "Small entities with oversized bald heads and small mouths. Observed using a cylindrical 'paralyzing tube' device on witnesses. Extremely focused on soil and biological sampling.",
    history: "Sightings reported by Maurice Masse in 1965 (Valensole, France). Associated with the collection of lavender plants and soil cores for unknown agricultural research.",
    anomalies: [
      "Utilization of directed-energy stasis tools",
      "Total silence during movement",
      "Anomalous soil dehydration at landing site"
    ],
    img: "/media/foto/EXTRATERRESTRI/valensole.png"
  }
];

export function XenoBiologyScan() {
  const [selected, setSelected] = useState(XENO_ENTITIES[0]);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 flex-1">
        {/* SIDEBAR SELECTOR - LEFT */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar max-h-[70vh]">
           <div className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] mb-2 sticky top-0 bg-[#070707] py-2 z-10 border-b border-white/5">NHI_Biological_Registry</div>
           <div className="space-y-2">
              {XENO_ENTITIES.map(entity => (
                <button 
                  key={entity.id}
                  onClick={() => setSelected(entity)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 text-left ${selected.id === entity.id ? "bg-red-500/10 border-red-500/40 text-white" : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"}`}
                >
                   <img src={encodeURI(entity.img)} alt="" className="w-10 h-10 rounded-full object-cover" />
                   <div>
                      <div className="text-xs font-bold uppercase tracking-tight">{entity.name}</div>
                      <div className="text-[7px] font-mono opacity-50 truncate">{entity.origin}</div>
                   </div>
                </button>
              ))}
           </div>
        </div>

        {/* MAIN DATA VIEW - RIGHT */}
        <div className="bg-black/40 border border-white/10 rounded-3xl overflow-y-auto custom-scrollbar p-10 relative">
           <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,#ff4444,transparent_70%)] pointer-events-none" />
           
           <AnimatePresence mode="wait">
             <motion.div 
               key={selected.id}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-12 relative z-10"
             >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-10 items-start">
                   <div className="w-full md:w-64 aspect-[3/4] bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                      <img src={encodeURI(selected.img)} alt={selected.name} className="w-full h-full object-cover transition-all duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <div className="absolute top-4 right-4">
                         <div className="px-2 py-1 bg-red-500/20 border border-red-500/40 rounded text-[8px] font-mono text-red-500 uppercase">{selected.classification.split('//')[1] || "RESTRICTED"}</div>
                      </div>
                   </div>
                   
                   <div className="flex-1 space-y-6">
                      <div className="space-y-1">
                         <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{selected.name}</h2>
                         <div className="font-mono text-xs text-red-500 uppercase tracking-[0.4em]">{selected.origin}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         {Object.entries(selected.stats).map(([key, val]) => (
                           <div key={key} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                              <div className="font-mono text-[8px] text-white/30 uppercase tracking-widest mb-1">{key}</div>
                              <div className="text-xs text-white font-bold">{val}</div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Extended Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 font-mono text-[10px] text-white/30 uppercase tracking-widest">
                         <Activity className="w-4 h-4 text-red-500" /> Physiological_Analysis
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed italic font-serif">"{selected.bioInfo}"</p>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 font-mono text-[10px] text-white/30 uppercase tracking-widest">
                         <Info className="w-4 h-4 text-red-500" /> Historical_Correlation
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed border-l-2 border-red-500/40 pl-6">
                         {selected.history}
                      </p>
                   </div>
                </div>

                {/* Anomalies & Risk */}
                <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-xs text-red-500 font-black uppercase tracking-tighter">
                         <ShieldAlert className="w-5 h-5" /> RECOVERED_ANOMALY_LOGS
                      </div>
                      <div className="font-mono text-[10px] text-red-500/40 uppercase">Classified_Data_Stream</div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {selected.anomalies.map((a, i) => (
                        <div key={i} className="flex gap-4 items-start">
                           <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0 animate-pulse" />
                           <div className="font-mono text-[10px] text-white/60 uppercase leading-relaxed">{a}</div>
                        </div>
                      ))}
                   </div>
                </div>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- ALIEN LINGUISTICS COMPONENT ---

const LINGUISTIC_GROUPS = [
  {
    id: "ros-1947",
    name: "Roswell Incident // 1947",
    description: "Symbols recovered from the I-beam debris of the 509th Bomb Group crash site.",
    symbols: [
      { glyph: "⎊", meaning: "Spacetime Coordinate // Point 0", detail: "Central navigation marker. Often seen in 'home' sequence logs." },
      { glyph: "⎋", meaning: "Gravitational Collapse // Exit", detail: "Propulsion shutdown or wormhole exit protocol." },
      { glyph: "⍝", meaning: "Biological Link // DNA Bridge", detail: "Interface signature for biological pilot synchronization." },
      { glyph: "⍟", meaning: "Celestial Node // Sirius-A", detail: "Targeting vector for the Sirius stellar system." }
    ]
  },
  {
    id: "soc-1964",
    name: "Socorro Landing // 1964",
    description: "Insignia reported by Officer Lonnie Zamora on the egg-shaped craft.",
    symbols: [
      { glyph: "⍋", meaning: "Unit-14 // Expedition Group", detail: "Military-grade tactical insignia for recon units." },
      { glyph: "⍒", meaning: "Subterranean Entry // Base", detail: "Marker for planetary surface entry points." },
      { glyph: "⍞", meaning: "Atmospheric Seal // Active", detail: "Indicator for environmental containment status." }
    ]
  },
  {
    id: "ren-1980",
    name: "Rendlesham Forest // 1980",
    description: "Etched markings and tactile binary telemetry from the triangular craft.",
    symbols: [
      { glyph: "⟠", meaning: "Origin Code // Earth Marker", detail: "Decoded binary sequence: 52° 09' 42.5' N, 1° 20' 20.1' E." },
      { glyph: "⟡", meaning: "Temporal Bridge // Year 8100", detail: "Theoretical time-marker sequence found in the message stream." },
      { glyph: "⟦⟧", meaning: "Binary Container // Data Hub", detail: "Symbol used to encapsulate high-density data bursts." }
    ]
  },
  {
    id: "kec-1965",
    name: "Kecksburg Acorn // 1965",
    description: "Egyptian-style hieroglyphs found on the base of the recovered object.",
    symbols: [
      { glyph: "◈", meaning: "Manufacturer // Black Sun", detail: "Possible manufacturing stamp of the 'Vril' or 'Bell' series." },
      { glyph: "▣", meaning: "High-Energy Hazard // Core", detail: "Warning marker for the isotopic propulsion reactor." }
    ]
  },
  {
    id: "val-1965",
    name: "Valensole Event // 1965",
    description: "Symbols seen on the craft in the lavender field by Maurice Masse.",
    symbols: [
      { glyph: "⊞", meaning: "Resource Sampling // Flora", detail: "Indicator for biological material harvesting sequence." },
      { glyph: "⊟", meaning: "Exclusion Zone // Radius", detail: "Warning for local biological entities during take-off." }
    ]
  }
];

export function AlienLinguistics() {
  const [activeGroup, setActiveGroup] = useState(LINGUISTIC_GROUPS[0]);
  const [selectedSymbol, setSelectedSymbol] = useState(LINGUISTIC_GROUPS[0].symbols[0]);

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 flex-1">
        {/* LEFT: EVENT SELECTOR */}
        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[75vh]">
           <div className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] sticky top-0 bg-[#070707] py-2 z-10 border-b border-white/5">Historical_Events</div>
           <div className="space-y-2">
              {LINGUISTIC_GROUPS.map(group => (
                <button 
                  key={group.id}
                  onClick={() => { setActiveGroup(group); setSelectedSymbol(group.symbols[0]); }}
                  className={`w-full p-5 rounded-2xl border transition-all text-left group ${activeGroup.id === group.id ? "bg-blue-500/10 border-blue-500/40 text-white" : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"}`}
                >
                   <div className="text-xs font-bold uppercase tracking-tight group-hover:text-blue-400 transition-colors">{group.name}</div>
                   <div className="text-[8px] font-mono opacity-50 mt-1 leading-tight">{group.description}</div>
                </button>
              ))}
           </div>
        </div>

        {/* RIGHT: DECODER INTERFACE */}
        <div className="bg-black/40 border border-white/10 rounded-3xl p-10 relative flex flex-col gap-10">
           <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,#0088ff,transparent_70%)] pointer-events-none" />
           
           <div className="flex flex-col md:flex-row gap-12 items-center md:items-stretch">
              {/* SYMBOL GRID */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                 {activeGroup.symbols.map((s, i) => (
                   <button 
                     key={i}
                     onClick={() => setSelectedSymbol(s)}
                     className={`w-24 h-24 rounded-2xl border flex items-center justify-center text-5xl transition-all ${selectedSymbol.glyph === s.glyph ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(0,136,255,0.3)]" : "bg-white/5 border-white/10 text-white/20 hover:border-white/30"}`}
                   >
                     {s.glyph}
                   </button>
                 ))}
              </div>

              {/* DECODER OUTPUT */}
              <div className="flex-1 space-y-8 relative z-10">
                 <div className="space-y-2">
                    <div className="font-mono text-[9px] text-blue-400 uppercase tracking-[0.4em]">Decoded_Output // Conf: 99.8%</div>
                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">{selectedSymbol.meaning}</h3>
                 </div>

                 <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2">
                       <Languages className="w-4 h-4 text-blue-400" />
                       <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Linguistic_Context</span>
                    </div>
                    <p className="text-sm text-white/70 italic leading-relaxed font-serif">"{selectedSymbol.detail}"</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black border border-white/5 rounded-xl">
                       <div className="font-mono text-[8px] text-blue-500/60 uppercase mb-1">Grammar_Type</div>
                       <div className="text-[10px] text-white font-bold uppercase">Non-Linear Logogram</div>
                    </div>
                    <div className="p-4 bg-black border border-white/5 rounded-xl">
                       <div className="font-mono text-[8px] text-blue-500/60 uppercase mb-1">Encryption_Level</div>
                       <div className="text-[10px] text-white font-bold uppercase">Tactical_Clearance_4</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="mt-auto p-6 bg-blue-950/20 border border-blue-500/20 rounded-2xl flex items-center gap-6">
              <Binary className="w-10 h-10 text-blue-400 animate-pulse" />
              <div className="space-y-1">
                 <div className="font-mono text-xs text-white uppercase font-bold tracking-widest">NHI Linguistic Protocol v9.5</div>
                 <p className="text-[10px] text-white/40 font-mono italic">"Logogram patterns identified as high-dimensional semantic containers. Direct brain-interface compatibility detected in Rendlesham data."</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
