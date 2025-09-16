import React from "react";

/**
 * BuildInfo badge showing deployment information
 * Server component that reads Vercel environment variables
 */

function formatSha(sha?: string): string {
  if (!sha) return "unknown";
  return sha.slice(0, 7);
}

function formatMessage(message?: string, maxLength = 50): string {
  if (!message) return "—";
  return message.length > maxLength ? message.slice(0, maxLength - 1) + "…" : message;
}

function getStatusColor(env?: string): string {
  switch (env) {
    case "production":
      return "bg-green-500";
    case "preview":
      return "bg-yellow-500";
    case "development":
      return "bg-blue-500";
    default:
      return "bg-gray-400";
  }
}

export default function BuildInfo() {
  // Check if badge should be shown (defaults to true in development)
  const showBuildInfo = process.env.NEXT_PUBLIC_SHOW_BUILD_INFO?.toLowerCase() !== "false";
  
  if (!showBuildInfo) {
    return null;
  }

  // Vercel environment variables
  const env = process.env.VERCEL_ENV ?? "development";
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? "unknown";
  const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? "unknown";
  const message = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "";
  const author = process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN ?? 
                 process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME ?? 
                 "unknown";

  // Render timestamp (server render time)
  const renderedAt = new Date().toISOString();

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 max-w-[90vw] sm:max-w-md"
      aria-label="Build Information"
    >
      <div className="bg-white/95 backdrop-blur border border-[#E5E9EF] rounded-xl shadow-sm p-3 text-xs">
        <div className="flex items-center gap-3 text-[#6B7280]">
          {/* Environment badge */}
          <div className="flex items-center gap-1.5 bg-[#F4EDE2] border border-[#E5E9EF] rounded-full px-2 py-1">
            <div className={`h-2 w-2 rounded-full ${getStatusColor(env)}`} />
            <span className="font-medium uppercase tracking-wide text-[#1F2937]">
              {env}
            </span>
          </div>

          {/* Build details */}
          <div className="flex items-center gap-3 text-[#6B7280] overflow-hidden">
            <span className="hidden sm:inline">
              <strong>branch:</strong> <code className="text-[#1F2937]">{branch}</code>
            </span>
            
            <span>
              <strong>sha:</strong> <code className="text-[#1F2937]">{formatSha(sha)}</code>
            </span>
            
            <span className="hidden md:inline">
              <strong>by:</strong> <code className="text-[#1F2937]">{author}</code>
            </span>
          </div>
        </div>

        {/* Additional details on larger screens */}
        <div className="hidden lg:block mt-2 pt-2 border-t border-[#E5E9EF] space-y-1">
          <div className="text-[#6B7280]">
            <strong>message:</strong>{" "}
            <code className="text-[#1F2937]" title={message}>
              {formatMessage(message)}
            </code>
          </div>
          <div className="text-[#6B7280]">
            <strong>rendered:</strong>{" "}
            <code className="text-[#1F2937]">{renderedAt}</code>
          </div>
        </div>
      </div>
    </div>
  );
}