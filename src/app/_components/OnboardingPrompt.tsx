"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProfile } from "@/lib/storage";

export default function OnboardingPrompt() {
  const [profile, setProfile] = useState<{ persona: string; job: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userProfile = getProfile();
    if (userProfile) {
      setProfile({
        persona: userProfile.persona,
        job: userProfile.job,
      });
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  if (profile) {
    return (
      <div className="mx-auto mt-8 max-w-2xl">
        <div className="rounded-xl border-2 border-[#F7DC6F] bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] p-4 shadow-[0_2px_8px_rgba(247,220,111,0.2)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div className="text-sm text-[#8B7355]">
                <span className="font-medium">Personalized for you:</span>{" "}
                <span className="font-semibold">{profile.persona}</span> looking to{" "}
                <span className="font-semibold">{profile.job.toLowerCase()}</span>
              </div>
            </div>
            <Link
              href="/settings"
              className="text-xs text-[#D4A574] hover:text-[#F7DC6F] hover:bg-gradient-to-r hover:from-[#FFF9E6] hover:to-[#FFF5CC] hover:bg-clip-text hover:text-transparent transition-all px-2 py-1 rounded"
            >
              Change
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <div className="rounded-xl border-2 border-[#E8E9EA] bg-gradient-to-br from-white via-[#FEFEFE] to-[#FCFCFC] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] shadow-[0_2px_8px_rgba(247,220,111,0.3)]">
            <svg className="h-6 w-6 text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#4A5568] mb-2">
            Personalize your experience
          </h3>
          <p className="text-sm text-[#6B7280] mb-4">
            Tell us about your role and goals to get tailored business building tools
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] rounded-lg hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02] text-sm font-medium"
          >
            Complete Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
