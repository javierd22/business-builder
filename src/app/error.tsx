"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  React.useEffect(() => {
    // Log the error for debugging
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-beige py-12">
      <div className="mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader>
            <CardTitle as="h1" className="text-center text-red-600 text-2xl">
              Something went wrong
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="text-6xl mb-4">😓</div>
            
            <div className="space-y-2">
              <p className="text-text-DEFAULT">
                We encountered an unexpected error while loading this page.
              </p>
              <p className="text-sm text-text-muted">
                This has been automatically reported to our team.
              </p>
            </div>

            {error.digest && (
              <div className="bg-gray-50 border border-metal-silverLight rounded-xl p-3">
                <p className="text-xs text-text-muted">
                  <strong>Error ID:</strong> {error.digest}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                onClick={reset}
                variant="primary"
                size="lg"
              >
                Try Again
              </Button>
              
              <Button
                href="/"
                variant="secondary"
                size="lg"
              >
                Go Home
              </Button>
            </div>

            <div className="pt-6 border-t border-metal-silverLight">
              <p className="text-xs text-text-muted">
                If this problem persists, please contact support with the error ID above.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}