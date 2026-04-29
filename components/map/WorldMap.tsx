"use client";

import { useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { motion } from "framer-motion";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapDoc {
  id: string;
  title: string;
  status: string;
  latitude: number;
  longitude: number;
  country?: string;
  year: number;
  agency: { name: string; colorPrimary: string };
}

interface MapAnomaly {
  id: string;
  title: string;
  status: string;
  latitude: number;
  longitude: number;
  country?: string;
  severity: number;
  objectType?: string;
}

interface MapMedia {
  id: string;
  title: string;
  type: string;
  category: string;
  latitude: number;
  longitude: number;
  year: number;
}

interface Props {
  documents: MapDoc[];
  anomalies: MapAnomaly[];
  media?: MapMedia[];
  onSelect: (item: MapDoc | MapAnomaly | MapMedia | null) => void;
  selected: MapDoc | MapAnomaly | MapMedia | null;
}

export default function WorldMap({ documents, anomalies, media = [], onSelect, selected }: Props) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (tooltip) {
      setTooltip((t) => t ? { ...t, x: e.clientX, y: e.clientY } : null);
    }
  }, [tooltip]);

  return (
    <div className="w-full h-full relative" onMouseMove={handleMouseMove}>
      <ComposableMap
        style={{ width: "100%", height: "100%", background: "transparent" }}
        projectionConfig={{ scale: 147, center: [10, 10] }}
      >
        <ZoomableGroup zoom={1} minZoom={0.8} maxZoom={8}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: "#0d1117",
                      stroke: "#1a2a1a",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "#111a11",
                      stroke: "#00ff00",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#0a150a",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Document Markers */}
          {documents.map((doc) => {
            const isSelected = selected?.id === doc.id;
            const color = doc.status === "classified" ? "#ff3333" : "#33ff99";
            const glowColor = doc.status === "classified" ? "rgba(255,51,51,0.5)" : "rgba(51,255,153,0.5)";

            return (
              <Marker
                key={doc.id}
                coordinates={[doc.longitude, doc.latitude]}
                onClick={() => onSelect(isSelected ? null : doc)}
                onMouseEnter={(e: any) =>
                  setTooltip({
                    x: e.clientX,
                    y: e.clientY,
                    text: `${doc.title} (${doc.year}) — ${doc.agency.name}`,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
              >
                <circle
                  r={isSelected ? 10 : 5}
                  fill={color}
                  fillOpacity={0.8}
                  style={{
                    cursor: "pointer",
                    filter: `drop-shadow(0 0 ${isSelected ? 12 : 4}px ${glowColor})`,
                    transition: "all 0.2s ease",
                  }}
                />
                {isSelected && (
                  <circle
                    r={16}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.5}
                    strokeOpacity={0.6}
                    strokeDasharray="4 2"
                  />
                )}
              </Marker>
            );
          })}

          {/* Anomaly Markers */}
          {anomalies.map((anomaly) => {
            const isSelected = selected?.id === anomaly.id;
            const size = Math.max(4, anomaly.severity * 2);

            return (
              <Marker
                key={anomaly.id}
                coordinates={[anomaly.longitude, anomaly.latitude]}
                onClick={() => onSelect(isSelected ? null : anomaly)}
                onMouseEnter={(e: any) =>
                  setTooltip({
                    x: e.clientX,
                    y: e.clientY,
                    text: `UAP: ${anomaly.title} — Severity ${anomaly.severity}/5`,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Diamond shape for anomalies */}
                <polygon
                  points={`0,${-size} ${size},0 0,${size} ${-size},0`}
                  fill="#ffaa00"
                  fillOpacity={0.9}
                  style={{
                    cursor: "pointer",
                    filter: `drop-shadow(0 0 ${isSelected ? 10 : 5}px rgba(255,170,0,0.7))`,
                    transition: "all 0.2s ease",
                  }}
                />
                {/* Pulse ring for high severity */}
                {anomaly.severity >= 4 && (
                  <circle
                    r={size + 8}
                    fill="none"
                    stroke="#ffaa00"
                    strokeWidth={0.8}
                    strokeOpacity={0.4}
                    strokeDasharray="3 2"
                  />
                )}
              </Marker>
            );
          })}

          {/* Media Markers */}
          {media.map((m) => {
            const isSelected = selected?.id === m.id;
            return (
              <Marker
                key={m.id}
                coordinates={[m.longitude, m.latitude]}
                onClick={() => onSelect(isSelected ? null : m)}
                onMouseEnter={(e: any) =>
                  setTooltip({
                    x: e.clientX,
                    y: e.clientY,
                    text: `MEDIA: ${m.title} (${m.year}) — ${m.type}`,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
              >
                <rect
                  x={isSelected ? -8 : -4}
                  y={isSelected ? -8 : -4}
                  width={isSelected ? 16 : 8}
                  height={isSelected ? 16 : 8}
                  fill="#0088ff"
                  fillOpacity={0.9}
                  style={{
                    cursor: "pointer",
                    filter: `drop-shadow(0 0 ${isSelected ? 10 : 4}px rgba(0,136,255,0.7))`,
                    transition: "all 0.2s ease",
                  }}
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-black/90 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 font-mono text-[11px] text-white max-w-xs"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Tactical Overlays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <motion.div 
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-[#00ff00]/20 shadow-[0_0_15px_rgba(0,255,0,0.5)] z-20"
        />
      </div>
    </div>
  );
}
