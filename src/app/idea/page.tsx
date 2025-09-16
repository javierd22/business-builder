"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";
import { Textarea } from "@/app/_components/ui/Textarea";
import { addProject, updateProject } from "@/lib/storage";
import { createPlan } from "@/lib/api";

function FriendlyErrorPanel({ 
  error, 
  onRetry, 
  onEditInput, 
  onTrySample,
  isLoading 
}: {
  error: string;
  onRetry: () => void;
  onEditInput: () => void;
  onTrySample: () => void;
  isLoading: boolean;
}) {
  const isMockModeAvailable = process.env.NEXT_PUBLIC_MOCK_AI === "true";

  return (
    <div 
      className="p-6 bg-brand-beige border-2 border-metal-silverLight rounded-2xl"
      role="alert"
    >
      <h3 className="text-lg font-semibold text-text-DEFAULT mb-2">
        We couldn&apos;t complete this step
      </h3>
      <p className="text-sm text-text-muted mb-4">
        {error}
      </p>
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={onRetry}
          variant="primary"
          size="md"
          loading={isLoading}
          disabled={isLoading}
        >
          Retry
        </Button>
        <Button
          onClick={onEditInput}
          variant="secondary"
          size="md"
        >
          Edit Input
        </Button>
        {isMockModeAvailable && (
          <Button
            onClick={onTrySample}
            variant="secondary"
            size="md"
            disabled={isLoading}
          >
            Try Sample
          </Button>
        )}
      </div>
    </div>
  );
}

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
      return "Business idea must be at least 10 characters long";
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
      // Create project in localStorage with draft status
      const project = addProject({ idea: idea.trim() });

      // Generate PRD
      const planResponse = await createPlan(idea.trim());

      // Update project with PRD and planning status
      updateProject(project.id, {
        prd: planResponse.prd,
        status: "planning",
      });

      // Navigate to PRD review
      router.push(`/plan/review/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError("");
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const handleEditInput = () => {
    setError("");
  };

  const handleTrySample = () => {
    setError("");
    setIdea("AI-powered personal finance assistant that helps users track expenses, create budgets, and receive personalized financial advice based on their spending patterns and financial goals.");
    
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-brand-beige py-12">
      <div className="mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader>
            <CardTitle as="h1" className="text-center text-2xl">
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
                error={error && !error.includes("couldn't") ? error : undefined}
              />

              <div 
                className="space-y-4"
                aria-live="polite"
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Generating PRD..." : "Generate Business Plan"}
                </Button>

                {error && error.includes("couldn't") && (
                  <FriendlyErrorPanel
                    error={error}
                    onRetry={handleRetry}
                    onEditInput={handleEditInput}
                    onTrySample={handleTrySample}
                    isLoading={isLoading}
                  />
                )}

                {isLoading && (
                  <div className="p-4 bg-brand-beige border border-metal-silverLight rounded-xl">
                    <p className="text-sm text-text-muted">
                      Analyzing your business idea and generating a comprehensive Product Requirements Document...
                    </p>
                  </div>
                )}
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-metal-silverLight">
              <h3 className="text-sm font-medium text-text-DEFAULT mb-3">
                Quick Tips for Better Results:
              </h3>
              <ul className="text-sm text-text-muted space-y-1">
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