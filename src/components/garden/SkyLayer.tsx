"use client";

import type { SkyState } from "@/types/garden";

const gradients: Record<SkyState, string> = {
  dawn: "linear-gradient(to bottom, #d4a0b0, #c4b5d6)",
  morning: "linear-gradient(to bottom, #f0dfa0, #87ceeb)",
  afternoon: "linear-gradient(to bottom, #4a90d9, #e8e8e8)",
  dusk: "linear-gradient(to bottom, #e07830, #4b0082)",
  night: "linear-gradient(to bottom, #0a0a1a, #0f1b3d)",
};

function getSkyState(): SkyState {
  const hour = new Date().getHours();
  if (hour >= 5 && hour <= 7) return "dawn";
  if (hour >= 8 && hour <= 11) return "morning";
  if (hour >= 12 && hour <= 16) return "afternoon";
  if (hour >= 17 && hour <= 19) return "dusk";
  return "night";
}

export default function SkyLayer() {
  const sky = getSkyState();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: gradients[sky],
        zIndex: 0,
      }}
    />
  );
}
