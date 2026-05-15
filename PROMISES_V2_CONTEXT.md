# Promises V2 — Two-Category System
This app is not a task manager. It is a habit of honesty with yourself and the people around you. Every word the app shows -- buttons, labels, empty states, confirmations -- should sound like something a thoughtful friend would say, not a project management tool. "Kept" not "Completed". "Broke this one" not "Failed". "A promise for someone" not "Assignee". When in doubt, make it quieter and warmer.
Read AGENTS.md and AI_CONTEXT.md before touching anything.

This document describes a single, contained upgrade: splitting the promise system into
two categories — "self" and "others" — with up to 5 promises each per day. The garden
integration extends automatically without changes to GARDEN_CONTEXT.md.

---

## What changes and what does not

### Changes
- `PromiseEntry` gets a new `category` field
- `promiseStorage.ts` gets a migration function and new helper
- `src/app/page.tsx` (Today) is redesigned with two sections
- `src/app/history/page.tsx` shows a tag per promise indicating category
- `src/app/insights/page.tsx` shows a score breakdown by category

### Does NOT change
- `src/types/garden.ts` — untouched
- `src/lib/gardenGenerator.ts` — untouched
- `src/lib/gardenStorage.ts` — untouched
- `src/components/garden/` — untouched
- `GARDEN_CONTEXT.md` rules — still apply
- The self-trust score calculation logic — just calculated twice (once per category)

---

## Data model

Edit `src/types/promise.ts`. Add one field to the existing `PromiseEntry` interface.
Do not remove or rename any existing fields.

```typescript
export type PromiseCategory = "self" | "others";

export interface PromiseEntry {
  id: string;
  date: string;               // YYYY-MM-DD
  text: string;
  status: "pending" | "kept" | "partly-kept" | "broken";
  reflection?: string;
  tomorrowSize?: "smaller" | "same" | "bigger";
  createdAt: number;
  category: PromiseCategory;  // NEW — default "self" in migration
}
```

Do not change any other type. The `category` field is the only addition.

---

## Storage migration

Edit `src/lib/promiseStorage.ts`. Add these two exports without changing anything else:

```typescript
// Maximum promises allowed per category per day
export const MAX_PROMISES_PER_CATEGORY = 5;

// Returns all promises for a given date, grouped by category
export function getPromisesByDate(date: string): {
  self: PromiseEntry[];
  others: PromiseEntry[];
} {
  const all = loadPromises(); // existing function
  const forDate = all.filter((p) => p.date === date);
  return {
    self: forDate.filter((p) => p.category === "self"),
    others: forDate.filter((p) => p.category === "others"),
  };
}

// Migration: run once on app load.
// Any PromiseEntry missing a category field is assigned "self".
export function migratePromises(): void {
  if (typeof window === "undefined") return;
  const all = loadPromises();
  const needsMigration = all.some((p) => !p.category);
  if (!needsMigration) return;
  const migrated = all.map((p) =>
    p.category ? p : { ...p, category: "self" as PromiseCategory }
  );
  savePromises(migrated); // existing function
}
```

The migration runs on every app load but exits immediately once all entries have a
category. It is safe to call multiple times.

---

## Today page redesign (src/app/page.tsx)

This is the largest change. Read the existing file carefully before editing.

The page renders two sections. A section is:
- A label row: colored dot + category name + "N / 5" pill
- A list of existing PromiseEntry cards for that category on today's date
- An "Add a promise" button, disabled (greyed) if that category already has 5

Each PromiseEntry card shows:
- A circular checkbox (tappable to open the check-in flow)
- The promise text
- A strikethrough + muted color when status is "kept"
- A subtle red-tinted circle when status is "broken"

The two sections are stacked vertically. "For me" is always on top.

### Color tokens to use
- Self category dot and accents: `#7F77DD` (purple mid-tone)
- Others category dot and accents: `#1D9E75` (teal mid-tone)
- These are hardcoded hex, not CSS variables, because they are categorical identifiers
  that should not invert in dark mode the same way semantic tokens do.

### Add promise flow
When the user taps "Add a promise for [category]":
1. Show an inline text input beneath the add button (do not navigate away)
2. On submit, call `savePromise({ ...newEntry, category })` (existing save function)
3. Re-render the section with the new card

Do not open a modal. Keep it inline.

### Check-in flow
When the user taps a promise card checkbox:
1. Show an inline mini-form beneath the card: status buttons + optional reflection textarea
2. On submit, update the entry via `updatePromise(id, { status, reflection })` (existing)
3. If status is "kept", call `generatePlantRecipe` and `addPlant` (garden integration —
   same two lines from GARDEN_CONTEXT.md step 9)
4. Collapse the form

### Migration call
At the top of the page component (in the `useEffect` that loads today's promises),
add one line before loading:

```typescript
migratePromises(); // ensure all historical entries have a category
```

---

## History page (src/app/history/page.tsx)

Read the existing file. Make the smallest possible change.

Each promise card in the history list should show a small pill tag on the right side:
- "me" in purple tones for `category === "self"`:
  `background: #EEEDFE; color: #534AB7; font-size: 10px; padding: 2px 7px; border-radius: 20px;`
- "others" in teal tones for `category === "others"`:
  `background: #E1F5EE; color: #0F6E56; font-size: 10px; padding: 2px 7px; border-radius: 20px;`

Group the promises within each day by category in the display: self promises first,
then others. Show both under the same date heading.

Do not add any new filtering or sorting controls. Just the tags and grouping.

---

## Insights page (src/app/insights/page.tsx)

Read the existing file and understand how the self-trust score is calculated (in
`src/lib/promiseStats.ts` or inline). Do not change the calculation logic.

Show the existing score prominently as before.

Below it, add a simple two-column breakdown:

| For me | For others |
|--------|------------|
| [score] | [score] |
| [kept/total] | [kept/total] |

Calculate each category's score by filtering `loadPromises()` to `category === "self"`
or `category === "others"` before passing to the existing stats function.

Add a short, calm label under each score:
- If score >= 0.8: "Reliable"
- If score >= 0.5: "Growing"
- If score < 0.5: "Be gentle with yourself"

The tone is the same as the rest of the app: honest and kind, never accusatory.

---

## Build order

Do these one at a time. Do not jump ahead.

1. Edit `src/types/promise.ts` — add `PromiseCategory` type and `category` field
2. Edit `src/lib/promiseStorage.ts` — add `migratePromises`, `getPromisesByDate`, `MAX_PROMISES_PER_CATEGORY`
3. Edit `src/app/page.tsx` — redesign Today page with two sections (largest change)
4. Edit `src/app/history/page.tsx` — add category tags and grouping
5. Edit `src/app/insights/page.tsx` — add category score breakdown

---

## What NOT to do

- Do not create new files. All changes go in existing files except step 1 has no
  new file either — it edits `src/types/promise.ts`.
- Do not rename or remove any existing PromiseEntry fields.
- Do not add a backend.
- Do not add a third category.
- Do not add per-promise deadlines, reminders, or priorities.
- Do not change the garden at all.
- Do not rewrite the check-in flow from scratch — find where it already lives and
  extend it to handle multi-promise.
- Do not add a "switch category" button on a card. Category is set at creation and
  is immutable.

---

## Philosophy alignment

The same Tiny Promise tone applies to both categories:
- "For others" is not a task manager. It is a commitment tracker.
- Do not use the word "task", "todo", or "assignee" anywhere.
- Labels should feel like spoken promises: "Call Mum back tonight", not "Contact: Mum".
- The 5-promise cap per category is a feature, not a limitation. It forces intentionality.
- An empty "For others" section on any given day is fine. Do not prompt or nudge.
