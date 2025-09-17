/**
 * Evaluation configuration and rubric definitions
 * Defines scoring criteria and thresholds for evaluation
 */

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  weight: number; // 1-5, higher weight = more important
}

export interface EvaluationThresholds {
  ship: number;    // >= 4.0
  revise: number;  // 3.0-3.9
  reject: number;  // < 3.0
}

export interface EvaluationDefaults {
  temperature: number;
  depth: 'brief' | 'standard' | 'deep';
  format: 'markdown' | 'bulleted';
  promptVersions: string[];
}

// Evaluation criteria for Plan generation
export const PLAN_CRITERIA: EvaluationCriteria[] = [
  {
    id: 'clarity',
    name: 'Clarity',
    description: 'The plan is clear, well-structured, and easy to understand',
    weight: 5,
  },
  {
    id: 'completeness',
    name: 'Completeness',
    description: 'All necessary sections and details are included',
    weight: 5,
  },
  {
    id: 'feasibility',
    name: 'Feasibility',
    description: 'The scope and timeline are realistic and achievable',
    weight: 4,
  },
  {
    id: 'risk_awareness',
    name: 'Risk Awareness',
    description: 'Identifies and addresses potential risks and challenges',
    weight: 4,
  },
  {
    id: 'market_focus',
    name: 'Market Focus',
    description: 'Clearly defines target market and competitive positioning',
    weight: 4,
  },
  {
    id: 'consistency',
    name: 'Consistency',
    description: 'Internal consistency and alignment with the original idea',
    weight: 3,
  },
];

// Evaluation criteria for UX generation
export const UX_CRITERIA: EvaluationCriteria[] = [
  {
    id: 'user_centered',
    name: 'User-Centered',
    description: 'Focuses on user needs and pain points',
    weight: 5,
  },
  {
    id: 'testability',
    name: 'Testability',
    description: 'Provides clear ways to validate assumptions and test ideas',
    weight: 5,
  },
  {
    id: 'completeness',
    name: 'Completeness',
    description: 'Covers all necessary user flows and interactions',
    weight: 4,
  },
  {
    id: 'feasibility',
    name: 'Feasibility',
    description: 'Technical and design feasibility is realistic',
    weight: 4,
  },
  {
    id: 'clarity',
    name: 'Clarity',
    description: 'Clear, actionable guidance for implementation',
    weight: 4,
  },
  {
    id: 'consistency',
    name: 'Consistency',
    description: 'Consistent with the business plan and user personas',
    weight: 3,
  },
];

// Evaluation thresholds
export const EVALUATION_THRESHOLDS: EvaluationThresholds = {
  ship: 4.0,
  revise: 3.0,
  reject: 3.0,
};

// Default evaluation parameters
export const EVALUATION_DEFAULTS: EvaluationDefaults = {
  temperature: 0.7,
  depth: 'standard',
  format: 'markdown',
  promptVersions: ['v1', 'v2'],
};

/**
 * Get criteria for a specific step
 */
export function getCriteriaForStep(step: 'plan' | 'ux'): EvaluationCriteria[] {
  return step === 'plan' ? PLAN_CRITERIA : UX_CRITERIA;
}

/**
 * Calculate weighted average score
 */
export function calculateWeightedScore(scores: Record<string, number>, criteria: EvaluationCriteria[]): number {
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  criteria.forEach(criterion => {
    const score = scores[criterion.id];
    if (score !== undefined && score >= 1 && score <= 5) {
      totalWeightedScore += score * criterion.weight;
      totalWeight += criterion.weight;
    }
  });
  
  return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
}

/**
 * Get evaluation status based on score
 */
export function getEvaluationStatus(score: number): 'ship' | 'revise' | 'reject' {
  if (score >= EVALUATION_THRESHOLDS.ship) return 'ship';
  if (score >= EVALUATION_THRESHOLDS.revise) return 'revise';
  return 'reject';
}

/**
 * Get status color for UI display
 */
export function getStatusColor(status: 'ship' | 'revise' | 'reject'): string {
  switch (status) {
    case 'ship':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'revise':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'reject':
      return 'bg-red-100 text-red-800 border-red-200';
  }
}

/**
 * Get status description
 */
export function getStatusDescription(status: 'ship' | 'revise' | 'reject'): string {
  switch (status) {
    case 'ship':
      return 'Ready to ship - meets quality standards';
    case 'revise':
      return 'Needs revision - close but has issues';
    case 'reject':
      return 'Should be rejected - significant problems';
  }
}

/**
 * Validate score input
 */
export function isValidScore(score: unknown): score is number {
  return typeof score === 'number' && score >= 1 && score <= 5 && Number.isInteger(score);
}

/**
 * Get recommended evaluation parameters for different scenarios
 */
export function getRecommendedParams(scenario: 'quick' | 'thorough' | 'creative'): {
  temperature: number;
  depth: 'brief' | 'standard' | 'deep';
  format: 'markdown' | 'bulleted';
} {
  switch (scenario) {
    case 'quick':
      return {
        temperature: 0.5,
        depth: 'brief',
        format: 'bulleted',
      };
    case 'thorough':
      return {
        temperature: 0.7,
        depth: 'deep',
        format: 'markdown',
      };
    case 'creative':
      return {
        temperature: 0.9,
        depth: 'standard',
        format: 'markdown',
      };
  }
}
