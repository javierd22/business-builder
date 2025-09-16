import React from "react";

export default function GeneratorLoading() {
  return (
    <div className="min-h-screen bg-[#F4EDE2] py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="bg-white border border-[#E5E9EF] rounded-xl shadow-sm p-6">
          <div 
            className="animate-pulse space-y-6"
            role="status" 
            aria-live="polite"
            aria-label="Loading page content"
          >
            {/* Title skeleton */}
            <div className="space-y-3">
              <div className="h-8 bg-[#E5E9EF] rounded w-3/4" />
              <div className="h-4 bg-[#E5E9EF] rounded w-1/2" />
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-[#E5E9EF] rounded w-full" />
              <div className="h-4 bg-[#E5E9EF] rounded w-5/6" />
              <div className="h-4 bg-[#E5E9EF] rounded w-4/5" />
              <div className="h-4 bg-[#E5E9EF] rounded w-full" />
              <div className="h-4 bg-[#E5E9EF] rounded w-3/4" />
            </div>

            {/* Button skeleton */}
            <div className="flex gap-3 pt-4">
              <div className="h-10 bg-[#E5E9EF] rounded w-24" />
              <div className="h-10 bg-[#E5E9EF] rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
