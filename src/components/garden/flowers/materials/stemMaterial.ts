import * as THREE from "three";

export interface StemMaterialOptions {
  color?: string;
  roughness?: number;
}

export function makeStemMaterial(
  opts: StemMaterialOptions = {},
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: opts.color ?? "#2C5235",
    roughness: opts.roughness ?? 0.7,
    metalness: 0,
  });
}
