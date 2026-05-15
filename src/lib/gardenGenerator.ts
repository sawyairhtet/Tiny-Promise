import { PromiseEntry, PromiseStatus } from "@/types/promise";
import { GardenPlant, PlantKind, PlantMood } from "@/types/garden";

const PLANT_KINDS: PlantKind[] = ["sprout", "daisy", "tulip", "fern", "sunflower"];

const MOOD_MAP: Record<Exclude<PromiseStatus, "pending">, PlantMood> = {
  kept: "thriving",
  partly: "growing",
  broke: "wilting",
};

function hashFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function generatePlant(promise: PromiseEntry): GardenPlant {
  const hash = hashFromId(promise.id);
  return {
    promiseId: promise.id,
    kind: PLANT_KINDS[hash % PLANT_KINDS.length],
    mood: MOOD_MAP[promise.status as Exclude<PromiseStatus, "pending">] ?? "growing",
    position: hash % 12,
    plantedAt: promise.completedAt ?? promise.createdAt,
  };
}

export function generateGarden(promises: PromiseEntry[]): GardenPlant[] {
  return promises
    .filter((p) => p.status !== "pending")
    .map(generatePlant);
}
