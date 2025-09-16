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

      if (planResponse.prd) {
        // Update project with PRD and new status
        updateProject(project.id, {
          prd: planResponse.prd,
          status: "planning",
        });

        // Navigate to PRD review
        router.push(`/plan/review/${project.id}`);
      } else if (planResponse.message) {
        throw new Error(planResponse.message);
      } else {
        throw new Error("Failed to generate business plan");
      }
    } catch (err) {
      console.error("Error generating plan:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError("");
    handleSubmit(new Event("submit") as any);
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
                label="What's your business idea?"
                placeholder="Describe your business concept, target market, and what problem you're solving..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={6}
                error={error}
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
                  {isLoading ? "Generating PRD..." : "Generate Business Plan"}
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

              {error && (
                <div 
                  className="p-4 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                  aria-live="polite"
                >
                  <p className="text-sm text-red-800">{error}</p>
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
                <li>• Describe the problem you're solving</li>
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
