"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Link2, Shield, User, Star, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DATA = {
  nodes: [
    { id: "Von Braun", type: "person", agency: "NASA/SS", group: 1 },
    { id: "Debus", type: "person", agency: "NASA/SS", group: 1 },
    { id: "Strughold", type: "person", agency: "USAF/SS", group: 1 },
    { id: "Op. Paperclip", type: "project", agency: "OSS/JIOA", group: 2 },
    { id: "Saturn V", type: "project", agency: "NASA", group: 3 },
    { id: "White Sands", type: "project", agency: "US Army", group: 3 },
    { id: "Project Sigma", type: "project", agency: "NSA", group: 4 },
    { id: "MJ-12", type: "project", agency: "Executive", group: 4 },
    { id: "Apollo", type: "project", agency: "NASA", group: 3 },
    { id: "Aerojet", type: "agency", agency: "Private", group: 5 },
  ],
  links: [
    { source: "Von Braun", target: "Op. Paperclip", type: "extraction" },
    { source: "Debus", target: "Op. Paperclip", type: "extraction" },
    { source: "Strughold", target: "Op. Paperclip", type: "extraction" },
    { source: "Von Braun", target: "Saturn V", type: "development" },
    { source: "Von Braun", target: "White Sands", type: "development" },
    { source: "Op. Paperclip", target: "MJ-12", type: "oversight" },
    { source: "MJ-12", target: "Project Sigma", type: "control" },
    { source: "Aerojet", target: "Saturn V", type: "contract" },
    { source: "Saturn V", target: "Apollo", type: "integration" },
  ]
};

export function PaperclipGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 500;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(DATA.nodes as any)
      .force("link", d3.forceLink(DATA.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(DATA.links)
      .join("line")
      .attr("stroke", "#ffffff")
      .attr("stroke-opacity", 0.1)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d: any) => d.type === "oversight" ? "4 4" : "none");

    const node = svg.append("g")
      .selectAll("g")
      .data(DATA.nodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("click", (e, d) => setSelectedNode(d))
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    node.append("circle")
      .attr("r", (d: any) => d.type === "project" ? 12 : 8)
      .attr("fill", (d: any) => d.type === "project" ? "#00ff00" : d.type === "person" ? "#00aaff" : "#ffffff")
      .attr("fill-opacity", 0.2)
      .attr("stroke", (d: any) => d.type === "project" ? "#00ff00" : d.type === "person" ? "#00aaff" : "#ffffff")
      .attr("stroke-width", 2);

    node.append("text")
      .attr("dy", 24)
      .attr("text-anchor", "middle")
      .attr("font-family", "monospace")
      .attr("font-size", "8px")
      .attr("fill", "#ffffff")
      .attr("fill-opacity", 0.4)
      .text((d: any) => d.id.toUpperCase());

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

  }, []);

  return (
    <div className="bg-black/60 border border-[#00ff00]/20 rounded-2xl p-6 font-mono overflow-hidden">
      <div className="flex items-center gap-3 mb-6 border-b border-[#00ff00]/10 pb-4">
        <Link2 className="w-5 h-5 text-[#00ff00]" />
        <div className="flex flex-col">
          <div className="text-[10px] text-[#00ff00] uppercase tracking-[0.3em] font-bold">Forensic_Module // 13</div>
          <div className="text-sm text-white uppercase font-black italic tracking-tighter">Paperclip_Connectivity_Graph</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8">
        <div className="bg-black/40 border border-white/10 rounded-xl relative overflow-hidden h-[500px]">
           <svg ref={svgRef} className="w-full h-full" viewBox="0 0 800 500" />
           
           <div className="absolute top-4 left-4 flex gap-4 text-[8px] uppercase tracking-widest text-white/30">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border border-blue-400" /> Personnel</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border border-[#00ff00]" /> Projects</div>
           </div>
        </div>

        <div className="space-y-4">
           <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-4 bg-white/[0.02] border border-[#00ff00]/20 rounded-xl space-y-4"
                >
                   <div className="flex items-center gap-2 text-[#00ff00] font-bold text-[10px] uppercase">
                      {selectedNode.type === "person" ? <User className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                      Node_Inspector
                   </div>
                   
                   <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tighter">{selectedNode.id}</h4>
                      <div className="text-[9px] text-white/40 uppercase mt-1">{selectedNode.agency}</div>
                   </div>

                   <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                      <div className="text-[8px] text-white/20 uppercase mb-2">Operational_History</div>
                      <p className="text-[9px] text-white/50 leading-relaxed italic">
                        Node extracted during Phase 2 of Operation Paperclip. Core contributor to the foundational logic of the unacknowledged sector.
                      </p>
                   </div>

                   <button className="w-full py-2 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 text-[#00ff00] font-mono text-[9px] rounded-lg uppercase tracking-widest transition-all">
                      Extract_Dossier
                   </button>
                </motion.div>
              ) : (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-white/20 font-mono text-[9px] uppercase italic">
                   Select a node to inspect connectivity metrics.
                </div>
              )}
           </AnimatePresence>

           <div className="p-4 bg-[#00ff00]/5 border border-[#00ff00]/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-[10px] text-[#00ff00] font-bold uppercase tracking-widest">
                 <Shield className="w-3 h-3" /> Security_Notice
              </div>
              <p className="text-[8px] text-white/30 leading-relaxed">
                Graph depicts unclassified and leaked data points. Actual MJ-12 hierarchy remains compartmentalized.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
