// src/app/_components/IdeaBox.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IdeaBox() {
  const [idea, setIdea] = useState("");
  const router = useRouter();
  const suggestions = [
    "Reporting Dashboard",
    "Gaming Platform",
    "Onboarding Portal",
    "Networking App",
    "Room Visualizer",
  ];

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: optionally persist idea to localStorage here before routing
    if (idea.trim()) {
      console.log("idea:", idea);
    }
    router.push("/idea");
  }

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-surface-glass p-2 shadow-soft backdrop-blur">
      <form onSubmit={onSubmit} className="relative" aria-label="Describe your business idea">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="What do you want to build?"
          rows={3}
          className="w-full resize-y rounded-2xl border border-border bg-white p-4 pr-14 text-text shadow-sm placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-blue"
        />
        <button
          type="submit"
          className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange text-text-onBrand shadow hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-blue"
          aria-label="Submit idea"
          title="Submit idea"
        >
          ↑
        </button>
      </form>

      <div className="mt-3 rounded-2xl bg-surface-glass p-3">
        <p className="mb-2 text-xs text-text-muted">Not sure where to start? Try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setIdea(s)}
              className="rounded-full border border-border bg-white px-3 py-1 text-sm text-text shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-blue"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}