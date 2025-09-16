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
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl border-2 border-[#C0C4CC] bg-white/95 p-3 shadow-[0_20px_40px_rgba(0,0,0,0.1)] backdrop-blur">
      <form onSubmit={onSubmit} className="relative" aria-label="Describe your business idea">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="What do you want to build?"
          rows={3}
          className="w-full resize-y rounded-xl border-2 border-[#C0C4CC] bg-white p-4 pr-14 text-[#2D1B02] shadow-inner placeholder:text-[#8B7355] focus:outline-none focus:border-[#FFD700] focus-visible:ring-2 focus-visible:ring-[#FFD700] transition-all"
        />
        <button
          type="submit"
          className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-[#2D1B02] shadow-lg hover:from-[#FFED4E] hover:via-[#FFD700] hover:to-[#FFA500] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] transition-all transform hover:scale-110 font-bold text-lg"
          aria-label="Submit idea"
          title="Submit idea"
        >
          ↑
        </button>
      </form>

      <div className="mt-3 rounded-xl bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] p-3 border border-[#C0C4CC]">
        <p className="mb-2 text-xs text-[#5D4E37] font-medium">Not sure where to start? Try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setIdea(s)}
              className="rounded-full border border-[#C0C4CC] bg-gradient-to-br from-white to-[#F8F9FA] px-3 py-1 text-sm text-[#2D1B02] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-[#FFD700] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] font-medium"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}