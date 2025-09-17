/**
 * Evaluation run storage and management
 * Stores evaluation results with provider/model tracking
 */

import { createRunId, hashParams } from './hash';

export type EvalStep = 'plan' | 'ux';

export interface EvalParams {
  temperature: number;
  depth: 'brief' | 'standard' | 'deep';
  format: 'markdown' | 'bulleted';
  revision?: string;
  promptVersion?: string;
}

export interface EvalRun {
  id: string;
  setId: string;
  itemId: string;
  step: EvalStep;
  provider: string;
  model: string;
  promptVersion?: string;
  params: EvalParams;
  paramsHash: string;
  inputSummary: string;
  outputText: string;
  ok: boolean;
  ms: number;
  meta?: Record<string, unknown>;
  createdAt: string;
}

const EVAL_RUNS_KEY = 'business_builder_eval_runs';

/**
 * Check if we're in a client environment
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get all evaluation runs
 */
function getRuns(): EvalRun[] {
  if (!isClient()) return [];
  try {
    const stored = localStorage.getItem(EVAL_RUNS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to parse evaluation runs from localStorage', error);
    return [];
  }
}

/**
 * Save evaluation runs
 */
function saveRuns(runs: EvalRun[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(EVAL_RUNS_KEY, JSON.stringify(runs));
  } catch (error) {
    console.error('Failed to save evaluation runs to localStorage', error);
  }
}

/**
 * Save a new evaluation run
 */
export function saveRun(run: Omit<EvalRun, 'id' | 'paramsHash' | 'createdAt'>): EvalRun {
  const runs = getRuns();
  const now = new Date().toISOString();
  
  const newRun: EvalRun = {
    id: createRunId(),
    paramsHash: hashParams(run.params),
    createdAt: now,
    ...run,
  };
  
  runs.push(newRun);
  saveRuns(runs);
  
  return newRun;
}

/**
 * List runs for a specific item and step
 */
export function listRunsByItem(setId: string, itemId: string, step?: EvalStep): EvalRun[] {
  return getRuns()
    .filter(run => 
      run.setId === setId && 
      run.itemId === itemId && 
      (step === undefined || run.step === step)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Get the latest run for a specific item and step
 */
export function latestRun(setId: string, itemId: string, step: EvalStep): EvalRun | undefined {
  const runs = listRunsByItem(setId, itemId, step);
  return runs[0];
}

/**
 * Find comparable runs (same item, step, and params)
 */
export function findComparableRuns(setId: string, itemId: string, step: EvalStep): Record<string, EvalRun[]> {
  const runs = listRunsByItem(setId, itemId, step);
  const grouped: Record<string, EvalRun[]> = {};
  
  runs.forEach(run => {
    const key = `${run.provider}_${run.model}_${run.paramsHash}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(run);
  });
  
  return grouped;
}

/**
 * Get all runs for a set
 */
export function listRunsBySet(setId: string, step?: EvalStep): EvalRun[] {
  return getRuns()
    .filter(run => 
      run.setId === setId && 
      (step === undefined || run.step === step)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Get runs grouped by provider and model
 */
export function getRunsByProvider(setId: string, step?: EvalStep): Record<string, EvalRun[]> {
  const runs = listRunsBySet(setId, step);
  const grouped: Record<string, EvalRun[]> = {};
  
  runs.forEach(run => {
    const key = `${run.provider}_${run.model}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(run);
  });
  
  return grouped;
}

/**
 * Get summary statistics for a set
 */
export function getSetSummary(setId: string): {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageMs: number;
  providers: string[];
  steps: { plan: number; ux: number };
} {
  const runs = listRunsBySet(setId);
  
  const successfulRuns = runs.filter(run => run.ok).length;
  const failedRuns = runs.length - successfulRuns;
  const averageMs = runs.length > 0 ? runs.reduce((sum, run) => sum + run.ms, 0) / runs.length : 0;
  
  const providers = [...new Set(runs.map(run => run.provider))];
  
  const planRuns = runs.filter(run => run.step === 'plan').length;
  const uxRuns = runs.filter(run => run.step === 'ux').length;
  
  return {
    totalRuns: runs.length,
    successfulRuns,
    failedRuns,
    averageMs: Math.round(averageMs),
    providers,
    steps: { plan: planRuns, ux: uxRuns },
  };
}

/**
 * Clear all runs for a set
 */
export function clearRunsForSet(setId: string): boolean {
  const runs = getRuns();
  const filtered = runs.filter(run => run.setId !== setId);
  
  if (filtered.length === runs.length) return false;
  
  saveRuns(filtered);
  return true;
}

/**
 * Delete a specific run
 */
export function deleteRun(runId: string): boolean {
  const runs = getRuns();
  const runIndex = runs.findIndex(run => run.id === runId);
  
  if (runIndex === -1) return false;
  
  runs.splice(runIndex, 1);
  saveRuns(runs);
  
  return true;
}

/**
 * Get run statistics by provider and model
 */
export function getProviderStats(setId: string, step?: EvalStep): Record<string, {
  runs: number;
  successful: number;
  averageMs: number;
  averageScore?: number;
}> {
  const runs = listRunsBySet(setId, step);
  const stats: Record<string, {
    runs: number;
    successful: number;
    averageMs: number;
    averageScore?: number;
  }> = {};
  
  runs.forEach(run => {
    const key = `${run.provider}_${run.model}`;
    if (!stats[key]) {
      stats[key] = { runs: 0, successful: 0, averageMs: 0 };
    }
    
    stats[key].runs++;
    if (run.ok) stats[key].successful++;
    stats[key].averageMs += run.ms;
  });
  
  // Calculate averages
  Object.keys(stats).forEach(key => {
    const stat = stats[key];
    stat.averageMs = Math.round(stat.averageMs / stat.runs);
  });
  
  return stats;
}
