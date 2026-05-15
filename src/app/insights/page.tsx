"use client";

import { useState, useEffect } from "react";
import { PromiseEntry } from "@/types/promise";
import { getPromises } from "@/lib/promiseStorage";
import { calculateSelfTrustScore, getCompletedPromises } from "@/lib/promiseStats";
import InsightCards from "@/components/InsightCards";

function scoreLabel(score: number | null): string {
  if (score === null) return "";
  if (score >= 80) return "Reliable";
  if (score >= 50) return "Growing";
  return "Be gentle with yourself";
}

export default function InsightsPage() {
  const [promises, setPromises] = useState<PromiseEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setPromises(getPromises());
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!loaded) {
    return <div className="pt-12 text-center text-warm-400 text-sm">Loading your promises...</div>;
  }

  const selfPromises = promises.filter((p) => p.category === "self");
  const othersPromises = promises.filter((p) => p.category === "others");

  const selfScore = calculateSelfTrustScore(selfPromises);
  const othersScore = calculateSelfTrustScore(othersPromises);

  const selfCompleted = getCompletedPromises(selfPromises);
  const othersCompleted = getCompletedPromises(othersPromises);

  const selfKept = selfCompleted.filter((p) => p.status === "kept").length;
  const othersKept = othersCompleted.filter((p) => p.status === "kept").length;

  return (
    <div className="pt-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-warm-700">Gentle Insights</h2>
        <p className="text-warm-400 text-sm mt-1">Notice patterns without judging yourself.</p>
      </div>
      <InsightCards promises={promises} />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-2xl border border-warm-200 bg-white p-4 shadow-soft text-center space-y-1">
          <span
            className="inline-block w-2 h-2 rounded-full mb-1"
            style={{ backgroundColor: "#7F77DD" }}
          />
          <p className="text-warm-500 text-xs">For me</p>
          <p className="text-2xl font-semibold" style={{ color: "#7F77DD" }}>
            {selfScore !== null ? `${selfScore}%` : "—"}
          </p>
          <p className="text-warm-400 text-xs">
            {selfKept} / {selfCompleted.length} kept
          </p>
          {selfScore !== null && (
            <p className="text-warm-500 text-xs italic">{scoreLabel(selfScore)}</p>
          )}
        </div>

        <div className="rounded-2xl border border-warm-200 bg-white p-4 shadow-soft text-center space-y-1">
          <span
            className="inline-block w-2 h-2 rounded-full mb-1"
            style={{ backgroundColor: "#1D9E75" }}
          />
          <p className="text-warm-500 text-xs">For others</p>
          <p className="text-2xl font-semibold" style={{ color: "#1D9E75" }}>
            {othersScore !== null ? `${othersScore}%` : "—"}
          </p>
          <p className="text-warm-400 text-xs">
            {othersKept} / {othersCompleted.length} kept
          </p>
          {othersScore !== null && (
            <p className="text-warm-500 text-xs italic">{scoreLabel(othersScore)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
