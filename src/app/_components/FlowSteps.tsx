"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface FlowStep {
  id: string;
  title: string;
  description: string;
  href: string;
  status: "completed" | "current" | "upcoming";
}

interface FlowStepsProps {
  currentStep: string;
  projectId?: string;
}

const STEPS = [
  {
    id: "idea",
    title: "Idea",
    description: "Describe your business concept",
    href: "/idea",
  },
  {
    id: "plan",
    title: "PRD Review",
    description: "Review your product requirements",
    href: "/plan/review",
  },
  {
    id: "ux",
    title: "UX Preview",
    description: "Preview your user experience",
    href: "/ux/preview",
  },
  {
    id: "deploy",
    title: "Deploy",
    description: "Launch your project",
    href: "/deploy",
  },
];

export default function FlowSteps({ currentStep, projectId }: FlowStepsProps) {
  
  const getStepStatus = (stepId: string, index: number): "completed" | "current" | "upcoming" => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStep);
    
    if (index < currentIndex) {
      return "completed";
    } else if (index === currentIndex) {
      return "current";
    } else {
      return "upcoming";
    }
  };

  const getStepHref = (step: typeof STEPS[0]) => {
    if (step.id === "idea") {
      return step.href;
    }
    
    if (projectId && (step.id === "plan" || step.id === "ux" || step.id === "deploy")) {
      return `${step.href}/${projectId}`;
    }
    
    return step.href;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-8">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const status = getStepStatus(step.id, index);
            const href = getStepHref(step);
            const isClickable = status === "completed" || status === "current" || (projectId && status === "upcoming");
            
            return (
              <li key={step.id} className="flex items-center">
                <div className="flex items-center">
                  {/* Step Circle */}
                  <div className="flex items-center">
                    {status === "completed" ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border-2 border-[#F7DC6F] shadow-[0_2px_8px_rgba(247,220,111,0.3)]">
                        <svg className="h-6 w-6 text-[#8B7355]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : status === "current" ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border-2 border-[#F7DC6F] shadow-[0_2px_8px_rgba(247,220,111,0.3)] ring-4 ring-[#F7DC6F] ring-opacity-30">
                        <div className="h-2 w-2 rounded-full bg-[#8B7355]"></div>
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4]">
                        <span className="text-sm font-medium text-[#6B7280]">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Step Content */}
                  <div className="ml-4 min-w-0">
                    {isClickable ? (
                      <Link
                        href={href}
                        className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] focus-visible:ring-offset-2 rounded-lg p-2 -m-2"
                      >
                        <span className={`text-sm font-medium ${
                          status === "completed" 
                            ? "text-[#8B7355]" 
                            : status === "current" 
                            ? "text-[#4A5568]" 
                            : "text-[#6B7280]"
                        }`}>
                          {step.title}
                        </span>
                        <p className={`text-xs ${
                          status === "completed" 
                            ? "text-[#8B7355]" 
                            : status === "current" 
                            ? "text-[#6B7280]" 
                            : "text-[#9CA3AF]"
                        }`}>
                          {step.description}
                        </p>
                      </Link>
                    ) : (
                      <div>
                        <span className={`text-sm font-medium ${
                          status === "completed" 
                            ? "text-[#8B7355]" 
                            : status === "current" 
                            ? "text-[#4A5568]" 
                            : "text-[#6B7280]"
                        }`}>
                          {step.title}
                        </span>
                        <p className={`text-xs ${
                          status === "completed" 
                            ? "text-[#8B7355]" 
                            : status === "current" 
                            ? "text-[#6B7280]" 
                            : "text-[#9CA3AF]"
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div className="ml-4 mr-4 flex-1">
                    <div className={`h-0.5 w-full ${
                      status === "completed" 
                        ? "bg-gradient-to-r from-[#F7DC6F] to-[#E8E9EA]" 
                        : "bg-[#E8E9EA]"
                    }`}></div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
