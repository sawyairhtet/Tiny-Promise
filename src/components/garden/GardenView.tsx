"use client";

import { useEffect, useState } from "react";
import { loadPlants, clearGarden } from "@/lib/gardenStorage";
import type { PlantRecipe, WeatherEffect } from "@/types/garden";
import SkyLayer from "./SkyLayer";
import PlantSVG from "./PlantSVG";
import WeatherLayer from "./WeatherLayer";
import GardenControls, { nextWeather } from "./GardenControls";

const WEATHER_KEY = "tiny-promise-weather-v1";

export default function GardenView() {
  const [plants, setPlants] = useState<PlantRecipe[]>([]);
  const [weather, setWeather] = useState<WeatherEffect | null>(null);

  useEffect(() => {
    setPlants(loadPlants());
    const saved = localStorage.getItem(WEATHER_KEY);
    if (saved) setWeather(saved as WeatherEffect);
  }, []);

  function handleCycleWeather() {
    const next = nextWeather(weather);
    setWeather(next);
    if (next) {
      localStorage.setItem(WEATHER_KEY, next);
    } else {
      localStorage.removeItem(WEATHER_KEY);
    }
  }

  function handleClearGarden() {
    clearGarden();
    setPlants([]);
  }

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
      <WeatherLayer effect={weather} />
      <GardenControls
        currentWeather={weather}
        onCycleWeather={handleCycleWeather}
        onClearGarden={handleClearGarden}
      />

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
