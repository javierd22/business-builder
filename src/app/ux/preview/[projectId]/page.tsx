"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProject, updateProject, getProfile } from "@/lib/storage";
import { requestDeploy } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";
import { Project } from "@/lib/storage";
import FlowSteps from "@/app/_components/FlowSteps";
import { EmptyStates } from "@/app/_components/EmptyState";
import { exportUXAsMarkdown, exportUXAsPDF, exportProjectAsJSON } from "@/lib/export";
import { setStatus } from "@/lib/assumptions";
import { recordSurvey } from "@/lib/research-telemetry";
import { shouldShowResearch } from "@/lib/flags";
import MicroSurvey from "@/app/_components/MicroSurvey";

export default function UXPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [profile, setProfile] = useState<{ persona: string; job: string } | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);

  useEffect(() => {
    const projectData = getProject(projectId);
    if (!projectData) {
      setError("Project not found");
      setIsLoading(false);
      return;
    }
    setProject(projectData);

    // Load profile for context
    const userProfile = getProfile();
    if (userProfile) {
      setProfile({
        persona: userProfile.persona,
        job: userProfile.job,
      });
    }
    
    setIsLoading(false);
  }, [projectId]);

  async function deployProject() {
    if (!project?.prd || !project?.ux) return;

    setIsDeploying(true);
    setError(null);

    try {
      const result = await requestDeploy(projectId, project.prd, project.ux);
      
      updateProject(projectId, { 
        deploymentLink: result.url,
        status: "deploying"
      });
      
      router.push(`/deploy/${projectId}`);
    } catch (err) {
      console.error("Deployment error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsDeploying(false);
    }
  }

  function handleExportUXMarkdown() {
    if (!project?.ux) return;
    exportUXAsMarkdown(project.ux, project.idea);
    
    // Show survey after export (if research enabled)
    if (shouldShowResearch()) {
      setShowSurvey(true);
    }
  }

  function handleExportUXPDF() {
    if (!project?.ux) return;
    exportUXAsPDF(project.ux, project.idea);
    
    // Show survey after export (if research enabled)
    if (shouldShowResearch()) {
      setShowSurvey(true);
    }
  }

  function handleExportProject() {
    if (!project) return;
    exportProjectAsJSON(project);
    
    // Show survey after export (if research enabled)
    if (shouldShowResearch()) {
      setShowSurvey(true);
    }
  }

  const handleSurveySubmit = (result: { choice: string; note?: string }) => {
    recordSurvey('exports_needed', result.choice, result.note);
    
    // Update assumption status based on response
    if (result.choice === 'Yes') {
      setStatus('exports_needed', 'validated', result.note);
    } else if (result.choice === 'No') {
      setStatus('exports_needed', 'invalidated', result.note);
    }
    
    setShowSurvey(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7DC6F] mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
        <FlowSteps currentStep="ux" projectId={projectId} />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent>
              {EmptyStates.projectNotFound}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!project.ux) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
        <FlowSteps currentStep="ux" projectId={projectId} />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent>
              {EmptyStates.noUX}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
      <FlowSteps currentStep="ux" projectId={projectId} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#4A5568] mb-4">UX Preview</h1>
          <p className="text-lg text-[#6B7280]">Review your UX specification and deploy your project.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* UX Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-[#4A5568]">UX Specification</CardTitle>
                    <CardDescription className="mt-2">
                      Generated for: {project.idea}
                      {profile && (
                        <span className="block mt-1 text-sm text-[#8B7355]">
                          🎨 Tailored for <strong>{profile.persona}</strong> to <strong>{profile.job.toLowerCase()}</strong>
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleExportUXMarkdown}
                      variant="secondary"
                      className="border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] text-[#4A5568] hover:from-[#F1F2F4] hover:to-[#E9ECEF] hover:border-[#D1D5DB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D1D5DB] transition-all"
                    >
                      Export UX (.md)
                    </Button>
                    <Button
                      onClick={handleExportUXPDF}
                      variant="secondary"
                      className="border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] text-[#4A5568] hover:from-[#F1F2F4] hover:to-[#E9ECEF] hover:border-[#D1D5DB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D1D5DB] transition-all"
                    >
                      Export UX (.pdf)
                    </Button>
                    <Button
                      onClick={handleExportProject}
                      variant="secondary"
                      className="border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] text-[#4A5568] hover:from-[#F1F2F4] hover:to-[#E9ECEF] hover:border-[#D1D5DB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D1D5DB] transition-all"
                    >
                      Export Project (.json)
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-[#4A5568] font-sans leading-relaxed">
                    {project.ux}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#4A5568]">Deploy Project</CardTitle>
                <CardDescription>
                  Deploy your project to make it live
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={deployProject}
                  disabled={isDeploying}
                  className="w-full bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02]"
                >
                  {isDeploying ? "Deploying..." : "Deploy Project"}
                </Button>

                <Button
                  onClick={() => router.push('/idea')}
                  variant="ghost"
                  className="w-full text-[#6B7280] hover:text-[#D4A574] hover:bg-gradient-to-r hover:from-[#FFF9E6] hover:to-[#FFF5CC] hover:bg-clip-text hover:text-transparent transition-all"
                >
                  Start New Project
                </Button>
              </CardContent>
            </Card>

            {/* LLM Metadata */}
            {project.llm?.ux && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-[#4A5568]">UX Generation Info</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[#6B7280] space-y-1">
                  <p>Provider: {project.llm.ux.provider}</p>
                  <p>Model: {project.llm.ux.model}</p>
                  <p>Duration: {(project.llm.ux.durationMs / 1000).toFixed(1)}s</p>
                  {project.llm.ux.tokensUsed && (
                    <p>Tokens: {project.llm.ux.tokensUsed.toLocaleString()}</p>
                  )}
                  {project.llm.ux.costEstimate && (
                    <p>Cost: ${project.llm.ux.costEstimate.toFixed(4)}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Research Survey */}
            {showSurvey && shouldShowResearch() && (
              <MicroSurvey
                assumptionId="exports_needed"
                question="Was export helpful for your workflow?"
                options={["Yes", "No"]}
                onSubmit={handleSurveySubmit}
                variant="box"
              />
            )}

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
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
          </div>
        </div>
      </div>
    </div>
  );
}