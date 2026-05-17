"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mulberry32 } from "../parts/random";
import Stem from "../parts/Stem";
import type { ArchetypeProps } from "../types";

interface Bloom {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  colorMix: number;
}

export default function WisteriaCascade({
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
      [0.02, 0.22, 0.02],
      [0.05, 0.45, 0.02],
      [0.08, 0.68, 0.01],
      [0.1, 0.85, 0],
    ],
    [],
  );

  const blooms = useMemo<Bloom[]>(() => {
    const rng = mulberry32(seed || 1);
    const count = 32;
    const arr: Bloom[] = [];
    const cascadeLength = 0.85;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const taper = 1 - t * 0.65;
      const ringR = 0.07 * taper;
      const around = rng() * Math.PI * 2;
      const y = 0.85 - t * cascadeLength;
      arr.push({
        position: [
          0.1 + Math.cos(around) * ringR + (rng() - 0.5) * 0.02,
          y,
          Math.sin(around) * ringR + (rng() - 0.5) * 0.02,
        ],
        rotation: [
          -1.0 + (rng() - 0.5) * 0.3,
          around,
          (rng() - 0.5) * 0.3,
        ],
        scale: 0.7 + rng() * 0.4 - t * 0.15,
        colorMix: t,
      });
    }
    return arr;
  }, [seed]);

  const baseColor = useMemo(() => new THREE.Color(palette.petal), [palette.petal]);
  const deepColor = useMemo(() => new THREE.Color(palette.accent), [palette.accent]);
  const droop = bloom < 0.3 ? -0.2 : 0;
  const open = Math.max(0.2, bloom);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Stem points={stemPoints} radius={0.022} />
      <group rotation={[droop, 0, 0]}>
        {blooms.map((b, i) => {
          const mixed = baseColor.clone().lerp(deepColor, b.colorMix * 0.7);
          const hex = `#${mixed.getHexString()}`;
          const s = b.scale * open;
          return (
            <group
              key={i}
              position={b.position}
              rotation={b.rotation}
              scale={s}
            >
              {/* Two-petal clamshell */}
              <mesh position={[0, 0.018, 0.012]} rotation={[0.4, 0, 0]} castShadow>
                <sphereGeometry args={[0.022, 10, 8, 0, Math.PI, 0, Math.PI / 1.5]} />
                <meshPhysicalMaterial
                  color={hex}
                  roughness={0.28}
                  transmission={0.55}
                  thickness={0.2}
                  ior={1.35}
                  clearcoat={0.4}
                  emissive={hex}
                  emissiveIntensity={0.05}
                  side={THREE.DoubleSide}
                  transparent
                />
              </mesh>
              <mesh position={[0, 0.018, -0.012]} rotation={[-0.4, Math.PI, 0]} castShadow>
                <sphereGeometry args={[0.022, 10, 8, 0, Math.PI, 0, Math.PI / 1.5]} />
                <meshPhysicalMaterial
                  color={hex}
                  roughness={0.28}
                  transmission={0.55}
                  thickness={0.2}
                  ior={1.35}
                  clearcoat={0.4}
                  emissive={hex}
                  emissiveIntensity={0.05}
                  side={THREE.DoubleSide}
                  transparent
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
