"use client";

import { useState, useEffect, useCallback } from "react";
import { PromiseEntry, PromiseStatus, TomorrowSize } from "@/types/promise";
import { getTodayPromise, createPromise, updatePromise } from "@/lib/promiseStorage";
import PromiseForm from "@/components/PromiseForm";
import TodayPromiseCard from "@/components/TodayPromiseCard";
import CheckInForm from "@/components/CheckInForm";
import CompletedState from "@/components/CompletedState";

type Phase = "loading" | "new" | "pending" | "checking-in" | "completed";

export default function HomePage() {
  const [promise, setPromise] = useState<PromiseEntry | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [checkInStatus, setCheckInStatus] = useState<PromiseStatus>("kept");

  const load = useCallback(() => {
    const today = getTodayPromise();
    setPromise(today);
    if (!today) {
      setPhase("new");
    } else if (today.status === "pending") {
      setPhase("pending");
    } else {
      setPhase("completed");
    }
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    load();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [load]);

  function handleCreate(text: string) {
    const entry = createPromise(text);
    setPromise(entry);
    setPhase("pending");
  }

  function handleCheckIn(status: PromiseStatus) {
    setCheckInStatus(status);
    setPhase("checking-in");
  }

  function handleComplete(reflection: string, tomorrowSize: TomorrowSize) {
    if (!promise) return;
    const updated = updatePromise(promise.id, {
      status: checkInStatus,
      reflection: reflection || undefined,
      tomorrowSize,
      completedAt: new Date().toISOString(),
    });
    if (updated) {
      setPromise(updated);
      setPhase("completed");
    }
  }

  if (phase === "loading") {
    return <div className="pt-12 text-center text-warm-400">...</div>;
  }

  return (
    <div className="pt-8">
      {phase === "new" && <PromiseForm onSubmit={handleCreate} />}
      {phase === "pending" && promise && (
        <TodayPromiseCard promise={promise} onCheckIn={handleCheckIn} />
      )}
      {phase === "checking-in" && promise && (
        <CheckInForm
          promise={promise}
          status={checkInStatus}
          onComplete={handleComplete}
        />
      )}
      {phase === "completed" && promise && <CompletedState promise={promise} />}
    </div>
  );
}
