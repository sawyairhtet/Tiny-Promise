# Butterfly Garden - Manual Test Checklist

Test against `localhost:3000`. Clear localStorage between full runs.

## Prerequisites

- Dev server running (`npm run dev`)
- Browser DevTools open (Application > Local Storage)
- Two localStorage keys to monitor:
  - `tiny-promise.entries` (promises)
  - `tiny-promise.garden.v1` (garden plants)

---

## 1. First visit (empty state)

- [ ] Open the app with no localStorage data
- [ ] Promise form is visible with "One promise is enough." heading
- [ ] Below the form, the garden empty state card is visible
- [ ] Empty state shows a small sprout illustration and "Your garden awaits."
- [ ] `tiny-promise.garden.v1` does not exist in localStorage

## 2. Create promise

- [ ] Type a promise and submit
- [ ] Phase transitions to "pending" showing the TodayPromiseCard
- [ ] Garden empty state remains visible below the promise card
- [ ] `tiny-promise.garden.v1` still does not exist (no plant yet)
- [ ] `tiny-promise.entries` contains one entry with `status: "pending"`

## 3. Keep promise

- [ ] Click "I kept it"
- [ ] Check-in form appears (reflection + tomorrow size)
- [ ] Fill in reflection, select a tomorrow size, submit
- [ ] CompletedPromiseCard appears with status "Kept"
- [ ] Reflection text is displayed in the card

## 4. Plant appears

- [ ] After completing with "kept", the garden scene replaces the empty state
- [ ] Exactly one plant is visible in the garden grid
- [ ] Plant has mood "thriving" (upright, vibrant sage/green colors)
- [ ] `tiny-promise.garden.v1` in localStorage contains one entry
- [ ] The entry's `promiseId` matches the promise's `id` in `tiny-promise.entries`
- [ ] The entry's `mood` is `"thriving"`

## 5. Refresh preserves plant

- [ ] Hard-refresh the page (Ctrl+Shift+R / Cmd+Shift+R)
- [ ] CompletedPromiseCard reappears with today's promise
- [ ] Garden scene still shows the same plant
- [ ] `tiny-promise.garden.v1` still contains the same entry
- [ ] Plant kind and position are identical to before refresh

## 6. Partly kept does not create plant

- [ ] Clear localStorage and refresh
- [ ] Create a new promise, click "Partly"
- [ ] Complete the check-in flow
- [ ] CompletedPromiseCard shows status "Partly kept"
- [ ] Garden still shows the empty state ("Your garden awaits.")
- [ ] `tiny-promise.garden.v1` does not exist or is an empty array

## 7. Broken does not create plant

- [ ] Clear localStorage and refresh
- [ ] Create a new promise, click "Not today"
- [ ] Complete the check-in flow
- [ ] CompletedPromiseCard shows status "Broken"
- [ ] Garden still shows the empty state
- [ ] `tiny-promise.garden.v1` does not exist or is an empty array

## 8. Duplicate plant prevention

- [ ] Complete a promise with "kept" so a plant appears
- [ ] In DevTools Console, run:
  ```js
  // Simulate re-adding the same plant
  const garden = JSON.parse(localStorage.getItem('tiny-promise.garden.v1'));
  console.log('Plant count before:', garden.length);
  ```
- [ ] Refresh the page
- [ ] Garden still shows exactly one plant
- [ ] `tiny-promise.garden.v1` still contains exactly one entry
- [ ] No duplicate `promiseId` values exist in the array

## 9. Reset garden does not delete promises

> Note: Garden reset is not yet implemented. This test validates the
> data isolation between the two localStorage keys.

- [ ] Complete a promise with "kept" so both keys have data
- [ ] In DevTools Console, run:
  ```js
  localStorage.removeItem('tiny-promise.garden.v1');
  ```
- [ ] Refresh the page
- [ ] Promise data is intact: CompletedPromiseCard shows today's promise
- [ ] Garden shows empty state (plant is gone)
- [ ] `tiny-promise.entries` is unchanged
- [ ] Confirm the reverse: removing `tiny-promise.entries` does not affect `tiny-promise.garden.v1`

## 10. Mobile layout

- [ ] Open DevTools and toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
- [ ] Test at 375px width (iPhone SE)
- [ ] Garden scene maintains 4:3 aspect ratio
- [ ] Plants are visible and not clipped
- [ ] Ground and sky gradients render without gaps
- [ ] Garden card does not overflow horizontally
- [ ] Bottom navigation does not overlap the garden
- [ ] Test at 390px width (iPhone 14)
- [ ] Test at 768px width (tablet) -- garden should not stretch unnaturally

---

## Multi-day scenario (optional, requires date manipulation)

- [ ] In DevTools Console, override the date utility to simulate a new day
- [ ] Create and keep a second promise
- [ ] Garden now shows two plants
- [ ] Each plant has a distinct `promiseId`
- [ ] Plants may share a grid position (visual overlap is acceptable for now)
- [ ] After 12 kept promises, garden displays the 12 most recent plants
