"use client";

import { useMemo } from "react";
import * as THREE from "three";

export interface StemProps {
  points: Array<[number, number, number]>;
  radius?: number;
  tubularSegments?: number;
  radialSegments?: number;
  color?: string;
  roughness?: number;
}

export default function Stem({
  points,
  radius = 0.018,
  tubularSegments = 24,
  radialSegments = 6,
  color = "#2C5235",
  roughness = 0.72,
}: StemProps) {
  const geometry = useMemo(() => {
    const vec = points.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const curve = new THREE.CatmullRomCurve3(vec, false, "catmullrom", 0.5);
    return new THREE.TubeGeometry(
      curve,
      tubularSegments,
      radius,
      radialSegments,
      false,
    );
  }, [points, radius, tubularSegments, radialSegments]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={roughness} metalness={0} />
    </mesh>
  );
}
