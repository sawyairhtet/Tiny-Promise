"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { CSS_SKY_GRADIENT } from "@/components/garden/config/palette";
import GardenList from "@/components/garden/GardenList";
import { useGardenPromises } from "@/components/garden/hooks/useGardenPromises";
import { useReducedMotion } from "@/components/garden/hooks/useReducedMotion";
import { useSelectionSlice } from "@/components/garden/hooks/useSelectionStore";

const GardenCanvas = dynamic(
  () => import("@/components/garden/GardenCanvas"),
  { ssr: false },
);

function CursorEffect() {
  const hoveredId = useSelectionSlice((s) => s.hoveredId);
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (hoveredId) {
      document.body.style.cursor = "pointer";
      return () => {
        document.body.style.cursor = "";
      };
    }
  }, [hoveredId]);
  return null;
}

export default function GardenClient() {
  const promises = useGardenPromises();
  const reducedMotion = useReducedMotion();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <CursorEffect />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "calc(100dvh - 320px)",
          minHeight: "380px",
          overflow: "hidden",
          borderRadius: "20px",
          background: CSS_SKY_GRADIENT,
          boxShadow:
            "0 1px 3px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.04) inset",
        }}
      >
        <GardenCanvas />
      </div>
      <GardenList promises={promises} defaultOpen={reducedMotion} />
    </div>
  );
}
