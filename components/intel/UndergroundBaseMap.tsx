"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Activity, Layers, Users, Shield, Info } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const BASE_NODES = [
  {
    id: "dulce",
    name: "Dulce Base (Level 7)",
    location: "Archuleta Mesa, NM",
    coordinates: "36.9392° N, 106.9972° W",
    depth: "Estimated 2.0 miles",
    personnel: "Joint Human/NHI (Alleged)",
    security: "MAXIMUM // OMEGA-5",
    description: "Deep subterranean facility specializing in genetic experimentation and cross-species hybridization. Reportedly consists of 7 levels, with Level 6 ('Nightmare Hall') being the primary biological research site.",
    reports: [
      "Thomas Castello whistleblowing (1979)",
      "Phil Schneider firefight incident reports",
      "Anomalous cattle mutilation proximity clustering"
    ],
    lat: 36.9392,
    lng: -106.9972
  },
  {
    id: "pine-gap",
    name: "Pine Gap Facility",
    location: "Alice Springs, Australia",
    coordinates: "23.8214° S, 133.7369° E",
    depth: "Varies // Deep Crustal Antennas",
    personnel: "NSA/CIA/NRO Joint Task Force",
    security: "ULTRA TOP SECRET // ECHELON",
    description: "The 'Area 51 of Australia.' Primary SIGINT and satellite tracking station. Rumored to house deep-space monitoring equipment for tracking NHI craft entering Earth's orbit.",
    reports: [
      "High-altitude electromagnetic pulse detections",
      "Suppressed local reports of light-beam transmissions to space",
      "Secret subterranean maglev train link (Alleged)"
    ],
    lat: -23.8214,
    lng: 133.7369
  },
  {
    id: "bermuda",
    name: "Bermuda Undersea Hub",
    location: "Bermuda Triangle",
    coordinates: "25.0000° N, 71.0000° W",
    depth: "Sub-oceanic // Trench Levels",
    personnel: "US Navy / Unacknowledged NHI",
    security: "TOTAL LOCKDOWN // DARK-WATER",
    description: "Mobile underwater anomalies detected near the Puerto Rico Trench. Likely a trans-medium refueling or construction site for USO (Unidentified Submerged Objects).",
    reports: [
      "USS Nimitz sensor correlation (Trans-medium entry)",
      "1968 submerged structure sonar leak",
      "Magnetic field variance reports"
    ],
    lat: 25.0,
    lng: -71.0
  },
  {
    id: "nazca",
    name: "Nazca Incursion Hub",
    location: "Nazca Plateau, Peru",
    coordinates: "14.7208° S, 75.1211° W",
    depth: "Sub-Desert Chamber System",
    personnel: "Archaeological Cover / Redacted",
    security: "RESTRICTED // COBRA-7",
    description: "Ancient subterranean complex linked to the recovery of tridactyl NHI mummies. Satellite telemetry suggests active electromagnetic interference originating from deep within the glyph structures.",
    reports: [
      "2017 recovery of biological remains (Josephina/Maria)",
      "Anomalous gold/silver alloy implants detected",
      "Gravitational variance over the Hummingbird geoglyph"
    ],
    lat: -14.7208,
    lng: -75.1211
  },
  {
    id: "antarctica",
    name: "Base 211 (Site-X)",
    location: "Queen Maud Land, Antarctica",
    coordinates: "71.8500° S, 2.8167° E",
    depth: "Under-Ice // Geothermal Cavity",
    personnel: "Global Coalition / Unacknowledged",
    security: "BLACK-OUT // EVENT-HORIZON",
    description: "Massive pre-civilization structure discovered beneath 2 miles of ice. Utilizing geothermal heat to maintain a livable environment. Reports indicate large-scale craft hangars and advanced propulsion testing.",
    reports: [
      "Operation Highjump (1946) redacted encounters",
      "Neutrino detector spikes at IceCube facility",
      "High-speed trans-medium exits from under-ice rifts"
    ],
    lat: -71.8500,
    lng: 2.8167
  }
];

export function UndergroundBaseMap() {
  const [selectedBase, setSelectedBase] = useState<typeof BASE_NODES[0] | null>(null);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-4 h-full">
      <div className="relative bg-[#050505] border border-[#00ff00]/20 rounded-3xl overflow-hidden aspect-[21/9] lg:aspect-auto min-h-[500px]">
        {/* Professional Tactical Map Engine with Interaction */}
        <div className="absolute inset-0 opacity-40">
          <ComposableMap
            projectionConfig={{ scale: 200, center: [0, 20] }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup zoom={1} minZoom={0.5} maxZoom={10}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: "#0d1117",
                          stroke: "#00ff00",
                          strokeWidth: 0.3,
                          outline: "none",
                        },
                        hover: {
                          fill: "#1a2a1a",
                          stroke: "#00ff00",
                          strokeWidth: 0.5,
                          outline: "none",
                        }
                      }}
                    />
                  ))
                }
              </Geographies>
              
              {BASE_NODES.map((base) => (
                <Marker key={base.id} coordinates={[base.lng, base.lat]}>
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.3 }}
                    onClick={() => setSelectedBase(base)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing Sonar Ring */}
                    <circle
                      r={12}
                      fill="none"
                      stroke="#00ff00"
                      strokeWidth={1}
                      strokeOpacity={0.4}
                      className="animate-ping"
                    />
                    {/* Tactical Map Pin Icon */}
                    <g transform="translate(-12, -24)">
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        fill={selectedBase?.id === base.id ? "#00ff00" : "#00ff00/60"}
                        className="transition-colors drop-shadow-[0_0_8px_#00ff00]"
                      />
                    </g>
                  </motion.g>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#000_100%)] pointer-events-none" />

        {/* Tactical Overlays */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Radar Overlay Info */}
        <div className="absolute top-4 right-4 p-4 bg-black/60 border border-white/5 rounded-xl text-left space-y-2 pointer-events-none z-20">
           <div className="flex items-center gap-2">
             <Activity className="w-3 h-3 text-[#00ff00]" />
             <span className="font-mono text-[9px] text-[#00ff00] uppercase tracking-widest">Global_Incursion_Sweep</span>
           </div>
           <div className="font-mono text-[8px] text-white/30 uppercase">Scan: Active // Nodes: {BASE_NODES.length}</div>
        </div>
      </div>

      {/* INTELLIGENCE REVIEW SIDEBAR */}
      <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          {selectedBase ? (
            <motion.div
              key={selectedBase.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                 <div className="flex items-start justify-between">
                   <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{selectedBase.name}</h3>
                   <div className="px-2 py-1 bg-[#00ff00]/10 border border-[#00ff00]/20 rounded text-[8px] font-mono text-[#00ff00]">{selectedBase.security}</div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <div className="flex items-center gap-1 text-[8px] font-mono text-white/30 uppercase">
                         <Layers className="w-2.5 h-2.5" /> Depth
                       </div>
                       <div className="text-[10px] text-white font-mono">{selectedBase.depth}</div>
                    </div>
                    <div className="space-y-1">
                       <div className="flex items-center gap-1 text-[8px] font-mono text-white/30 uppercase">
                         <Users className="w-2.5 h-2.5" /> Personnel
                       </div>
                       <div className="text-[10px] text-white font-mono">{selectedBase.personnel}</div>
                    </div>
                 </div>

                 <div className="space-y-2">
                   <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest border-b border-white/5 pb-1">Site_Analysis</div>
                   <p className="text-[11px] text-white/60 leading-relaxed italic">"{selectedBase.description}"</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-2 font-mono text-[10px] text-white/40 uppercase">
                   <Info className="w-4 h-4" /> Forensic Reports
                 </div>
                 <div className="space-y-2">
                    {selectedBase.reports.map((report, i) => (
                      <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-[10px] text-white/50 border-l-2 border-l-[#00ff00]/40">
                         {report}
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-20 space-y-4">
               <Shield className="w-16 h-16" />
               <div className="font-mono text-[10px] uppercase tracking-[0.3em]">Select a tactical node to begin intelligence review</div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
