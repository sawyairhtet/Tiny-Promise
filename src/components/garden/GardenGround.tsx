"use client";

export default function GardenGround() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-full h-[38%]"
      viewBox="0 0 400 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="garden-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-sage-200)" />
          <stop offset="60%" stopColor="var(--color-warm-200)" />
          <stop offset="100%" stopColor="var(--color-warm-300)" />
        </linearGradient>
      </defs>
      <path
        d="M0,24 Q80,4 200,14 Q320,4 400,24 L400,120 L0,120 Z"
        fill="url(#garden-ground)"
      />
    </svg>
  );
}
