const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
export const PLANTER_INNER_RADIUS = 2.85;
export const PLANTER_OUTER_RADIUS = 2.9;
const PLANT_Y = 0.09;
const JITTER_RADIUS = 0.06;

export interface FlowerPlacement {
  position: [number, number, number];
  rotationY: number;
}

function hashJitter(seed: number, salt: number): number {
  const v = Math.imul(seed ^ salt, 0x85ebca6b) >>> 0;
  return v / 0x100000000;
}

export function flowerLayout(
  count: number,
  seeds: number[],
): FlowerPlacement[] {
  if (count <= 0) return [];
  const denom = Math.max(count, 1);
  const placements: FlowerPlacement[] = [];

  for (let i = 0; i < count; i++) {
    const angle = i * GOLDEN_ANGLE;
    const radiusFraction = Math.sqrt((i + 0.5) / denom);
    const baseRadius = radiusFraction * PLANTER_INNER_RADIUS;
    const seed = seeds[i] ?? i + 1;
    const jitterAngle = hashJitter(seed, 0x9e3779b9) * Math.PI * 2;
    const jitterMag = hashJitter(seed, 0x243f6a88) * JITTER_RADIUS;
    const x = baseRadius * Math.cos(angle) + Math.cos(jitterAngle) * jitterMag;
    const z = baseRadius * Math.sin(angle) + Math.sin(jitterAngle) * jitterMag;
    const rotationY = hashJitter(seed, 0xb7e15163) * Math.PI * 2;

    placements.push({
      position: [x, PLANT_Y, z],
      rotationY,
    });
  }

  return placements;
}
