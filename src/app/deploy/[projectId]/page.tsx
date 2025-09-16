"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";
import { getProject } from "@/lib/storage";
import type { Project } from "@/lib/storage";

export default function DeployPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isMockDemo, setIsMockDemo] = useState(false);
  const params = useParams();
  const projectId = params.projectId as string;

  useEffect(() => {
    if (projectId) {
      const foundProject = getProject(projectId);
      setProject(foundProject || null);
      setIsLoadingProject(false);

      // Check if this is a mock demo URL
      if (foundProject?.deploymentLink === "https://example.com/live-demo") {
        setIsMockDemo(true);
      }
    }
  }, [projectId]);

  const openLiveApp = () => {
    if (project?.deploymentLink) {
      window.open(project.deploymentLink, "_blank", "noopener,noreferrer");
    }
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "deploying":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return "✅";
      case "deploying":
        return "🚀";
      case "failed":
        return "❌";
      default:
        return "⏳";
    }
  };

  if (isLoadingProject) {
    return (
      <div className="min-h-screen bg-brand-beige py-12">
        <div className="mx-auto max-w-4xl px-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-gold border-t-transparent mx-auto mb-4" />
                  <p className="text-text-muted">Loading deployment status...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-brand-beige py-12">
        <div className="mx-auto max-w-2xl px-4">
          <Card>
            <CardHeader>
              <CardTitle as="h1" className="text-center text-red-600">
                Project Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-text-muted">
                This project doesn&apos;t exist or has been deleted.
              </p>
              <Button href="/idea" variant="primary">
                Start New Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle as="h1" className="text-2xl">
                Deployment Status
              </CardTitle>
              <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full border ${getStatusColor(project.status)}`}>
                <span>{getStatusIcon(project.status)}</span>
                <span className="capitalize">{project.status.replace("_", " ")}</span>
              </div>
            </div>
            <p className="text-sm text-text-muted mt-2">
              <strong>Project:</strong> {project.idea}
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Live App Section */}
              {project.deploymentLink && project.status === "completed" && (
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-text-DEFAULT">
                    Your Business App is Live!
                  </h2>
                  <p className="text-text-muted">
                    Congratulations! Your business application has been successfully deployed and is now accessible to users.
                  </p>
                  
                  {/* Mock Mode Indicator */}
                  {isMockDemo && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="text-sm text-blue-800">
                        ℹ️ Using sample content for demonstration
                      </p>
                    </div>
                  )}

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-800 mb-3">
                      <strong>Live URL:</strong>
                    </p>
                    <div className="font-mono text-sm bg-white border border-green-300 rounded px-3 py-2 text-green-700 break-all">
                      {project.deploymentLink}
                    </div>
                  </div>
                  <Button
                    onClick={openLiveApp}
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    🚀 View Live App
                  </Button>
                </div>
              )}

              {/* Deploying Status */}
              {project.status === "deploying" && (
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">🚀</div>
                  <h2 className="text-2xl font-bold text-text-DEFAULT">
                    Deployment in Progress
                  </h2>
                  <p className="text-text-muted">
                    Your business application is being deployed to production. This usually takes 2-5 minutes.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      <span className="text-sm font-medium text-blue-900">Deploying...</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Please refresh this page in a few minutes to check the deployment status.
                    </p>
                  </div>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="secondary"
                    size="lg"
                  >
                    🔄 Refresh Status
                  </Button>
                </div>
              )}

              {/* Failed Status */}
              {project.status === "failed" && (
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">❌</div>
                  <h2 className="text-2xl font-bold text-text-DEFAULT">
                    Deployment Failed
                  </h2>
                  <p className="text-text-muted">
                    Unfortunately, there was an issue deploying your application. This is usually temporary.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-800">
                      <strong>What you can do:</strong>
                    </p>
                    <ul className="text-sm text-red-700 mt-2 space-y-1 text-left">
                      <li>• Wait a few minutes and try deploying again</li>
                      <li>• Check if your UX design has any issues</li>
                      <li>• Contact support if the problem persists</li>
                    </ul>
                  </div>
                  <Button
                    href={`/ux/preview/${project.id}`}
                    variant="primary"
                    size="lg"
                  >
                    🔄 Try Deploying Again
                  </Button>
                </div>
              )}

              {/* Unknown/Other Status */}
              {!project.deploymentLink && project.status !== "deploying" && project.status !== "failed" && (
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">⏳</div>
                  <h2 className="text-2xl font-bold text-text-DEFAULT">
                    Deployment Status Unavailable
                  </h2>
                  <p className="text-text-muted">
                    We couldn&apos;t determine the current deployment status for this project.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-sm text-yellow-800">
                      This project may need to go through the UX preview stage before deployment.
                    </p>
                  </div>
                  <Button
                    href={`/ux/preview/${project.id}`}
                    variant="primary"
                    size="lg"
                  >
                    ← Back to UX Preview
                  </Button>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex gap-3 w-full justify-center">
              <Button
                href="/idea"
                variant="secondary"
                size="lg"
              >
                💡 Start New Idea
              </Button>
              
              <Button
                href="/"
                variant="ghost"
                size="lg"
              >
                🏠 Back to Home
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}