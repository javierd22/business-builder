/**
 * Evaluation quality scoring system
 * Manages scores and comments for evaluation runs
 */

import { 
  getCriteriaForStep, 
  calculateWeightedScore, 
  getEvaluationStatus,
  type EvaluationCriteria 
} from './eval-config';

export interface EvaluationScore {
  runId: string;
  criteriaScores: Record<string, number>;
  weightedAverage: number;
  status: 'ship' | 'revise' | 'reject';
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSummary {
  provider: string;
  model: string;
  runs: number;
  averageScore: number;
  statusCounts: {
    ship: number;
    revise: number;
    reject: number;
  };
}

const EVAL_SCORES_KEY = 'business_builder_eval_scores';

/**
 * Check if we're in a client environment
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get all evaluation scores
 */
function getScores(): EvaluationScore[] {
  if (!isClient()) return [];
  try {
    const stored = localStorage.getItem(EVAL_SCORES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to parse evaluation scores from localStorage', error);
    return [];
  }
}

/**
 * Save evaluation scores
 */
function saveScores(scores: EvaluationScore[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(EVAL_SCORES_KEY, JSON.stringify(scores));
  } catch (error) {
    console.error('Failed to save evaluation scores to localStorage', error);
  }
}

/**
 * Save a score for an evaluation run
 */
export function saveScore(
  runId: string, 
  criteriaScores: Record<string, number>, 
  comment: string = ''
): EvaluationScore {
  const scores = getScores();
  const now = new Date().toISOString();
  
  // Calculate weighted average (we need to determine the step from the run)
  // For now, we'll use a default calculation - this could be enhanced to lookup the run
  const weightedAverage = calculateWeightedScore(criteriaScores, [
    // Default criteria for fallback calculation
    { id: 'clarity', name: 'Clarity', description: '', weight: 5 },
    { id: 'completeness', name: 'Completeness', description: '', weight: 5 },
    { id: 'feasibility', name: 'Feasibility', description: '', weight: 4 },
  ]);
  
  const status = getEvaluationStatus(weightedAverage);
  
  const existingIndex = scores.findIndex(score => score.runId === runId);
  
  const newScore: EvaluationScore = {
    runId,
    criteriaScores,
    weightedAverage,
    status,
    comment,
    createdAt: existingIndex >= 0 ? scores[existingIndex].createdAt : now,
    updatedAt: now,
  };
  
  if (existingIndex >= 0) {
    scores[existingIndex] = newScore;
  } else {
    scores.push(newScore);
  }
  
  saveScores(scores);
  
  return newScore;
}

/**
 * Get score for a specific run
 */
export function getScore(runId: string): EvaluationScore | undefined {
  return getScores().find(score => score.runId === runId);
}

/**
 * Get all scores for a set
 */
export function getScoresForSet(_setId: string): EvaluationScore[] {
  // This would require linking scores to sets through runs
  // For now, return all scores - this could be enhanced
  return getScores();
}

/**
 * Get summary by provider for a specific set and step
 */
export function summaryByProvider(_setId: string, _step: 'plan' | 'ux'): ProviderSummary[] {
  // This is a simplified implementation
  // In a full implementation, you'd link scores to runs to sets
  const scores = getScores();
  const providerMap = new Map<string, {
    runs: number;
    totalScore: number;
    statusCounts: { ship: number; revise: number; reject: number };
  }>();
  
  scores.forEach(score => {
    // For now, we'll use a placeholder provider/model
    // In reality, you'd lookup the run to get provider/model
    const key = 'anthropic_claude-3-5-sonnet'; // Placeholder
    
    if (!providerMap.has(key)) {
      providerMap.set(key, {
        runs: 0,
        totalScore: 0,
        statusCounts: { ship: 0, revise: 0, reject: 0 },
      });
    }
    
    const provider = providerMap.get(key)!;
    provider.runs++;
    provider.totalScore += score.weightedAverage;
    provider.statusCounts[score.status]++;
  });
  
  return Array.from(providerMap.entries()).map(([key, data]) => {
    const [provider, model] = key.split('_');
    return {
      provider,
      model,
      runs: data.runs,
      averageScore: data.runs > 0 ? data.totalScore / data.runs : 0,
      statusCounts: data.statusCounts,
    };
  });
}

/**
 * Get criteria for a specific step
 */
export function getCriteriaForStepType(step: 'plan' | 'ux'): EvaluationCriteria[] {
  return getCriteriaForStep(step);
}

/**
 * Validate criteria scores
 */
export function validateCriteriaScores(scores: Record<string, number>, criteria: EvaluationCriteria[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check if all required criteria have scores
  criteria.forEach(criterion => {
    if (!(criterion.id in scores)) {
      errors.push(`Missing score for ${criterion.name}`);
    } else {
      const score = scores[criterion.id];
      if (typeof score !== 'number' || score < 1 || score > 5 || !Number.isInteger(score)) {
        errors.push(`${criterion.name} score must be an integer between 1 and 5`);
      }
    }
  });
  
  // Check for extra scores that aren't in criteria
  Object.keys(scores).forEach(scoreKey => {
    if (!criteria.some(criterion => criterion.id === scoreKey)) {
      errors.push(`Unknown criteria: ${scoreKey}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get score statistics for a set
 */
export function getSetScoreStats(setId: string): {
  totalScoredRuns: number;
  averageScore: number;
  statusDistribution: {
    ship: number;
    revise: number;
    reject: number;
  };
  scoreDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
} {
  const scores = getScoresForSet(setId);
  
  const totalScoredRuns = scores.length;
  const averageScore = scores.length > 0 
    ? scores.reduce((sum, score) => sum + score.weightedAverage, 0) / scores.length 
    : 0;
  
  const statusDistribution = {
    ship: scores.filter(s => s.status === 'ship').length,
    revise: scores.filter(s => s.status === 'revise').length,
    reject: scores.filter(s => s.status === 'reject').length,
  };
  
  const scoreDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  scores.forEach(score => {
    const roundedScore = Math.round(score.weightedAverage);
    if (roundedScore >= 1 && roundedScore <= 5) {
      const scoreKey = roundedScore.toString() as keyof typeof scoreDistribution;
      scoreDistribution[scoreKey]++;
    }
  });
  
  return {
    totalScoredRuns,
    averageScore: Math.round(averageScore * 100) / 100,
    statusDistribution,
    scoreDistribution,
  };
}

/**
 * Delete score for a run
 */
export function deleteScore(runId: string): boolean {
  const scores = getScores();
  const scoreIndex = scores.findIndex(score => score.runId === runId);
  
  if (scoreIndex === -1) return false;
  
  scores.splice(scoreIndex, 1);
  saveScores(scores);
  
  return true;
}

/**
 * Clear all scores
 */
export function clearAllScores(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(EVAL_SCORES_KEY);
  } catch (error) {
    console.error('Failed to clear evaluation scores from localStorage', error);
  }
}
