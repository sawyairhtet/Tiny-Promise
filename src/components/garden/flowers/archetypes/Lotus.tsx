"use client";

import { useMemo } from "react";
import Petal from "../parts/Petal";
import Stamen from "../parts/Stamen";
import Stem from "../parts/Stem";
import type { ArchetypeProps } from "../types";

const LAYERS = [
  { count: 6, radius: 0.0, scaleX: 1.0, scaleY: 1.0, tilt: 0.0, yOffset: 0.0 },
  { count: 6, radius: 0.02, scaleX: 0.95, scaleY: 0.96, tilt: 0.18, yOffset: 0.02 },
  { count: 6, radius: 0.03, scaleX: 0.85, scaleY: 0.88, tilt: 0.36, yOffset: 0.04 },
  { count: 6, radius: 0.035, scaleX: 0.72, scaleY: 0.78, tilt: 0.58, yOffset: 0.06 },
  { count: 6, radius: 0.04, scaleX: 0.58, scaleY: 0.62, tilt: 0.85, yOffset: 0.08 },
];

export default function Lotus({
  palette,
  bloom,
  seed,
  position,
  rotation,
  scale = 1,
}: ArchetypeProps) {
  const stemPoints = useMemo<Array<[number, number, number]>>(
    () => [
      [0, 0, 0],
      [0.01, 0.18, 0.02],
      [0.0, 0.38, 0.0],
      [0.0, 0.55, 0.0],
    ],
    [],
  );
  const droop = bloom < 0.3 ? -0.18 : 0;
  const flowerY = 0.58 + droop * 0.5;
  const openness = THREE_clamp(bloom);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Stem points={stemPoints} radius={0.024} />
      <group position={[0, flowerY, 0]} rotation={[droop, 0, droop * 0.6]}>
        {LAYERS.map((layer, li) => {
          const layerBloomTilt = -layer.tilt * (0.25 + 0.75 * openness);
          return (
            <group key={li} position={[0, layer.yOffset * openness, 0]}>
              {Array.from({ length: layer.count }).map((_, i) => {
                const angle = (i / layer.count) * Math.PI * 2 + (li % 2) * 0.25;
                return (
                  <group
                    key={i}
                    rotation={[0, angle, 0]}
                    position={[0, 0, 0]}
                  >
                    <Petal
                      position={[0, 0, 0.02 + layer.radius]}
                      rotation={[Math.PI / 2 + layerBloomTilt, 0, 0]}
                      width={0.34 * layer.scaleX}
                      length={0.55 * layer.scaleY}
                      thickness={0.012}
                      tipSharpness={0.55}
                      curl={0.45}
                      materialOptions={{
                        color: li < 2 ? palette.petal : palette.accent,
                        roughness: 0.32,
                        transmission: 0.65,
                        thickness: 0.45,
                      }}
                    />
                  </group>
                );
              })}
            </group>
          );
        })}

        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.08, 0.04, 18, 1, false]} />
          <meshStandardMaterial color={palette.stamen} roughness={0.55} metalness={0.1} />
        </mesh>
        <Stamen
          count={14}
          radius={0.058}
          height={0.02}
          beadRadius={0.012}
          seed={seed ^ 0x10707}
          position={[0, 0.08, 0]}
          materialOptions={{ color: palette.stamen, emissiveIntensity: 0.5 }}
        />
      </group>
    </group>
  );
}

function THREE_clamp(v: number): number {
  return Math.max(0, Math.min(1, v));
}
