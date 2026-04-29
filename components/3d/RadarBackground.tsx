"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";

// Pages where radar ruins the background
// Pages where radar ruins the background or is too heavy
const HIDDEN_ON = ["/map", "/mj12", "/auth", "/admin", "/advanced-intel", "/media"];

export function RadarBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const hidden = HIDDEN_ON.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (hidden || !containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = -10;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); // Disable antialias for performance
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)); // Cap pixel ratio
    containerRef.current.appendChild(renderer.domElement);

    const gridHelper = new THREE.PolarGridHelper(40, 16, 8, 64, 0x00ff00, 0x003300);
    gridHelper.rotation.x = Math.PI / 2;
    (gridHelper.material as THREE.LineBasicMaterial).transparent = true;
    (gridHelper.material as THREE.LineBasicMaterial).opacity = 0.12;
    scene.add(gridHelper);

    const sweepGeo = new THREE.BufferGeometry();
    sweepGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0, 40, 0, 0]), 3));
    const sweepLine = new THREE.Line(sweepGeo, new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.7 }));
    scene.add(sweepLine);

    const coneMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.08, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
    const sweepCone = new THREE.Mesh(new THREE.CircleGeometry(40, 32, 0, Math.PI / 8), coneMat);
    scene.add(sweepCone);

    const blipsCount = 12;
    const blipPos = new Float32Array(blipsCount * 3);
    const blipAlpha = new Float32Array(blipsCount);
    for (let i = 0; i < blipsCount; i++) {
      const r = Math.random() * 35, a = Math.random() * Math.PI * 2;
      blipPos[i * 3] = Math.cos(a) * r; blipPos[i * 3 + 1] = Math.sin(a) * r; blipPos[i * 3 + 2] = 0;
      blipAlpha[i] = Math.random();
    }
    const blipGeo = new THREE.BufferGeometry();
    blipGeo.setAttribute("position", new THREE.BufferAttribute(blipPos, 3));
    blipGeo.setAttribute("alpha", new THREE.BufferAttribute(blipAlpha, 1));
    const blipMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, color: { value: new THREE.Color(0x00ff00) } },
      vertexShader: `attribute float alpha; varying float vAlpha; void main() { vAlpha = alpha; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = 4.0*(30.0/-mv.z); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 color; uniform float time; varying float vAlpha; void main() { float d=length(gl_PointCoord-vec2(0.5)); if(d>0.5)discard; float p=(sin(time*2.0+vAlpha*10.0)+1.0)*0.5; gl_FragColor=vec4(color,(0.5-d)*2.0*p*0.7); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    scene.add(new THREE.Points(blipGeo, blipMat));

    let angle = 0;
    const clock = new THREE.Clock();
    let rafId: number;
    let lastTime = 0;
    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      
      // Throttle to ~30 FPS
      if (now - lastTime < 33) return;
      lastTime = now;

      const delta = clock.getDelta(), elapsed = clock.getElapsedTime();
      angle -= delta * 1.5;
      sweepLine.rotation.z = angle; sweepCone.rotation.z = angle;
      blipMat.uniforms.time.value = elapsed;
      camera.position.x = Math.sin(elapsed * 0.1) * 2;
      camera.position.y = -10 + Math.cos(elapsed * 0.15) * 2;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);

    const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      if (containerRef.current?.contains(renderer.domElement)) containerRef.current.removeChild(renderer.domElement);
      renderer.dispose(); scene.clear();
    };
  }, [hidden]);

  if (hidden) return null;

  return <div ref={containerRef} className="fixed inset-0 z-[-1] pointer-events-none opacity-20 mix-blend-screen" />;
}
