"use client";

import { PromiseEntry } from "@/types/promise";
import { formatDisplayDate } from "@/lib/dateUtils";
import { statusLabels, statusColors } from "@/lib/statusDisplay";

type PromiseHistoryListProps = {
  promises: PromiseEntry[];
};

export default function PromiseHistoryList({ promises }: PromiseHistoryListProps) {
  if (promises.length === 0) {
    return (
      <div className="text-center pt-12 space-y-2">
        <p className="text-warm-500">Your promise history will appear here.</p>
        <p className="text-warm-400 text-sm">Start with one tiny promise today.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {[...promises].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)).map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-2xl border border-warm-200 p-4 shadow-soft space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-warm-400 text-sm">{formatDisplayDate(p.date)}</span>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[p.status]}`}
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
