"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mulberry32 } from "../parts/random";
import Stem from "../parts/Stem";
import type { ArchetypeProps } from "../types";

function makeBellGeometry(): THREE.BufferGeometry {
  const profile: THREE.Vector2[] = [];
  const segments = 12;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = -t * 0.14;
    let r = 0.005;
    if (t < 0.5) r = 0.04 - t * 0.05;
    else r = 0.018 + (t - 0.5) * 0.12;
    if (i % 2 === 0 && t > 0.85) r += 0.012;
    profile.push(new THREE.Vector2(r, y));
  }
  const geom = new THREE.LatheGeometry(profile, 16);
  return geom;
}

export default function Bluebell({
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
      [0.05, 0.25, 0.04],
      [0.12, 0.55, 0.08],
      [0.18, 0.82, 0.12],
      [0.22, 1.02, 0.14],
    ],
    [],
  );

  const bellGeom = useMemo(() => makeBellGeometry(), []);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: palette.petal,
        roughness: 0.28,
        transmission: 0.78,
        thickness: 0.2,
        ior: 1.35,
        clearcoat: 0.4,
        sheen: 0.4,
        sheenColor: new THREE.Color(palette.accent),
        iridescence: 0.1,
        emissive: new THREE.Color(palette.petal),
        emissiveIntensity: 0.04,
        side: THREE.DoubleSide,
        transparent: true,
      }),
    [palette.petal, palette.accent],
  );

  const bells = useMemo(() => {
    const rng = mulberry32(seed || 1);
    const count = 7;
    const open = Math.max(0.15, bloom);
    const arr: Array<{
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
    }> = [];
    for (let i = 0; i < count; i++) {
      const t = 0.45 + (i / count) * 0.55;
      const cx = 0.05 + t * 0.18;
      const cy = t * 1.02;
      const cz = 0.04 + t * 0.12;
      arr.push({
        position: [cx + (rng() - 0.5) * 0.04, cy, cz + (rng() - 0.5) * 0.04],
        rotation: [-0.35, rng() * Math.PI * 2, rng() * 0.2],
        scale: 0.85 + open * 0.4 + rng() * 0.2,
      });
    }
    return arr;
  }, [seed, bloom]);

  const droop = bloom < 0.3 ? -0.25 : 0;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group rotation={[droop, 0, 0]}>
        <Stem points={stemPoints} radius={0.014} />
        {bells.map((b, i) => (
          <mesh
            key={i}
            geometry={bellGeom}
            material={material}
            position={b.position}
            rotation={b.rotation}
            scale={b.scale}
            castShadow
          />
        ))}
      </group>
    </group>
  );
}
