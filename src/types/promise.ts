export type PromiseStatus = "pending" | "kept" | "partly" | "broke";
export type TomorrowSize = "smaller" | "same" | "bigger";
export type PromiseCategory = "self" | "others";

export interface PromiseEntry {
  id: string;
  date: string;
  text: string;
  status: PromiseStatus;
  reflection?: string;
  tomorrowSize?: TomorrowSize;
  createdAt: string;
  completedAt?: string;
  category: PromiseCategory;
}
