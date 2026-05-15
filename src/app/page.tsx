"use client";

import { useState, useEffect, useCallback } from "react";
import { PromiseEntry, PromiseStatus, PromiseCategory, TomorrowSize } from "@/types/promise";
import {
  getPromises,
  savePromises,
  updatePromise,
  getPromisesByDate,
  migratePromises,
  MAX_PROMISES_PER_CATEGORY,
} from "@/lib/promiseStorage";
import { getTodayDate } from "@/lib/dateUtils";
import CheckInForm from "@/components/CheckInForm";
import { addPlant } from "@/lib/gardenStorage";
import { generatePlantRecipe } from "@/lib/gardenGenerator";
import Link from "next/link";

const CATEGORIES: { key: PromiseCategory; label: string; addLabel: string; color: string }[] = [
  { key: "self", label: "For me", addLabel: "for me", color: "#7F77DD" },
  { key: "others", label: "For others", addLabel: "for others", color: "#1D9E75" },
];

export default function HomePage() {
  const [selfPromises, setSelfPromises] = useState<PromiseEntry[]>([]);
  const [othersPromises, setOthersPromises] = useState<PromiseEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [addingCategory, setAddingCategory] = useState<PromiseCategory | null>(null);
  const [addText, setAddText] = useState("");

  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [checkInPhase, setCheckInPhase] = useState<"status" | "reflection">("status");
  const [checkInStatus, setCheckInStatus] = useState<PromiseStatus>("kept");

  const [gardenGrew, setGardenGrew] = useState(false);

  const load = useCallback(() => {
    migratePromises();
    const today = getTodayDate();
    const grouped = getPromisesByDate(today);
    setSelfPromises(grouped.self);
    setOthersPromises(grouped.others);
    setLoading(false);
    setGardenGrew(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleAddPromise(category: PromiseCategory) {
    const trimmed = addText.trim();
    if (!trimmed) return;

    const entry: PromiseEntry = {
      id: crypto.randomUUID(),
      date: getTodayDate(),
      text: trimmed,
      status: "pending",
      createdAt: new Date().toISOString(),
      category,
    };

    const all = getPromises();
    all.push(entry);
    savePromises(all);

    setAddText("");
    setAddingCategory(null);
    load();
  }

  function handleCheckIn(id: string, status: PromiseStatus) {
    setCheckingInId(id);
    setCheckInStatus(status);
    setCheckInPhase("reflection");
  }

  function handleComplete(reflection: string, tomorrowSize: TomorrowSize) {
    if (!checkingInId) return;

    const allPromises = [...selfPromises, ...othersPromises];
    const promise = allPromises.find((p) => p.id === checkingInId);
    if (!promise) return;

    const updatedEntry: PromiseEntry = {
      ...promise,
      status: checkInStatus,
      reflection: reflection || undefined,
      tomorrowSize,
      completedAt: new Date().toISOString(),
    };

    updatePromise(updatedEntry);

    if (checkInStatus === "kept") {
      const recipe = generatePlantRecipe(updatedEntry.id);
      addPlant(recipe);
      setGardenGrew(true);
    }

    setCheckingInId(null);
    setCheckInPhase("status");
    load();
  }

  function cancelCheckIn() {
    setCheckingInId(null);
    setCheckInPhase("status");
  }

  function promisesFor(category: PromiseCategory): PromiseEntry[] {
    return category === "self" ? selfPromises : othersPromises;
  }

  if (loading) {
    return (
      <div className="pt-12 text-center text-warm-400 text-sm">
        Loading your promises...
      </div>
    );
  }

  return (
    <div className="pt-6 space-y-8">
      {CATEGORIES.map((cat) => {
        const promises = promisesFor(cat.key);
        const count = promises.length;
        const full = count >= MAX_PROMISES_PER_CATEGORY;

        return (
          <section key={cat.key} className="space-y-3">
            {/* Label row */}
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-warm-700 text-sm font-medium">
                {cat.label}
              </span>
              <span className="ml-auto text-xs text-warm-400 bg-warm-100 px-2 py-0.5 rounded-full">
                {count} / {MAX_PROMISES_PER_CATEGORY}
              </span>
            </div>

            {/* Promise cards */}
            {promises.map((p) => (
              <div key={p.id}>
                <div className="flex items-center gap-3 rounded-xl border border-warm-200 bg-white px-4 py-3 shadow-soft">
                  {/* Circular checkbox / status indicator */}
                  {p.status === "pending" ? (
                    <button
                      onClick={() => {
                        setCheckingInId(p.id);
                        setCheckInPhase("status");
                      }}
                      className="w-5 h-5 rounded-full border-2 border-warm-300 hover:border-warm-400 transition-colors flex-shrink-0"
                      aria-label={`Check in on: ${p.text}`}
                    />
                  ) : p.status === "kept" ? (
                    <span
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: cat.color }}
                    >
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  ) : p.status === "broke" ? (
                    <span className="w-5 h-5 rounded-full bg-rose-100 border-2 border-rose-300 flex-shrink-0" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-amber-100 border-2 border-amber-300 flex-shrink-0" />
                  )}

                  {/* Promise text */}
                  <span
                    className={`text-sm ${
                      p.status === "kept"
                        ? "line-through text-warm-400"
                        : p.status === "broke"
                          ? "text-warm-500"
                          : "text-warm-800"
                    }`}
                  >
                    {p.text}
                  </span>
                </div>

                {/* Inline check-in: status selection */}
                {checkingInId === p.id && checkInPhase === "status" && (
                  <div className="mt-2 ml-8 space-y-2">
                    <p className="text-warm-400 text-xs">
                      Be honest with yourself.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCheckIn(p.id, "kept")}
                        className="rounded-lg border border-sage-200 bg-sage-50 px-3 py-1.5 text-xs text-sage-700 font-medium hover:bg-sage-100 transition-colors"
                      >
                        I kept it
                      </button>
                      <button
                        onClick={() => handleCheckIn(p.id, "partly")}
                        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-600 font-medium hover:bg-amber-100 transition-colors"
                      >
                        Partly
                      </button>
                      <button
                        onClick={() => handleCheckIn(p.id, "broke")}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-400 font-medium hover:bg-rose-100 transition-colors"
                      >
                        Not today
                      </button>
                    </div>
                    <button
                      onClick={cancelCheckIn}
                      className="text-xs text-warm-400 hover:text-warm-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Inline check-in: reflection form (existing CheckInForm) */}
                {checkingInId === p.id && checkInPhase === "reflection" && (
                  <div className="mt-2 ml-8">
                    <CheckInForm
                      selectedStatus={
                        checkInStatus as "kept" | "partly" | "broke"
                      }
                      onSave={handleComplete}
                      onCancel={cancelCheckIn}
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Empty state */}
            {count === 0 && !addingCategory && (
              <p className="text-warm-400 text-sm pl-5">
                {cat.key === "self"
                  ? "No promises for yourself yet today."
                  : "No promises for others yet today."}
              </p>
            )}

            {/* Add promise: inline form or button */}
            {addingCategory === cat.key ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddPromise(cat.key);
                }}
                className="space-y-2"
              >
                <input
                  type="text"
                  value={addText}
                  onChange={(e) => setAddText(e.target.value)}
                  placeholder={
                    cat.key === "self"
                      ? "I promise myself to..."
                      : "I promise to..."
                  }
                  maxLength={200}
                  autoFocus
                  className="w-full rounded-xl border border-warm-200 bg-white px-4 py-2.5 text-sm text-warm-800 shadow-soft placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!addText.trim()}
                    className="rounded-lg px-4 py-1.5 text-xs text-white font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: cat.color }}
                  >
                    I promise
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddingCategory(null);
                      setAddText("");
                    }}
                    className="rounded-lg px-4 py-1.5 text-xs text-warm-400 border border-warm-200 hover:text-warm-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                disabled={full}
                onClick={() => {
                  setAddingCategory(cat.key);
                  setAddText("");
                }}
                className="w-full rounded-xl border border-dashed border-warm-200 py-2.5 text-sm text-warm-400 transition-colors hover:border-warm-300 hover:text-warm-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {full
                  ? `${cat.label} is full for today`
                  : `Add a promise ${cat.addLabel}`}
              </button>
            )}
          </section>
        );
      })}

      {gardenGrew && (
        <p className="text-center text-sm text-sage-500">
          <Link
            href="/garden"
            className="underline hover:text-sage-700 transition-colors"
          >
            Your garden grew
          </Link>
        </p>
      )}
    </div>
  );
}
