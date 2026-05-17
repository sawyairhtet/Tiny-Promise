"use client";

import { useMemo } from "react";
import Leaf from "../parts/Leaf";
import Petal from "../parts/Petal";
import Stem from "../parts/Stem";
import type { ArchetypeProps } from "../types";

export default function Tulip({
  palette,
  bloom,
  position,
  rotation,
  scale = 1,
}: ArchetypeProps) {
  const stemPoints = useMemo<Array<[number, number, number]>>(
    () => [
      [0, 0, 0],
      [0.01, 0.25, 0.02],
      [-0.01, 0.55, 0.0],
      [0.0, 0.78, 0.0],
    ],
    [],
  );

  const open = Math.max(0.18, bloom);
  const droop = bloom < 0.3 ? -0.3 : 0;
  const flowerY = 0.8 + droop * 0.45;
  const cupTilt = -0.4 - open * 0.35;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Stem points={stemPoints} radius={0.022} />
      <Leaf
        position={[0.08, 0.18, 0]}
        rotation={[0.15, 0.6, 0.7]}
        length={0.4}
        width={0.09}
        color="#3A6E40"
      />

      <group position={[0, flowerY, 0]} rotation={[droop, 0, 0]}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2 + (i % 2) * (Math.PI / 6);
          return (
            <group key={i} rotation={[0, angle, 0]}>
              <Petal
                position={[0, -0.06, 0.04]}
                rotation={[cupTilt, 0, 0]}
                width={0.28}
                length={0.48}
                thickness={0.015}
                tipSharpness={0.1}
                curl={0.15}
                materialOptions={{
                  color: palette.petal,
                  roughness: 0.22,
                  transmission: 0.5,
                  thickness: 0.55,
                  clearcoat: 0.7,
                }}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}
