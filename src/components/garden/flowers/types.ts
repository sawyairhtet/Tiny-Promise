import type { FlowerPalette } from "../config/flowerPalettes";

export interface ArchetypeProps {
  palette: FlowerPalette;
  bloom: number;
  seed: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}
