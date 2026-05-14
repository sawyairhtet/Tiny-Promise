"use client";

import { PromiseEntry } from "@/types/promise";

type TodayPromiseCardProps = {
  promise: PromiseEntry;
  onSelectStatus: (status: "kept" | "partly" | "broke") => void;
};

const statusButtons = [
  {
    status: "kept" as const,
    label: "I kept it",
    style:
      "border-sage-200 bg-sage-50 text-sage-700 hover:border-sage-300 hover:bg-sage-100",
  },
  {
    status: "partly" as const,
    label: "Partly",
    style:
      "border-amber-200 bg-amber-50 text-amber-600 hover:border-amber-300 hover:bg-amber-100",
  },
  {
    status: "broke" as const,
    label: "I broke it",
    style:
      "border-rose-200 bg-rose-50 text-rose-400 hover:border-rose-300 hover:bg-rose-100",
  },
];

export default function TodayPromiseCard({
  promise,
  onSelectStatus,
}: TodayPromiseCardProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-warm-400 text-sm">Today&apos;s Promise</p>
        <p className="text-warm-800 text-xl leading-relaxed">
          &quot;{promise.text}&quot;
        </p>
      </div>

      <p className="text-center text-warm-400 text-sm">
        No shame. Just honesty.
      </p>

      <div className="space-y-3">
        {statusButtons.map((btn) => (
          <button
            key={btn.status}
            onClick={() => onSelectStatus(btn.status)}
            className={`w-full rounded-xl border px-4 py-3 font-medium transition-colors ${btn.style}`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
