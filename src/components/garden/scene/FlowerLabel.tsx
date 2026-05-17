"use client";

import { Html } from "@react-three/drei";
import { useMemo } from "react";
import type { PromiseEntry } from "@/types/promise";
import { formatDisplayDate } from "@/lib/dateUtils";
import { statusLabels } from "@/lib/statusDisplay";

const LABEL_BG = "rgba(15, 12, 40, 0.62)";
const LABEL_TEXT = "#F5E6D0";
const LABEL_BORDER = "rgba(245, 230, 208, 0.3)";

interface Props {
  promise: PromiseEntry;
  pinned: boolean;
  onClose: () => void;
}

export default function FlowerLabel({ promise, pinned, onClose }: Props) {
  const dateText = useMemo(() => {
    const target = promise.completedAt
      ? new Date(promise.completedAt).toISOString().slice(0, 10)
      : promise.date;
    return formatDisplayDate(target);
  }, [promise.completedAt, promise.date]);

  const outcome = statusLabels[promise.status];

  return (
    <Html
      position={[0, 0.95, 0]}
      center
      distanceFactor={5.5}
      zIndexRange={[60, 0]}
      style={{
        pointerEvents: pinned ? "auto" : "none",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "220px",
          textAlign: "left",
          padding: "12px",
          paddingRight: pinned ? "26px" : "12px",
          borderRadius: "10px",
          background: LABEL_BG,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: `1px solid ${LABEL_BORDER}`,
          color: LABEL_TEXT,
          fontFamily:
            "var(--font-garden-serif), 'Cormorant Garamond', 'Fraunces', serif",
          fontSize: "13px",
          lineHeight: "1.35",
          letterSpacing: "0.01em",
          transform: "translateY(-100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontSize: "11px",
            opacity: 0.75,
            marginBottom: "4px",
            fontFeatureSettings: '"smcp"',
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {dateText}
        </div>
        <div
          style={{
            fontSize: "14px",
            fontStyle: "italic",
            marginBottom: "6px",
          }}
        >
          {promise.text}
        </div>
        <div
          style={{
            fontSize: "11px",
            opacity: 0.85,
            letterSpacing: "0.04em",
          }}
        >
          {outcome}
        </div>

        {pinned && (
          <button
            type="button"
            aria-label="Close label"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "20px",
              height: "20px",
              padding: 0,
              border: "none",
              background: "transparent",
              color: LABEL_TEXT,
              opacity: 0.7,
              cursor: "pointer",
              fontSize: "14px",
              lineHeight: "20px",
              borderRadius: "4px",
            }}
            onPointerOver={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            onPointerOut={(e) => {
              e.currentTarget.style.opacity = "0.7";
            }}
          >
            ×
          </button>
        )}

        <div
          style={{
            position: "absolute",
            bottom: "-6px",
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: "10px",
            height: "10px",
            background: LABEL_BG,
            borderRight: `1px solid ${LABEL_BORDER}`,
            borderBottom: `1px solid ${LABEL_BORDER}`,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        />
      </div>
    </Html>
  );
}
