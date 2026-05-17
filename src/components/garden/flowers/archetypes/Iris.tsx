"use client";

import { useMemo } from "react";
import Petal from "../parts/Petal";
import Stem from "../parts/Stem";
import type { ArchetypeProps } from "../types";

export default function Iris({
  palette,
  bloom,
  position,
  rotation,
  scale = 1,
}: ArchetypeProps) {
  const stemPoints = useMemo<Array<[number, number, number]>>(
    () => [
      [0, 0, 0],
      [0.01, 0.25, 0.01],
      [0, 0.55, 0],
      [0, 0.8, 0],
    ],
    [],
  );

  const open = Math.max(0.18, bloom);
  const droop = bloom < 0.3 ? -0.25 : 0;
  const flowerY = 0.82 + droop * 0.45;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Stem points={stemPoints} radius={0.022} />

      <group position={[0, flowerY, 0]} rotation={[droop, 0, 0]}>
        {Array.from({ length: 3 }).map((_, i) => {
          const angle = (i / 3) * Math.PI * 2;
          return (
            <group key={`fall-${i}`} rotation={[0, angle, 0]}>
              <Petal
                position={[0, -0.05, 0.05]}
                rotation={[-2.0 - open * 0.3, 0, 0]}
                width={0.28}
                length={0.42}
                thickness={0.014}
                tipSharpness={0.25}
                curl={0.5}
                materialOptions={{
                  color: palette.petal,
                  roughness: 0.25,
                  transmission: 0.6,
                  thickness: 0.5,
                }}
              />
              <group position={[0, -0.05, 0.1]} rotation={[-1.5, 0, 0]}>
                {Array.from({ length: 6 }).map((_, b) => (
                  <mesh
                    key={b}
                    position={[0, 0.04 * b, 0]}
                    castShadow
                  >
                    <coneGeometry args={[0.012, 0.025, 6]} />
                    <meshStandardMaterial
                      color={palette.stamen}
                      emissive={palette.stamen}
                      emissiveIntensity={0.4}
                      roughness={0.55}
                    />
                  </mesh>
                ))}
              </group>
            </group>
          );
        })}

        {Array.from({ length: 3 }).map((_, i) => {
          const angle = (i / 3) * Math.PI * 2 + Math.PI / 3;
          return (
            <group key={`std-${i}`} rotation={[0, angle, 0]}>
              <Petal
                position={[0, 0.02, 0.03]}
                rotation={[-0.4 - open * 0.2, 0, 0]}
                width={0.2}
                length={0.32}
                thickness={0.012}
                tipSharpness={0.4}
                curl={0.4}
                materialOptions={{
                  color: palette.accent,
                  roughness: 0.28,
                  transmission: 0.58,
                  thickness: 0.45,
                }}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}
