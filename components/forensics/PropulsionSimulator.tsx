"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars, Float, Gltf } from "@react-three/drei";
import * as THREE from "three";
import { Zap, Activity, Shield, RefreshCw, Cpu } from "lucide-react";

function Craft({ type, velocity }: { type: string, velocity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Anomalous jitter/vibration
    meshRef.current.position.y = Math.sin(t * velocity * 2) * 0.2;
    meshRef.current.rotation.y += 0.01 * velocity;
    meshRef.current.rotation.z = Math.sin(t) * 0.1;
  });

  return (
    <Float speed={5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        {type === "tic-tac" ? (
          <capsuleGeometry args={[0.5, 1, 32]} />
        ) : type === "triangle" ? (
          <coneGeometry args={[1, 0.5, 3]} />
        ) : (
          <sphereGeometry args={[0.8, 32, 32]} />
        )}
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={1} 
          roughness={0.1} 
          emissive="#00ff00"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

export function PropulsionSimulator() {
  const [craftType, setCraftType] = useState("tic-tac");
  const [velocity, setVelocity] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="bg-black/60 border border-[#00ff00]/20 rounded-2xl p-6 font-mono overflow-hidden">
      <div className="flex items-center gap-3 mb-6 border-b border-[#00ff00]/10 pb-4">
        <Cpu className="w-5 h-5 text-[#00ff00]" />
        <div className="flex flex-col">
          <div className="text-[10px] text-[#00ff00] uppercase tracking-[0.3em] font-bold">Forensic_Module // 28</div>
          <div className="text-sm text-white uppercase font-black italic tracking-tighter">Anomalous_Propulsion_Sim</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3D Viewport */}
        <div className="lg:col-span-8 bg-black/80 border border-white/10 rounded-xl h-[400px] relative group overflow-hidden">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00ff00" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            <Craft type={craftType} velocity={velocity} />
            
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={velocity} />
          </Canvas>

          {/* HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
             <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <div className="text-[8px] text-[#00ff00] font-bold uppercase tracking-widest flex items-center gap-2">
                      <Activity className="w-3 h-3" /> Live_Telemetry
                   </div>
                   <div className="text-[10px] text-white/40 uppercase">G-FORCE: {(velocity * 12).toFixed(1)}G</div>
                   <div className="text-[10px] text-white/40 uppercase">VELOCITY: MACH {(velocity * 4).toFixed(2)}</div>
                </div>
                <div className="w-24 h-12 border border-white/10 bg-black/60 flex items-center justify-center">
                   <div className="text-[10px] text-white font-black tracking-tighter">SIM_ACTIVE</div>
                </div>
             </div>
             
             <div className="flex justify-between items-end">
                <div className="font-mono text-[7px] text-white/20 uppercase max-w-[200px]">
                   Visualizing inertia-cancellation characteristics based on radar-return data.
                </div>
                <div className="flex gap-1">
                   {Array.from({ length: 12 }).map((_, i) => (
                     <div key={i} className="w-1 h-3 bg-[#00ff00]/20 rounded-full" />
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
           <div className="space-y-4">
              <div>
                 <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-3">Morphology</label>
                 <div className="grid grid-cols-2 gap-2">
                    {["tic-tac", "triangle", "disc", "cube"].map(t => (
                      <button
                        key={t}
                        onClick={() => setCraftType(t)}
                        className={`py-2 px-3 rounded-lg border font-mono text-[9px] uppercase tracking-widest transition-all ${
                          craftType === t ? "bg-[#00ff00]/10 border-[#00ff00]/40 text-[#00ff00]" : "bg-white/5 border-white/10 text-white/30 hover:border-white/20"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                 </div>
              </div>

              <div>
                 <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-3">Gravitic_Intensity</label>
                 <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={velocity}
                    onChange={(e) => setVelocity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#00ff00]"
                 />
                 <div className="flex justify-between text-[8px] text-white/20 mt-2 uppercase">
                    <span>Stable</span>
                    <span>Trans-Medium</span>
                 </div>
              </div>
           </div>

           <div className="pt-6 border-t border-white/5 space-y-3">
              <button className="w-full py-3 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 text-[#00ff00] font-mono text-[9px] rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                 <RefreshCw className="w-3.5 h-3.5" /> Reinitialize_Physics
              </button>
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 font-mono text-[9px] rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                 <Shield className="w-3.5 h-3.5" /> Stability_Lock
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
