# Tiny Promise AI Context

Tiny Promise is a Next.js App Router, TypeScript, Tailwind CSS app. It is fully client-side and stores data in localStorage.

## Product philosophy

Tiny Promise is not a productivity-maxxing app. It is a gentle self-trust app.

The app should avoid:
- streak anxiety
- guilt language
- aggressive gamification
- complex dashboards
- productivity bro tone

The app should prefer:
- one small daily promise
- honest reflection
- calm visuals
- poetic but clear language
- local-first privacy
- soft progress

## Current core model

A PromiseEntry is the source of truth for the user’s daily promise.

Do not delete or rewrite the existing promise system unless explicitly asked.

## New garden concept

The Butterfly Garden is a visual layer on top of kept promises.

When a user keeps a promise, the app creates one GardenPlant linked to that PromiseEntry.

Garden plants are stored separately from promises.

Store plant recipes, not SVG strings.

## Code rules

- Keep page.tsx thin.
- Put pure generation logic in lib/gardenGenerator.ts.
- Put localStorage logic in lib/gardenStorage.ts.
- Put visual rendering in components/garden/.
- Keep TypeScript types explicit.
- Do not add a backend.
- Do not add external libraries unless requested.
- Do not rewrite the entire app.
- Make one small change at a time.