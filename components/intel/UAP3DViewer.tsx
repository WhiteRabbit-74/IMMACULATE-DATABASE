"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage, PerspectiveCamera } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { Suspense } from "react";

function Model({ url, color = "#00ffaa" }: { url: string | string[], color?: string }) {
  if (Array.isArray(url)) {
    return (
      <group>
        {url.map((u, i) => <SingleModel key={i} url={u} color={color} />)}
      </group>
    );
  }
  return <SingleModel url={url} color={color} />;
}

function SingleModel({ url, color }: { url: string, color: string }) {
  const geom = useLoader(STLLoader, url);
  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

export function UAP3DViewer({ ufoName }: { ufoName: string }) {
  let url: string | string[] = "";
  if (ufoName === "Saucer") url = "/media/foto/UFO STL 3D/Disc  Saucer Type.STL";
  if (ufoName === "Tic-Tac") url = [
    "/media/foto/UFO STL 3D/Tic_Tac_UFO/Tic_Tac_UFO/Tic Tac End Cap.stl",
    "/media/foto/UFO STL 3D/Tic_Tac_UFO/Tic_Tac_UFO/Tic Tac Middle.stl"
  ];

  if (!url) return <div className="text-white/20 font-mono text-xs uppercase">No 3D Model Available</div>;

  return (
    <div className="w-full h-full bg-black rounded-3xl border border-white/10 overflow-hidden relative">
      <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center text-[#00ffaa] font-mono animate-pulse uppercase">Initializing_3D_Matrix...</div>}>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <Stage intensity={0.5} environment="city" adjustCamera={false}>
            <Model url={url} />
          </Stage>
          <OrbitControls autoRotate />
        </Canvas>
      </Suspense>
    </div>
  );
}
