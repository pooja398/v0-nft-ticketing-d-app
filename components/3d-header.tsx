"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Text3D, Sphere, Box, Torus } from "@react-three/drei"
import { Suspense, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

function FloatingGeometry({
  position,
  color,
  geometry,
}: { position: [number, number, number]; color: string; geometry: "sphere" | "box" | "torus" }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.2
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const GeometryComponent = geometry === "sphere" ? Sphere : geometry === "box" ? Box : Torus

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <GeometryComponent
        ref={meshRef}
        position={position}
        args={geometry === "torus" ? [0.3, 0.1, 8, 16] : [0.5, 0.5, 0.5]}
      >
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </GeometryComponent>
    </Float>
  )
}

function AnimatedText() {
  const textRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
      <Text3D ref={textRef} font="/fonts/Geist_Bold.json" size={0.5} height={0.1} position={[-1.5, 0, 0]}>
        NFT
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} />
      </Text3D>
    </Float>
  )
}

export function Header3D({ className }: { className?: string }) {
  return (
    <div className={`h-32 w-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <Environment preset="night" />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
          <pointLight position={[-10, -10, 10]} intensity={0.8} color="#ff00ff" />
          <pointLight position={[0, 10, -10]} intensity={0.6} color="#ffff00" />

          <AnimatedText />

          <FloatingGeometry position={[2, 1, -1]} color="#00ffff" geometry="sphere" />
          <FloatingGeometry position={[-2, -1, 1]} color="#ff00ff" geometry="box" />
          <FloatingGeometry position={[3, -0.5, 0]} color="#ffff00" geometry="torus" />
          <FloatingGeometry position={[-3, 0.5, -2]} color="#ff6600" geometry="sphere" />

          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  )
}
