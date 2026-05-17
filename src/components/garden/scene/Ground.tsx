"use client";

import { useMemo } from "react";
import { CanvasTexture, Color } from "three";
import { GROUND } from "../config/palette";

const PLANTER_RADIUS = 3.2;
const PLANTER_BASE_RADIUS = 3.4;
const PLANTER_HEIGHT = 0.18;
const FOG_RADIUS = 18;

function buildFogTexture(): CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const center = new Color(GROUND.fogCenter);
  const cssCenter = `rgba(${Math.round(center.r * 255)}, ${Math.round(
    center.g * 255,
  )}, ${Math.round(center.b * 255)}, 1)`;
  const cssEdge = `rgba(${Math.round(center.r * 255)}, ${Math.round(
    center.g * 255,
  )}, ${Math.round(center.b * 255)}, 0)`;

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, cssCenter);
  gradient.addColorStop(0.55, cssCenter.replace(", 1)", ", 0.55)"));
  gradient.addColorStop(1, cssEdge);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const tex = new CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function Ground() {
  const fogTexture = useMemo(() => buildFogTexture(), []);

  return (
    <group>
      <mesh
        position={[0, PLANTER_HEIGHT / 2 - 0.02, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[PLANTER_RADIUS, PLANTER_BASE_RADIUS, PLANTER_HEIGHT, 64]}
        />
        <meshStandardMaterial
          color={GROUND.planter}
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[FOG_RADIUS, 96]} />
        <meshBasicMaterial
          map={fogTexture ?? undefined}
          color={fogTexture ? "#ffffff" : GROUND.fogCenter}
          transparent
          opacity={fogTexture ? 1 : 0.6}
          depthWrite={false}
          fog={false}
        />
      </mesh>
    </group>
  );
}
