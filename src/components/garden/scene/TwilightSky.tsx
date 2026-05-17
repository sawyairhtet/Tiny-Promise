"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BackSide,
  BufferAttribute,
  Color,
  InstancedMesh,
  Matrix4,
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { SKY } from "../config/palette";

type Props = {
  reducedMotion: boolean;
};

const STAR_COUNT = 120;
const TWINKLE_COUNT = 7;
const SKY_RADIUS = 30;

function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function buildSkyGeometry(): SphereGeometry {
  const geom = new SphereGeometry(SKY_RADIUS, 48, 32);
  const positions = geom.attributes.position as BufferAttribute;
  const colors = new Float32Array(positions.count * 3);
  const zenith = new Color(SKY.zenith);
  const mid = new Color(SKY.mid);
  const horizon = new Color(SKY.horizon);
  const tmp = new Color();
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i) / SKY_RADIUS;
    const t = (y + 1) * 0.5;
    if (t > 0.55) {
      const k = (t - 0.55) / 0.45;
      tmp.copy(mid).lerp(zenith, k);
    } else {
      const k = t / 0.55;
      tmp.copy(horizon).lerp(mid, k);
    }
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  geom.setAttribute("color", new BufferAttribute(colors, 3));
  return geom;
}

type StarData = {
  position: Vector3;
  scale: number;
  twinkleAmp: number;
  twinklePhase: number;
  twinkleSpeed: number;
};

function buildStars(): StarData[] {
  const rng = makeRng(20260517);
  const stars: StarData[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(rng() * 0.85);
    const r = SKY_RADIUS - 1.5;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);
    const scale = 0.008 + rng() * 0.014;
    const twinkles = i < TWINKLE_COUNT;
    stars.push({
      position: new Vector3(x, y, z),
      scale,
      twinkleAmp: twinkles ? 0.45 : 0,
      twinklePhase: rng() * Math.PI * 2,
      twinkleSpeed: 0.7 + rng() * 0.6,
    });
  }
  return stars;
}

export default function TwilightSky({ reducedMotion }: Props) {
  const skyGeometry = useMemo(() => buildSkyGeometry(), []);
  const skyMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: `
          varying vec3 vColor;
          void main() {
            vColor = color;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            gl_FragColor = vec4(vColor, 1.0);
          }
        `,
        side: BackSide,
        vertexColors: true,
        depthWrite: false,
        fog: false,
      }),
    [],
  );

  const stars = useMemo(() => buildStars(), []);
  const starsRef = useRef<InstancedMesh>(null);
  const matrix = useMemo(() => new Matrix4(), []);

  useFrame(({ clock }) => {
    const mesh = starsRef.current;
    if (!mesh) return;
    if (reducedMotion) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < TWINKLE_COUNT; i++) {
      const s = stars[i];
      const k = 1 + Math.sin(t * s.twinkleSpeed + s.twinklePhase) * s.twinkleAmp;
      matrix.makeScale(s.scale * k, s.scale * k, s.scale * k);
      matrix.setPosition(s.position);
      mesh.setMatrixAt(i, matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  const starInit = (mesh: InstancedMesh | null) => {
    if (!mesh) return;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      matrix.makeScale(s.scale, s.scale, s.scale);
      matrix.setPosition(s.position);
      mesh.setMatrixAt(i, matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };

  return (
    <group>
      <mesh geometry={skyGeometry} material={skyMaterial} frustumCulled={false} />

      <instancedMesh
        ref={(node: InstancedMesh | null) => {
          starsRef.current = node;
          starInit(node);
        }}
        args={[undefined, undefined, STAR_COUNT]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={SKY.star} toneMapped={false} fog={false} />
      </instancedMesh>

      <Moon />
    </group>
  );
}

function Moon() {
  const ref = useRef<Mesh>(null);
  return (
    <group position={[8, 6, -18]}>
      <mesh>
        <circleGeometry args={[1.6, 64]} />
        <meshBasicMaterial
          color={SKY.moonHalo}
          transparent
          opacity={0.18}
          toneMapped={false}
          depthWrite={false}
          fog={false}
        />
      </mesh>
      <mesh ref={ref} position={[0, 0, 0.01]}>
        <circleGeometry args={[0.95, 64]} />
        <meshBasicMaterial
          color={SKY.moonCore}
          toneMapped={false}
          fog={false}
        />
      </mesh>
    </group>
  );
}
