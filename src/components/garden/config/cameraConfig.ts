import { MathUtils } from "three";

export const CAMERA = {
  position: [0, 2.4, 6.2] as [number, number, number],
  fov: 32,
  near: 0.1,
  far: 60,
};

export const ORBIT = {
  target: [0, 0.55, 0] as [number, number, number],
  enablePan: false,
  enableZoom: true,
  minDistance: 4,
  maxDistance: 11,
  minPolarAngle: Math.PI * 0.18,
  maxPolarAngle: Math.PI * 0.48,
  autoRotate: true,
  autoRotateSpeed: 0.35,
  enableDamping: true,
  dampingFactor: 0.07,
};

export const IDLE_RESUME_MS = 4000;

export const MOBILE_BREAKPOINT_PX = 768;

export const MOBILE_OVERRIDES = {
  fov: 40,
  maxDistance: 9,
  target: [0, 0.85, 0] as [number, number, number],
};

export const REDUCED_MOTION_CAMERA = {
  position: [0, 2.6, 6.8] as [number, number, number],
  target: [0, 0.6, 0] as [number, number, number],
};

export const POST_PROCESSING_ENABLED = true;
export const MIN_GL_TEXTURE_SIZE_FOR_POST = 4096;

export function pickCameraFov(widthPx: number): number {
  return widthPx < MOBILE_BREAKPOINT_PX ? MOBILE_OVERRIDES.fov : CAMERA.fov;
}

export function pickOrbitMaxDistance(widthPx: number): number {
  return widthPx < MOBILE_BREAKPOINT_PX
    ? MOBILE_OVERRIDES.maxDistance
    : ORBIT.maxDistance;
}

export function pickOrbitTarget(widthPx: number): [number, number, number] {
  return widthPx < MOBILE_BREAKPOINT_PX ? MOBILE_OVERRIDES.target : ORBIT.target;
}

export const DEG = (deg: number) => MathUtils.degToRad(deg);
