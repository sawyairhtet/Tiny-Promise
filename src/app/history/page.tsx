"use client";

import { useState, useEffect } from "react";
import { PromiseEntry } from "@/types/promise";
import { getPromises } from "@/lib/promiseStorage";
import { formatDisplayDate } from "@/lib/dateUtils";
import { statusLabels, statusColors } from "@/lib/statusDisplay";

function categoryOrder(p: PromiseEntry): number {
  return p.category === "self" ? 0 : 1;
}

function groupByDate(promises: PromiseEntry[]): { date: string; entries: PromiseEntry[] }[] {
  const sorted = [...promises].sort(
    (a, b) => b.date.localeCompare(a.date) || categoryOrder(a) - categoryOrder(b) || b.createdAt.localeCompare(a.createdAt)
  );
  const groups: { date: string; entries: PromiseEntry[] }[] = [];
  for (const p of sorted) {
    const last = groups[groups.length - 1];
    if (last && last.date === p.date) {
      last.entries.push(p);
    } else {
      groups.push({ date: p.date, entries: [p] });
    }
  }
  return groups;
}

const PILL_STYLES = {
  self: { background: "#EEEDFE", color: "#534AB7" },
  others: { background: "#E1F5EE", color: "#0F6E56" },
} as const;

export default function HistoryPage() {
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

  const groups = groupByDate(promises);

  return (
    <div className="pt-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-warm-700">Promise History</h2>
        <p className="text-warm-400 text-sm mt-1">A gentle record of showing up.</p>
      </div>
      {groups.length === 0 ? (
        <div className="text-center pt-12 space-y-2">
          <p className="text-warm-500">Your promise history will appear here.</p>
          <p className="text-warm-400 text-sm">Start with one tiny promise today.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.date} className="space-y-3">
              <h3 className="text-warm-400 text-sm font-medium">
                {formatDisplayDate(group.date)}
              </h3>
              {group.entries.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-warm-200 p-4 shadow-soft space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[p.status]}`}
                    >
                      {statusLabels[p.status]}
                    </span>
                    <span
                      style={{
                        background: PILL_STYLES[p.category ?? "self"].background,
                        color: PILL_STYLES[p.category ?? "self"].color,
                        fontSize: "10px",
                        padding: "2px 7px",
                        borderRadius: "20px",
                      }}
                    >
                      {p.category === "others" ? "others" : "me"}
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
          ))}
        </div>
      )}
    </div>
  );
}
