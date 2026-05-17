"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "../flowers/parts/random";

const GRASS_COUNT = 60;
const GRASS_RING_RADIUS = 3.45;
const GRASS_RING_JITTER = 0.45;
const TALL_STEMS = 0;

export default function BackgroundFoliage() {
  const grassRef = useRef<THREE.InstancedMesh>(null);

  const grassMatrices = useMemo(() => {
    const rng = mulberry32(0xfa11e7);
    const tmp = new THREE.Object3D();
    const arr: THREE.Matrix4[] = [];
    for (let i = 0; i < GRASS_COUNT; i++) {
      const a = (i / GRASS_COUNT) * Math.PI * 2 + rng() * 0.1;
      const r = GRASS_RING_RADIUS + (rng() - 0.5) * GRASS_RING_JITTER;
      tmp.position.set(Math.cos(a) * r, 0.04, Math.sin(a) * r);
      tmp.rotation.set((rng() - 0.5) * 0.2, rng() * Math.PI * 2, (rng() - 0.5) * 0.2);
      const s = 0.6 + rng() * 0.6;
      tmp.scale.set(s * 0.7, s, s * 0.7);
      tmp.updateMatrix();
      arr.push(tmp.matrix.clone());
    }
    return arr;
  }, []);

  useLayoutEffect(() => {
    const mesh = grassRef.current;
    if (!mesh) return;
    for (let i = 0; i < grassMatrices.length; i++) {
      mesh.setMatrixAt(i, grassMatrices[i]);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [grassMatrices]);

  const tallStems = useMemo(() => {
    const rng = mulberry32(0x7a115);
    const arr: Array<{
      position: [number, number, number];
      rotation: [number, number, number];
      height: number;
    }> = [];
    for (let i = 0; i < TALL_STEMS; i++) {
      const a = (i / TALL_STEMS) * Math.PI * 2 + rng() * 0.4;
      const r = 3.6 + rng() * 0.5;
      arr.push({
        position: [Math.cos(a) * r, 0, Math.sin(a) * r],
        rotation: [(rng() - 0.5) * 0.1, rng() * Math.PI * 2, (rng() - 0.5) * 0.1],
        height: 1.2 + rng() * 0.6,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      <instancedMesh
        ref={grassRef}
        args={[undefined, undefined, GRASS_COUNT]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[0.04, 0.32, 5, 1]} />
        <meshStandardMaterial color="#3F5C3A" roughness={0.85} metalness={0} />
      </instancedMesh>

      {tallStems.map((s, i) => (
        <group key={i} position={s.position} rotation={s.rotation}>
          <mesh castShadow position={[0, s.height / 2, 0]}>
            <cylinderGeometry args={[0.012, 0.018, s.height, 6]} />
            <meshStandardMaterial color="#3A5236" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, s.height + 0.06, 0]}>
            <sphereGeometry args={[0.05, 8, 6]} />
            <meshStandardMaterial color="#4F6F4A" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
