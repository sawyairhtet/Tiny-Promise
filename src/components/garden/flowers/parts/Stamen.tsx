"use client";

import { useMemo } from "react";
import {
  makeStamenMaterial,
  type StamenMaterialOptions,
} from "../materials/stamenMaterial";
import { mulberry32 } from "./random";

export interface StamenProps {
  count?: number;
  radius?: number;
  height?: number;
  beadRadius?: number;
  seed?: number;
  materialOptions?: StamenMaterialOptions;
  position?: [number, number, number];
}

export default function Stamen({
  count = 12,
  radius = 0.04,
  height = 0.04,
  beadRadius = 0.012,
  seed = 1,
  materialOptions,
  position,
}: StamenProps) {
  const material = useMemo(
    () => makeStamenMaterial(materialOptions),
    [materialOptions],
  );

  const beads = useMemo(() => {
    const rng = mulberry32(seed || 1);
    const arr: Array<{
      pos: [number, number, number];
      scale: number;
    }> = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + rng() * 0.2;
      const r = radius * (0.4 + rng() * 0.7);
      const y = height * (0.3 + rng() * 0.7);
      const s = 0.7 + rng() * 0.7;
      arr.push({ pos: [Math.cos(a) * r, y, Math.sin(a) * r], scale: s });
    }
    return arr;
  }, [count, radius, height, seed]);

  return (
    <group position={position}>
      {beads.map((b, i) => (
        <mesh
          key={i}
          position={b.pos}
          scale={[b.scale, b.scale, b.scale]}
          material={material}
        >
          <sphereGeometry args={[beadRadius, 10, 8]} />
        </mesh>
      ))}
    </group>
  );
}
