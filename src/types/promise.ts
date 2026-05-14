export type PromiseStatus = "pending" | "kept" | "partly" | "broke";
export type TomorrowSize = "smaller" | "same" | "bigger";

export interface PromiseEntry {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  status: PromiseStatus;
  reflection?: string;
  tomorrowSize?: TomorrowSize;
  createdAt: string;
  completedAt?: string;
}
