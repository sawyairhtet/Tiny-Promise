"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Preload } from "@react-three/drei";
import * as THREE from "three";
import GardenScene from "./GardenScene";
import {
  CAMERA,
  IDLE_RESUME_MS,
  MIN_GL_TEXTURE_SIZE_FOR_POST,
  MOBILE_BREAKPOINT_PX,
  ORBIT,
  POST_PROCESSING_ENABLED,
  REDUCED_MOTION_CAMERA,
  pickCameraFov,
  pickOrbitMaxDistance,
  pickOrbitTarget,
} from "./config/cameraConfig";
import { SKY } from "./config/palette";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { selectionActions } from "./hooks/useSelectionStore";

const MOBILE_ANIMATION_FPS = 30;
const DESKTOP_ANIMATION_FPS = 45;

const Effects = dynamic(() => import("./scene/Effects"), {
  ssr: false,
  loading: () => null,
});

export default function GardenCanvas() {
  const reducedMotion = useReducedMotion();

  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      frameloop="demand"
      style={{
        display: "block",
        borderRadius: "24px",
      }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      onCreated={(state) => {
        state.gl.setClearColor(SKY.zenith, 1);
      }}
      onPointerMissed={() => {
        selectionActions.unpin();
      }}
    >
      <color attach="background" args={[SKY.zenith]} />
      <Suspense fallback={null}>
        <ResponsiveCamera reducedMotion={reducedMotion} />
        <CameraRig reducedMotion={reducedMotion} />
        <AnimationTicker reducedMotion={reducedMotion} />
        <GardenScene reducedMotion={reducedMotion} />
        <EffectsSlot reducedMotion={reducedMotion} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

function EffectsSlot({ reducedMotion }: { reducedMotion: boolean }) {
  const width = useThree((state) => state.size.width);
  const maxTextureSize = useThree(
    (state) => state.gl.capabilities.maxTextureSize ?? 0,
  );

  if (!POST_PROCESSING_ENABLED) return null;
  if (reducedMotion) return null;
  if (width < MOBILE_BREAKPOINT_PX) return null;
  if (maxTextureSize < MIN_GL_TEXTURE_SIZE_FOR_POST) return null;

  return <Effects reducedMotion={reducedMotion} />;
}

function AnimationTicker({ reducedMotion }: { reducedMotion: boolean }) {
  const width = useThree((state) => state.size.width);
  const invalidate = useThree((state) => state.invalidate);
  const targetFps =
    width < MOBILE_BREAKPOINT_PX ? MOBILE_ANIMATION_FPS : DESKTOP_ANIMATION_FPS;

  useEffect(() => {
    if (reducedMotion) return;
    let frameId = 0;
    let lastFrame = 0;
    const minFrameMs = 1000 / targetFps;

    const tick = (now: number) => {
      if (now - lastFrame >= minFrameMs) {
        lastFrame = now;
        invalidate();
      }
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [invalidate, reducedMotion, targetFps]);

  return null;
}

function ResponsiveCamera({ reducedMotion }: { reducedMotion: boolean }) {
  const width = useThree((state) => state.size.width);
  const fov = pickCameraFov(width);
  const position = reducedMotion ? REDUCED_MOTION_CAMERA.position : CAMERA.position;

  return (
    <PerspectiveCamera
      makeDefault
      position={position}
      fov={fov}
      near={CAMERA.near}
      far={CAMERA.far}
    />
  );
}

type CameraRigProps = { reducedMotion: boolean };

function CameraRig({ reducedMotion }: CameraRigProps) {
  const width = useThree((state) => state.size.width);
  const setFrameloop = useThree((state) => state.setFrameloop);
  const invalidate = useThree((state) => state.invalidate);

  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls> | null>(
    null,
  );
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [initialTarget] = useState<[number, number, number]>(() =>
    reducedMotion ? REDUCED_MOTION_CAMERA.target : pickOrbitTarget(width),
  );

  useEffect(() => {
    setFrameloop("demand");
    invalidate();
  }, [setFrameloop, invalidate]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const [tx, ty, tz] = reducedMotion
      ? REDUCED_MOTION_CAMERA.target
      : pickOrbitTarget(width);
    controls.target.set(tx, ty, tz);
    controls.maxDistance = pickOrbitMaxDistance(width);
    controls.update();
  }, [width, reducedMotion]);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const handleStart = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (!reducedMotion) {
      controls.autoRotate = false;
    }
  };

  const handleEnd = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (reducedMotion) return;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      const c = controlsRef.current;
      if (!c) return;
      c.autoRotate = true;
      idleTimerRef.current = null;
      invalidate();
    }, IDLE_RESUME_MS);
  };

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={initialTarget}
      enablePan={ORBIT.enablePan}
      enableZoom={!reducedMotion && ORBIT.enableZoom}
      enableRotate={!reducedMotion}
      minDistance={ORBIT.minDistance}
      maxDistance={pickOrbitMaxDistance(width)}
      minPolarAngle={ORBIT.minPolarAngle}
      maxPolarAngle={ORBIT.maxPolarAngle}
      autoRotate={!reducedMotion}
      autoRotateSpeed={ORBIT.autoRotateSpeed}
      enableDamping={!reducedMotion}
      dampingFactor={ORBIT.dampingFactor}
      onStart={handleStart}
      onEnd={handleEnd}
    />
  );
}
