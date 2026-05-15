"use client";

import type { GardenPlant as GardenPlantData } from "@/types/garden";
import GardenSky from "./GardenSky";
import GardenGround from "./GardenGround";
import GardenPlant from "./GardenPlant";
import GardenEmptyState from "./GardenEmptyState";

type Props = {
  plants: GardenPlantData[];
};

const MAX_VISIBLE = 12;

export default function GardenScene({ plants }: Props) {
  if (plants.length === 0) return <GardenEmptyState />;

  const visible = [...plants]
    .sort((a, b) => b.plantedAt.localeCompare(a.plantedAt))
    .slice(0, MAX_VISIBLE)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-warm-200 shadow-soft">
      <GardenSky />
      <GardenGround />
      <div className="absolute inset-x-0 bottom-[10%] grid grid-cols-4 gap-x-2 gap-y-1 px-4">
        {visible.map((plant) => (
          <div key={plant.promiseId} className="flex justify-center">
            <GardenPlant plant={plant} />
          </div>
        ))}
      </div>
    </div>
  );
}
