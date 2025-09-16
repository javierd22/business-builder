"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";
import { Textarea } from "@/app/_components/ui/Textarea";
import { getProject, updateProject } from "@/lib/storage";
import { createUX } from "@/lib/api";
import type { Project } from "@/lib/storage";

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

      // Update project with UX and new status
      updateProject(project.id, {
        ux: uxResponse.ux,
        status: "ux_design",
      });

      // Navigate to UX preview
      router.push(`/ux/preview/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError("");
    handleGenerateUX();
  };

  const handleEditInput = () => {
    setError("");
  };

  const handleTrySample = () => {
    setError("");
    
    const samplePRD = `# Sample Product Requirements Document

## Executive Summary
AI-powered personal finance assistant for budget management and financial planning.

## Problem Statement
Users struggle to track expenses and create effective budgets without personalized guidance.

## Target Audience
- **Primary:** Working professionals aged 25-45
- **Secondary:** Small business owners
- **Tertiary:** College students learning financial management

## Core Features
1. **Expense Tracking** - Automatic categorization of transactions
2. **Budget Creation** - Smart budget templates and monitoring
3. **Financial Advice** - Personalized recommendations and insights
4. **Goal Setting** - Progress tracking for financial objectives
5. **Bill Reminders** - Automated payment scheduling and alerts

## Technical Requirements
- Mobile-first responsive design
- Real-time data synchronization
- Bank-level security and encryption
- Integration with financial institutions`;

    setPrd(samplePRD);
    
    setTimeout(() => {
      handleGenerateUX();
    }, 100);
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
                  <p className="text-text-muted">Loading project...</p>
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
      <div className="min-h-screen bg-brand-beige py-12">
        <div className="mx-auto max-w-2xl px-4">
          <Card>
            <CardHeader>
              <CardTitle as="h1" className="text-center text-red-600">
                PRD Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-text-muted">
                {!project 
                  ? "This project doesn&apos;t exist or has been deleted."
                  : "This project doesn&apos;t have a Product Requirements Document yet."
                }
              </p>
              <p className="text-sm text-text-muted">
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
    <div className="min-h-screen bg-brand-beige py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle as="h1" className="text-2xl">
                Review Product Requirements Document
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <div className="h-2 w-2 rounded-full bg-brand-gold" />
                <span>Planning Phase</span>
              </div>
            </div>
            <p className="text-sm text-text-muted mt-2">
              <strong>Project:</strong> {project.idea}
            </p>
          </CardHeader>
          
          <CardContent>
            <div 
              className="space-y-6"
              aria-live="polite"
            >
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
                size="lg"
              >
                ← Back to Ideas
              </Button>
              
              <Button
                onClick={handleGenerateUX}
                variant="primary"
                size="lg"
                loading={isLoading}
                disabled={isLoading || !prd.trim()}
                className="flex-1"
              >
                {isLoading ? "Generating UX..." : "Generate User Experience"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}