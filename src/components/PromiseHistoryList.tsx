"use client";

import { PromiseEntry, PromiseStatus } from "@/types/promise";
import { formatDate } from "@/lib/dateUtils";

interface PromiseHistoryListProps {
  promises: PromiseEntry[];
}

const statusLabels: Record<PromiseStatus, string> = {
  kept: "Kept",
  partly: "Partly kept",
  broke: "Not today",
  pending: "Pending",
};

const statusColors: Record<PromiseStatus, string> = {
  kept: "text-sage-600 bg-sage-50 border-sage-200",
  partly: "text-sky-500 bg-sky-50 border-sky-200",
  broke: "text-rose-400 bg-rose-50 border-rose-200",
  pending: "text-warm-400 bg-warm-100 border-warm-200",
};

export default function PromiseHistoryList({ promises }: PromiseHistoryListProps) {
  if (promises.length === 0) {
    return (
      <div className="text-center pt-12 space-y-2">
        <p className="text-warm-500">No promises yet.</p>
        <p className="text-warm-400 text-sm">Your journey starts whenever you&apos;re ready.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {promises.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-xl border border-warm-200 p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-warm-400 text-sm">{formatDate(p.date)}</span>
            <span
              className={`rounded-full border px-3 py-0.5 text-xs font-medium ${statusColors[p.status]}`}
            >
              {statusLabels[p.status]}
            </span>
          </div>
          <p className="text-warm-800 leading-relaxed">{p.text}</p>
          {p.reflection && (
            <p className="text-warm-500 text-sm italic">
              &quot;{p.reflection}&quot;
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
