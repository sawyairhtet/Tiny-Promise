"use client";

import type { WeatherEffect } from "@/types/garden";

const WEATHER_CYCLE: (WeatherEffect | null)[] = [
  null,
  "rain",
  "pollen",
  "fireflies",
  "fog",
  "aurora",
];

interface GardenControlsProps {
  currentWeather: WeatherEffect | null;
  onCycleWeather: () => void;
  onClearGarden: () => void;
}

function weatherLabel(w: WeatherEffect | null): string {
  if (!w) return "off";
  return w;
}

export function nextWeather(
  current: WeatherEffect | null
): WeatherEffect | null {
  const idx = WEATHER_CYCLE.indexOf(current);
  return WEATHER_CYCLE[(idx + 1) % WEATHER_CYCLE.length];
}

export default function GardenControls({
  currentWeather,
  onCycleWeather,
  onClearGarden,
}: GardenControlsProps) {
  function handleClear() {
    if (window.confirm("Clear your entire garden? This cannot be undone.")) {
      onClearGarden();
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 100,
        display: "flex",
        gap: 8,
      }}
    >
      <button
        onClick={onCycleWeather}
        title={`Weather: ${weatherLabel(currentWeather)}`}
        aria-label={`Cycle weather, currently ${weatherLabel(currentWeather)}`}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(6px)",
          color: "white",
          fontSize: 16,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {currentWeather === "rain"
          ? "\u{1F327}"
          : currentWeather === "pollen"
            ? "\u{1F33C}"
            : currentWeather === "fireflies"
              ? "✨"
              : currentWeather === "fog"
                ? "\u{1F32B}"
                : currentWeather === "aurora"
                  ? "\u{1F30C}"
                  : "☁"}
      </button>

      <button
        onClick={handleClear}
        title="Clear garden"
        aria-label="Clear garden"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(6px)",
          color: "white",
          fontSize: 16,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {"\u{1F5D1}"}
      </button>
    </div>
  );
}
