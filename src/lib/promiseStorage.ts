import { PromiseEntry } from "@/types/promise";
import { getTodayDate } from "./dateUtils";

const STORAGE_KEY = "tiny-promise.entries";

export function getPromises(): PromiseEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as PromiseEntry[];
  } catch {
    return [];
  }
}

export function savePromises(promises: PromiseEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(promises));
}

export function getTodayPromise(
  promises: PromiseEntry[]
): PromiseEntry | undefined {
  const today = getTodayDate();
  return promises.find((p) => p.date === today);
}

export function createTodayPromise(text: string): PromiseEntry[] {
  const promises = getPromises();
  const entry: PromiseEntry = {
    id: crypto.randomUUID(),
    date: getTodayDate(),
    text: text.trim(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  promises.push(entry);
  savePromises(promises);
  return promises;
}

export function updatePromise(updatedPromise: PromiseEntry): PromiseEntry[] {
  const promises = getPromises();
  const index = promises.findIndex((p) => p.id === updatedPromise.id);
  if (index !== -1) {
    promises[index] = updatedPromise;
  }
  savePromises(promises);
  return promises;
}
