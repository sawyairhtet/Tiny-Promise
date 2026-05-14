"use client";

import { PromiseEntry } from "@/types/promise";
import { getCompletedCount, getSelfTrustScore, getLast7Completed, getGentleInsight } from "@/lib/promiseStats";
import { formatDate } from "@/lib/dateUtils";

interface InsightCardsProps {
  promises: PromiseEntry[];
}

const statusDots: Record<string, string> = {
  kept: "bg-sage-400",
  partly: "bg-sky-400",
  broke: "bg-rose-300",
};

export default function InsightCards({ promises }: InsightCardsProps) {
  const completedCount = getCompletedCount(promises);
  const trustScore = getSelfTrustScore(promises);
  const last7 = getLast7Completed(promises);
  const insight = getGentleInsight(promises);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-warm-200 p-4 text-center">
          <p className="text-3xl font-semibold text-warm-800">{completedCount}</p>
          <p className="text-warm-400 text-sm mt-1">Promises reflected on</p>
        </div>
        <div className="bg-white rounded-xl border border-warm-200 p-4 text-center">
          <p className="text-3xl font-semibold text-sage-600">{trustScore}%</p>
          <p className="text-warm-400 text-sm mt-1">Self-trust score</p>
        </div>
      </div>

      {last7.length > 0 && (
        <div className="bg-white rounded-xl border border-warm-200 p-4 space-y-3">
          <p className="text-warm-500 text-sm font-medium">Last 7 check-ins</p>
          <div className="space-y-2">
            {last7.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDots[p.status] ?? "bg-warm-300"}`} />
                <span className="text-warm-400 text-xs w-20 shrink-0">{formatDate(p.date)}</span>
                <span className="text-warm-700 text-sm truncate">{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-sage-50 rounded-xl border border-sage-200 p-4 text-center">
        <p className="text-sage-700 text-sm leading-relaxed italic">
          {insight}
        </p>
      </div>
    </div>
  );
}
