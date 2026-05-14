import { PromiseEntry } from "@/types/promise";

export function getCompletedPromises(promises: PromiseEntry[]): PromiseEntry[] {
  return promises.filter((p) => p.status !== "pending");
}

export function calculateSelfTrustScore(
  promises: PromiseEntry[]
): number | null {
  const completed = getCompletedPromises(promises);
  if (completed.length === 0) return null;

  const points = completed.reduce((sum, p) => {
    if (p.status === "kept") return sum + 1;
    if (p.status === "partly") return sum + 0.5;
    return sum;
  }, 0);

  return Math.round((points / completed.length) * 100);
}

export function getLastCompletedPromises(
  promises: PromiseEntry[],
  count: number
): PromiseEntry[] {
  return getCompletedPromises(promises)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, count);
}

export function getGentleInsight(promises: PromiseEntry[]): string {
  const completed = getCompletedPromises(promises);
  if (completed.length === 0) {
    return "Start with one tiny promise. That is enough.";
  }

  const recent = getLastCompletedPromises(promises, 3);
  const brokeCount = recent.filter((p) => p.status === "broke").length;
  const keptCount = recent.filter((p) => p.status === "kept").length;
  const partlyCount = completed.filter((p) => p.status === "partly").length;

  if (brokeCount >= 2) {
    return "Your recent promises may be too heavy. Tomorrow can be smaller.";
  }
  if (keptCount >= 3) {
    return "You are building trust with yourself. Keep tomorrow realistic.";
  }
  if (partlyCount >= 3) {
    return "You are showing up. Try making the promise more specific.";
  }
  return "Keep it small. Keep it honest.";
}
