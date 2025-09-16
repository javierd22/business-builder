import React from "react";
import { Card, CardContent } from "@/app/_components/ui/Card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-beige py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Card>
          <CardContent>
            <div className="animate-pulse space-y-6">
              {/* Header skeleton */}
              <div className="space-y-3">
                <div className="h-8 bg-metal-silverLight rounded-xl w-1/3" />
                <div className="h-4 bg-metal-silverLight rounded-lg w-2/3" />
              </div>

              {/* Content skeleton */}
              <div className="space-y-4">
                <div className="h-4 bg-metal-silverLight rounded-lg w-full" />
                <div className="h-4 bg-metal-silverLight rounded-lg w-5/6" />
                <div className="h-4 bg-metal-silverLight rounded-lg w-4/6" />
                <div className="h-4 bg-metal-silverLight rounded-lg w-3/4" />
              </div>

              {/* Large content block */}
              <div className="h-64 bg-metal-silverLight rounded-xl" />

              {/* Button skeleton */}
              <div className="h-12 bg-metal-silverLight rounded-xl w-1/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}