"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/app/_components/ui/Button";

interface EmptyStateProps {
  title: string;
  message: string;
  primaryAction?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  icon?: React.ReactNode;
  illustration?: string;
}

export default function EmptyState({
  title,
  message,
  primaryAction,
  secondaryAction,
  icon,
  illustration,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6">
      <div className="mx-auto max-w-md">
        {/* Icon or Illustration */}
        <div className="mb-6">
          {illustration ? (
            <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] shadow-[0_2px_8px_rgba(247,220,111,0.3)] flex items-center justify-center">
              <span className="text-4xl">{illustration}</span>
            </div>
          ) : icon ? (
            <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] shadow-[0_2px_8px_rgba(247,220,111,0.3)] flex items-center justify-center">
              {icon}
            </div>
          ) : (
            <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] border border-[#E8E9EA] flex items-center justify-center">
              <svg className="h-12 w-12 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-[#4A5568] mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-[#6B7280] mb-8 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              className="bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02]"
            >
              {primaryAction.href ? (
                <Link href={primaryAction.href} className="inline-flex items-center">
                  {primaryAction.label}
                </Link>
              ) : (
                primaryAction.label
              )}
            </Button>
          )}

          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="secondary"
              className="border border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] text-[#4A5568] hover:from-[#F1F2F4] hover:to-[#E9ECEF] hover:border-[#D1D5DB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D1D5DB] transition-all"
            >
              {secondaryAction.href ? (
                <Link href={secondaryAction.href} className="inline-flex items-center">
                  {secondaryAction.label}
                </Link>
              ) : (
                secondaryAction.label
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Predefined empty states for common scenarios
export const EmptyStates = {
  noProjects: (
    <EmptyState
      title="No projects yet"
      message="Start building your first business idea and watch it come to life with structured plans and professional presentations."
      primaryAction={{
        label: "Start Your First Idea",
        href: "/idea",
      }}
      illustration="💡"
    />
  ),

  noPRD: (
    <EmptyState
      title="No PRD generated yet"
      message="Generate a comprehensive Product Requirements Document to define your business concept and requirements."
      primaryAction={{
        label: "Generate PRD Now",
        href: "/idea",
      }}
      secondaryAction={{
        label: "View All Projects",
        href: "/dashboard",
      }}
      illustration="📋"
    />
  ),

  noUX: (
    <EmptyState
      title="No UX design yet"
      message="Create a detailed UX specification to define the user experience and interface design for your project."
      primaryAction={{
        label: "Generate UX Design",
        href: "/idea",
      }}
      secondaryAction={{
        label: "View All Projects",
        href: "/dashboard",
      }}
      illustration="🎨"
    />
  ),

  noDeployment: (
    <EmptyState
      title="Not deployed yet"
      message="Deploy your project to make it live and accessible to users. Your PRD and UX design are ready to go."
      primaryAction={{
        label: "Deploy Project",
        href: "/idea",
      }}
      secondaryAction={{
        label: "View All Projects",
        href: "/dashboard",
      }}
      illustration="🚀"
    />
  ),

  projectNotFound: (
    <EmptyState
      title="Project not found"
      message="The project you're looking for doesn't exist or may have been deleted."
      primaryAction={{
        label: "Start New Project",
        href: "/idea",
      }}
      secondaryAction={{
        label: "View All Projects",
        href: "/dashboard",
      }}
      illustration="🔍"
    />
  ),

  error: (
    <EmptyState
      title="Something went wrong"
      message="We encountered an error while processing your request. Please try again or contact support if the issue persists."
      primaryAction={{
        label: "Try Again",
        href: "/",
      }}
      secondaryAction={{
        label: "Go Home",
        href: "/",
      }}
      illustration="⚠️"
    />
  ),
};
