"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "../flowers/parts/random";

const COUNT = 24;
const HIGH_DRIFT_COUNT = 6;
const RADIUS = 3.5;
const HEIGHT = 2.5;
const BASE_Y = 0.4;
const HIGH_DRIFT_Y_BOOST = 1.2;
const FIREFLY_RADIUS = 0.012;

const BODY_COLOR = "#F8D88A";
const BASE_EMISSIVE = 1.4;
const MIN_EMISSIVE = 0.4;
const MAX_EMISSIVE = 1.4;
const EMISSIVE_ATTRIBUTE = "instanceEmissiveScale";

interface FireflyConfig {
  origin: THREE.Vector3;
  amplitude: THREE.Vector3;
  speed: THREE.Vector3;
  phase: THREE.Vector3;
  fadeSpeed: number;
  fadePhase: number;
  highDrift: boolean;
}

function buildFireflies(): FireflyConfig[] {
  const rng = mulberry32(0xfa1efeed);
  const arr: FireflyConfig[] = [];
  for (let i = 0; i < COUNT; i++) {
    const theta = rng() * Math.PI * 2;
    const r = Math.sqrt(rng()) * RADIUS;
    const highDrift = i < HIGH_DRIFT_COUNT;
    const baseY = BASE_Y + rng() * HEIGHT + (highDrift ? HIGH_DRIFT_Y_BOOST : 0);
    arr.push({
      origin: new THREE.Vector3(Math.cos(theta) * r, baseY, Math.sin(theta) * r),
      amplitude: new THREE.Vector3(
        0.35 + rng() * 0.35,
        0.18 + rng() * 0.22,
        0.35 + rng() * 0.35,
      ),
      speed: new THREE.Vector3(
        (highDrift ? 0.18 : 0.32) + rng() * 0.18,
        (highDrift ? 0.12 : 0.22) + rng() * 0.16,
        (highDrift ? 0.16 : 0.3) + rng() * 0.18,
      ),
      phase: new THREE.Vector3(
        rng() * Math.PI * 2,
        rng() * Math.PI * 2,
        rng() * Math.PI * 2,
      ),
      fadeSpeed: 0.4 + rng() * 0.6,
      fadePhase: rng() * Math.PI * 2,
      highDrift,
    });
  }
  return arr;
}

interface Props {
  reducedMotion: boolean;
}

export default function Fireflies({ reducedMotion }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const fireflies = useMemo(() => buildFireflies(), []);

  const tempObject = useMemo(() => new THREE.Object3D(), []);

  const material = useMemo(
    () => {
      const mat = new THREE.MeshStandardMaterial({
        color: BODY_COLOR,
        emissive: BODY_COLOR,
        emissiveIntensity: BASE_EMISSIVE,
        roughness: 0.4,
        metalness: 0,
        toneMapped: false,
      });
      mat.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader.replace(
          "#include <common>",
          `#include <common>
          attribute float ${EMISSIVE_ATTRIBUTE};
          varying float vFireflyEmissiveScale;`,
        );
        shader.vertexShader = shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          vFireflyEmissiveScale = ${EMISSIVE_ATTRIBUTE};`,
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <common>",
          `#include <common>
          varying float vFireflyEmissiveScale;`,
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          "vec3 totalEmissiveRadiance = emissive;",
          "vec3 totalEmissiveRadiance = emissive * vFireflyEmissiveScale;",
        );
      };
      mat.customProgramCacheKey = () => "garden-firefly-instance-emissive";
      return mat;
    },
    [],
  );

  const geometry = useMemo(() => {
    const geom = new THREE.SphereGeometry(FIREFLY_RADIUS, 8, 8);
    const attr = new THREE.InstancedBufferAttribute(
      new Float32Array(COUNT),
      1,
    );
    attr.setUsage(THREE.DynamicDrawUsage);
    geom.setAttribute(EMISSIVE_ATTRIBUTE, attr);
    return geom;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useEffect(() => {
    if (reducedMotion) return;
    const mesh = meshRef.current;
    if (!mesh) return;
    const emissiveAttribute = mesh.geometry.getAttribute(
      EMISSIVE_ATTRIBUTE,
    ) as THREE.InstancedBufferAttribute | undefined;
    if (!emissiveAttribute) return;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    for (let i = 0; i < fireflies.length; i++) {
      const f = fireflies[i];
      tempObject.position.copy(f.origin);
      tempObject.scale.setScalar(1);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);
      emissiveAttribute.setX(i, 1);
    }
    mesh.instanceMatrix.needsUpdate = true;
    emissiveAttribute.needsUpdate = true;
  }, [fireflies, reducedMotion, tempObject]);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const mesh = meshRef.current;
    if (!mesh) return;
    const emissiveAttribute = mesh.geometry.getAttribute(
      EMISSIVE_ATTRIBUTE,
    ) as THREE.InstancedBufferAttribute | undefined;
    if (!emissiveAttribute) return;
    const t = clock.elapsedTime;

    for (let i = 0; i < fireflies.length; i++) {
      const f = fireflies[i];
      const dx = Math.sin(t * f.speed.x + f.phase.x) * f.amplitude.x;
      const dy = Math.sin(t * f.speed.y + f.phase.y) * f.amplitude.y;
      const dz = Math.cos(t * f.speed.z + f.phase.z) * f.amplitude.z;
      tempObject.position.set(
        f.origin.x + dx,
        f.origin.y + dy,
        f.origin.z + dz,
      );
      tempObject.scale.setScalar(1);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);

      const fade = Math.sin(t * f.fadeSpeed + f.fadePhase) * 0.5 + 0.5;
      const intensity = THREE.MathUtils.lerp(
        MIN_EMISSIVE,
        MAX_EMISSIVE,
        fade,
      );
      emissiveAttribute.setX(i, intensity / BASE_EMISSIVE);
    }
    mesh.instanceMatrix.needsUpdate = true;
    emissiveAttribute.needsUpdate = true;
  });

  if (reducedMotion) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, COUNT]}
      frustumCulled={false}
    />
  );
}
