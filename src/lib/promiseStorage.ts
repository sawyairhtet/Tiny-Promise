import { PromiseEntry } from "@/types/promise";
import { getToday } from "./dateUtils";

const STORAGE_KEY = "tiny-promise-entries";

function readAll(): PromiseEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as PromiseEntry[];
  } catch {
    return [];
  }
}

function writeAll(entries: PromiseEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getAllPromises(): PromiseEntry[] {
  return readAll().sort((a, b) => b.date.localeCompare(a.date));
}

export function getTodayPromise(): PromiseEntry | null {
  const today = getToday();
  return readAll().find((e) => e.date === today) ?? null;
}

export function createPromise(text: string): PromiseEntry {
  const entry: PromiseEntry = {
    id: crypto.randomUUID(),
    date: getToday(),
    text: text.trim(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const entries = readAll();
  entries.push(entry);
  writeAll(entries);
  return entry;
}

export function updatePromise(
  id: string,
  updates: Partial<Pick<PromiseEntry, "status" | "reflection" | "tomorrowSize" | "completedAt">>
): PromiseEntry | null {
  const entries = readAll();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return null;
  entries[index] = { ...entries[index], ...updates };
  writeAll(entries);
  return entries[index];
}
