"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveProfile } from "@/lib/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";

const PERSONAS = [
  {
    id: "solopreneur",
    title: "Solopreneur",
    description: "Building and running your business solo",
    icon: "🚀",
    examples: ["Freelancer", "Consultant", "Creator", "Indie Hacker"]
  },
  {
    id: "smb-owner",
    title: "SMB Owner",
    description: "Leading a small to medium business",
    icon: "🏢",
    examples: ["Local Business", "Family Business", "Growing Company", "Regional Leader"]
  },
  {
    id: "agency",
    title: "Agency",
    description: "Serving multiple clients with services",
    icon: "🎯",
    examples: ["Marketing Agency", "Design Studio", "Consulting Firm", "Service Provider"]
  },
  {
    id: "pm-founder",
    title: "PM/Founder",
    description: "Product manager or startup founder",
    icon: "💡",
    examples: ["Product Manager", "Startup Founder", "Innovation Lead", "Tech Entrepreneur"]
  }
];

const JOBS = [
  {
    id: "launch-mvp",
    title: "Launch MVP",
    description: "Get a minimum viable product to market quickly",
    icon: "⚡",
    focus: "Speed to market, core features, user validation"
  },
  {
    id: "validate-market",
    title: "Validate Market",
    description: "Test and prove your business concept",
    icon: "🔍",
    focus: "Market research, user feedback, business model validation"
  },
  {
    id: "automate-ops",
    title: "Automate Operations",
    description: "Streamline and scale your business processes",
    icon: "⚙️",
    focus: "Efficiency, scalability, process optimization"
  },
  {
    id: "pitch-deck",
    title: "Create Pitch Deck",
    description: "Present your business to investors or stakeholders",
    icon: "📊",
    focus: "Investor presentation, business case, growth strategy"
  }
];

export default function OnboardingPage() {
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const canContinue = selectedPersona && selectedJob;

  async function handleContinue() {
    if (!canContinue) return;

    setIsLoading(true);
    setError(null);

    try {
      const persona = PERSONAS.find(p => p.id === selectedPersona);
      const job = JOBS.find(j => j.id === selectedJob);

      if (!persona || !job) {
        throw new Error("Invalid selection");
      }

      saveProfile({
        persona: persona.title,
        job: job.title,
      });

      // Redirect to idea page with success
      router.push('/idea?onboarded=true');
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err instanceof Error ? err.message : "Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#4A5568] mb-4">
            Let&apos;s personalize your experience
          </h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            Tell us about yourself so we can tailor our business building tools to your specific needs and goals.
          </p>
        </div>

        {/* Persona Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[#4A5568]">What best describes you?</CardTitle>
            <CardDescription>
              Choose the role that most closely matches your current situation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] ${
                    selectedPersona === persona.id
                      ? 'border-[#F7DC6F] bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] shadow-[0_4px_12px_rgba(247,220,111,0.2)]'
                      : 'border-[#E8E9EA] bg-gradient-to-br from-white via-[#FEFEFE] to-[#FCFCFC] hover:border-[#F7DC6F] hover:shadow-[0_2px_8px_rgba(247,220,111,0.1)]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{persona.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#4A5568] mb-2">
                        {persona.title}
                      </h3>
                      <p className="text-[#6B7280] mb-3">{persona.description}</p>
                      <div className="text-sm text-[#9CA3AF]">
                        <p className="font-medium mb-1">Examples:</p>
                        <p>{persona.examples.join(' • ')}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Job Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-[#4A5568]">What&apos;s your main goal?</CardTitle>
            <CardDescription>
              What are you trying to accomplish with your business?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {JOBS.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] ${
                    selectedJob === job.id
                      ? 'border-[#F7DC6F] bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] shadow-[0_4px_12px_rgba(247,220,111,0.2)]'
                      : 'border-[#E8E9EA] bg-gradient-to-br from-white via-[#FEFEFE] to-[#FCFCFC] hover:border-[#F7DC6F] hover:shadow-[0_2px_8px_rgba(247,220,111,0.1)]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{job.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#4A5568] mb-2">
                        {job.title}
                      </h3>
                      <p className="text-[#6B7280] mb-3">{job.description}</p>
                      <div className="text-sm text-[#9CA3AF]">
                        <p className="font-medium mb-1">Focus:</p>
                        <p>{job.focus}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                  <div className="mt-4">
                    <Button
                      onClick={() => setError(null)}
                      variant="ghost"
                      className="bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Link
            href="/"
            className="text-[#6B7280] hover:text-[#D4A574] hover:bg-gradient-to-r hover:from-[#FFF9E6] hover:to-[#FFF5CC] hover:bg-clip-text hover:text-transparent transition-all px-4 py-2 rounded-lg"
          >
            Skip for now
          </Link>

          <Button
            onClick={handleContinue}
            disabled={!canContinue || isLoading}
            className="bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#9CA3AF]">
            You can change these settings anytime in your{" "}
            <Link
              href="/settings"
              className="text-[#D4A574] hover:text-[#F7DC6F] hover:bg-gradient-to-r hover:from-[#FFF9E6] hover:to-[#FFF5CC] hover:bg-clip-text hover:text-transparent transition-all"
            >
              settings
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
