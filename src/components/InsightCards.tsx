"use client";

import { PromiseEntry } from "@/types/promise";
import {
  getCompletedPromises,
  calculateSelfTrustScore,
  getLastCompletedPromises,
  getGentleInsight,
} from "@/lib/promiseStats";

type InsightCardsProps = {
  promises: PromiseEntry[];
};

export default function InsightCards({ promises }: InsightCardsProps) {
  const completed = getCompletedPromises(promises);
  const trustScore = calculateSelfTrustScore(promises);
  const last7 = getLastCompletedPromises(promises, 7);

  const keptCount = last7.filter((p) => p.status === "kept").length;
  const partlyCount = last7.filter((p) => p.status === "partly").length;
  const brokeCount = last7.filter((p) => p.status === "broke").length;

  const insight = getGentleInsight(promises);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-warm-200 bg-white p-4 shadow-soft text-center">
          <p className="text-3xl font-semibold text-sage-600">
            {trustScore !== null ? `${trustScore}%` : "No score yet"}
          </p>
          <p className="text-warm-500 text-sm mt-1">Self-trust</p>
        </div>

        <div className="rounded-2xl border border-warm-200 bg-white p-4 shadow-soft text-center">
          <p className="text-3xl font-semibold text-warm-800">
            {completed.length}
          </p>
          <p className="text-warm-400 text-sm mt-1">Completed</p>
        </div>
      </div>

      <div className="rounded-2xl border border-warm-200 bg-white p-4 shadow-soft">
        <p className="text-warm-500 text-sm font-medium mb-3">
          Recent promises
        </p>
        {last7.length === 0 ? (
          <p className="text-warm-400 text-sm">No completed promises yet.</p>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sage-400" />
              <span className="text-warm-700 text-sm">
                {keptCount} kept
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="text-warm-700 text-sm">
                {partlyCount} partly
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
              <span className="text-warm-700 text-sm">
                {brokeCount} broke
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-sage-200 bg-sage-50 p-4 shadow-soft text-center">
        <p className="text-sage-700 text-sm leading-relaxed italic">
          {insight}
        </p>
      </div>
    </div>
  );
}
