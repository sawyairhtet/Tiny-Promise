"use client";

import { useMemo } from "react";
import Petal from "../parts/Petal";
import Stem from "../parts/Stem";
import type { ArchetypeProps } from "../types";

const RINGS = [
  { count: 12, radius: 0.07, tilt: -1.45, scale: 1.0, color: "petal" as const },
  { count: 10, radius: 0.055, tilt: -1.15, scale: 0.85, color: "petal" as const },
  { count: 8, radius: 0.04, tilt: -0.85, scale: 0.7, color: "accent" as const },
  { count: 6, radius: 0.025, tilt: -0.55, scale: 0.55, color: "accent" as const },
];

export default function Dahlia({
  palette,
  bloom,
  position,
  rotation,
  scale = 1,
}: ArchetypeProps) {
  const stemPoints = useMemo<Array<[number, number, number]>>(
    () => [
      [0, 0, 0],
      [0.01, 0.22, 0.02],
      [-0.01, 0.45, -0.01],
      [0, 0.62, 0],
    ],
    [],
  );

  const open = Math.max(0.18, bloom);
  const droop = bloom < 0.3 ? -0.22 : 0;
  const flowerY = 0.64 + droop * 0.4;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Stem points={stemPoints} radius={0.024} />

      <group position={[0, flowerY, 0]} rotation={[droop, 0, 0]}>
        {RINGS.map((ring, ri) => (
          <group key={ri} position={[0, ri * 0.012, 0]}>
            {Array.from({ length: ring.count }).map((_, i) => {
              const angle = (i / ring.count) * Math.PI * 2 + (ri % 2) * 0.18;
              return (
                <group key={i} rotation={[0, angle, 0]}>
                  <Petal
                    position={[0, 0, ring.radius]}
                    rotation={[ring.tilt - (1 - open) * 0.4, 0, 0]}
                    width={0.12 * ring.scale}
                    length={0.32 * ring.scale}
                    thickness={0.011}
                    tipSharpness={0.9}
                    curl={0.25}
                    materialOptions={{
                      color: ring.color === "petal" ? palette.petal : palette.accent,
                      roughness: 0.28,
                      transmission: 0.5,
                      thickness: 0.4,
                    }}
                  />
                </group>
              );
            })}
          </group>
        ))}
        <mesh position={[0, 0.06, 0]} castShadow>
          <sphereGeometry args={[0.03, 12, 10]} />
          <meshStandardMaterial
            color={palette.stamen}
            emissive={palette.stamen}
            emissiveIntensity={0.4}
            roughness={0.5}
          />
        </mesh>
      </group>
    </group>
  );
}
