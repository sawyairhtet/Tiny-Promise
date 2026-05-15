"use client";

import { useEffect, useState } from "react";
import { loadPlants } from "@/lib/gardenStorage";
import type { PlantRecipe } from "@/types/garden";
import SkyLayer from "./SkyLayer";
import PlantSVG from "./PlantSVG";

export default function GardenView() {
  const [plants, setPlants] = useState<PlantRecipe[]>([]);

  useEffect(() => {
    setPlants(loadPlants());
  }, []);

  const sorted = [...plants].sort((a, b) => a.createdAt - b.createdAt);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>

      <SkyLayer />

      {sorted.map((recipe, i) => (
        <div
          key={recipe.id}
          style={{
            position: "absolute",
            bottom: 0,
            left: `${recipe.positionX}%`,
            width: "80px",
            transform: "translateX(-50%)",
            transformOrigin: "bottom center",
            animation: "grow 0.6s ease-out both",
            animationDelay: `${i * 80}ms`,
            zIndex: i + 1,
          }}
        >
          <PlantSVG recipe={recipe} />
        </div>
      ))}
    </div>
  );
}
