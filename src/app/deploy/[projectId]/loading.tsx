import React from "react";

export default function DeployLoading() {
  return (
    <div className="min-h-screen bg-[#F4EDE2] py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="bg-white border border-[#E5E9EF] rounded-xl shadow-sm p-6">
          <div 
            className="animate-pulse space-y-6"
            role="status" 
            aria-live="polite"
            aria-label="Loading deployment status"
          >
            {/* Header skeleton */}
            <div className="space-y-3">
              <div className="h-8 bg-[#E5E9EF] rounded w-1/2" />
              <div className="h-4 bg-[#E5E9EF] rounded w-2/3" />
            </div>

            {/* Status content skeleton */}
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-[#E5E9EF] rounded-full mx-auto" />
              <div className="h-8 bg-[#E5E9EF] rounded w-1/2 mx-auto" />
              <div className="h-4 bg-[#E5E9EF] rounded w-3/4 mx-auto" />
              
              {/* Status box skeleton */}
              <div className="bg-gray-50 border border-[#E5E9EF] rounded-lg p-4 space-y-2">
                <div className="h-4 bg-[#E5E9EF] rounded w-1/3 mx-auto" />
                <div className="h-8 bg-[#E5E9EF] rounded w-full" />
              </div>
            </div>

            {/* Footer buttons skeleton */}
            <div className="flex gap-3 justify-center pt-4 border-t border-[#E5E9EF]">
              <div className="h-10 bg-[#E5E9EF] rounded w-32" />
              <div className="h-10 bg-[#E5E9EF] rounded w-28" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
