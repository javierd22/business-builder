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
    if (idea.trim()) {
      console.log("idea:", idea);
    }
    router.push("/idea");
  }

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#E5E9EF] bg-white/80 p-2 shadow-[0_10px_30px_rgba(2,6,23,0.08)] backdrop-blur">
      <form onSubmit={onSubmit} className="relative" aria-label="Describe your business idea">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="What do you want to build?"
          rows={3}
          className="w-full resize-y rounded-2xl border border-[#E5E9EF] bg-white p-4 pr-14 text-[#1F2937] shadow-sm placeholder:text-[#6B7280] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        />
        <button
          type="submit"
          className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-[#1F2937] shadow hover:bg-[#B4891E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          aria-label="Submit idea"
          title="Submit idea"
        >
          ↑
        </button>
      </form>

      <div className="mt-3 rounded-2xl bg-white/70 p-3">
        <p className="mb-2 text-xs text-[#6B7280]">Not sure where to start? Try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setIdea(s)}
              className="rounded-full border border-[#E5E9EF] bg-white px-3 py-1 text-sm text-[#1F2937] shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}