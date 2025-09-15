// app/_components/BuildInfo.tsx
// Server Component: surfaces current deploy info on every page.
// Reads Vercel-provided env vars at render time. No client env needed.

import React from "react";

// Tailwind styles assume base styles are already configured in globals.css
// The badge anchors bottom-right, collapses on mobile, and can be hidden via an env flag.

function fmtSha(sha?: string) {
  if (!sha) return "unknown";
  return sha.slice(0, 7);
}

export default function BuildInfo() {
  const env = process.env.VERCEL_ENV ?? "unknown"; // production | preview | development
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? "unknown";
  const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? "unknown";
  const msg = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "";
  const author =
    process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN ??
    process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME ??
    "";
  const show =
    process.env.NEXT_PUBLIC_SHOW_BUILD_INFO?.toLowerCase() !== "false";

  // Build/render time stamp (server render time; good enough to prove freshness)
  const renderedAt = new Date().toISOString();

  if (!show) return null;

  return (
    <div
      aria-label="Build Info"
      className="fixed bottom-3 right-3 z-50 max-w-[90vw] rounded-2xl border border-gray-300 bg-white/95 px-3 py-2 shadow-lg backdrop-blur md:px-4"
    >
      <div className="flex items-center gap-3 text-xs text-gray-700">
        <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 font-medium">
          <Dot env={env} />
          <span className="uppercase tracking-wide">{env}</span>
        </span>
        <span className="truncate">
          <strong>branch:</strong> <code>{branch}</code>
        </span>
        <span className="truncate">
          <strong>sha:</strong> <code>{fmtSha(sha)}</code>
        </span>
        <span className="hidden md:inline truncate">
          <strong>by:</strong> <code>{author || "unknown"}</code>
        </span>
        <span className="hidden lg:inline truncate">
          <strong>msg:</strong>{" "}
          <code title={msg}>{msg ? clip(msg, 60) : "—"}</code>
        </span>
        <span className="hidden sm:inline truncate">
          <strong>rendered:</strong> <code>{renderedAt}</code>
        </span>
      </div>
    </div>
  );
}

function Dot({ env }: { env: string }) {
  const color =
    env === "production"
      ? "bg-emerald-500"
      : env === "preview"
      ? "bg-amber-500"
      : env === "development"
      ? "bg-sky-500"
      : "bg-gray-400";
  return <span className={`h-2 w-2 rounded-full ${color}`} />;
}

function clip(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
