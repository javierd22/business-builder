import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/app/_components/ui/Card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-beige py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Card>
          <CardHeader>
            <div className="animate-pulse space-y-3">
              <div className="h-8 bg-metal-silverLight rounded-xl w-2/3" />
              <div className="h-4 bg-metal-silverLight rounded-lg w-1/2" />
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="animate-pulse space-y-6">
              <div className="space-y-2">
                <div className="h-4 bg-metal-silverLight rounded-lg w-1/4" />
                <div className="h-64 bg-metal-silverLight rounded-xl" />
                <div className="h-3 bg-metal-silverLight rounded w-3/4" />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="animate-pulse flex gap-3 w-full">
              <div className="h-12 bg-metal-silverLight rounded-xl w-32" />
              <div className="h-12 bg-metal-silverLight rounded-xl flex-1" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}