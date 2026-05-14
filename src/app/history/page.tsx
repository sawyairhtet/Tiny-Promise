"use client";

import { useState, useEffect } from "react";
import { PromiseEntry } from "@/types/promise";
import { getAllPromises } from "@/lib/promiseStorage";
import PromiseHistoryList from "@/components/PromiseHistoryList";

export default function HistoryPage() {
  const [promises, setPromises] = useState<PromiseEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setPromises(getAllPromises());
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!loaded) {
    return <div className="pt-12 text-center text-warm-400">...</div>;
  }

  return (
    <div className="pt-4">
      <h2 className="text-lg font-semibold text-warm-700 mb-4">Your promises</h2>
      <PromiseHistoryList promises={promises} />
    </div>
  );
}
