"use client";

import { PromiseEntry, TomorrowSize } from "@/types/promise";
import { statusLabels, statusColors } from "@/lib/statusDisplay";

type CompletedPromiseCardProps = {
  promise: PromiseEntry;
};

const tomorrowMessages: Record<TomorrowSize, string> = {
  smaller: "Tomorrow can be smaller.",
  same: "Same size tomorrow feels okay.",
  bigger: "You may be ready for a little more.",
};

export default function CompletedPromiseCard({
  promise,
}: CompletedPromiseCardProps) {
  return (
    <div className="rounded-2xl border border-warm-200 bg-white p-6 shadow-soft space-y-6 text-center">
      <div className="space-y-2">
        <p className="text-warm-400 text-sm">Today&apos;s Promise</p>
        <p className="text-warm-800 text-xl leading-relaxed">
          &quot;{promise.text}&quot;
        </p>
      </div>

      <div
        className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${statusColors[promise.status]}`}
      >
        {statusLabels[promise.status]}
      </div>

      {promise.reflection && (
        <div className="rounded-xl border border-warm-200 bg-warm-50 p-4 text-left">
          <p className="text-warm-400 text-xs mb-1">Reflection</p>
          <p className="text-warm-700 text-sm leading-relaxed">
            {promise.reflection}
          </p>
        </div>
      )}

      {promise.tomorrowSize && (
        <p className="text-warm-500 text-sm">
          {tomorrowMessages[promise.tomorrowSize]}
        </p>
      )}

      <p className="text-warm-400 text-sm italic">
        Self-trust is built gently.
      </p>
    </div>
  );
}
