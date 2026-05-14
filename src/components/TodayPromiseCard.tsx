"use client";

import { PromiseEntry, PromiseStatus } from "@/types/promise";

interface TodayPromiseCardProps {
  promise: PromiseEntry;
  onCheckIn: (status: PromiseStatus) => void;
}

const statusButtons: { status: PromiseStatus; label: string; description: string }[] = [
  { status: "kept", label: "I kept it", description: "You showed up for yourself." },
  { status: "partly", label: "Partly", description: "That still counts." },
  { status: "broke", label: "Not today", description: "No shame. Just notice." },
];

export default function TodayPromiseCard({ promise, onCheckIn }: TodayPromiseCardProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-warm-400 text-sm">Today&apos;s promise</p>
        <p className="text-warm-800 text-xl leading-relaxed">
          &quot;{promise.text}&quot;
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-center text-warm-500 text-sm">
          How did it go?
        </p>
        {statusButtons.map((btn) => (
          <button
            key={btn.status}
            onClick={() => onCheckIn(btn.status)}
            className="w-full rounded-xl border border-warm-200 bg-white px-4 py-3 text-left transition-colors hover:border-sage-300 hover:bg-sage-50"
          >
            <span className="text-warm-800 font-medium">{btn.label}</span>
            <span className="block text-warm-400 text-sm mt-0.5">
              {btn.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
