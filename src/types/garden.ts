export type PlantKind = "sprout" | "daisy" | "tulip" | "fern" | "sunflower";
export type PlantMood = "thriving" | "growing" | "wilting";

export interface GardenPlant {
  promiseId: string;
  kind: PlantKind;
  mood: PlantMood;
  position: number;
  plantedAt: string;
}
