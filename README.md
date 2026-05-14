# Tiny Promise

A minimalist daily commitment app that helps you build self-trust — one small promise at a time.

---

## Philosophy

Most productivity tools ask you to do more. Tiny Promise asks you to do less — but mean it.

Make one small promise each day. Check in honestly. Reflect briefly. Over time, the habit of keeping your word to yourself becomes something quietly powerful.

No streaks. No guilt. Just honesty.

## Features

- **One promise per day** — focused, intentional, achievable
- **Honest check-ins** — mark your promise as kept, partly kept, or broken
- **Brief reflections** — capture what happened in a sentence or two
- **Tomorrow sizing** — decide if your next promise should be smaller, the same, or bigger
- **Self-trust score** — a gentle metric based on your follow-through patterns
- **Adaptive insights** — the app notices trends and offers kind, practical nudges
- **Promise history** — scroll through your journey, one day at a time

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org) (App Router) |
| Language | [TypeScript](https://typescriptlang.org) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Storage | Browser `localStorage` |
| Backend | None (MVP is fully client-side) |

All data stays in your browser. Nothing is sent to a server.

## Getting Started

```bash
# Clone the repository
git clone <your-repo-url>
cd tiny-promise

# Install dependencies
npm install

# Start the dev server
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

Tiny Promise is designed to deploy on [Vercel](https://vercel.com) with zero configuration.

1. Push your code to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Next.js — accept the default settings and click **Deploy**.
4. Your app will be live at a `.vercel.app` URL within minutes.

Every push to `main` triggers a new production deployment automatically.

> **Note:** Tiny Promise stores all data in your browser's `localStorage`. There is no backend, no database, and no environment variables to configure. Your promises never leave your device.

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

## Future Ideas

- Cloud sync so promises travel across devices
- Notification reminders for evening check-ins
- Weekly and monthly reflection summaries
- Theming options (dark mode, seasonal palettes)
- Export promise history as a journal
- PWA support for a native-app feel

## Screenshots

> _Screenshots coming soon._

---

Built with care by [Saw Ye Htet](mailto:minwn2244@gmail.com).
