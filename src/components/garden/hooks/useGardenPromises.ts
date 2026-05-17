"use client";

import { useSyncExternalStore } from "react";
import { getPromises } from "@/lib/promiseStorage";
import type { PromiseEntry } from "@/types/promise";

const STORAGE_KEY = "tiny-promise.entries";
const EMPTY: PromiseEntry[] = [];

let cachedRaw: string | null = null;
let cachedGardenPromises: PromiseEntry[] = EMPTY;

function readGardenPromises(): PromiseEntry[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedGardenPromises;
  cachedRaw = raw;
  cachedGardenPromises = getPromises().filter((p) => p.status !== "pending");
  return cachedGardenPromises;
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
  return useSyncExternalStore(subscribe, readGardenPromises, () => EMPTY);
}
