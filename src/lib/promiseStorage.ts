import { PromiseEntry, PromiseCategory } from "@/types/promise";
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
  const trimmed = text.trim();
  if (!trimmed) return getPromises();

  const promises = getPromises();
  if (getTodayPromise(promises)) return promises;

  const entry: PromiseEntry = {
    id: crypto.randomUUID(),
    date: getTodayDate(),
    text: trimmed,
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
  if (index !== -1 && !promises[index].completedAt) {
    promises[index] = updatedPromise;
    savePromises(promises);
  }
  return promises;
}

export const MAX_PROMISES_PER_CATEGORY = 5;

export function getPromisesByDate(date: string): {
  self: PromiseEntry[];
  others: PromiseEntry[];
} {
  const all = getPromises();
  const forDate = all.filter((p) => p.date === date);
  return {
    self: forDate.filter((p) => p.category === "self"),
    others: forDate.filter((p) => p.category === "others"),
  };
}

export function migratePromises(): void {
  if (typeof window === "undefined") return;
  const all = getPromises();
  const needsMigration = all.some((p) => !p.category);
  if (!needsMigration) return;
  const migrated = all.map((p) =>
    p.category ? p : { ...p, category: "self" as PromiseCategory }
  );
  savePromises(migrated);
}
