"use client";

import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F4EDE2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <CardTitle as="h1" className="text-red-600">
              Something went wrong
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-[#6B7280]">
              We encountered an unexpected error while processing your request. 
              This has been logged and our team will investigate.
            </p>
            
            <p className="text-sm text-[#6B7280]">
              You can try again, or if the problem persists, please contact support.
            </p>

            {error.digest && (
              <div className="bg-gray-50 border border-[#E5E9EF] rounded-lg p-3">
                <p className="text-xs text-[#6B7280] font-mono">
                  Error ID: {error.digest}
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <div className="flex gap-3 w-full">
              <Button
                onClick={reset}
                variant="primary"
                size="large"
                className="flex-1"
              >
                Try Again
              </Button>
              
              <Button
                href="/"
                variant="secondary"
                size="large"
                className="flex-1"
              >
                Go Home
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}