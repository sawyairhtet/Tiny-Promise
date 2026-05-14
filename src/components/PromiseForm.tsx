"use client";

import { useState } from "react";

interface PromiseFormProps {
  onSubmit: (text: string) => void;
}

export default function PromiseForm({ onSubmit }: PromiseFormProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-warm-600 text-lg">
          What&apos;s one small promise you&apos;ll make to yourself today?
        </p>
        <p className="text-warm-400 text-sm">
          Keep it small. Keep it honest.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. I'll take a 10-minute walk..."
        rows={3}
        maxLength={200}
        className="w-full rounded-xl border border-warm-200 bg-white px-4 py-3 text-warm-800 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent resize-none"
      />

      <button
        type="submit"
        disabled={!text.trim()}
        className="w-full rounded-xl bg-sage-500 py-3 text-white font-medium transition-colors hover:bg-sage-600 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        I promise
      </button>
    </form>
  );
}
