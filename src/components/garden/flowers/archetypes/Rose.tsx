"use client";

import { useMemo } from "react";
import Leaf from "../parts/Leaf";
import Petal from "../parts/Petal";
import Stem from "../parts/Stem";
import type { ArchetypeProps } from "../types";

const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const PETAL_COUNT = 18;

export default function Rose({
  palette,
  bloom,
  position,
  rotation,
  scale = 1,
}: ArchetypeProps) {
  const stemPoints = useMemo<Array<[number, number, number]>>(
    () => [
      [0, 0, 0],
      [0.025, 0.18, 0.02],
      [-0.02, 0.38, -0.01],
      [0.0, 0.55, 0.0],
    ],
    [],
  );

  const open = Math.max(0.15, bloom);
  const droop = bloom < 0.3 ? -0.22 : 0;
  const flowerY = 0.57 + droop * 0.4;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Stem points={stemPoints} radius={0.022} />
      <Leaf
        position={[0.16, 0.22, 0.04]}
        rotation={[0.2, 0.4, 0.6]}
        length={0.22}
        width={0.1}
        color="#365B36"
      />
      <Leaf
        position={[-0.14, 0.32, -0.02]}
        rotation={[0.1, -0.6, -0.5]}
        length={0.2}
        width={0.09}
        color="#3F6B3F"
      />

      <group position={[0, flowerY, 0]} rotation={[droop, 0, droop * 0.3]}>
        {Array.from({ length: PETAL_COUNT }).map((_, i) => {
          const t = i / (PETAL_COUNT - 1);
          const angle = i * GOLDEN;
          const radius = 0.005 + t * 0.07;
          const tilt = -0.05 - t * (1.2 + open * 0.3);
          const petalScale = 0.55 + t * 0.5;
          const color = t < 0.35 ? palette.accent : palette.petal;
          return (
            <group key={i} rotation={[0, angle, 0]}>
              <Petal
                position={[0, t * 0.015, radius]}
                rotation={[tilt, 0, 0]}
                width={0.22 * petalScale}
                length={0.42 * petalScale}
                thickness={0.014}
                tipSharpness={0.25}
                curl={0.55}
                materialOptions={{
                  color,
                  roughness: 0.28,
                  transmission: 0.55,
                  thickness: 0.55,
                  clearcoat: 0.45,
                }}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}
