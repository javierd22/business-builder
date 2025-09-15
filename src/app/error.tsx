// src/app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for debugging (Vercel Functions / browser console in dev)
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Something went wrong</h1>
        <p className="mt-2 text-gray-600">
          An error occurred while rendering this page. You can try again or go back home.
        </p>
        {error?.digest ? (
          <p className="mt-2 text-xs text-gray-500">Digest: {error.digest}</p>
        ) : null}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
