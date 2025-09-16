import React from "react";
import { Card, CardContent } from "@/app/_components/ui/Card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F4EDE2] flex items-center justify-center p-4">
      <Card>
        <CardContent>
          <div 
            className="flex items-center justify-center py-12"
            role="status" 
            aria-live="polite"
          >
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent mx-auto mb-4" />
              <p className="text-[#6B7280]">Loading...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
