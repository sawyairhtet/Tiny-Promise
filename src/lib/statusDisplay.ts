import { PromiseStatus } from "@/types/promise";

export const statusLabels: Record<PromiseStatus, string> = {
  kept: "Kept",
  partly: "Partly kept",
  broke: "Not today",
  pending: "Pending",
};

export const statusColors: Record<PromiseStatus, string> = {
  kept: "text-sage-600 bg-sage-50 border-sage-200",
  partly: "text-amber-500 bg-amber-50 border-amber-200",
  broke: "text-rose-400 bg-rose-50 border-rose-200",
  pending: "text-warm-400 bg-warm-50 border-warm-200",
};
