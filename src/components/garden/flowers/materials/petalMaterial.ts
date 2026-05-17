import * as THREE from "three";

export interface PetalMaterialOptions {
  color: string;
  roughness?: number;
  transmission?: number;
  thickness?: number;
  sheenColor?: string;
  emissiveColor?: string;
  emissiveIntensity?: number;
  iridescence?: number;
  clearcoat?: number;
}

function warmSheen(base: string): string {
  const c = new THREE.Color(base);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  const next = new THREE.Color().setHSL(
    (hsl.h + 0.02) % 1,
    Math.max(0, hsl.s * 0.55),
    Math.min(1, hsl.l * 0.85 + 0.05),
  );
  return `#${next.getHexString()}`;
}

export function makePetalMaterial(
  opts: PetalMaterialOptions,
): THREE.MeshPhysicalMaterial {
  const sheenColor = opts.sheenColor ?? warmSheen(opts.color);
  const emissive = opts.emissiveColor ?? opts.color;
  const intensity = Math.min(0.08, opts.emissiveIntensity ?? 0.04);
  const transmission = Math.min(0.95, Math.max(0, opts.transmission ?? 0.7));

  return new THREE.MeshPhysicalMaterial({
    color: opts.color,
    roughness: opts.roughness ?? 0.25,
    metalness: 0,
    transmission,
    thickness: opts.thickness ?? 0.4,
    ior: 1.35,
    clearcoat: opts.clearcoat ?? 0.4,
    clearcoatRoughness: 0.25,
    sheen: 0.35,
    sheenColor: new THREE.Color(sheenColor),
    sheenRoughness: 0.5,
    iridescence: opts.iridescence ?? 0.15,
    iridescenceIOR: 1.3,
    emissive: new THREE.Color(emissive),
    emissiveIntensity: intensity,
    side: THREE.DoubleSide,
    transparent: true,
  });
}
