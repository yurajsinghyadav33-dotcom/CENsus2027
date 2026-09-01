"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

const locations = [
  { name: 'UP', lat: 26.84, lng: 80.94, status: 'complete', progress: 95 },
  { name: 'Maharashtra', lat: 19.75, lng: 75.71, status: 'complete', progress: 92 },
  { name: 'Bihar', lat: 25.09, lng: 85.31, status: 'in-progress', progress: 65 },
  { name: 'Assam', lat: 26.20, lng: 92.93, status: 'pending', progress: 12 },
];

function Globe() {
  const globeRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={globeRef}>
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#0f172a" 
          wireframe={true} 
          transparent={true} 
          opacity={0.3} 
        />
      </Sphere>
      <Sphere args={[1.98, 32, 32]}>
         <meshStandardMaterial 
          color="#020617" 
        />
      </Sphere>
      
      {/* Map pins (approximated on a sphere) */}
      {locations.map((loc, i) => {
        // Convert lat/lng to roughly front-facing positions for visualization
        const phi = (90 - loc.lat) * (Math.PI / 180);
        const theta = (loc.lng + 180) * (Math.PI / 180);
        
        const x = -(2.1 * Math.sin(phi) * Math.cos(theta));
        const z = (2.1 * Math.sin(phi) * Math.sin(theta));
        const y = (2.1 * Math.cos(phi));
        
        // Adjust these to show up on the front for this demo
        const demoX = (i - 1.5) * 0.8;
        const demoY = (Math.random() - 0.5) * 1.5;
        const demoZ = 1.8;

        const color = loc.status === 'complete' ? '#10b981' : loc.status === 'in-progress' ? '#eab308' : '#ef4444';

        return (
          <group key={loc.name} position={[demoX, demoY, demoZ]}>
            <Sphere args={[0.04, 16, 16]}>
              <meshBasicMaterial color={color} />
            </Sphere>
            <Html distanceFactor={10} position={[0.1, 0, 0]}>
              <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 whitespace-nowrap">
                <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: color }} />
                <span className="text-white text-xs font-medium">{loc.name}</span>
                <span className="text-white/60 text-[10px] ml-2">{loc.progress}%</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function IndiaMap3D() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        <Globe />
        <OrbitControls enableZoom={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
