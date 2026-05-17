"use client";

import { useThree } from "@react-three/fiber";
import { MOBILE_BREAKPOINT_PX } from "../config/cameraConfig";
import { LIGHTS } from "../config/palette";

export default function Lights() {
  const viewportWidth = useThree((state) => state.size.width);
  const shadowMapSize = viewportWidth < MOBILE_BREAKPOINT_PX ? 512 : 1024;

  return (
    <>
      <hemisphereLight
        args={[LIGHTS.hemiSky, LIGHTS.hemiGround, 0.35]}
      />

      <directionalLight
        position={[8, 9, -6]}
        color={LIGHTS.moon}
        intensity={0.7}
        castShadow
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-left={-3.6}
        shadow-camera-right={3.6}
        shadow-camera-top={3.6}
        shadow-camera-bottom={-3.6}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-bias={-0.0008}
      />

      <directionalLight
        position={[-5, 2, 4]}
        color={LIGHTS.warmRim}
        intensity={0.25}
      />

      <ambientLight color={LIGHTS.ambient} intensity={0.08} />
    </>
  );
}
