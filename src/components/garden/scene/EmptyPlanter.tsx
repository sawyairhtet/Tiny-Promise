"use client";

import { Html } from "@react-three/drei";
import { ATMOSPHERE } from "../config/palette";

export default function EmptyPlanter() {
  return (
    <group>
      <WateringCan />
      <Sprout />
      <Html
        position={[0, 1.45, 0]}
        center
        distanceFactor={6}
        style={{
          pointerEvents: "none",
          color: ATMOSPHERE.labelText,
          fontFamily: "var(--font-garden-serif), 'Cormorant Garamond', serif",
          fontSize: "20px",
          fontStyle: "italic",
          whiteSpace: "nowrap",
          textShadow: "0 1px 8px rgba(0, 0, 0, 0.45)",
          letterSpacing: "0.02em",
        }}
      >
        Your garden is waiting.
      </Html>
    </group>
  );
}

function WateringCan() {
  return (
    <group position={[-1.4, 0.18, 0.6]} rotation={[0, -0.4, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.34, 0.38, 0.55, 24]} />
        <meshStandardMaterial
          color={ATMOSPHERE.clayTerracotta}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      <mesh castShadow position={[0, 0.6, 0]}>
        <torusGeometry args={[0.34, 0.04, 12, 32]} />
        <meshStandardMaterial
          color={ATMOSPHERE.clayTerracotta}
          roughness={0.78}
          metalness={0.05}
        />
      </mesh>

      <mesh
        castShadow
        position={[0.5, 0.42, 0]}
        rotation={[0, 0, -Math.PI / 3]}
      >
        <cylinderGeometry args={[0.07, 0.09, 0.55, 16]} />
        <meshStandardMaterial
          color={ATMOSPHERE.clayTerracotta}
          roughness={0.82}
          metalness={0.05}
        />
      </mesh>

      <mesh
        castShadow
        position={[-0.42, 0.36, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.18, 0.035, 12, 24, Math.PI]} />
        <meshStandardMaterial
          color={ATMOSPHERE.clayTerracotta}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

function Sprout() {
  return (
    <group position={[0.25, 0.18, 0]}>
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.018, 0.022, 0.36, 8]} />
        <meshStandardMaterial
          color={ATMOSPHERE.sproutStem}
          roughness={0.7}
          metalness={0}
        />
      </mesh>
      <mesh castShadow position={[-0.07, 0.34, 0]} rotation={[0, 0, 0.5]}>
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshStandardMaterial
          color={ATMOSPHERE.sproutLeaf}
          roughness={0.6}
          metalness={0}
        />
      </mesh>
      <mesh castShadow position={[0.07, 0.36, 0.02]} rotation={[0, 0, -0.5]}>
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshStandardMaterial
          color={ATMOSPHERE.sproutLeaf}
          roughness={0.6}
          metalness={0}
        />
      </mesh>
    </group>
  );
}
