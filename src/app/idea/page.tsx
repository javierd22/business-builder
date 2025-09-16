"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";
import { Textarea } from "@/app/_components/ui/Textarea";
import { addProject, updateProject } from "@/lib/storage";
import { createPlan } from "@/lib/api";

export default function IdeaPage() {
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastResult, setLastResult] = useState<{ isMocked?: boolean } | null>(null);
  const router = useRouter();

  const validateIdea = (idea: string): string | null => {
    if (!idea.trim()) {
      return "Please describe your business idea";
    }
    if (idea.trim().length < 10) {
      return "Please provide at least 10 characters to describe your idea";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLastResult(null);

    const validationError = validateIdea(idea);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Create project in localStorage
      const project = addProject({ idea: idea.trim() });

      // Generate PRD
      const planResponse = await createPlan(idea.trim());

      // Update project with PRD and new status
      updateProject(project.id, {
        prd: planResponse.prd,
        status: "planning",
      });

      setLastResult(planResponse);

      // Navigate to PRD review
      router.push(`/plan/review/${project.id}`);
    } catch (err) {
      console.error("Error generating plan:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError("");
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const handleTrySample = async () => {
    setError("");
    setIdea("AI-powered personal finance assistant that helps users track expenses, create budgets, and receive personalized financial advice based on their spending patterns and financial goals.");
    
    // Auto-submit with sample idea
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#F4EDE2] py-12">
      <div className="mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader>
            <CardTitle as="h1" className="text-center">
              Describe Your Business Idea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Textarea
                label="What&apos;s your business idea?"
                placeholder="Describe your business concept, target market, and what problem you&apos;re solving..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={6}
                helpText="Provide as much detail as possible to get a comprehensive business plan (minimum 10 characters)"
                disabled={isLoading}
                aria-describedby={error ? undefined : "idea-help"}
              />

              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Generating Business Plan..." : "Generate Business Plan"}
                </Button>

                {error && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="large"
                    onClick={handleRetry}
                    disabled={isLoading}
                  >
                    Retry
                  </Button>
                )}
              </div>

              {/* Friendly Error Panel */}
              {error && (
                <div 
                  className="p-6 bg-[#F4EDE2] border-2 border-[#E5E9EF] rounded-xl"
                  role="alert"
                  aria-live="polite"
                >
                  <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                    We couldn&apos;t complete this step
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-4">
                    {error}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleRetry}
                      variant="primary"
                      size="large"
                      disabled={isLoading}
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={() => setError("")}
                      variant="secondary"
                      size="large"
                    >
                      Edit Input
                    </Button>
                    <Button
                      onClick={handleTrySample}
                      variant="secondary"
                      size="large"
                      disabled={isLoading}
                    >
                      Try Sample
                    </Button>
                  </div>
                </div>
              )}

              {/* Mock Mode Indicator */}
              {lastResult?.isMocked && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ℹ️ Using sample content for demonstration
                  </p>
                </div>
              )}

              {isLoading && (
                <div 
                  className="p-4 bg-[#F4EDE2] border border-[#E5E9EF] rounded-lg"
                  aria-live="polite"
                >
                  <p className="text-sm text-[#6B7280]">
                    Analyzing your business idea and generating a comprehensive Product Requirements Document...
                  </p>
                </div>
              )}
            </form>

            <div className="mt-8 pt-6 border-t border-[#E5E9EF]">
              <h3 className="text-sm font-medium text-[#1F2937] mb-3">
                Quick Tips for Better Results:
              </h3>
              <ul className="text-sm text-[#6B7280] space-y-1">
                <li>• Be specific about your target audience</li>
                <li>• Describe the problem you&apos;re solving</li>
                <li>• Mention your unique value proposition</li>
                <li>• Include any business model ideas</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}