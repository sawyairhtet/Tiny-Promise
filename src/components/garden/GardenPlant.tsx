"use client";

import type { GardenPlant as GardenPlantData, PlantKind, PlantMood } from "@/types/garden";

type Props = {
  plant: GardenPlantData;
};

const STEM: Record<PlantMood, string> = {
  thriving: "var(--color-sage-600)",
  growing: "var(--color-sage-500)",
  wilting: "var(--color-warm-400)",
};

const LEAF: Record<PlantMood, string> = {
  thriving: "var(--color-sage-400)",
  growing: "var(--color-sage-300)",
  wilting: "var(--color-warm-300)",
};

const BLOOM: Record<PlantMood, string> = {
  thriving: "var(--color-rose-300)",
  growing: "var(--color-rose-200)",
  wilting: "var(--color-warm-300)",
};

const PETAL: Record<PlantMood, string> = {
  thriving: "var(--color-amber-400)",
  growing: "var(--color-amber-300)",
  wilting: "var(--color-warm-300)",
};

function Sprout({ mood }: { mood: PlantMood }) {
  return (
    <>
      <line x1="24" y1="58" x2="24" y2="30" stroke={STEM[mood]} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="17" cy="28" rx="5" ry="9" fill={LEAF[mood]} transform="rotate(-25 17 28)" />
      <ellipse cx="31" cy="26" rx="5" ry="9" fill={LEAF[mood]} transform="rotate(25 31 26)" />
    </>
  );
}

function Daisy({ mood }: { mood: PlantMood }) {
  const cx = 24;
  const cy = 16;
  const petals = Array.from({ length: 5 }, (_, i) => {
    const angle = ((i * 72 - 90) * Math.PI) / 180;
    return (
      <ellipse
        key={i}
        cx={cx + Math.cos(angle) * 7}
        cy={cy + Math.sin(angle) * 7}
        rx="5"
        ry="5"
        fill="var(--color-warm-100)"
      />
    );
  });
  return (
    <>
      <line x1="24" y1="58" x2="24" y2="22" stroke={STEM[mood]} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="17" cy="42" rx="4" ry="8" fill={LEAF[mood]} transform="rotate(-20 17 42)" />
      {petals}
      <circle cx={cx} cy={cy} r="4" fill={PETAL[mood]} />
    </>
  );
}

function Tulip({ mood }: { mood: PlantMood }) {
  return (
    <>
      <line x1="24" y1="58" x2="24" y2="24" stroke={STEM[mood]} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="30" cy="42" rx="4" ry="8" fill={LEAF[mood]} transform="rotate(15 30 42)" />
      <path d="M16,22 Q18,8 24,6 Q30,8 32,22 Q24,25 16,22 Z" fill={BLOOM[mood]} />
    </>
  );
}

function Fern({ mood }: { mood: PlantMood }) {
  const fronds = Array.from({ length: 4 }, (_, i) => {
    const y = 26 + i * 8;
    return (
      <g key={i}>
        <ellipse cx="17" cy={y} rx="6" ry="3" fill={LEAF[mood]} transform={`rotate(-30 17 ${y})`} />
        <ellipse cx="31" cy={y + 3} rx="6" ry="3" fill={LEAF[mood]} transform={`rotate(30 31 ${y + 3})`} />
      </g>
    );
  });
  return (
    <>
      <line x1="24" y1="58" x2="24" y2="22" stroke={STEM[mood]} strokeWidth="2" strokeLinecap="round" />
      {fronds}
      <ellipse cx="24" cy="20" rx="3" ry="5" fill={LEAF[mood]} />
    </>
  );
}

function Sunflower({ mood }: { mood: PlantMood }) {
  const cx = 24;
  const cy = 14;
  const petals = Array.from({ length: 8 }, (_, i) => {
    const angle = ((i * 45) * Math.PI) / 180;
    return (
      <ellipse
        key={i}
        cx={cx + Math.cos(angle) * 9}
        cy={cy + Math.sin(angle) * 9}
        rx="4"
        ry="4"
        fill={PETAL[mood]}
      />
    );
  });
  return (
    <>
      <line x1="24" y1="58" x2="24" y2="20" stroke={STEM[mood]} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="16" cy="38" rx="5" ry="9" fill={LEAF[mood]} transform="rotate(-20 16 38)" />
      <ellipse cx="32" cy="46" rx="5" ry="9" fill={LEAF[mood]} transform="rotate(20 32 46)" />
      {petals}
      <circle cx={cx} cy={cy} r="5" fill="var(--color-warm-600)" />
    </>
  );
}

function renderPlant(kind: PlantKind, mood: PlantMood) {
  switch (kind) {
    case "sprout": return <Sprout mood={mood} />;
    case "daisy": return <Daisy mood={mood} />;
    case "tulip": return <Tulip mood={mood} />;
    case "fern": return <Fern mood={mood} />;
    case "sunflower": return <Sunflower mood={mood} />;
  }
}

export default function GardenPlant({ plant }: Props) {
  const wilt = plant.mood === "wilting" ? "rotate(10 24 58)" : undefined;
  return (
    <svg
      viewBox="0 0 48 64"
      className="w-12 h-16"
      role="img"
      aria-label={`${plant.mood} ${plant.kind}`}
    >
      <g transform={wilt}>
        {renderPlant(plant.kind, plant.mood)}
      </g>
    </svg>
  );
}
