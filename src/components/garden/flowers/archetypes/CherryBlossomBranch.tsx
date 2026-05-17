"use client";

import { useMemo } from "react";
import Petal from "../parts/Petal";
import { mulberry32 } from "../parts/random";
import Stem from "../parts/Stem";
import type { ArchetypeProps } from "../types";

interface Blossom {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export default function CherryBlossomBranch({
  palette,
  bloom,
  seed,
  position,
  rotation,
  scale = 1,
}: ArchetypeProps) {
  const branchPoints = useMemo<Array<[number, number, number]>>(
    () => [
      [0, 0, 0],
      [0.04, 0.2, 0.02],
      [0.1, 0.4, 0.04],
      [0.18, 0.58, 0.06],
    ],
    [],
  );

  const blossoms = useMemo<Blossom[]>(() => {
    const rng = mulberry32(seed || 1);
    const open = Math.max(0.2, bloom);
    const count = 6 + Math.floor(rng() * 3);
    const arr: Blossom[] = [];
    for (let i = 0; i < count; i++) {
      const t = 0.25 + (i / count) * 0.75;
      const cx = 0.04 * t + 0.14 * t * t;
      const cy = t * 0.58;
      const cz = 0.02 * t + 0.04 * t * t;
      const jitter = 0.04;
      arr.push({
        position: [
          cx + (rng() - 0.5) * jitter,
          cy + (rng() - 0.5) * jitter,
          cz + (rng() - 0.5) * jitter,
        ],
        rotation: [
          rng() * Math.PI * 2,
          rng() * Math.PI * 2,
          rng() * Math.PI * 2,
        ],
        scale: (0.7 + rng() * 0.5) * (0.5 + open * 0.6),
      });
    }
    return arr;
  }, [seed, bloom]);

  const droop = bloom < 0.3 ? -0.25 : 0;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group rotation={[droop, 0, droop * 0.5]}>
        <Stem points={branchPoints} radius={0.018} color="#5C3A22" roughness={0.85} />

        {blossoms.map((b, i) => (
          <group key={i} position={b.position} rotation={b.rotation} scale={b.scale}>
            {Array.from({ length: 5 }).map((_, p) => {
              const angle = (p / 5) * Math.PI * 2;
              return (
                <group key={p} rotation={[0, 0, angle]}>
                  <Petal
                    position={[0, 0.04, 0]}
                    rotation={[0, 0, 0]}
                    width={0.08}
                    length={0.1}
                    thickness={0.006}
                    tipSharpness={0.1}
                    curl={0.05}
                    materialOptions={{
                      color: palette.petal,
                      roughness: 0.3,
                      transmission: 0.82,
                      thickness: 0.18,
                    }}
                  />
                </group>
              );
            })}
            <mesh>
              <sphereGeometry args={[0.012, 8, 6]} />
              <meshStandardMaterial
                color={palette.stamen}
                emissive={palette.stamen}
                emissiveIntensity={0.35}
                roughness={0.5}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
