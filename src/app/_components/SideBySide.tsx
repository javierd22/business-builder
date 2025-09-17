'use client';

import React, { useState } from 'react';
import { Button } from '@/app/_components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/Card';
import DiffView from './DiffView';

export interface ComparableRun {
  id: string;
  provider: string;
  model: string;
  paramsHash: string;
  outputText: string;
  ms: number;
  ok: boolean;
  createdAt: string;
  temperature?: number;
  depth?: string;
  format?: string;
  promptVersion?: string;
}

interface SideBySideProps {
  runs: ComparableRun[];
  onClose?: () => void;
  className?: string;
}

export default function SideBySide({ runs, onClose, className = '' }: SideBySideProps) {
  const [leftRunId, setLeftRunId] = useState<string>('');
  const [rightRunId, setRightRunId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'raw' | 'diff'>('raw');

  const leftRun = runs.find(run => run.id === leftRunId);
  const rightRun = runs.find(run => run.id === rightRunId);

  const formatParams = (run: ComparableRun) => {
    const parts = [];
    if (run.temperature !== undefined) parts.push(`T: ${run.temperature}`);
    if (run.depth) parts.push(`D: ${run.depth}`);
    if (run.format) parts.push(`F: ${run.format}`);
    if (run.promptVersion) parts.push(`V: ${run.promptVersion}`);
    return parts.join(', ');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className={`side-by-side ${className}`}>
      <Card className="border-[#E5D5B7]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#8B6914]">Compare Runs</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setViewMode('raw')}
                variant={viewMode === 'raw' ? 'primary' : 'secondary'}
                size="sm"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
              >
                Raw
              </Button>
              <Button
                onClick={() => setViewMode('diff')}
                variant={viewMode === 'diff' ? 'primary' : 'secondary'}
                size="sm"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                disabled={!leftRun || !rightRun}
              >
                Diff
              </Button>
              {onClose && (
                <Button
                  onClick={onClose}
                  variant="secondary"
                  size="sm"
                  className="border-[#E5D5B7] text-[#8B6914] hover:bg-[#F5F0E8]"
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Run Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label htmlFor="left-run" className="block text-sm font-medium text-[#8B6914]">
                Left Run
              </label>
              <select
                id="left-run"
                value={leftRunId}
                onChange={(e) => setLeftRunId(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5D5B7] rounded-lg bg-white text-[#4A5568] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                <option value="">Select a run...</option>
                {runs.map(run => (
                  <option key={run.id} value={run.id}>
                    {run.provider} {run.model} - {new Date(run.createdAt).toLocaleString()} ({run.ms}ms)
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="right-run" className="block text-sm font-medium text-[#8B6914]">
                Right Run
              </label>
              <select
                id="right-run"
                value={rightRunId}
                onChange={(e) => setRightRunId(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5D5B7] rounded-lg bg-white text-[#4A5568] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                <option value="">Select a run...</option>
                {runs.map(run => (
                  <option key={run.id} value={run.id}>
                    {run.provider} {run.model} - {new Date(run.createdAt).toLocaleString()} ({run.ms}ms)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Content */}
          {leftRun && rightRun ? (
            viewMode === 'raw' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Panel */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-[#8B6914]">
                      {leftRun.provider} {leftRun.model}
                    </div>
                    <Button
                      onClick={() => copyToClipboard(leftRun.outputText)}
                      size="sm"
                      variant="secondary"
                      className="text-xs border-[#E5D5B7] text-[#8B6914] hover:bg-[#F5F0E8]"
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="text-xs text-[#6B7280] mb-2">
                    {formatParams(leftRun)} • {leftRun.ms}ms • {new Date(leftRun.createdAt).toLocaleString()}
                  </div>
                  <div className="border border-[#E5D5B7] rounded-lg p-4 bg-[#FBF9F4] max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-[#4A5568] font-mono">
                      {leftRun.outputText}
                    </pre>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-[#8B6914]">
                      {rightRun.provider} {rightRun.model}
                    </div>
                    <Button
                      onClick={() => copyToClipboard(rightRun.outputText)}
                      size="sm"
                      variant="secondary"
                      className="text-xs border-[#E5D5B7] text-[#8B6914] hover:bg-[#F5F0E8]"
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="text-xs text-[#6B7280] mb-2">
                    {formatParams(rightRun)} • {rightRun.ms}ms • {new Date(rightRun.createdAt).toLocaleString()}
                  </div>
                  <div className="border border-[#E5D5B7] rounded-lg p-4 bg-[#FBF9F4] max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-[#4A5568] font-mono">
                      {rightRun.outputText}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Diff Header */}
                <div className="flex items-center justify-between text-sm text-[#8B6914]">
                  <div>
                    Comparing: {leftRun.provider} {leftRun.model} vs {rightRun.provider} {rightRun.model}
                  </div>
                  <div className="text-xs text-[#6B7280]">
                    {leftRun.ms}ms vs {rightRun.ms}ms
                  </div>
                </div>

                {/* Diff Content */}
                <div className="border border-[#E5D5B7] rounded-lg p-4 bg-[#FBF9F4] max-h-96 overflow-y-auto">
                  <DiffView 
                    leftText={leftRun.outputText}
                    rightText={rightRun.outputText}
                  />
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-8 text-[#6B7280]">
              <p>Select two runs to compare</p>
              <p className="text-xs mt-1">Choose runs from the dropdowns above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
