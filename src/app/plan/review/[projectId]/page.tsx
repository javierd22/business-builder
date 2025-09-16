"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";
import { Textarea } from "@/app/_components/ui/Textarea";
import { getProject, updateProject } from "@/lib/storage";
import { createUX } from "@/lib/api";
import type { Project } from "@/lib/storage";

export default function PlanReviewPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [prd, setPrd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  useEffect(() => {
    if (projectId) {
      const foundProject = getProject(projectId);
      setProject(foundProject || null);
      if (foundProject?.prd) {
        setPrd(foundProject.prd);
      }
      setIsLoadingProject(false);
    }
  }, [projectId]);

  const handleGenerateUX = async () => {
    if (!project) return;

    setError("");
    setIsLoading(true);

    try {
      // Save current PRD edits
      const updatedPrd = prd.trim();
      if (updatedPrd !== project.prd) {
        updateProject(project.id, { prd: updatedPrd });
      }

      // Generate UX
      const uxResponse = await createUX(updatedPrd);

      if (uxResponse.ux) {
        // Update project with UX and new status
        updateProject(project.id, {
          ux: uxResponse.ux,
          status: "ux_design",
        });

        // Navigate to UX preview
        router.push(`/ux/preview/${project.id}`);
      } else if (uxResponse.message) {
        throw new Error(uxResponse.message);
      } else {
        throw new Error("Failed to generate UX design");
      }
    } catch (err) {
      console.error("Error generating UX:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError("");
    handleGenerateUX();
  };

  if (isLoadingProject) {
    return (
      <div className="min-h-screen bg-[#F4EDE2] py-12">
        <div className="mx-auto max-w-4xl px-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent mx-auto mb-4" />
                  <p className="text-[#6B7280]">Loading project...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!project || !project.prd) {
    return (
      <div className="min-h-screen bg-[#F4EDE2] py-12">
        <div className="mx-auto max-w-2xl px-4">
          <Card>
            <CardHeader>
              <CardTitle as="h1" className="text-center text-red-600">
                PRD Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-[#6B7280]">
                {!project 
                  ? "This project doesn't exist or has been deleted."
                  : "This project doesn't have a Product Requirements Document yet."
                }
              </p>
              <p className="text-sm text-[#6B7280]">
                Please generate an idea first to create your business plan.
              </p>
              <Button href="/idea" variant="primary">
                Generate Business Idea
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EDE2] py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle as="h1">
                Review Product Requirements Document
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <div className="h-2 w-2 rounded-full bg-[#D4AF37]" />
                <span>Planning Phase</span>
              </div>
            </div>
            <p className="text-sm text-[#6B7280] mt-2">
              <strong>Project:</strong> {project.idea}
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <Textarea
                label="Product Requirements Document"
                value={prd}
                onChange={(e) => setPrd(e.target.value)}
                rows={15}
                helpText="Review and edit your PRD before generating the UX design. This document will guide the user experience creation."
                disabled={isLoading}
                className="font-mono text-sm"
              />

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
                    Creating user experience design based on your PRD...
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex gap-3 w-full">
              <Button
                href="/idea"
                variant="secondary"
                size="large"
              >
                ← Back to Ideas
              </Button>
              
              <Button
                onClick={handleGenerateUX}
                variant="primary"
                size="large"
                isLoading={isLoading}
                disabled={isLoading || !prd.trim()}
                className="flex-1"
              >
                {isLoading ? "Generating UX..." : "Generate User Experience"}
              </Button>

              {error && (
                <Button
                  onClick={handleRetry}
                  variant="secondary"
                  size="large"
                  disabled={isLoading}
                >
                  Retry
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
