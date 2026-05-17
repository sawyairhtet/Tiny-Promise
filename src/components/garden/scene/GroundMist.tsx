"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PLANE_SIZE = 12;
const PLANE_Y = 0.05;
const MAX_ALPHA = 0.18;

function buildMistTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.1,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.45, "rgba(255, 255, 255, 0.55)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Add some softer noise for organic feel
  ctx.globalCompositeOperation = "destination-in";
  const noise = ctx.createRadialGradient(
    size * 0.4,
    size * 0.6,
    size * 0.05,
    size * 0.5,
    size * 0.5,
    size * 0.55,
  );
  noise.addColorStop(0, "rgba(255, 255, 255, 1)");
  noise.addColorStop(1, "rgba(255, 255, 255, 0.85)");
  ctx.fillStyle = noise;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

interface Props {
  reducedMotion: boolean;
}

export default function GroundMist({ reducedMotion }: Props) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const texture = useMemo(() => buildMistTexture(), []);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const mat = materialRef.current;
    if (!mat || !mat.map) return;
    mat.map.offset.x += delta * 0.008;
    mat.map.offset.y += delta * 0.004;
  });

  if (!texture) return null;

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, PLANE_Y, 0]}
      renderOrder={-1}
    >
      <planeGeometry args={[PLANE_SIZE, PLANE_SIZE, 1, 1]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        color="#A89AC4"
        transparent
        opacity={MAX_ALPHA}
        depthWrite={false}
        fog={false}
        toneMapped={false}
      />
    </mesh>
  );
}
