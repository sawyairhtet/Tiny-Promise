"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Preload } from "@react-three/drei";
import * as THREE from "three";
import GardenScene from "./GardenScene";
import {
  CAMERA,
  IDLE_RESUME_MS,
  ORBIT,
  REDUCED_MOTION_CAMERA,
  pickCameraFov,
  pickOrbitMaxDistance,
  pickOrbitTarget,
} from "./config/cameraConfig";
import { SKY } from "./config/palette";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { selectionActions } from "./hooks/useSelectionStore";
import Effects from "./scene/Effects";

export default function GardenCanvas() {
  const reducedMotion = useReducedMotion();
  const initialFrameloop: "always" | "demand" = reducedMotion
    ? "demand"
    : "always";

  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      frameloop={initialFrameloop}
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
        <GardenScene reducedMotion={reducedMotion} />
        <Effects reducedMotion={reducedMotion} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
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
    setFrameloop(reducedMotion ? "demand" : "always");
    invalidate();
  }, [reducedMotion, setFrameloop, invalidate]);

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
      enableZoom={ORBIT.enableZoom}
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
