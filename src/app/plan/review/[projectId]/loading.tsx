import React from "react";

export default function PlanReviewLoading() {
  return (
    <div className="min-h-screen bg-[#F4EDE2] py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="bg-white border border-[#E5E9EF] rounded-xl shadow-sm p-6">
          <div 
            className="animate-pulse space-y-6"
            role="status" 
            aria-live="polite"
            aria-label="Loading PRD review"
          >
            {/* Header skeleton */}
            <div className="space-y-3">
              <div className="h-8 bg-[#E5E9EF] rounded w-2/3" />
              <div className="h-4 bg-[#E5E9EF] rounded w-1/2" />
            </div>

            {/* Large content area skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-[#E5E9EF] rounded w-1/4" />
              <div className="h-64 bg-[#E5E9EF] rounded w-full" />
            </div>

            {/* Footer buttons skeleton */}
            <div className="flex gap-3 pt-4 border-t border-[#E5E9EF]">
              <div className="h-10 bg-[#E5E9EF] rounded w-28" />
              <div className="h-10 bg-[#E5E9EF] rounded flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
