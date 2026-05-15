import { GardenPlant } from "@/types/garden";

const STORAGE_KEY = "tiny-promise.garden.v1";

export function getGarden(): GardenPlant[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as GardenPlant[];
  } catch {
    return [];
  }
}

export function saveGarden(plants: GardenPlant[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
}

export function addPlant(plant: GardenPlant): GardenPlant[] {
  const garden = getGarden();
  if (garden.some((p) => p.promiseId === plant.promiseId)) return garden;
  garden.push(plant);
  saveGarden(garden);
  return garden;
}
