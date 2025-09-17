'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/app/_components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/Card';
import { createPlan, createUX } from '@/lib/api';
import { saveRun, type EvalRun, type EvalParams, type EvalStep } from '@/lib/eval-store';
import { listItems, type EvalItem } from '@/lib/evalsets';

interface EvalRunnerProps {
  setId: string;
  step: EvalStep;
  params: EvalParams;
  providerOverride?: 'anthropic' | 'openai';
  modelOverride?: string;
  concurrency?: number;
  onProgress?: (current: number, total: number, item: EvalItem, status: 'running' | 'success' | 'error') => void;
  onComplete?: () => void;
  className?: string;
}

interface RunStatus {
  itemId: string;
  status: 'pending' | 'running' | 'success' | 'error';
  run?: EvalRun;
  error?: string;
  startTime?: number;
}

export default function EvalRunner({
  setId,
  step,
  params,
  providerOverride,
  modelOverride,
  concurrency = 1,
  onProgress,
  onComplete,
  className = '',
}: EvalRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [runStatuses, setRunStatuses] = useState<RunStatus[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  const items = listItems(setId);
  const completedCount = runStatuses.filter(status => status.status === 'success' || status.status === 'error').length;
  const successCount = runStatuses.filter(status => status.status === 'success').length;
  const errorCount = runStatuses.filter(status => status.status === 'error').length;
  const progress = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

  const runEvaluation = useCallback(async (item: EvalItem, index: number): Promise<void> => {
    const startTime = Date.now();
    
    // Update status to running
    setRunStatuses(prev => prev.map((status, i) => 
      i === index ? { ...status, status: 'running', startTime } : status
    ));
    
    onProgress?.(index + 1, totalItems, item, 'running');

    try {
      let result;
      
      if (step === 'plan') {
        result = await createPlan(
          item.idea,
          item.persona,
          item.job,
          {
            temperature: params.temperature,
            depth: params.depth,
            format: params.format,
            revision: params.revision,
            promptVersion: params.promptVersion,
            providerOverride,
            modelOverride,
          }
        );
      } else {
        result = await createUX(
          item.idea, // For UX, we need the PRD, but we'll use the idea for now
          item.persona,
          item.job,
          {
            temperature: params.temperature,
            depth: params.depth,
            format: params.format,
            revision: params.revision,
            promptVersion: params.promptVersion,
            providerOverride,
            modelOverride,
          }
        );
      }

      // Save the run
      const outputText = step === 'plan' ? 
        (result as { prd: string }).prd : 
        (result as { ux: string }).ux;
      const evalRun = saveRun({
        setId,
        itemId: item.id,
        step,
        provider: providerOverride || 'anthropic', // Default provider
        model: modelOverride || 'claude-3-5-sonnet', // Default model
        promptVersion: params.promptVersion,
        params,
        inputSummary: `${item.idea}${item.persona ? ` (${item.persona})` : ''}${item.job ? ` - ${item.job}` : ''}`,
        outputText,
        ok: true,
        ms: Date.now() - startTime,
        meta: {
          provider: providerOverride,
          model: modelOverride,
          ...(result as { meta: Record<string, unknown> }).meta,
        },
      });

      // Update status to success
      setRunStatuses(prev => prev.map((status, i) => 
        i === index ? { ...status, status: 'success', run: evalRun } : status
      ));
      
      onProgress?.(index + 1, totalItems, item, 'success');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Update status to error
      setRunStatuses(prev => prev.map((status, i) => 
        i === index ? { ...status, status: 'error', error: errorMessage } : status
      ));
      
      onProgress?.(index + 1, totalItems, item, 'error');
    }
  }, [setId, step, params, providerOverride, modelOverride, totalItems, onProgress]);

  const startEvaluation = async () => {
    if (items.length === 0) return;
    
    setIsRunning(true);
    setIsPaused(false);
    setCurrentIndex(0);
    setTotalItems(items.length);
    
    // Initialize run statuses
    const initialStatuses: RunStatus[] = items.map(item => ({
      itemId: item.id,
      status: 'pending',
    }));
    setRunStatuses(initialStatuses);
    
    // Process items with concurrency control
    const processItems = async () => {
      for (let i = 0; i < items.length; i++) {
        if (isPaused) {
          setCurrentIndex(i);
          return; // Pause evaluation
        }
        
        setCurrentIndex(i);
        await runEvaluation(items[i], i);
        
        // Add delay between items if needed
        if (i < items.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Evaluation complete
      setIsRunning(false);
      onComplete?.();
    };
    
    processItems();
  };

  const pauseEvaluation = () => {
    setIsPaused(true);
  };

  const resumeEvaluation = async () => {
    setIsPaused(false);
    
    // Resume from current index
    for (let i = currentIndex; i < items.length; i++) {
      if (isPaused) {
        setCurrentIndex(i);
        return;
      }
      
      setCurrentIndex(i);
      await runEvaluation(items[i], i);
      
      if (i < items.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    setIsRunning(false);
    onComplete?.();
  };

  const cancelEvaluation = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentIndex(0);
    setRunStatuses([]);
  };

  const resetEvaluation = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentIndex(0);
    setRunStatuses([]);
    setTotalItems(0);
  };

  return (
    <Card className={`eval-runner ${className} border-[#E5D5B7]`}>
      <CardHeader>
        <CardTitle className="text-[#8B6914]">
          Evaluation Runner - {step === 'plan' ? 'Plan Generation' : 'UX Generation'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {totalItems > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-[#8B6914]">
              <span>Progress: {completedCount} / {totalItems}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-[#E5D5B7] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span>✅ {successCount} successful</span>
              <span>❌ {errorCount} failed</span>
              <span>⏱️ {Math.round(progress)}% complete</span>
            </div>
          </div>
        )}

        {/* Current Item Status */}
        {isRunning && currentIndex < items.length && (
          <div className="p-3 bg-[#FBF9F4] border border-[#E5D5B7] rounded-lg">
            <div className="text-sm font-medium text-[#8B6914] mb-1">
              Processing item {currentIndex + 1} of {totalItems}
            </div>
            <div className="text-xs text-[#6B7280] truncate">
              {items[currentIndex]?.idea}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <Button
              onClick={startEvaluation}
              disabled={items.length === 0}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white focus:ring-2 focus:ring-[#D4AF37]"
            >
              Start Evaluation
            </Button>
          ) : isPaused ? (
            <Button
              onClick={resumeEvaluation}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white focus:ring-2 focus:ring-[#D4AF37]"
            >
              Resume
            </Button>
          ) : (
            <Button
              onClick={pauseEvaluation}
              variant="secondary"
              className="border-[#E5D5B7] text-[#8B6914] hover:bg-[#F5F0E8] focus:ring-2 focus:ring-[#D4AF37]"
            >
              Pause
            </Button>
          )}
          
          {isRunning && (
            <Button
              onClick={cancelEvaluation}
              variant="secondary"
              className="border-red-200 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </Button>
          )}
          
          {!isRunning && totalItems > 0 && (
            <Button
              onClick={resetEvaluation}
              variant="secondary"
              className="border-[#E5D5B7] text-[#8B6914] hover:bg-[#F5F0E8] focus:ring-2 focus:ring-[#D4AF37]"
            >
              Reset
            </Button>
          )}
        </div>

        {/* Evaluation Summary */}
        {totalItems > 0 && (
          <div className="text-xs text-[#6B7280] space-y-1">
            <div>Items in set: {items.length}</div>
            <div>Parameters: T={params.temperature}, D={params.depth}, F={params.format}</div>
            {providerOverride && <div>Provider override: {providerOverride}</div>}
            {modelOverride && <div>Model override: {modelOverride}</div>}
            <div>Concurrency: {concurrency}</div>
          </div>
        )}

        {/* Results Summary */}
        {completedCount > 0 && (
          <div className="p-3 bg-[#F8F4ED] border border-[#E5D5B7] rounded-lg">
            <div className="text-sm font-medium text-[#8B6914] mb-2">Results Summary</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-medium text-emerald-600">{successCount}</div>
                <div className="text-[#6B7280]">Successful</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-red-600">{errorCount}</div>
                <div className="text-[#6B7280]">Failed</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-[#8B6914]">{completedCount}</div>
                <div className="text-[#6B7280]">Total</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
