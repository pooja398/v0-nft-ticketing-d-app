"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, RoundedBox } from "@react-three/drei"
import type { Group } from "three"

export function Ticket3D() {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [flipped, setFlipped] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1

      // Auto-rotation when not hovered
      if (!hovered) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      }
    }
  })

  const handleClick = () => {
    setFlipped(!flipped)
  }

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      rotation={flipped ? [0, Math.PI, 0] : [0, 0, 0]}
    >
      {/* Main ticket body */}
      <RoundedBox args={[3, 1.8, 0.1]} radius={0.1} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={flipped ? "#1e1b4b" : "#0f0f23"}
          metalness={0.8}
          roughness={0.2}
          emissive={hovered ? "#00ffff" : "#000033"}
          emissiveIntensity={hovered ? 0.1 : 0.05}
        />
      </RoundedBox>

      {/* Holographic overlay */}
      <RoundedBox args={[2.8, 1.6, 0.11]} radius={0.08} smoothness={4} position={[0, 0, 0.06]}>
        <meshStandardMaterial color="#00ffff" transparent opacity={0.1} metalness={1} roughness={0} />
      </RoundedBox>

      {/* Front side content */}
      {!flipped && (
        <group position={[0, 0, 0.07]}>
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.2}
            color="#00ffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-bold.woff"
          >
            NEON DREAMS
          </Text>
          <Text position={[0, 0.1, 0]} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle">
            FESTIVAL 2024
          </Text>
          <Text position={[0, -0.2, 0]} fontSize={0.1} color="#888888" anchorX="center" anchorY="middle">
            MARCH 15 • CYBER ARENA
          </Text>
          <Text position={[0, -0.4, 0]} fontSize={0.08} color="#ff00ff" anchorX="center" anchorY="middle">
            SEAT: A-42 • 0.05 ETH
          </Text>
        </group>
      )}

      {/* Back side content (QR code area) */}
      {flipped && (
        <group position={[0, 0, 0.07]} rotation={[0, Math.PI, 0]}>
          <RoundedBox args={[0.8, 0.8, 0.02]} radius={0.05} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#ffffff" />
          </RoundedBox>
          <Text position={[0, -0.3, 0]} fontSize={0.08} color="#00ffff" anchorX="center" anchorY="middle">
            SCAN TO VERIFY
          </Text>
          <Text position={[0, -0.5, 0]} fontSize={0.06} color="#888888" anchorX="center" anchorY="middle">
            TOKEN ID: #1337
          </Text>
        </group>
      )}

      {/* Glow effect */}
      <RoundedBox args={[3.2, 2, 0.05]} radius={0.12} position={[0, 0, -0.03]}>
        <meshStandardMaterial
          color="#00ffff"
          transparent
          opacity={hovered ? 0.05 : 0.02}
          emissive="#00ffff"
          emissiveIntensity={hovered ? 0.1 : 0.05}
        />
      </RoundedBox>
    </group>
  )
}
