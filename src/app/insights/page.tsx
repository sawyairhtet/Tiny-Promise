"use client";

import { useState, useEffect } from "react";
import { PromiseEntry } from "@/types/promise";
import { getPromises } from "@/lib/promiseStorage";
import InsightCards from "@/components/InsightCards";

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

  return (
    <div className="pt-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-warm-700">Gentle Insights</h2>
        <p className="text-warm-400 text-sm mt-1">Notice patterns without judging yourself.</p>
      </div>
      <InsightCards promises={promises} />
    </div>
  );
}
