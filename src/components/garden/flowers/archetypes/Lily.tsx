"use client";

import { useMemo } from "react";
import Petal from "../parts/Petal";
import Stem from "../parts/Stem";
import type { ArchetypeProps } from "../types";

export default function Lily({
  palette,
  bloom,
  position,
  rotation,
  scale = 1,
}: ArchetypeProps) {
  const stemPoints = useMemo<Array<[number, number, number]>>(
    () => [
      [0, 0, 0],
      [0.02, 0.22, 0.02],
      [-0.02, 0.45, -0.01],
      [0.0, 0.7, 0.0],
    ],
    [],
  );
  const droop = bloom < 0.3 ? -0.25 : 0;
  const flowerY = 0.72 + droop * 0.4;
  const open = Math.max(0.15, bloom);
  const tilt = -1.0 - open * 0.6;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Stem points={stemPoints} radius={0.02} />
      <group position={[0, flowerY, 0]} rotation={[droop, 0, 0]}>
        {[0, 1].map((ring) =>
          Array.from({ length: 3 }).map((_, i) => {
            const angle =
              (i / 3) * Math.PI * 2 + (ring === 1 ? Math.PI / 3 : 0);
            return (
              <group key={`${ring}-${i}`} rotation={[0, angle, 0]}>
                <Petal
                  position={[0, 0, 0.04]}
                  rotation={[tilt, 0, 0]}
                  width={0.22}
                  length={0.62}
                  thickness={0.01}
                  tipSharpness={0.8}
                  curl={0.7 * open}
                  materialOptions={{
                    color: ring === 0 ? palette.petal : palette.accent,
                    roughness: 0.18,
                    transmission: 0.7,
                    thickness: 0.35,
                    clearcoat: 0.55,
                  }}
                />
              </group>
            );
          }),
        )}

        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <group key={`s-${i}`} rotation={[0, angle, 0]}>
              <mesh position={[0, 0.05, 0.0]} rotation={[-0.5, 0, 0]} castShadow>
                <cylinderGeometry args={[0.004, 0.004, 0.16, 6]} />
                <meshStandardMaterial
                  color={palette.stamen}
                  emissive={palette.stamen}
                  emissiveIntensity={0.25}
                  roughness={0.45}
                />
              </mesh>
              <mesh
                position={[
                  Math.sin(0.5) * 0.0,
                  0.05 + Math.cos(-0.5) * 0.16,
                  Math.sin(-0.5) * -0.16,
                ]}
                castShadow
              >
                <sphereGeometry args={[0.015, 10, 8]} />
                <meshStandardMaterial
                  color={palette.stamen}
                  emissive={palette.stamen}
                  emissiveIntensity={0.5}
                  roughness={0.4}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
