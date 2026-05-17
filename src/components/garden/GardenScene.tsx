"use client";

import { useMemo } from "react";
import { flowerLayout } from "./config/flowerLayout";
import { promiseToFlower } from "./config/promiseToFlower";
import Flower from "./flowers/Flower";
import { useGardenPromises } from "./hooks/useGardenPromises";
import BackgroundFoliage from "./scene/BackgroundFoliage";
import EmptyPlanter from "./scene/EmptyPlanter";
import Fireflies from "./scene/Fireflies";
import Ground from "./scene/Ground";
import GroundMist from "./scene/GroundMist";
import Lights from "./scene/Lights";
import TwilightSky from "./scene/TwilightSky";

type Props = {
  reducedMotion: boolean;
};

function pickNewestId(promises: ReturnType<typeof useGardenPromises>): string | null {
  if (promises.length === 0) return null;
  let newest = promises[0];
  for (let i = 1; i < promises.length; i++) {
    const a = promises[i].completedAt ?? promises[i].createdAt;
    const b = newest.completedAt ?? newest.createdAt;
    if (a > b) newest = promises[i];
  }
  return newest.id;
}

export default function GardenScene({ reducedMotion }: Props) {
  const promises = useGardenPromises();
  const isEmpty = promises.length === 0;

  const placements = useMemo(() => {
    if (isEmpty) return [];
    const seeds = promises.map((p) => promiseToFlower(p).seed);
    return flowerLayout(promises.length, seeds);
  }, [promises, isEmpty]);

  const newestId = useMemo(() => pickNewestId(promises), [promises]);

  return (
    <>
      <fog attach="fog" args={["#2A1A3E", 5, 22]} />
      <TwilightSky reducedMotion={reducedMotion} />
      <Lights />
      <Ground />
      <GroundMist reducedMotion={reducedMotion} />
      <BackgroundFoliage />
      <Fireflies reducedMotion={reducedMotion} />
      {isEmpty && <EmptyPlanter />}
      {!isEmpty &&
        promises.map((promise, i) => {
          const place = placements[i];
          if (!place) return null;
          return (
            <Flower
              key={promise.id}
              promise={promise}
              position={place.position}
              rotationY={place.rotationY}
              reducedMotion={reducedMotion}
              bloomIn={promise.id === newestId}
            />
          );
        })}
    </>
  );
}
