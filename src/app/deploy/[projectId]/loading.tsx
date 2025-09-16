import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/app/_components/ui/Card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-beige py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Card>
          <CardHeader>
            <div className="animate-pulse flex items-center justify-between">
              <div className="h-8 bg-metal-silverLight rounded-xl w-1/3" />
              <div className="h-6 bg-metal-silverLight rounded-full w-24" />
            </div>
            <div className="animate-pulse mt-3">
              <div className="h-4 bg-metal-silverLight rounded-lg w-2/3" />
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="animate-pulse space-y-6 text-center">
              <div className="h-16 bg-metal-silverLight rounded-xl w-16 mx-auto" />
              <div className="space-y-3">
                <div className="h-8 bg-metal-silverLight rounded-xl w-1/2 mx-auto" />
                <div className="h-4 bg-metal-silverLight rounded-lg w-3/4 mx-auto" />
              </div>
              <div className="h-24 bg-metal-silverLight rounded-xl" />
              <div className="h-12 bg-metal-silverLight rounded-xl w-1/3 mx-auto" />
            </div>
          </CardContent>

          <CardFooter>
            <div className="animate-pulse flex gap-3 w-full justify-center">
              <div className="h-12 bg-metal-silverLight rounded-xl w-32" />
              <div className="h-12 bg-metal-silverLight rounded-xl w-32" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}