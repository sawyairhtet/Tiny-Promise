"use client";

import { PromiseEntry, PromiseStatus } from "@/types/promise";

interface CompletedStateProps {
  promise: PromiseEntry;
}

const statusLabels: Record<PromiseStatus, string> = {
  kept: "Kept",
  partly: "Partly kept",
  broke: "Not today",
  pending: "Pending",
};

const statusColors: Record<PromiseStatus, string> = {
  kept: "text-sage-600 bg-sage-50 border-sage-200",
  partly: "text-amber-500 bg-amber-50 border-amber-200",
  broke: "text-rose-400 bg-rose-50 border-rose-200",
  pending: "text-warm-400 bg-warm-50 border-warm-200",
};

export default function CompletedState({ promise }: CompletedStateProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <p className="text-warm-400 text-sm">Today&apos;s promise</p>
        <p className="text-warm-800 text-xl leading-relaxed">
          &quot;{promise.text}&quot;
        </p>
      </div>

      <div
        className={`inline-block rounded-full border px-4 py-1 text-sm font-medium ${statusColors[promise.status]}`}
      >
        {statusLabels[promise.status]}
      </div>

      {promise.reflection && (
        <div className="bg-white rounded-xl border border-warm-200 p-4 text-left">
          <p className="text-warm-400 text-xs mb-1">Reflection</p>
          <p className="text-warm-700 text-sm leading-relaxed">{promise.reflection}</p>
        </div>
      )}

      <p className="text-warm-400 text-sm italic">
        Self-trust is built gently.
      </p>
    </div>
  );
}
