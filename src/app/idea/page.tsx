"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addProject, updateProject, getProfile } from "@/lib/storage";
import { createPlan } from "@/lib/api";
import { Telemetry } from "@/lib/telemetry";
import { recordMilestone } from "@/lib/insights";
import { recordEvent } from "@/lib/observability";
import { setStatus } from "@/lib/assumptions";
import { recordSurvey } from "@/lib/research-telemetry";
import { shouldShowResearch, NEXT_PUBLIC_SHOW_INSTANT_PREVIEW } from "@/lib/flags";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/Card";
import { Textarea } from "@/app/_components/ui/Textarea";
import { Button } from "@/app/_components/ui/Button";
import FlowSteps from "@/app/_components/FlowSteps";
import ConsentBanner, { useConsent } from "@/app/_components/ConsentBanner";
import MicroSurvey from "@/app/_components/MicroSurvey";
import InstantPreview from "@/app/_components/InstantPreview";

export default function IdeaPage() {
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ persona: string; job: string } | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const { isConsented } = useConsent();
  const router = useRouter();

  const suggestions = [
    "E-commerce platform for local artisans",
    "Task management app for remote teams",
    "Analytics dashboard for small businesses",
    "Learning management system for online courses",
    "Customer support ticketing system",
  ];

  useEffect(() => {
    const userProfile = getProfile();
    if (userProfile) {
      setProfile({
        persona: userProfile.persona,
        job: userProfile.job,
      });
    }
    
    // Record page view for funnel tracking
    recordEvent({
      name: 'view',
      route: '/idea',
      ok: true,
      ms: 0
    });

    // Show survey if research is enabled and user has profile
    if (shouldShowResearch() && userProfile) {
      setShowSurvey(true);
    }
  }, []);

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
      Telemetry.ideaCreated();
      recordMilestone(newProject.id, 'idea_created');
      
      // Record CTA click for funnel tracking
      recordEvent({
        name: 'cta',
        route: '/idea',
        ok: true,
        ms: 0,
        meta: { action: 'generate-plan' }
      });
      
      const result = await createPlan(idea, profile?.persona, profile?.job);
      Telemetry.prdGenerated();
      recordMilestone(newProject.id, 'prd_generated');

      // Update project with PRD and LLM metadata
      updateProject(newProject.id, { 
        prd: result.prd, 
        status: "planning",
        llm: {
          plan: {
            provider: result.meta.provider,
            model: result.meta.model,
            durationMs: result.meta.durationMs,
            tokensUsed: result.meta.tokensUsed,
            costEstimate: result.meta.costEstimate,
          }
        }
      });
      
      router.push(`/plan/review/${newProject.id}`);
    } catch (err) {
      console.error("Idea submission error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSurveySubmit = (result: { choice: string; note?: string }) => {
    recordSurvey('local_only_ok', result.choice, result.note);
    
    // Update assumption status based on response
    if (result.choice === 'Yes') {
      setStatus('local_only_ok', 'validated', result.note);
    } else if (result.choice === 'No') {
      setStatus('local_only_ok', 'invalidated', result.note);
    }
    
    setShowSurvey(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
      <FlowSteps currentStep="idea" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ConsentBanner className="mb-6" />
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#4A5568] mb-4">
            What&apos;s your business idea?
          </h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            Describe your business concept and we&apos;ll help you create a comprehensive product requirements document.
          </p>
          {profile && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#F7DC6F] bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] px-4 py-2 text-sm text-[#8B7355] shadow-[0_2px_8px_rgba(247,220,111,0.2)]">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>
                Tailored for <strong>{profile.persona}</strong> looking to <strong>{profile.job.toLowerCase()}</strong>
              </span>
            </div>
          )}
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-[#4A5568]">Business Idea</CardTitle>
            <CardDescription>
              Be as detailed as possible. The more context you provide, the better your PRD will be.
              {profile && (
                <span className="block mt-2 text-sm text-[#8B7355]">
                  💡 As a {profile.persona.toLowerCase()}, focus on how this idea helps you {profile.job.toLowerCase()}.
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <Textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder={
                    profile 
                      ? `As a ${profile.persona.toLowerCase()}, I want to create a business that helps me ${profile.job.toLowerCase()}. For example...`
                      : "Describe your business idea in detail..."
                  }
                  rows={6}
                  className="w-full"
                  disabled={isLoading || !isConsented}
                />
                <p className="text-sm text-[#6B7280] mt-2">
                  {idea.length}/5000 characters
                </p>
              </div>

              {error && (
                <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4" role="alert">
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
                        <div className="-mx-2 -my-1.5 flex">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setError(null)}
                            className="bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!isConsented && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Consent Required:</strong> Please accept the privacy notice above to generate your business plan.
                  </p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || idea.trim().length < 10 || !isConsented}
                  className="bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02]"
                >
                  {isLoading ? "Generating PRD..." : !isConsented ? "Consent Required" : "Generate PRD"}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-sm text-[#6B7280] mb-3">Need inspiration? Try one of these:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setIdea(suggestion)}
                    className="rounded-full border border-[#E8E9EA] bg-gradient-to-br from-white via-[#FEFEFE] to-[#FCFCFC] px-3 py-1 text-sm text-[#4A5568] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-[#F7DC6F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] font-medium"
                    disabled={isLoading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {showSurvey && shouldShowResearch() && (
              <div className="mt-6">
                <MicroSurvey
                  assumptionId="local_only_ok"
                  question="Is local-only storage acceptable for your use right now?"
                  options={["Yes", "No"]}
                  onSubmit={handleSurveySubmit}
                  variant="inline"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instant Preview */}
        {NEXT_PUBLIC_SHOW_INSTANT_PREVIEW && idea.trim().length > 10 && (
          <div className="mt-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[#4A5568] mb-2">
                Instant Preview
              </h2>
              <p className="text-[#6B7280]">
                See how your idea could look as a website
              </p>
            </div>
            <InstantPreview 
              idea={idea} 
              persona={profile?.persona} 
              job={profile?.job} 
            />
          </div>
        )}
      </div>
    </div>
  );
}