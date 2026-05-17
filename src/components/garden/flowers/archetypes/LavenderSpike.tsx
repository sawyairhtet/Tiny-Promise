"use client";

import { useMemo } from "react";
import * as THREE from "three";
import Stem from "../parts/Stem";
import type { ArchetypeProps } from "../types";

interface Floret {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  colorMix: number;
  isBud: boolean;
}

export default function LavenderSpike({
  palette,
  bloom,
  position,
  rotation,
  scale = 1,
}: ArchetypeProps) {
  const stemPoints = useMemo<Array<[number, number, number]>>(
    () => [
      [0, 0, 0],
      [0.01, 0.3, 0.01],
      [0, 0.55, 0],
      [0, 0.85, 0],
    ],
    [],
  );

  const florets = useMemo<Floret[]>(() => {
    const arr: Floret[] = [];
    const total = 18;
    const startY = 0.85;
    const endY = 0.55;
    const spikeLen = startY - endY;
    for (let i = 0; i < total; i++) {
      const tier = Math.floor(i / 3);
      const inTier = i % 3;
      const t = tier / (total / 3 - 1);
      const around = (inTier / 3) * Math.PI * 2 + tier * 0.4;
      const y = startY - t * spikeLen;
      const r = 0.025;
      arr.push({
        position: [Math.cos(around) * r, y, Math.sin(around) * r],
        rotation: [0, around, 0],
        scale: 0.55 + t * 0.55,
        colorMix: t,
        isBud: t < 0.18,
      });
    }
    return arr;
  }, []);

  const base = useMemo(() => new THREE.Color(palette.petal), [palette.petal]);
  const deep = useMemo(() => new THREE.Color(palette.accent), [palette.accent]);
  const open = Math.max(0.2, bloom);
  const droop = bloom < 0.3 ? -0.18 : 0;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Stem points={stemPoints} radius={0.014} color="#4A6A3A" />
      <group rotation={[droop, 0, 0]}>
        {florets.map((f, i) => {
          const mixed = base.clone().lerp(deep, f.colorMix);
          const hex = `#${mixed.getHexString()}`;
          const fScale = f.scale * open;
          if (f.isBud) {
            return (
              <mesh
                key={i}
                position={f.position}
                scale={fScale}
                castShadow
              >
                <sphereGeometry args={[0.018, 8, 6]} />
                <meshPhysicalMaterial
                  color={hex}
                  roughness={0.4}
                  transmission={0.35}
                  thickness={0.2}
                  emissive={hex}
                  emissiveIntensity={0.04}
                />
              </mesh>
            );
          }
          return (
            <group key={i} position={f.position} rotation={f.rotation} scale={fScale}>
              {[0, 1, 2, 3].map((p) => {
                const a = (p / 4) * Math.PI * 2;
                return (
                  <mesh
                    key={p}
                    position={[Math.cos(a) * 0.012, 0, Math.sin(a) * 0.012]}
                    rotation={[0, a, 0]}
                    castShadow
                  >
                    <sphereGeometry args={[0.012, 8, 6]} />
                    <meshPhysicalMaterial
                      color={hex}
                      roughness={0.32}
                      transmission={0.55}
                      thickness={0.15}
                      emissive={hex}
                      emissiveIntensity={0.06}
                      side={THREE.DoubleSide}
                      transparent
                    />
                  </mesh>
                );
              })}
            </group>
          );
        })}
      </group>
    </group>
  );
}
