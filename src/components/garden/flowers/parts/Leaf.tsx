"use client";

import { useMemo } from "react";
import * as THREE from "three";

export interface LeafProps {
  length?: number;
  width?: number;
  thickness?: number;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

function buildLeafShape(length: number, width: number): THREE.Shape {
  const shape = new THREE.Shape();
  const half = width / 2;
  shape.moveTo(0, 0);
  shape.bezierCurveTo(half * 1.05, length * 0.18, half * 0.95, length * 0.7, 0, length);
  shape.bezierCurveTo(-half * 0.95, length * 0.7, -half * 1.05, length * 0.18, 0, 0);
  return shape;
}

export default function Leaf({
  length = 0.45,
  width = 0.18,
  thickness = 0.006,
  color = "#3F6B3F",
  position,
  rotation,
}: LeafProps) {
  const geometry = useMemo(() => {
    const shape = buildLeafShape(length, width);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: thickness * 0.5,
      bevelSize: thickness * 0.4,
      bevelSegments: 1,
      curveSegments: 10,
      steps: 1,
    });

    const pos = geom.attributes.position;
    const tmp = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      tmp.fromBufferAttribute(pos, i);
      const t = THREE.MathUtils.clamp(tmp.y / length, 0, 1);
      tmp.z += Math.sin(t * Math.PI) * length * 0.18;
      pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
    geom.translate(0, 0, -thickness / 2);
    return geom;
  }, [length, width, thickness]);

  return (
    <mesh geometry={geometry} position={position} rotation={rotation} castShadow>
      <meshStandardMaterial
        color={color}
        roughness={0.55}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
