"use client";

import { useSyncExternalStore } from "react";
import { getPromises } from "@/lib/promiseStorage";
import type { PromiseEntry } from "@/types/promise";

const STORAGE_KEY = "tiny-promise.entries";
const EMPTY: PromiseEntry[] = [];

let cachedRaw: string | null = null;
let cachedKept: PromiseEntry[] = EMPTY;

function readKept(): PromiseEntry[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedKept;
  cachedRaw = raw;
  cachedKept = getPromises().filter((p) => p.status === "kept");
  return cachedKept;
}

function subscribe(notify: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) notify();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

export function useGardenPromises(): PromiseEntry[] {
  return useSyncExternalStore(subscribe, readKept, () => EMPTY);
}
