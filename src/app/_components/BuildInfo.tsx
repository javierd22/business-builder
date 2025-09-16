import React from "react";

export default function BuildInfo() {
  // Check if build info should be shown
  const showBuildInfo = process.env.NEXT_PUBLIC_SHOW_BUILD_INFO?.toLowerCase() === "true";
  
  if (!showBuildInfo) {
    return null;
  }

  // Get environment variables
  const env = process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || "local";
  const branch = process.env.VERCEL_GIT_COMMIT_REF || "main";
  const author = process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME || "Developer";
  const message = process.env.VERCEL_GIT_COMMIT_MESSAGE || "Local development";
  const timestamp = new Date().toLocaleString();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-metal-silverLight rounded-xl shadow-soft p-3 text-xs text-text-muted max-w-xs">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-text-DEFAULT">Build Info</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              env === "production" 
                ? "bg-green-100 text-green-700" 
                : env === "preview" 
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}>
              {env}
            </span>
          </div>
          
          <div className="space-y-0.5">
            <div>
              <span className="font-medium">SHA:</span> {sha}
            </div>
            <div>
              <span className="font-medium">Branch:</span> {branch}
            </div>
            <div>
              <span className="font-medium">Author:</span> {author}
            </div>
            <div className="truncate">
              <span className="font-medium">Message:</span> {message}
            </div>
            <div>
              <span className="font-medium">Rendered:</span> {timestamp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}