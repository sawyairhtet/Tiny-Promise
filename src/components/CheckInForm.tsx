"use client";

import { useState } from "react";
import { PromiseEntry, PromiseStatus, TomorrowSize } from "@/types/promise";

interface CheckInFormProps {
  promise: PromiseEntry;
  status: PromiseStatus;
  onComplete: (reflection: string, tomorrowSize: TomorrowSize) => void;
}

const statusMessages: Record<PromiseStatus, string> = {
  kept: "You kept your promise. That's self-trust growing.",
  partly: "Partly kept is still showing up. That matters.",
  broke: "Tomorrow can be smaller. No shame — just notice.",
  pending: "",
};

const sizeOptions: { value: TomorrowSize; label: string }[] = [
  { value: "smaller", label: "Smaller" },
  { value: "same", label: "Same size" },
  { value: "bigger", label: "A little bigger" },
];

export default function CheckInForm({ promise, status, onComplete }: CheckInFormProps) {
  const [reflection, setReflection] = useState("");
  const [tomorrowSize, setTomorrowSize] = useState<TomorrowSize>("same");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onComplete(reflection.trim(), tomorrowSize);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-warm-800 text-lg">
          &quot;{promise.text}&quot;
        </p>
        <p className="text-sage-600 text-sm">
          {statusMessages[status]}
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-warm-600 text-sm">
          Any reflections? (optional)
        </label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="What did you notice?"
          rows={3}
          maxLength={300}
          className="w-full rounded-xl border border-warm-200 bg-white px-4 py-3 text-warm-800 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-warm-600 text-sm">
          Tomorrow&apos;s promise should be...
        </label>
        <div className="flex gap-2">
          {sizeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTomorrowSize(opt.value)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm transition-colors ${
                tomorrowSize === opt.value
                  ? "border-sage-400 bg-sage-50 text-sage-700 font-medium"
                  : "border-warm-200 bg-white text-warm-500 hover:border-warm-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-sage-500 py-3 text-white font-medium transition-colors hover:bg-sage-600"
      >
        Save & close
      </button>
    </form>
  );
}
