"use client";

import { useMemo } from "react";
import Petal from "../parts/Petal";
import Stem from "../parts/Stem";
import type { ArchetypeProps } from "../types";

export default function Orchid({
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
      [-0.02, 0.45, -0.02],
      [0, 0.65, 0],
    ],
    [],
  );

  const open = Math.max(0.18, bloom);
  const droop = bloom < 0.3 ? -0.22 : 0;
  const flowerY = 0.66 + droop * 0.4;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Stem points={stemPoints} radius={0.02} />

      <group position={[0, flowerY, 0]} rotation={[droop, 0, 0]}>
        {/* Two upright (back) petals */}
        {[-1, 1].map((side) => (
          <group key={`up-${side}`} rotation={[0, 0, side * 0.5]}>
            <Petal
              position={[0, 0.05, 0.03]}
              rotation={[-0.4, 0, side * 0.2]}
              width={0.18}
              length={0.3}
              thickness={0.012}
              tipSharpness={0.5}
              curl={0.35}
              materialOptions={{
                color: palette.petal,
                roughness: 0.25,
                transmission: 0.65,
                thickness: 0.45,
              }}
            />
          </group>
        ))}

        {/* Two side petals */}
        {[-1, 1].map((side) => (
          <group key={`side-${side}`} rotation={[0, 0, side * 1.4]}>
            <Petal
              position={[0, 0, 0.03]}
              rotation={[-1.55, 0, 0]}
              width={0.22}
              length={0.38}
              thickness={0.012}
              tipSharpness={0.55}
              curl={0.45}
              materialOptions={{
                color: palette.petal,
                roughness: 0.25,
                transmission: 0.65,
                thickness: 0.45,
              }}
            />
          </group>
        ))}

        {/* Bottom labellum (the lip) — focal point */}
        <group rotation={[0, 0, Math.PI]}>
          <Petal
            position={[0, 0.02, 0.06]}
            rotation={[-1.55, 0, 0]}
            width={0.3}
            length={0.42}
            thickness={0.018}
            tipSharpness={0.3}
            curl={0.85 * open}
            materialOptions={{
              color: palette.accent,
              roughness: 0.22,
              transmission: 0.4,
              thickness: 0.6,
              clearcoat: 0.55,
            }}
          />
          <mesh position={[0, 0.08, 0.04]} castShadow>
            <sphereGeometry args={[0.04, 12, 10]} />
            <meshStandardMaterial
              color={palette.stamen}
              emissive={palette.stamen}
              emissiveIntensity={0.35}
              roughness={0.5}
            />
          </mesh>
          <mesh position={[0, 0.04, 0.07]} castShadow>
            <sphereGeometry args={[0.026, 10, 8]} />
            <meshStandardMaterial color="#F2C24A" emissive="#F2C24A" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
