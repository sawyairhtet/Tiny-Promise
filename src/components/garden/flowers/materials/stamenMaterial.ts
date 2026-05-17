import * as THREE from "three";

export interface StamenMaterialOptions {
  color?: string;
  emissiveIntensity?: number;
}

export function makeStamenMaterial(
  opts: StamenMaterialOptions = {},
): THREE.MeshPhysicalMaterial {
  const color = opts.color ?? "#F5C95B";
  const intensity = opts.emissiveIntensity ?? 0.45;

  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.42,
    metalness: 0.2,
    transmission: 0.05,
    thickness: 0.15,
    clearcoat: 0.25,
    clearcoatRoughness: 0.35,
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
  });
}
