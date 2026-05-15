# Butterfly Effect — Garden Feature Context

This document is the canonical AI context for building the Butterfly Effect digital
garden on top of Tiny Promise. Read this before touching any file. Read AGENTS.md first
to understand which version of Next.js you are working with.

---

## What this feature is

A visual reward layer. When a user marks a promise as "kept", a unique generative SVG
plant grows in a full-screen digital garden. The garden is the celebration — it replaces
streaks and scores as the primary feeling of progress.

The existing promise system is untouched. The garden is purely additive.

---

## Core mental model

```
PromiseEntry (existing)
    └── on status === "kept"
        └── generatePlantRecipe(seed) → PlantRecipe
            └── savePlantRecipe(recipe) → gardenStorage
                └── renderPlant(recipe) → <PlantSVG /> component
```

A PlantRecipe is a plain JSON object. It contains numbers and strings that describe a
plant parametrically — not SVG markup. The SVG is computed at render time from the
recipe. This means the garden is editable: change the renderer, the plants change.
Never store raw SVG in localStorage.

---

## TypeScript types

Add these to `src/types/garden.ts` (create this file):

```typescript
export type PlantFamily =
  | "fern"
  | "crystal"
  | "wisp"
  | "cactus"
  | "bioluminescent"
  | "alien";

export type SkyState = "dawn" | "morning" | "afternoon" | "dusk" | "night";

export interface PlantRecipe {
  id: string;                  // nanoid or crypto.randomUUID()
  promiseId: string;           // links to PromiseEntry.id
  createdAt: number;           // Date.now()
  seed: number;                // 0–1, derived from promiseId hash
  family: PlantFamily;
  stemHeight: number;          // 40–120 (px units in viewBox)
  stemCurve: number;           // -30 to 30 (bezier offset)
  branchCount: number;         // 1–5
  leafSize: number;            // 0.5–2.0 scale multiplier
  hue: number;                 // 0–360
  saturation: number;          // 40–100
  lightness: number;           // 40–80
  glowIntensity: number;       // 0–1 (for bioluminescent/alien)
  positionX: number;           // 5–95 (% of garden width)
  animated: boolean;
}

export interface GardenState {
  plants: PlantRecipe[];
  skyState: SkyState;
  weatherEffect: WeatherEffect | null;
}

export type WeatherEffect = "rain" | "pollen" | "fireflies" | "fog" | "aurora";
```

---

## File structure to create

Only create these files. Do not move or rename existing files.

```
src/
├── types/
│   └── garden.ts               ← types above
├── lib/
│   ├── gardenGenerator.ts      ← pure functions, no side effects, no imports from Next
│   └── gardenStorage.ts        ← localStorage read/write for PlantRecipe[]
├── components/
│   └── garden/
│       ├── GardenView.tsx      ← full-screen canvas, renders all plants + sky
│       ├── PlantSVG.tsx        ← renders one PlantRecipe as an inline SVG
│       ├── SkyLayer.tsx        ← background gradient based on SkyState
│       ├── WeatherLayer.tsx    ← optional overlaid effect (rain, fireflies, etc.)
│       └── GardenControls.tsx  ← "Clear garden" button, weather toggle
└── app/
    └── garden/
        └── page.tsx            ← thin page, imports GardenView
```

---

## gardenGenerator.ts

This file is pure. It takes a `promiseId` string and returns a `PlantRecipe`.

```typescript
// src/lib/gardenGenerator.ts

import { PlantRecipe, PlantFamily } from "@/types/garden";

const FAMILIES: PlantFamily[] = [
  "fern", "crystal", "wisp", "cactus", "bioluminescent", "alien"
];

// Deterministic hash: same promiseId always gives the same recipe
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// Seeded random: given a seed and a salt, return a 0–1 float
function seededRandom(seed: number, salt: number): number {
  const x = Math.sin(seed + salt) * 10000;
  return x - Math.floor(x);
}

export function generatePlantRecipe(promiseId: string): PlantRecipe {
  const hash = hashString(promiseId);
  const r = (salt: number) => seededRandom(hash, salt);

  return {
    id: crypto.randomUUID(),
    promiseId,
    createdAt: Date.now(),
    seed: r(0),
    family: FAMILIES[Math.floor(r(1) * FAMILIES.length)],
    stemHeight: 40 + r(2) * 80,
    stemCurve: (r(3) - 0.5) * 60,
    branchCount: 1 + Math.floor(r(4) * 5),
    leafSize: 0.5 + r(5) * 1.5,
    hue: Math.floor(r(6) * 360),
    saturation: 40 + Math.floor(r(7) * 60),
    lightness: 40 + Math.floor(r(8) * 40),
    glowIntensity: r(9),
    positionX: 5 + r(10) * 90,
    animated: r(11) > 0.3,
  };
}
```

Key rule: the same `promiseId` always produces the same plant. The garden is reproducible
from localStorage data alone. Never pass `Math.random()` into the recipe.

---

## gardenStorage.ts

Mirrors the pattern in `lib/promiseStorage.ts`. Keep it consistent.

```typescript
// src/lib/gardenStorage.ts

import { PlantRecipe } from "@/types/garden";

const STORAGE_KEY = "tiny-promise-garden-v1";

export function loadPlants(): PlantRecipe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PlantRecipe[]) : [];
  } catch {
    return [];
  }
}

export function savePlants(plants: PlantRecipe[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
}

export function addPlant(recipe: PlantRecipe): void {
  const plants = loadPlants();
  savePlants([...plants, recipe]);
}

export function clearGarden(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
```

---

## PlantSVG.tsx rendering contract

Each plant renders in a local viewBox of `0 0 100 160`. The stem grows from y=160.
Branches attach to the stem at intervals. Leaves attach to branches.

Use these SVG primitives only. No canvas, no d3.

- `<path>` with quadratic bezier for stem: `M 50,160 Q ${50 + stemCurve},${160 - stemHeight / 2} 50,${160 - stemHeight}`
- `<ellipse>` for leaves, scaled by `leafSize`
- `<circle>` with blur filter for bioluminescent glow
- `<polygon>` for crystal family (sharp, geometric)
- CSS `@keyframes sway` for animated plants — translate + rotate from base

The hue/saturation/lightness from the recipe becomes the base color as an HSL string.
Derive secondary colors by offsetting hue ±30.

Families change the geometry, not just colors:

| Family | Shape language |
|---|---|
| fern | many small ellipse leaves, curved stem |
| crystal | polygon shards instead of leaves, straight stem |
| wisp | semi-transparent circles floating off the stem |
| cactus | thick stem, short stubby arms, spines as lines |
| bioluminescent | glow filter on all parts, low lightness base |
| alien | mirrored bilateral symmetry, unusual hue combos |

---

## Sky system

`SkyState` maps to local hour ranges. Derive from `new Date().getHours()` in `SkyLayer.tsx`.

| SkyState | Hours | Gradient suggestion |
|---|---|---|
| dawn | 5–7 | peach → lavender |
| morning | 8–11 | pale gold → sky blue |
| afternoon | 12–16 | bright blue → white |
| dusk | 17–19 | orange → deep violet |
| night | 20–4 | near-black → deep navy |

The sky changes on every page load. Do not store SkyState in localStorage.

---

## Weather effects (optional, additive)

`WeatherLayer.tsx` renders an animated SVG overlay on top of the garden.
Each effect is a set of small SVG shapes animating with CSS keyframes.

- `rain`: thin vertical lines drifting down
- `pollen`: tiny yellow circles floating up slowly
- `fireflies`: small circles that fade in/out at random positions
- `fog`: low-opacity white rectangles drifting horizontally
- `aurora`: sine-wave colored bands at the top of the sky (night only)

Weather is user-toggled via a button in `GardenControls.tsx`. Persist the last
chosen weather in localStorage under `tiny-promise-weather-v1`.

---

## Integration: where to trigger plant creation

In `src/app/page.tsx` (the Today page), after a promise is marked as kept:

```typescript
// After setPromiseStatus("kept") or equivalent:
import { generatePlantRecipe } from "@/lib/gardenGenerator";
import { addPlant } from "@/lib/gardenStorage";

const recipe = generatePlantRecipe(promise.id);
addPlant(recipe);
// Then optionally navigate to /garden to show it
```

Do not modify the existing promise-writing logic. Only add the two lines above.
Do not auto-navigate unless explicitly asked. Show a subtle "Your garden grew" link instead.

---

## Garden page layout

`/garden` is a full-screen view. No navigation tabs overlay it.
The existing `<Navigation />` component should still be visible at the bottom.

Layout:

```
[SkyLayer — full bleed background]
  [WeatherLayer — full bleed overlay, pointer-events none]
  [PlantSVG × n — absolute positioned by positionX, anchored to bottom]
  [GardenControls — top-right corner, small icon buttons]
```

Plants are layered by createdAt: older plants are lower z-index.
Plants animate with a `grow` keyframe on mount (scale from 0 to 1, origin bottom).

---

## What NOT to do

- Do not rewrite `page.tsx`, `history/page.tsx`, or `insights/page.tsx` beyond adding the two integration lines.
- Do not add any npm packages unless asked. All animation is CSS keyframes.
- Do not store SVG strings in localStorage.
- Do not use `useEffect` to generate plants on render — generate once on user action only.
- Do not add a "streak" or count display in the garden. The visual density of plants IS the metric.
- Do not use `Math.random()` inside the recipe generator — it must be deterministic.

---

## Build order (follow this exactly, one step at a time)

1. Create `src/types/garden.ts`
2. Create `src/lib/gardenGenerator.ts` and write a unit-testable `generatePlantRecipe`
3. Create `src/lib/gardenStorage.ts`
4. Create `src/components/garden/PlantSVG.tsx` — render one plant, hardcode a test recipe first
5. Create `src/components/garden/SkyLayer.tsx`
6. Create `src/components/garden/GardenView.tsx` — wire SkyLayer + PlantSVG[]
7. Create `src/app/garden/page.tsx` — thin wrapper around GardenView
8. Add the navigation link for `/garden` in `src/components/Navigation.tsx`
9. Add the two integration lines in `src/app/page.tsx`
10. Create `src/components/garden/WeatherLayer.tsx`
11. Create `src/components/garden/GardenControls.tsx`

Do step 4 before step 6. Verify the plant renders in isolation before compositing.

---

## Extending later (do not build now, just hooks to leave)

- Export a `PLANT_FAMILIES` map so a future AI prompt can add a new family by appending one entry
- Keep `WeatherEffect` as a union type so new effects are added by extending it, not rewriting
- The `SkyState` type can gain new values (e.g. `"eclipse"`) without breaking existing renders
- `PlantRecipe.glowIntensity` is reserved for a future glow slider in settings

---

## Tone alignment

The garden should feel like the rest of Tiny Promise: calm, unhurried, poetic.
Plants should sway gently, not bounce. Colors should feel hand-picked, not neon.
The garden is a quiet place, not a fireworks show.

When in doubt: less animation, more stillness. The plant density over time is the reward.
