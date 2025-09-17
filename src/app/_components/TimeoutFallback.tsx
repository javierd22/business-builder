"use client";

import React from 'react';
import { Card, CardContent } from '@/app/_components/ui/Card';
import { Button } from '@/app/_components/ui/Button';

interface TimeoutFallbackProps {
  step: 'plan' | 'ux';
  fallbackAttempted: boolean;
  onTryBrief: () => void;
  onRetry: () => void;
  onDismiss: () => void;
}

const TimeoutFallback: React.FC<TimeoutFallbackProps> = ({
  step,
  fallbackAttempted,
  onTryBrief,
  onRetry,
  onDismiss,
}) => {
  const stepName = step === 'plan' ? 'Business Plan' : 'UX Design';
  
  return (
    <div role="alert" aria-live="polite">
      <Card className="border border-yellow-200 bg-yellow-50 shadow-sm">
        <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-yellow-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              {stepName} Generation Taking Longer Than Expected
            </h3>
            
            <div className="text-sm text-yellow-700 mb-4">
              {fallbackAttempted ? (
                <>
                  We tried a lighter version but it&apos;s still taking longer than usual. 
                  This might be due to high server load or network conditions.
                </>
              ) : (
                <>
                  This is taking longer than expected. We&apos;re trying a lighter version 
                  that should be faster while maintaining quality.
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onTryBrief}
                className="bg-[#D4A574] hover:bg-[#C19660] text-white focus-visible:ring-[#F7DC6F]"
                aria-describedby="brief-description"
              >
                Try Brief Version Now
              </Button>
              
              <Button
                onClick={onRetry}
                variant="secondary"
                className="border-yellow-300 text-yellow-800 hover:bg-yellow-100 focus-visible:ring-[#F7DC6F]"
              >
                Try Again
              </Button>
              
              <Button
                onClick={onDismiss}
                variant="ghost"
                className="text-yellow-700 hover:bg-yellow-100 focus-visible:ring-[#F7DC6F]"
              >
                Dismiss
              </Button>
            </div>
            
            <div id="brief-description" className="text-xs text-yellow-600 mt-2">
              Brief version uses simplified prompts for faster generation
            </div>
          </div>
        </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeoutFallback;

