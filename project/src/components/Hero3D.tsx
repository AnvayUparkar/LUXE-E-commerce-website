import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, MeshDistortMaterial, Environment } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

function FloatingProduct({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <Box ref={meshRef} position={position} args={[1, 1, 1]}>
      <MeshDistortMaterial
        color="#f97316"
        attach="material"
        distort={0.3}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Box>
  );
}

function FloatingSphere({ position }: { position: [number, number, number] }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      sphereRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 1.2) * 0.3;
    }
  });

  return (
    <Sphere ref={sphereRef} position={position} args={[0.8, 32, 32]}>
      <MeshDistortMaterial
        color="#1e40af"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.1}
        metalness={0.9}
      />
    </Sphere>
  );
}

function Scene() {
  return (
    <>
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <FloatingProduct position={[2, 0, 0]} />
      <FloatingProduct position={[-2, 1, -1]} />
      <FloatingSphere position={[0, -1, 1]} />
      <FloatingSphere position={[3, 1, -2]} />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
    </>
  );
}

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
}