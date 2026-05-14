export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function daysAgo(dateStr: string): number {
  const today = new Date(getToday() + "T00:00:00");
  const date = new Date(dateStr + "T00:00:00");
  return Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}
