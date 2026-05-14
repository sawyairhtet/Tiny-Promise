"use client";

import { useState } from "react";

type PromiseFormProps = {
  onCreate: (text: string) => void;
};

const examples = [
  "Study for 25 minutes",
  "Walk for 10 minutes",
  "Clean my desk",
  "Meditate for 5 minutes",
  "Sleep before midnight",
];

export default function PromiseForm({ onCreate }: PromiseFormProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onCreate(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-warm-700 text-lg leading-relaxed">
          What is one small promise for today?
        </p>
        <p className="text-warm-400 text-sm">
          Keep it small enough that today-you can actually keep it.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Today I promise to..."
        rows={3}
        maxLength={200}
        className="w-full rounded-xl border border-warm-200 bg-white px-4 py-3 text-warm-800 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent resize-none"
      />

      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setText(example)}
            className="rounded-full border border-warm-200 bg-white px-3 py-1.5 text-xs text-warm-500 transition-colors hover:border-sage-300 hover:text-sage-600"
          >
            {example}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={!text.trim()}
        className="w-full rounded-xl bg-sage-500 py-3 text-white font-medium transition-colors hover:bg-sage-600 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Make Promise
      </button>
    </form>
  );
}
