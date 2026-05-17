"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { makePetalMaterial, type PetalMaterialOptions } from "../materials/petalMaterial";

export interface PetalProps {
  width?: number;
  length?: number;
  thickness?: number;
  tipSharpness?: number;
  baseInset?: number;
  curl?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  materialOptions: PetalMaterialOptions;
}

function buildTeardropShape(
  width: number,
  length: number,
  tipSharpness: number,
  baseInset: number,
): THREE.Shape {
  const shape = new THREE.Shape();
  const halfWidth = width / 2;
  const tipY = length;
  const cpYHigh = length * (0.85 - tipSharpness * 0.25);
  const cpYLow = length * (0.18 + baseInset * 0.05);

  shape.moveTo(0, 0);
  shape.bezierCurveTo(
    halfWidth * 0.85,
    cpYLow,
    halfWidth * (0.92 - tipSharpness * 0.2),
    cpYHigh,
    0,
    tipY,
  );
  shape.bezierCurveTo(
    -halfWidth * (0.92 - tipSharpness * 0.2),
    cpYHigh,
    -halfWidth * 0.85,
    cpYLow,
    0,
    0,
  );
  return shape;
}

function buildCurledGeometry(
  shape: THREE.Shape,
  thickness: number,
  curl: number,
  length: number,
): THREE.BufferGeometry {
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.5,
    bevelSize: thickness * 0.4,
    bevelSegments: 2,
    curveSegments: 14,
    steps: 1,
  });

  if (curl !== 0) {
    const pos = geom.attributes.position;
    const tmp = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      tmp.fromBufferAttribute(pos, i);
      const t = THREE.MathUtils.clamp(tmp.y / length, 0, 1);
      const lift = Math.sin(t * Math.PI) * curl * length * 0.35;
      const inward = Math.pow(t, 1.4) * curl * 0.18;
      const half = Math.max(0.0001, Math.abs(tmp.x));
      tmp.z += lift;
      tmp.x -= Math.sign(tmp.x) * inward * half;
      pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
  }

  geom.translate(0, 0, -thickness / 2);
  return geom;
}

export default function Petal({
  width = 0.32,
  length = 0.72,
  thickness = 0.012,
  tipSharpness = 0.45,
  baseInset = 0.4,
  curl = 0.35,
  position,
  rotation,
  scale,
  materialOptions,
}: PetalProps) {
  const geometry = useMemo(() => {
    const shape = buildTeardropShape(width, length, tipSharpness, baseInset);
    return buildCurledGeometry(shape, thickness, curl, length);
  }, [width, length, thickness, tipSharpness, baseInset, curl]);

  const material = useMemo(
    () => makePetalMaterial(materialOptions),
    [materialOptions],
  );

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
    />
  );
}
