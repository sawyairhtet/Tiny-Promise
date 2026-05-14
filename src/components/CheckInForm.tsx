"use client";

import { useState } from "react";
import { TomorrowSize } from "@/types/promise";

type CheckInFormProps = {
  selectedStatus: "kept" | "partly" | "broke";
  onSave: (reflection: string, tomorrowSize: TomorrowSize) => void;
  onCancel?: () => void;
};

const headings: Record<CheckInFormProps["selectedStatus"], string> = {
  kept: "What helped you keep it?",
  partly: "What got in the way?",
  broke: "What made it hard today?",
};

const defaultSize: Record<CheckInFormProps["selectedStatus"], TomorrowSize> = {
  kept: "same",
  partly: "same",
  broke: "smaller",
};

const sizeOptions: { value: TomorrowSize; label: string }[] = [
  { value: "smaller", label: "Smaller" },
  { value: "same", label: "Same" },
  { value: "bigger", label: "Bigger" },
];

export default function CheckInForm({
  selectedStatus,
  onSave,
  onCancel,
}: CheckInFormProps) {
  const [reflection, setReflection] = useState("");
  const [tomorrowSize, setTomorrowSize] = useState<TomorrowSize>(
    defaultSize[selectedStatus]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(reflection.trim(), tomorrowSize);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-1">
        <p className="text-warm-700 text-lg leading-relaxed">
          {headings[selectedStatus]}
        </p>
      </div>

      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="Write a few words, or leave it blank."
        aria-label="Your reflection"
        rows={3}
        maxLength={300}
        className="w-full rounded-xl border border-warm-200 bg-white px-4 py-3 text-warm-800 shadow-soft placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent resize-none"
      />

      <div className="space-y-2">
        <p className="text-warm-600 text-sm">
          Tomorrow&apos;s promise should be...
        </p>
        <div className="flex gap-2">
          {sizeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTomorrowSize(opt.value)}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-300 ${
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

      <div className="space-y-3">
        <button
          type="submit"
          className="w-full rounded-xl bg-sage-500 py-3 text-white font-medium shadow-soft transition-colors hover:bg-sage-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-300"
        >
          Save reflection
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-warm-200 bg-white py-3 text-warm-400 text-sm transition-colors hover:text-warm-600 hover:border-warm-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-300"
          >
            Go back
          </button>
        )}
      </div>
    </form>
  );
}
