"use client";

export default function GardenEmptyState() {
  return (
    <div className="rounded-2xl border border-warm-200 bg-white p-8 shadow-soft text-center space-y-4">
      <svg
        viewBox="0 0 48 48"
        className="w-12 h-12 mx-auto"
        aria-hidden="true"
      >
        <ellipse cx="24" cy="40" rx="16" ry="5" fill="var(--color-warm-200)" />
        <line x1="24" y1="40" x2="24" y2="22" stroke="var(--color-sage-300)" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="18" cy="22" rx="4" ry="7" fill="var(--color-sage-200)" transform="rotate(-20 18 22)" />
        <ellipse cx="30" cy="20" rx="4" ry="7" fill="var(--color-sage-200)" transform="rotate(20 30 20)" />
      </svg>
      <p className="text-warm-700 text-lg font-medium">Your garden awaits.</p>
      <p className="text-warm-400 text-sm">Complete a promise to plant your first seedling.</p>
    </div>
  );
}
