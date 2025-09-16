"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addProject, updateProject } from "@/lib/storage";
import { createPlan } from "@/lib/api";

export default function IdeaBox() {
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const suggestions = [
    "Reporting Dashboard",
    "Gaming Platform", 
    "Onboarding Portal",
    "Networking App",
    "Room Visualizer",
  ];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!idea.trim() || idea.trim().length < 10) {
      setError("Please describe your idea with at least 10 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const newProject = addProject({ idea });
      const result = await createPlan(idea);

      if (result.prd) {
        updateProject(newProject.id, { prd: result.prd, status: "planning" });
        router.push(`/plan/review/${newProject.id}`);
      } else {
        setError(result.message || "Failed to generate PRD. Please try again.");
        updateProject(newProject.id, { status: "failed" });
      }
    } catch (err) {
      console.error("Idea submission error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl border-2 border-[#E8E9EA] bg-gradient-to-br from-white via-[#FEFEFE] to-[#FCFCFC] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur">
      <form onSubmit={onSubmit} className="relative" aria-label="Describe your business idea">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="What do you want to build?"
          rows={3}
          className="w-full resize-y rounded-xl border-2 border-[#E8E9EA] bg-gradient-to-br from-white via-[#FEFEFE] to-[#FCFCFC] p-4 pr-14 text-[#4A5568] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#F7DC6F] focus-visible:ring-2 focus-visible:ring-[#F7DC6F] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_0_0_3px_rgba(247,220,111,0.1)] transition-all"
        />
        <button
          type="submit"
          className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] shadow-[0_4px_16px_rgba(247,220,111,0.25)] hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_6px_20px_rgba(247,220,111,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-110 font-bold text-lg"
          aria-label="Submit idea"
          title="Submit idea"
          disabled={isLoading}
        >
          {isLoading ? "..." : "↑"}
        </button>
      </form>
      {error && (
        <div className="mt-3 text-sm text-red-600 text-center" role="alert">
          {error}
        </div>
      )}

      <div className="mt-3 rounded-xl bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] p-3 border border-[#E8E9EA] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <p className="mb-2 text-xs text-[#6B7280] font-medium">Not sure where to start? Try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setIdea(s)}
              className="rounded-full border border-[#E8E9EA] bg-gradient-to-br from-white via-[#FEFEFE] to-[#FCFCFC] px-3 py-1 text-sm text-[#4A5568] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-[#F7DC6F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] font-medium"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}