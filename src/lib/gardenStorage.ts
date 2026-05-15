import { PlantRecipe } from "@/types/garden";

const STORAGE_KEY = "tiny-promise-garden-v1";

export function loadPlants(): PlantRecipe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PlantRecipe[]) : [];
  } catch {
    return [];
  }
}

export function savePlants(plants: PlantRecipe[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
}

export function addPlant(recipe: PlantRecipe): void {
  const plants = loadPlants();
  savePlants([...plants, recipe]);
}

export function clearGarden(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
