/**
 * Latency envelope and timeout management
 * Provides targets, timeouts, and fallback strategies
 */

export interface LatencyTargets {
  p50: number; // 50th percentile target in ms
  p95: number; // 95th percentile target in ms
}

export interface FallbackParams {
  temperature: number;
  depth: 'brief' | 'standard' | 'deep';
  format: 'markdown' | 'bulleted';
  revision?: string;
  promptVersion?: string;
}

export interface LatencyConfig {
  defaultTimeoutMs: number;
  fallbackTimeoutMs: number;
  targets: {
    plan: LatencyTargets;
    ux: LatencyTargets;
  };
}

// Latency targets for each step (in milliseconds)
export const LATENCY_TARGETS = {
  plan: { p50: 10_000, p95: 30_000 }, // 10s p50, 30s p95
  ux: { p50: 12_000, p95: 40_000 },   // 12s p50, 40s p95
} as const;

// Timeout configuration
export const DEFAULT_TIMEOUT_MS = 60_000; // 60 seconds
export const FALLBACK_TIMEOUT_MS = 25_000; // 25 seconds

// Complete latency configuration
export const LATENCY_CONFIG: LatencyConfig = {
  defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
  fallbackTimeoutMs: FALLBACK_TIMEOUT_MS,
  targets: LATENCY_TARGETS,
};

/**
 * Generate fallback parameters for retry attempts
 * Creates "lighter" parameters to reduce processing time
 */
export function nextFallback(params: FallbackParams): FallbackParams {
  const fallback: FallbackParams = { ...params };
  
  // Reduce depth: deep → standard → brief
  if (fallback.depth === 'deep') {
    fallback.depth = 'standard';
  } else if (fallback.depth === 'standard') {
    fallback.depth = 'brief';
  }
  // If already brief, keep it brief
  
  // Slightly lower temperature for more deterministic/faster responses
  fallback.temperature = Math.max(0.3, fallback.temperature - 0.1);
  
  // Use simpler format if possible
  if (fallback.format === 'markdown') {
    fallback.format = 'bulleted';
  }
  
  // Clear revision notes for fallback (use original prompt)
  delete fallback.revision;
  
  // Use default prompt version for consistency
  fallback.promptVersion = 'v1';
  
  return fallback;
}

/**
 * Determine if a fallback should be attempted
 */
export function shouldFallback(msElapsed: number, target: 'plan' | 'ux'): boolean {
  const targetMs = LATENCY_TARGETS[target].p95;
  return msElapsed > targetMs;
}

/**
 * Get latency status based on actual vs target
 */
export function getLatencyStatus(msElapsed: number, target: 'plan' | 'ux'): {
  status: 'excellent' | 'good' | 'warning' | 'poor';
  message: string;
  exceeded: boolean;
} {
  const targets = LATENCY_TARGETS[target];
  
  if (msElapsed <= targets.p50) {
    return {
      status: 'excellent',
      message: `Excellent (≤${targets.p50 / 1000}s p50 target)`,
      exceeded: false,
    };
  } else if (msElapsed <= targets.p95) {
    return {
      status: 'good',
      message: `Good (≤${targets.p95 / 1000}s p95 target)`,
      exceeded: false,
    };
  } else {
    const exceeded = msElapsed > targets.p95;
    return {
      status: exceeded ? 'poor' : 'warning',
      message: exceeded 
        ? `Poor (exceeded ${targets.p95 / 1000}s p95 target)`
        : `Warning (approaching ${targets.p95 / 1000}s p95 target)`,
      exceeded,
    };
  }
}

/**
 * Format latency for display
 */
export function formatLatency(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 10000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 1000)}s`;
}

/**
 * Calculate latency percentiles from a list of measurements
 */
export function calculatePercentiles(measurements: number[]): {
  p50: number;
  p95: number;
  p99: number;
  min: number;
  max: number;
  count: number;
} {
  if (measurements.length === 0) {
    return { p50: 0, p95: 0, p99: 0, min: 0, max: 0, count: 0 };
  }
  
  const sorted = [...measurements].sort((a, b) => a - b);
  const len = sorted.length;
  
  const getPercentile = (p: number) => {
    const index = Math.ceil((p / 100) * len) - 1;
    return sorted[Math.max(0, Math.min(index, len - 1))];
  };
  
  return {
    p50: getPercentile(50),
    p95: getPercentile(95),
    p99: getPercentile(99),
    min: sorted[0],
    max: sorted[len - 1],
    count: len,
  };
}

/**
 * Check if a timeout should trigger based on current elapsed time
 */
export function isTimeoutReached(elapsedMs: number, timeoutMs: number): boolean {
  return elapsedMs >= timeoutMs;
}

/**
 * Get recommended timeout based on step and parameters
 */
export function getRecommendedTimeout(step: 'plan' | 'ux', params: FallbackParams): number {
  const baseTimeout = LATENCY_TARGETS[step].p95 * 2; // 2x p95 as safety margin
  
  // Adjust based on parameters
  let multiplier = 1.0;
  
  if (params.depth === 'deep') multiplier *= 1.5;
  else if (params.depth === 'standard') multiplier *= 1.2;
  
  if (params.format === 'markdown') multiplier *= 1.1;
  
  if (params.revision) multiplier *= 1.3; // Revision adds complexity
  
  return Math.min(Math.round(baseTimeout * multiplier), DEFAULT_TIMEOUT_MS);
}

/**
 * Create AbortController with timeout
 */
export function createTimeoutController(timeoutMs: number): {
  controller: AbortController;
  timeoutId: NodeJS.Timeout;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  
  return { controller, timeoutId };
}

/**
 * Check if an error is retryable (network, timeout, 5xx, 429)
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Network errors
    if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
      return true;
    }
    
    // Timeout errors
    if (message.includes('timeout') || message.includes('aborted')) {
      return true;
    }
    
    // HTTP status codes
    if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('504')) {
      return true;
    }
    
    if (message.includes('429')) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get fallback strategy description
 */
export function getFallbackDescription(originalParams: FallbackParams, fallbackParams: FallbackParams): string {
  const changes: string[] = [];
  
  if (originalParams.depth !== fallbackParams.depth) {
    changes.push(`depth: ${originalParams.depth} → ${fallbackParams.depth}`);
  }
  
  if (originalParams.temperature !== fallbackParams.temperature) {
    changes.push(`temperature: ${originalParams.temperature} → ${fallbackParams.temperature}`);
  }
  
  if (originalParams.format !== fallbackParams.format) {
    changes.push(`format: ${originalParams.format} → ${fallbackParams.format}`);
  }
  
  if (originalParams.revision && !fallbackParams.revision) {
    changes.push('removed revision notes');
  }
  
  if (originalParams.promptVersion !== fallbackParams.promptVersion) {
    changes.push(`prompt version: ${originalParams.promptVersion} → ${fallbackParams.promptVersion}`);
  }
  
  return changes.length > 0 ? changes.join(', ') : 'no parameter changes';
}

