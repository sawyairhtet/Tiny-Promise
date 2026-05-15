export type PlantKind = "sprout" | "daisy" | "tulip" | "fern" | "sunflower";
export type PlantMood = "thriving" | "growing" | "wilting";

export interface GardenPlant {
  promiseId: string;
  kind: PlantKind;
  mood: PlantMood;
  plantedAt: string;
  position: number;
}

export type PlantFamily =
  | "fern"
  | "crystal"
  | "wisp"
  | "cactus"
  | "bioluminescent"
  | "alien";

export type SkyState = "dawn" | "morning" | "afternoon" | "dusk" | "night";

export interface PlantRecipe {
  id: string;
  promiseId: string;
  createdAt: number;
  seed: number;
  family: PlantFamily;
  stemHeight: number;
  stemCurve: number;
  branchCount: number;
  leafSize: number;
  hue: number;
  saturation: number;
  lightness: number;
  glowIntensity: number;
  positionX: number;
  animated: boolean;
}

export interface GardenState {
  plants: PlantRecipe[];
  skyState: SkyState;
  weatherEffect: WeatherEffect | null;
}

export type WeatherEffect = "rain" | "pollen" | "fireflies" | "fog" | "aurora";
