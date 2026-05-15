import { PlantRecipe, PlantFamily } from "@/types/garden";

const FAMILIES: PlantFamily[] = [
  "fern", "crystal", "wisp", "cactus", "bioluminescent", "alien"
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seededRandom(seed: number, salt: number): number {
  const x = Math.sin(seed + salt) * 10000;
  return x - Math.floor(x);
}

export function generatePlantRecipe(promiseId: string): PlantRecipe {
  const hash = hashString(promiseId);
  const r = (salt: number) => seededRandom(hash, salt);

  return {
    id: crypto.randomUUID(),
    promiseId,
    createdAt: Date.now(),
    seed: r(0),
    family: FAMILIES[Math.floor(r(1) * FAMILIES.length)],
    stemHeight: 40 + r(2) * 80,
    stemCurve: (r(3) - 0.5) * 60,
    branchCount: 1 + Math.floor(r(4) * 5),
    leafSize: 0.5 + r(5) * 1.5,
    hue: Math.floor(r(6) * 360),
    saturation: 40 + Math.floor(r(7) * 60),
    lightness: 40 + Math.floor(r(8) * 40),
    glowIntensity: r(9),
    positionX: 5 + r(10) * 90,
    animated: r(11) > 0.3,
  };
}
