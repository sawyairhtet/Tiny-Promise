# Tiny Promise

A minimalist daily commitment app that helps you build self-trust — one small promise at a time.

Most productivity tools ask you to do more. Tiny Promise asks you to do **less** — but mean it. Make one small promise each day, check in honestly, reflect briefly, and over time build the quiet habit of keeping your word to yourself.

No streaks. No guilt. Just honesty.

---

## Screenshots

| Today | Check-in | History | Insights |
|:-----:|:--------:|:-------:|:--------:|
| ![Today view](screenshots/today.png) | ![Check-in view](screenshots/checkin.png) | ![History view](screenshots/history.png) | ![Insights view](screenshots/insights.png) |

> Screenshots will be added once the app is deployed.

---

## Features

- **One promise per day** — focused, intentional, achievable
- **Honest check-ins** — mark your promise as kept, partly kept, or broken
- **Brief reflections** — capture what happened in a sentence or two
- **Tomorrow sizing** — decide if your next promise should be smaller, the same, or bigger
- **Self-trust score** — a gentle metric based on your follow-through patterns
- **Adaptive insights** — the app notices trends and offers kind, practical nudges
- **Promise history** — scroll through your journey, one day at a time

## Why I Built This

I wanted a personal project that solves a real problem I care about — not a to-do app clone, but something with a point of view.

Most habit trackers punish you for breaking a streak. That never worked for me. I wanted something that treats "I broke my promise" as honest data, not failure. The core idea is simple: if you can keep small promises to yourself consistently, bigger ones become possible.

This project also gave me a chance to build a complete, shippable product from scratch — from design decisions down to deployment — rather than just following a tutorial.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org) (App Router) |
| Language | [TypeScript](https://typescriptlang.org) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Storage | Browser `localStorage` |
| Backend | None (fully client-side) |

All data stays in your browser. Nothing is sent to a server.

## Technical Decisions

**Why localStorage instead of a database?**
The MVP is deliberately offline-first. Promises are personal — keeping them on-device means zero signup friction and complete privacy. A backend can be added later without changing the UI layer.

**Why Next.js for a client-side app?**
Even though the app is fully client-side today, Next.js gives me static prerendering out of the box (faster initial load), file-based routing, and a clear upgrade path to server features if the project grows.

**Why one promise per day?**
The constraint is the feature. Limiting to a single daily promise forces the user to choose carefully and builds the habit of intentional commitment rather than aspirational list-making.

**Why no streak counter?**
Streaks create anxiety around breaking them and shift focus from honest self-reflection to gamified consistency. The self-trust score rewards honesty — marking a promise as "broken" still contributes to your data and insights.

## Getting Started

```bash
git clone https://github.com/sawyairhtet/Tiny-Promise.git
cd Tiny-Promise
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

## Deployment

Tiny Promise deploys on [Vercel](https://vercel.com) with zero configuration.

1. Push your code to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Next.js — accept the default settings and click **Deploy**.
4. Your app will be live at a `.vercel.app` URL within minutes.

Every push to `main` triggers a new production deployment automatically.

> **Note:** There is no backend, no database, and no environment variables to configure.

## Folder Structure

```
src/
├── app/
│   ├── page.tsx              # Today — the main promise flow
│   ├── history/page.tsx      # Promise history list
│   ├── insights/page.tsx     # Self-trust score and insights
│   ├── layout.tsx            # Root layout with navigation
│   └── globals.css           # Tailwind theme and custom styles
├── components/
│   ├── PromiseForm.tsx       # Create a new promise
│   ├── TodayPromiseCard.tsx  # Active promise with check-in
│   ├── CheckInForm.tsx       # Reflection and tomorrow sizing
│   ├── CompletedPromiseCard.tsx
│   ├── PromiseHistoryList.tsx
│   ├── InsightCards.tsx      # Stats and adaptive messages
│   ├── Navigation.tsx        # Bottom tab bar
│   └── AppShell.tsx          # Layout wrapper
├── lib/
│   ├── promiseStorage.ts     # localStorage read/write
│   ├── promiseStats.ts       # Score and insight calculations
│   └── dateUtils.ts          # Date formatting helpers
└── types/
    └── promise.ts            # TypeScript type definitions
```

## Known Limitations

- **Data lives in one browser** — clearing browser data or switching devices loses your promises. There is no sync or export yet.
- **No notifications** — the app relies on you remembering to check in. There is no reminder system.
- **Mobile-first layout** — the design is optimized for phone-width screens. It works on desktop but doesn't take advantage of the extra space.
- **No offline support** — although data is local, the app itself requires a network connection to load (no service worker / PWA yet).

## Roadmap

- [ ] Cloud sync for cross-device access
- [ ] Export promise history as JSON or markdown journal
- [ ] PWA support (offline access, home screen install)
- [ ] Evening check-in reminders via notifications
- [ ] Weekly and monthly reflection summaries
- [ ] Theming options (dark mode, seasonal palettes)

---

Built with care by [Saw Ye Htet](mailto:minwn2244@gmail.com).
