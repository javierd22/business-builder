"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";
import { getProject, updateProject } from "@/lib/storage";
import { requestDeploy } from "@/lib/api";
import type { Project } from "@/lib/storage";

export default function UXPreviewPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [lastResult, setLastResult] = useState<{ isMocked?: boolean } | null>(null);
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  useEffect(() => {
    if (projectId) {
      const foundProject = getProject(projectId);
      setProject(foundProject || null);
      setIsLoadingProject(false);
    }
  }, [projectId]);

  const handleDeploy = async () => {
    if (!project) return;

    setError("");
    setLastResult(null);
    setIsLoading(true);

    try {
      const deployResponse = await requestDeploy(project.id);

      // Update project status and deployment link
      const updates: Partial<Project> = {
        status: deployResponse.status || "deploying",
      };

      if (deployResponse.url) {
        updates.deploymentLink = deployResponse.url;
      }

      updateProject(project.id, updates);
      setLastResult(deployResponse);

      // Navigate to deploy page
      router.push(`/deploy/${project.id}`);
    } catch (err) {
      console.error("Error deploying project:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError("");
    handleDeploy();
  };

  const handleTrySample = async () => {
    setError("");
    
    // Mock deployment - update project directly
    updateProject(project!.id, {
      deploymentLink: "https://example.com/live-demo",
      status: "completed",
    });

    // Navigate to deploy page
    router.push(`/deploy/${project!.id}`);
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

  if (!project || !project.ux) {
    return (
      <div className="min-h-screen bg-[#F4EDE2] py-12">
        <div className="mx-auto max-w-2xl px-4">
          <Card>
            <CardHeader>
              <CardTitle as="h1" className="text-center text-red-600">
                UX Design Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-[#6B7280]">
                {!project 
                  ? "This project doesn&apos;t exist or has been deleted."
                  : "This project doesn&apos;t have a UX design yet."
                }
              </p>
              <p className="text-sm text-[#6B7280]">
                Please generate a PRD and UX design first.
              </p>
              <div className="flex gap-3 justify-center">
                <Button href="/idea" variant="secondary">
                  Start New Project
                </Button>
                {project && (
                  <Button href={`/plan/review/${project.id}`} variant="primary">
                    Back to PRD Review
                  </Button>
                )}
              </div>
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
                Preview User Experience
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span>UX Design Phase</span>
              </div>
            </div>
            <p className="text-sm text-[#6B7280] mt-2">
              <strong>Project:</strong> {project.idea}
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-[#1F2937] mb-3">
                  User Experience Design
                </h3>
                <div className="bg-white border border-[#E5E9EF] rounded-lg p-6">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-[#1F2937] leading-relaxed">
                      {project.ux}
                    </pre>
                  </div>
                </div>
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
                    Deploying your application to production...
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Ready to Deploy?
                </h4>
                <p className="text-sm text-blue-800">
                  Your UX design is complete! Click &quot;Deploy App&quot; to make your business application live on the web.
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex gap-3 w-full">
              <Button
                href={`/plan/review/${project.id}`}
                variant="secondary"
                size="large"
              >
                ← Back to Plan
              </Button>
              
              <Button
                onClick={handleDeploy}
                variant="primary"
                size="large"
                isLoading={isLoading}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Deploying Application..." : "Deploy App"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}