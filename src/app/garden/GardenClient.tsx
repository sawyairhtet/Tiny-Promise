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
    <div
      style={{
        position: "relative",
        left: "50%",
        width: "min(1120px, calc(100vw - 32px))",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        paddingBottom: "104px",
      }}
    >
      <CursorEffect />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(420px, calc(100dvh - 390px), 560px)",
          minHeight: "420px",
          overflow: "visible",
          borderRadius: "24px",
          background: CSS_SKY_GRADIENT,
          boxShadow:
            "0 18px 44px rgba(16, 10, 36, 0.22), 0 0 0 1px rgba(245, 230, 208, 0.08) inset",
        }}
      >
        <GardenCanvas />
      </div>
      <div style={{ maxWidth: "860px", width: "100%", margin: "0 auto" }}>
        <GardenList
          key={reducedMotion ? "garden-list-reduced" : "garden-list-motion"}
          promises={promises}
          defaultOpen={reducedMotion}
        />
      </div>
    </div>
  );
}
