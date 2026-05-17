"use client";

import { useMemo } from "react";
import * as THREE from "three";
import Petal from "../parts/Petal";
import Stem from "../parts/Stem";
import type { ArchetypeProps } from "../types";

function makeTrumpetGeometry(): THREE.BufferGeometry {
  const profile: THREE.Vector2[] = [];
  const segments = 18;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = t * 0.18;
    let r = 0.04 + t * 0.05;
    if (t > 0.85) {
      const u = (t - 0.85) / 0.15;
      r += 0.025 * Math.sin(u * Math.PI * 4) + 0.02 * u;
    }
    profile.push(new THREE.Vector2(r, y));
  }
  return new THREE.LatheGeometry(profile, 24);
}

export default function Daffodil({
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
      [-0.01, 0.5, -0.01],
      [0, 0.7, 0],
    ],
    [],
  );

  const trumpetGeom = useMemo(() => makeTrumpetGeometry(), []);
  const open = Math.max(0.18, bloom);
  const droop = bloom < 0.3 ? -0.22 : 0;
  const flowerY = 0.72 + droop * 0.4;
  const tepalTilt = -1.45 - open * 0.2;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Stem points={stemPoints} radius={0.022} />

      <group position={[0, flowerY, 0]} rotation={[droop, 0, 0]}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <group key={i} rotation={[0, angle, 0]}>
              <Petal
                position={[0, 0, 0.03]}
                rotation={[tepalTilt, 0, 0]}
                width={0.22}
                length={0.34}
                thickness={0.012}
                tipSharpness={0.55}
                curl={0.2}
                materialOptions={{
                  color: palette.petal,
                  roughness: 0.28,
                  transmission: 0.62,
                  thickness: 0.4,
                }}
              />
            </group>
          );
        })}

        <mesh
          geometry={trumpetGeom}
          position={[0, 0.0, 0]}
          rotation={[0, 0, 0]}
          castShadow
        >
          <meshPhysicalMaterial
            color={palette.stamen}
            roughness={0.32}
            transmission={0.35}
            thickness={0.5}
            ior={1.35}
            clearcoat={0.4}
            sheen={0.3}
            emissive={palette.stamen}
            emissiveIntensity={0.12}
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
      </group>
    </group>
  );
}
