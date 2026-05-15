"use client";

export default function GardenSky() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 400 300"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="garden-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-sage-50)" />
          <stop offset="70%" stopColor="var(--color-warm-50)" />
          <stop offset="100%" stopColor="var(--color-sage-100)" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#garden-sky)" />
    </svg>
  );
}
