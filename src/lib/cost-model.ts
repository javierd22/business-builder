/**
 * Cost model for LLM providers and token usage estimation
 * Provides pricing tables and cost calculation utilities
 */

export interface PricingInfo {
  inputPerMTokUSD: number;  // Cost per million input tokens
  outputPerMTokUSD: number; // Cost per million output tokens
  model: string;
  provider: string;
}

export interface CostEstimate {
  inputTokens: number;
  outputTokens: number;
  inputCostUSD: number;
  outputCostUSD: number;
  totalCostUSD: number;
}

export interface CostInput {
  provider: string;
  model: string;
  inputText?: string;
  outputText?: string;
  inputTokens?: number;
  outputTokens?: number;
}

// Pricing tables (as of 2024 - update as needed)
const PRICING_TABLE: Record<string, PricingInfo> = {
  // OpenAI Models
  'openai_gpt-4o': {
    provider: 'openai',
    model: 'gpt-4o',
    inputPerMTokUSD: 2.50,
    outputPerMTokUSD: 10.00,
  },
  'openai_gpt-4o-mini': {
    provider: 'openai',
    model: 'gpt-4o-mini',
    inputPerMTokUSD: 0.15,
    outputPerMTokUSD: 0.60,
  },
  'openai_gpt-3.5-turbo': {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    inputPerMTokUSD: 0.50,
    outputPerMTokUSD: 1.50,
  },
  
  // Anthropic Models
  'anthropic_claude-3-5-sonnet-latest': {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-latest',
    inputPerMTokUSD: 3.00,
    outputPerMTokUSD: 15.00,
  },
  'anthropic_claude-3-5-sonnet': {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet',
    inputPerMTokUSD: 3.00,
    outputPerMTokUSD: 15.00,
  },
  'anthropic_claude-3-haiku': {
    provider: 'anthropic',
    model: 'claude-3-haiku',
    inputPerMTokUSD: 0.25,
    outputPerMTokUSD: 1.25,
  },
  'anthropic_claude-3-opus': {
    provider: 'anthropic',
    model: 'claude-3-opus',
    inputPerMTokUSD: 15.00,
    outputPerMTokUSD: 75.00,
  },
};

// Default pricing for unknown models
const DEFAULT_PRICING: PricingInfo = {
  provider: 'unknown',
  model: 'unknown',
  inputPerMTokUSD: 1.00,  // Conservative estimate
  outputPerMTokUSD: 3.00,
};

/**
 * Estimate token count from text using simple heuristic
 * Rule of thumb: ~4 characters per token for English text
 */
export function estimateTokens(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  
  // Basic heuristic: 4 chars ≈ 1 token
  const baseEstimate = Math.ceil(text.length / 4);
  
  // Apply some adjustments for common patterns
  const wordCount = text.split(/\s+/).length;
  const charCount = text.length;
  
  // If text is very word-heavy, adjust up slightly
  const avgWordLength = charCount / wordCount;
  const adjustment = avgWordLength > 6 ? 1.1 : 1.0;
  
  const adjustedEstimate = Math.ceil(baseEstimate * adjustment);
  
  // Clamp to sensible bounds
  return Math.max(10, Math.min(adjustedEstimate, 100000)); // 10 tokens min, 100k max
}

/**
 * Get pricing info for a provider/model combination
 */
function getPricingInfo(provider: string, model: string): PricingInfo {
  const key = `${provider}_${model}`.toLowerCase();
  return PRICING_TABLE[key] || DEFAULT_PRICING;
}

/**
 * Calculate cost from meta object (preferred method)
 */
export function costFromMeta(meta: Record<string, unknown>): CostEstimate | null {
  if (!meta || typeof meta !== 'object') return null;
  
  const provider = meta.provider as string;
  const model = meta.model as string;
  
  if (!provider || !model) return null;
  
  // Try to get actual token usage from meta
  let inputTokens = 0;
  let outputTokens = 0;
  
  // Handle different meta formats
  if (meta.tokensUsed && typeof meta.tokensUsed === 'number') {
    // Simple total token count - split roughly 70/30 input/output
    const total = meta.tokensUsed;
    inputTokens = Math.ceil(total * 0.7);
    outputTokens = total - inputTokens;
  } else if (meta.usage && typeof meta.usage === 'object') {
    // Structured usage object
    const usage = meta.usage as Record<string, unknown>;
    inputTokens = (usage.input_tokens as number) || (usage.inputTokens as number) || 0;
    outputTokens = (usage.output_tokens as number) || (usage.outputTokens as number) || 0;
  } else if (meta.inputTokens && meta.outputTokens) {
    // Direct token properties
    inputTokens = meta.inputTokens as number;
    outputTokens = meta.outputTokens as number;
  } else {
    // Fallback to estimation if no token data available
    return null;
  }
  
  if (inputTokens === 0 && outputTokens === 0) return null;
  
  return estimateCostUSD({
    provider,
    model,
    inputTokens,
    outputTokens,
  });
}

/**
 * Estimate cost in USD for a given input
 */
export function estimateCostUSD(input: CostInput): CostEstimate {
  const { provider, model, inputText, outputText, inputTokens, outputTokens } = input;
  
  // Calculate tokens if not provided
  const finalInputTokens = inputTokens || (inputText ? estimateTokens(inputText) : 0);
  const finalOutputTokens = outputTokens || (outputText ? estimateTokens(outputText) : 0);
  
  // Get pricing info
  const pricing = getPricingInfo(provider, model);
  
  // Calculate costs (convert to per-token from per-million-token)
  const inputCostUSD = (finalInputTokens / 1_000_000) * pricing.inputPerMTokUSD;
  const outputCostUSD = (finalOutputTokens / 1_000_000) * pricing.outputPerMTokUSD;
  const totalCostUSD = inputCostUSD + outputCostUSD;
  
  return {
    inputTokens: finalInputTokens,
    outputTokens: finalOutputTokens,
    inputCostUSD: Math.round(inputCostUSD * 10000) / 10000, // Round to 4 decimal places
    outputCostUSD: Math.round(outputCostUSD * 10000) / 10000,
    totalCostUSD: Math.round(totalCostUSD * 10000) / 10000,
  };
}

/**
 * Get cost estimate for a specific step (Plan or UX)
 * Uses typical token budgets if no actual data available
 */
export function getStepCostEstimate(step: 'plan' | 'ux', provider: string, model: string): CostEstimate {
  // Typical token budgets for each step
  const tokenBudgets = {
    plan: {
      input: 500,   // Typical business idea + context
      output: 2000, // Typical PRD length
    },
    ux: {
      input: 2000,  // PRD as input
      output: 1500, // UX specification
    },
  };
  
  const budget = tokenBudgets[step];
  
  return estimateCostUSD({
    provider,
    model,
    inputTokens: budget.input,
    outputTokens: budget.output,
  });
}

/**
 * Calculate daily cost estimate from events
 */
export function calculateDailyCost(events: Array<{ meta?: Record<string, unknown> }>): {
  totalCostUSD: number;
  callCount: number;
  averageCostUSD: number;
  breakdown: Record<string, number>;
} {
  let totalCostUSD = 0;
  let callCount = 0;
  const breakdown: Record<string, number> = {};
  
  events.forEach(event => {
    if (!event.meta) return;
    
    const costEstimate = costFromMeta(event.meta);
    if (costEstimate) {
      totalCostUSD += costEstimate.totalCostUSD;
      callCount++;
      
      const key = `${event.meta.provider}_${event.meta.model}`;
      breakdown[key] = (breakdown[key] || 0) + costEstimate.totalCostUSD;
    }
  });
  
  const averageCostUSD = callCount > 0 ? totalCostUSD / callCount : 0;
  
  return {
    totalCostUSD: Math.round(totalCostUSD * 10000) / 10000,
    callCount,
    averageCostUSD: Math.round(averageCostUSD * 10000) / 10000,
    breakdown,
  };
}

/**
 * Get all available models and their pricing
 */
export function getAllPricingInfo(): PricingInfo[] {
  return Object.values(PRICING_TABLE);
}

/**
 * Format cost for display
 */
export function formatCost(costUSD: number): string {
  if (costUSD < 0.0001) return '<$0.0001';
  if (costUSD < 0.01) return `$${costUSD.toFixed(4)}`;
  if (costUSD < 1) return `$${costUSD.toFixed(3)}`;
  return `$${costUSD.toFixed(2)}`;
}

/**
 * Get cost efficiency rating (lower is better)
 */
export function getCostEfficiencyRating(costUSD: number, step: 'plan' | 'ux'): 'excellent' | 'good' | 'fair' | 'expensive' {
  // Baseline costs for each step (in USD)
  const baselines = {
    plan: 0.05,  // $0.05 baseline for plan generation
    ux: 0.04,    // $0.04 baseline for UX generation
  };
  
  const ratio = costUSD / baselines[step];
  
  if (ratio <= 0.5) return 'excellent';
  if (ratio <= 1.0) return 'good';
  if (ratio <= 2.0) return 'fair';
  return 'expensive';
}

