"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { PromiseEntry } from "@/types/promise";
import { getPalette, type ArchetypeKey } from "../config/flowerPalettes";
import { promiseToFlower } from "../config/promiseToFlower";
import { useIsFlowerActive, useSelectionActions } from "../hooks/useSelectionStore";
import FlowerLabel from "../scene/FlowerLabel";
import Bluebell from "./archetypes/Bluebell";
import CherryBlossomBranch from "./archetypes/CherryBlossomBranch";
import Daffodil from "./archetypes/Daffodil";
import Dahlia from "./archetypes/Dahlia";
import Iris from "./archetypes/Iris";
import LavenderSpike from "./archetypes/LavenderSpike";
import Lily from "./archetypes/Lily";
import Lotus from "./archetypes/Lotus";
import Orchid from "./archetypes/Orchid";
import Rose from "./archetypes/Rose";
import Tulip from "./archetypes/Tulip";
import WisteriaCascade from "./archetypes/WisteriaCascade";
import type { ArchetypeProps } from "./types";

const ARCHETYPES: Record<ArchetypeKey, ComponentType<ArchetypeProps>> = {
  lotus: Lotus,
  lily: Lily,
  rose: Rose,
  tulip: Tulip,
  cherryBlossom: CherryBlossomBranch,
  bluebell: Bluebell,
  iris: Iris,
  daffodil: Daffodil,
  orchid: Orchid,
  dahlia: Dahlia,
  wisteria: WisteriaCascade,
  lavender: LavenderSpike,
};

const HOVER_SCALE = 1.07;
const HOVER_LERP_FAST = 0.22;
const STAMEN_BOOST = 1.4;
const BOOSTABLE_EMISSIVE_MIN = 0.1;
const SWAY_TILT_DEG = 2;
const SWAY_BOB = 0.015;
const BLOOM_IN_DURATION = 1.2;
const LABEL_HIDE_DELAY_MS = 120;

type AugmentedMaterial = THREE.MeshStandardMaterial & {
  __baseEmissive?: number;
};

function easeOutBack(t: number, overshoot = 1.7): number {
  const c = overshoot;
  const x = t - 1;
  return 1 + (c + 1) * x * x * x + c * x * x;
}

function applyEmissiveBoost(root: THREE.Object3D, mult: number): void {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) {
      if (!m) continue;
      const mat = m as AugmentedMaterial;
      if (mat.emissiveIntensity === undefined) continue;
      if (mat.__baseEmissive === undefined) {
        mat.__baseEmissive = mat.emissiveIntensity;
      }
      if (mat.__baseEmissive > BOOSTABLE_EMISSIVE_MIN) {
        mat.emissiveIntensity = mat.__baseEmissive * mult;
      }
    }
  });
}

export interface FlowerProps {
  promise: PromiseEntry;
  position: [number, number, number];
  rotationY: number;
  reducedMotion: boolean;
  bloomIn: boolean;
}

export default function Flower({
  promise,
  position,
  rotationY,
  reducedMotion,
  bloomIn,
}: FlowerProps) {
  const instance = useMemo(() => promiseToFlower(promise), [promise]);
  const Archetype = ARCHETYPES[instance.archetype];
  const palette = getPalette(instance.archetype, instance.paletteVariant);

  const swayRef = useRef<THREE.Group>(null);
  const scaleRef = useRef<THREE.Group>(null);
  const archetypeRootRef = useRef<THREE.Group>(null);

  const targetScale = instance.scale;
  const targetBloom = instance.bloom;
  const shouldBloomIn = bloomIn && !reducedMotion && targetBloom > 0;
  const swayPeriod = useMemo(
    () => 4 + (instance.swayPhase / (Math.PI * 2)) * 2,
    [instance.swayPhase],
  );

  const [initialScale] = useState(() =>
    shouldBloomIn ? 0 : targetScale,
  );
  const [renderedBloom, setRenderedBloom] = useState(() =>
    shouldBloomIn ? 0 : targetBloom,
  );

  const bloomInElapsedRef = useRef(0);
  const currentScaleRef = useRef(initialScale);
  const currentBloomRef = useRef(renderedBloom);
  const hoverScaleRef = useRef(1);
  const emissiveBoostRef = useRef(1);
  const lastAppliedBoostRef = useRef(1);

  const { hovered, pinned, focused } = useIsFlowerActive(promise.id);
  const actions = useSelectionActions();
  const active = hovered || pinned || focused;

  const [labelMounted, setLabelMounted] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      const showTimer = setTimeout(() => setLabelMounted(true), 0);
      return () => clearTimeout(showTimer);
    }
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setLabelMounted(false);
      hideTimerRef.current = null;
    }, LABEL_HIDE_DELAY_MS);
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [active]);

  useEffect(() => {
    const root = archetypeRootRef.current;
    return () => {
      if (!root) return;
      applyEmissiveBoost(root, 1);
    };
  }, []);

  useFrame((_, delta) => {
    if (shouldBloomIn && bloomInElapsedRef.current < BLOOM_IN_DURATION) {
      bloomInElapsedRef.current += delta;
      const t = Math.min(1, bloomInElapsedRef.current / BLOOM_IN_DURATION);
      const eased = easeOutBack(t);
      currentScaleRef.current = THREE.MathUtils.clamp(
        eased * targetScale,
        0,
        targetScale * 1.5,
      );
      const nextBloom = THREE.MathUtils.clamp(eased * targetBloom, 0, targetBloom);
      if (
        Math.abs(nextBloom - currentBloomRef.current) > 0.01 ||
        t === 1
      ) {
        currentBloomRef.current = nextBloom;
        setRenderedBloom(nextBloom);
      }
    } else {
      currentScaleRef.current = targetScale;
      if (currentBloomRef.current !== targetBloom) {
        currentBloomRef.current = targetBloom;
        setRenderedBloom(targetBloom);
      }
    }

    const lerpRate = reducedMotion
      ? 1
      : 1 - Math.pow(1 - HOVER_LERP_FAST, delta * 60);

    const desiredHover = active ? HOVER_SCALE : 1;
    hoverScaleRef.current = THREE.MathUtils.lerp(
      hoverScaleRef.current,
      desiredHover,
      lerpRate,
    );

    const desiredBoost = active ? STAMEN_BOOST : 1;
    emissiveBoostRef.current = THREE.MathUtils.lerp(
      emissiveBoostRef.current,
      desiredBoost,
      lerpRate,
    );

    if (
      Math.abs(emissiveBoostRef.current - lastAppliedBoostRef.current) > 0.005
    ) {
      const root = archetypeRootRef.current;
      if (root) {
        applyEmissiveBoost(root, emissiveBoostRef.current);
        lastAppliedBoostRef.current = emissiveBoostRef.current;
      }
    }

    const finalScale = currentScaleRef.current * hoverScaleRef.current;
    const scaleGroup = scaleRef.current;
    if (scaleGroup) {
      scaleGroup.scale.setScalar(finalScale);
    }

    const swayGroup = swayRef.current;
    if (swayGroup && !reducedMotion) {
      const t = performance.now() / 1000;
      const periodA = swayPeriod;
      const periodB = periodA * 0.6 + 0.3;
      const tiltRad = (SWAY_TILT_DEG * Math.PI) / 180;
      swayGroup.rotation.x =
        Math.sin((t / periodA) * Math.PI * 2 + instance.swayPhase) * tiltRad;
      swayGroup.position.y =
        Math.sin((t / periodB) * Math.PI * 2 + instance.swayPhase * 1.3) *
        SWAY_BOB;
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    actions.setHovered(promise.id);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (hovered) actions.setHovered(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    actions.togglePin(promise.id);
  };

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <group ref={swayRef}>
        <group ref={scaleRef} scale={initialScale}>
          <group ref={archetypeRootRef}>
            <Archetype
              palette={palette}
              bloom={renderedBloom}
              seed={instance.seed}
            />
          </group>
        </group>
      </group>

      {labelMounted && (
        <FlowerLabel
          promise={promise}
          pinned={pinned}
          onClose={() => actions.unpin()}
        />
      )}
    </group>
  );
}
