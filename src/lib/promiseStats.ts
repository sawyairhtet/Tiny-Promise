import { PromiseEntry } from "@/types/promise";

export function getCompletedCount(entries: PromiseEntry[]): number {
  return entries.filter((e) => e.status !== "pending").length;
}

export function getSelfTrustScore(entries: PromiseEntry[]): number {
  const completed = entries.filter((e) => e.status !== "pending");
  if (completed.length === 0) return 0;

  const weights: Record<string, number> = { kept: 1, partly: 0.5, broke: 0 };
  const total = completed.reduce((sum, e) => sum + (weights[e.status] ?? 0), 0);
  return Math.round((total / completed.length) * 100);
}

export function getLast7Completed(entries: PromiseEntry[]): PromiseEntry[] {
  return entries
    .filter((e) => e.status !== "pending")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);
}

export function getGentleInsight(entries: PromiseEntry[]): string {
  const completed = entries.filter((e) => e.status !== "pending");
  if (completed.length === 0) {
    return "Your journey starts with one small promise. No rush.";
  }

  const recent = completed
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  const keptCount = recent.filter((e) => e.status === "kept").length;
  const partlyCount = recent.filter((e) => e.status === "partly").length;
  const brokeCount = recent.filter((e) => e.status === "broke").length;

  if (keptCount >= 5) {
    return "You’ve been keeping your promises gently and consistently. That’s self-trust growing.";
  }
  if (partlyCount >= 3) {
    return "Partly kept is still showing up. That matters more than perfection.";
  }
  if (brokeCount >= 3) {
    return "Some promises didn’t land lately. Tomorrow can be smaller. No shame — just notice.";
  }
  if (completed.length <= 3) {
    return "You’re just getting started. Keep it small. Keep it honest.";
  }
  return "Self-trust is built gently, one promise at a time.";
}
