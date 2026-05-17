"use client";

import { useThree } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import {
  MIN_GL_TEXTURE_SIZE_FOR_POST,
  MOBILE_BREAKPOINT_PX,
  POST_PROCESSING_ENABLED,
} from "../config/cameraConfig";

interface Props {
  reducedMotion: boolean;
}

export default function Effects({ reducedMotion }: Props) {
  const gl = useThree((s) => s.gl);
  const width = useThree((s) => s.size.width);

  if (!POST_PROCESSING_ENABLED) return null;
  if (reducedMotion) return null;

  const maxTex = gl.capabilities.maxTextureSize ?? 0;
  if (maxTex < MIN_GL_TEXTURE_SIZE_FOR_POST) return null;
  if (width < MOBILE_BREAKPOINT_PX) return null;

  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={0.45}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.4}
      />
      <Vignette eskil={false} offset={0.2} darkness={0.7} />
    </EffectComposer>
  );
}
