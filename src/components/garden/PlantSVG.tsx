"use client";

import React from "react";
import { PlantRecipe } from "@/types/garden";

interface PlantSVGProps {
  recipe: PlantRecipe;
}

function hsl(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function renderStem(recipe: PlantRecipe, color: string) {
  const { stemHeight, stemCurve } = recipe;
  const topY = 160 - stemHeight;
  const isCactus = recipe.family === "cactus";
  const isCrystal = recipe.family === "crystal";

  return (
    <path
      d={`M 50,160 Q ${50 + stemCurve},${160 - stemHeight / 2} 50,${topY}`}
      stroke={color}
      strokeWidth={isCactus ? 6 : isCrystal ? 3 : 2}
      fill="none"
      strokeLinecap="round"
    />
  );
}

function renderFern(recipe: PlantRecipe, base: string, secondary: string) {
  const { stemHeight, stemCurve, branchCount, leafSize } = recipe;
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < branchCount; i++) {
    const t = (i + 1) / (branchCount + 1);
    const cy = 160 - stemHeight * t;
    const cx = 50 + stemCurve * t * (1 - t) * 2;
    const side = i % 2 === 0 ? 1 : -1;
    const branchLen = 8 + leafSize * 6;
    const leafCount = 3 + Math.floor(leafSize * 2);
    for (let j = 0; j < leafCount; j++) {
      const lt = (j + 1) / (leafCount + 1);
      elements.push(
        <ellipse
          key={`fern-${i}-${j}`}
          cx={cx + side * branchLen * lt}
          cy={cy - lt * 4}
          rx={1.5 * leafSize}
          ry={3 * leafSize}
          fill={j % 2 === 0 ? base : secondary}
          opacity={0.85}
          transform={`rotate(${side * (20 + j * 5)}, ${cx + side * branchLen * lt}, ${cy - lt * 4})`}
        />
      );
    }
  }
  return elements;
}

function renderCrystal(recipe: PlantRecipe, base: string, secondary: string) {
  const { stemHeight, branchCount, leafSize } = recipe;
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < branchCount; i++) {
    const t = (i + 1) / (branchCount + 1);
    const cy = 160 - stemHeight * t;
    const side = i % 2 === 0 ? 1 : -1;
    const size = 4 * leafSize;
    const cx = 50 + side * 6;
    const points = [
      `${cx},${cy - size}`,
      `${cx + side * size},${cy}`,
      `${cx},${cy + size * 0.5}`,
    ].join(" ");
    elements.push(
      <polygon
        key={`crystal-${i}`}
        points={points}
        fill={i % 2 === 0 ? base : secondary}
        opacity={0.8}
      />
    );
  }
  return elements;
}

function renderWisp(recipe: PlantRecipe, base: string, secondary: string) {
  const { stemHeight, stemCurve, branchCount, leafSize } = recipe;
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < branchCount * 2; i++) {
    const t = (i + 1) / (branchCount * 2 + 1);
    const cy = 160 - stemHeight * t;
    const cx = 50 + stemCurve * t * (1 - t) * 2;
    const side = i % 2 === 0 ? 1 : -1;
    const drift = 6 + i * 3;
    elements.push(
      <circle
        key={`wisp-${i}`}
        cx={cx + side * drift}
        cy={cy - 2}
        r={2.5 * leafSize}
        fill={i % 3 === 0 ? secondary : base}
        opacity={0.35 + (i % 3) * 0.15}
      />
    );
  }
  return elements;
}

function renderCactus(recipe: PlantRecipe, base: string, secondary: string) {
  const { stemHeight, branchCount, leafSize } = recipe;
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < Math.min(branchCount, 4); i++) {
    const t = 0.3 + (i / 4) * 0.5;
    const cy = 160 - stemHeight * t;
    const side = i % 2 === 0 ? 1 : -1;
    const armLen = 8 + leafSize * 4;
    elements.push(
      <path
        key={`arm-${i}`}
        d={`M 50,${cy} Q ${50 + side * armLen},${cy} ${50 + side * armLen},${cy - 8}`}
        stroke={base}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
    );
    for (let s = 0; s < 3; s++) {
      const sx = 50 + side * (2 + s * 3);
      elements.push(
        <path
          key={`spine-${i}-${s}`}
          d={`M ${sx},${cy - 2} L ${sx + side * 2},${cy - 5}`}
          stroke={secondary}
          strokeWidth={0.5}
          fill="none"
        />
      );
    }
  }
  return elements;
}

function renderBioluminescent(
  recipe: PlantRecipe,
  base: string,
  secondary: string,
  filterId: string
) {
  const { stemHeight, stemCurve, branchCount, leafSize } = recipe;
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < branchCount; i++) {
    const t = (i + 1) / (branchCount + 1);
    const cy = 160 - stemHeight * t;
    const cx = 50 + stemCurve * t * (1 - t) * 2;
    const side = i % 2 === 0 ? 1 : -1;
    elements.push(
      <ellipse
        key={`bio-leaf-${i}`}
        cx={cx + side * 8 * leafSize}
        cy={cy}
        rx={3 * leafSize}
        ry={5 * leafSize}
        fill={base}
        filter={`url(#${filterId})`}
        opacity={0.9}
      />
    );
    elements.push(
      <circle
        key={`bio-glow-${i}`}
        cx={cx + side * 8 * leafSize}
        cy={cy}
        r={2 * leafSize}
        fill={secondary}
        filter={`url(#${filterId})`}
        opacity={0.6}
      />
    );
  }
  return elements;
}

function renderAlien(recipe: PlantRecipe, base: string, secondary: string) {
  const { stemHeight, stemCurve, branchCount, leafSize } = recipe;
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < branchCount; i++) {
    const t = (i + 1) / (branchCount + 1);
    const cy = 160 - stemHeight * t;
    const cx = 50 + stemCurve * t * (1 - t) * 2;
    const offsetX = 6 + i * 2;
    const r = 2 * leafSize;
    for (const side of [-1, 1]) {
      elements.push(
        <ellipse
          key={`alien-${i}-${side}`}
          cx={cx + side * offsetX}
          cy={cy}
          rx={r}
          ry={r * 1.8}
          fill={side === 1 ? base : secondary}
          opacity={0.75}
          transform={`rotate(${side * 15}, ${cx + side * offsetX}, ${cy})`}
        />
      );
    }
  }
  return elements;
}

function renderFamily(
  recipe: PlantRecipe,
  base: string,
  secondary: string,
  filterId: string
) {
  switch (recipe.family) {
    case "fern":
      return renderFern(recipe, base, secondary);
    case "crystal":
      return renderCrystal(recipe, base, secondary);
    case "wisp":
      return renderWisp(recipe, base, secondary);
    case "cactus":
      return renderCactus(recipe, base, secondary);
    case "bioluminescent":
      return renderBioluminescent(recipe, base, secondary, filterId);
    case "alien":
      return renderAlien(recipe, base, secondary);
  }
}

export default function PlantSVG({ recipe }: PlantSVGProps) {
  const { hue, saturation, lightness, glowIntensity, animated, id } = recipe;

  const baseColor = hsl(hue, saturation, lightness);
  const secondaryColor = hsl((hue + 30) % 360, saturation, lightness);
  const stemColor = hsl((hue - 30 + 360) % 360, saturation - 10, lightness - 10);
  const filterId = `glow-${id}`;

  return (
    <svg
      viewBox="0 0 100 160"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <style>{`
        @keyframes sway {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-1px, 0) rotate(-1.5deg); }
          75% { transform: translate(1px, 0) rotate(1.5deg); }
        }
        .plant-group-animated {
          animation: sway 4s ease-in-out infinite;
          transform-origin: 50px 160px;
        }
      `}</style>

      <defs>
        <filter id={filterId}>
          <feGaussianBlur stdDeviation={2 + glowIntensity * 3} />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className={animated ? "plant-group-animated" : undefined}>
        {renderStem(recipe, stemColor)}
        {renderFamily(recipe, baseColor, secondaryColor, filterId)}
      </g>
    </svg>
  );
}
