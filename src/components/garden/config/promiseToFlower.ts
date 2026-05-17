import type { PromiseEntry } from "@/types/promise";
import type { ArchetypeKey } from "./flowerPalettes";
import { getPaletteCount } from "./flowerPalettes";

export interface FlowerInstance {
  archetype: ArchetypeKey;
  paletteVariant: number;
  scale: number;
  bloom: number;
  swayPhase: number;
  seed: number;
}

const ARCHETYPE_WEIGHTS: Array<[ArchetypeKey, number]> = [
  ["rose", 12],
  ["tulip", 12],
  ["cherryBlossom", 12],
  ["lavender", 12],
  ["lily", 8],
  ["daffodil", 8],
  ["bluebell", 7],
  ["dahlia", 7],
  ["lotus", 6],
  ["iris", 5],
  ["orchid", 5],
  ["wisteria", 4],
];

const WEIGHT_TOTAL = ARCHETYPE_WEIGHTS.reduce((sum, [, w]) => sum + w, 0);

function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function unitFromHash(hash: number): number {
  return (hash >>> 0) / 0x100000000;
}

function pickArchetype(roll: number): ArchetypeKey {
  let cursor = roll * WEIGHT_TOTAL;
  for (const [key, weight] of ARCHETYPE_WEIGHTS) {
    if (cursor < weight) return key;
    cursor -= weight;
  }
  return ARCHETYPE_WEIGHTS[0][0];
}

function bloomFromStatus(status: PromiseEntry["status"]): number {
  switch (status) {
    case "kept":
      return 1.0;
    case "partly":
      return 0.55;
    case "broke":
      return 0.18;
    default:
      return 0.7;
  }
}

function scaleFromText(text: string, hash: number): number {
  const len = text.trim().length;
  const lenFactor = Math.min(1, len / 80);
  const wobble = unitFromHash(hash ^ 0x9e3779b1) * 0.08;
  return 0.82 + lenFactor * 0.22 + wobble;
}

export function promiseToFlower(promise: PromiseEntry): FlowerInstance {
  const seedString = `${promise.id}|${promise.createdAt}`;
  const seed = fnv1a(seedString);
  const archetypeRoll = unitFromHash(fnv1a(`arche|${seedString}`));
  const paletteRoll = unitFromHash(fnv1a(`pal|${seedString}`));
  const swayRoll = unitFromHash(fnv1a(`sway|${seedString}`));

  const archetype = pickArchetype(archetypeRoll);
  const paletteCount = getPaletteCount(archetype);
  const paletteVariant = Math.floor(paletteRoll * paletteCount) % paletteCount;
  const bloom = bloomFromStatus(promise.status);
  const scale = scaleFromText(promise.text, seed);
  const swayPhase = swayRoll * Math.PI * 2;

  return {
    archetype,
    paletteVariant,
    scale: Math.min(1.12, Math.max(0.78, scale)),
    bloom,
    swayPhase,
    seed,
  };
}
