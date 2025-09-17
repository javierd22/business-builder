/**
 * Resilient API client with tolerant parsing, exponential backoff retry, caching, timeouts, and fallbacks
 */

import { recordEvent } from './observability';
import { getCached, setCached, isCacheEnabled, type CacheKey } from './cache';
import { 
  DEFAULT_TIMEOUT_MS, 
  FALLBACK_TIMEOUT_MS, 
  nextFallback, 
  shouldFallback, 
  isRetryableError,
  createTimeoutController,
  type FallbackParams 
} from './latency';
import { getPerformanceSettings } from './settings';

interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
};

/**
 * Check if we're in mock mode
 */
function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_MOCK_AI?.toLowerCase() === "true";
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateDelay(attempt: number, baseDelay: number, maxDelay: number): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 0.1 * exponentialDelay;
  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Determine if an error should be retried
 */
function shouldRetry(error: unknown, attempt: number, maxRetries: number): boolean {
  if (attempt >= maxRetries) return false;
  return isRetryableError(error);
}

/**
 * Fetch with exponential backoff retry
 */
async function fetchWithRetry(
  url: string, 
  options: RequestInit & { signal?: AbortSignal } = {},
  retryOptions: RetryOptions = DEFAULT_RETRY_OPTIONS
): Promise<Response> {
  const { maxRetries, baseDelay, maxDelay } = retryOptions;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // If response is ok, return it
      if (response.ok) {
        return response;
      }
      
      // If it's a client error (4xx except 429), don't retry
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return response;
      }
      
      // For server errors (5xx) and rate limiting (429), throw to trigger retry
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // If we shouldn't retry this error, throw it
      if (!shouldRetry(error, attempt, maxRetries)) {
        throw error;
      }
      
      // Calculate delay for next attempt
      const delay = calculateDelay(attempt, baseDelay, maxDelay);
      
      // Wait before retrying
      await sleep(delay);
    }
  }
  
  // This should never be reached, but TypeScript requires it
  throw new Error('Max retries exceeded');
}

/**
 * Tolerant JSON parsing that handles various response formats
 */
function parseResponse(data: unknown): { prd?: string; ux?: string; meta?: Record<string, unknown> } {
  if (typeof data === 'string') {
    // If it's a plain string, assume it's the content
    return { prd: data };
  }
  
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    
    // Handle different possible response shapes
    if (obj.prd && typeof obj.prd === 'string') {
      return { prd: obj.prd, meta: obj.meta as Record<string, unknown> };
    }
    
    if (obj.ux && typeof obj.ux === 'string') {
      return { ux: obj.ux, meta: obj.meta as Record<string, unknown> };
    }
    
    if (obj.content && typeof obj.content === 'string') {
      return { prd: obj.content, meta: obj.meta as Record<string, unknown> };
    }
    
    if (obj.response && typeof obj.response === 'string') {
      return { prd: obj.response, meta: obj.meta as Record<string, unknown> };
    }
    
    // If we have a text field, use it
    if (obj.text && typeof obj.text === 'string') {
      return { prd: obj.text, meta: obj.meta as Record<string, unknown> };
    }
  }
  
  // Fallback: return the data as-is
  return { prd: JSON.stringify(data), meta: {} };
}

export interface PlanResponse {
  prd: string;
  meta?: Record<string, unknown>;
}

export interface UXResponse {
  ux: string;
  meta?: Record<string, unknown>;
}

export interface DeployResponse {
  url?: string;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
  meta?: Record<string, unknown>;
}

/**
 * Create a business plan from an idea
 */
export async function createPlan(
  idea: string, 
  persona?: string, 
  job?: string,
  options?: {
    providerOverride?: 'anthropic' | 'openai';
    modelOverride?: string;
    temperature?: number;
    depth?: 'brief' | 'standard' | 'deep';
    format?: 'markdown' | 'bulleted';
    revision?: string;
    promptVersion?: string;
  }
): Promise<PlanResponse> {
  const startTime = performance.now();
  
  if (!idea.trim()) {
    throw new Error("Business idea is required");
  }

  if (idea.trim().length < 10) {
    throw new Error("Business idea must be at least 10 characters long");
  }

  // Get performance settings for defaults
  const settings = getPerformanceSettings();
  
  // Build parameters with defaults
  const params: FallbackParams = {
    temperature: options?.temperature ?? settings.defaultTemperature,
    depth: options?.depth ?? settings.defaultDepth,
    format: options?.format ?? settings.defaultFormat,
    revision: options?.revision,
    promptVersion: options?.promptVersion ?? 'v1',
  };

  // Check cache first if enabled
  if (isCacheEnabled()) {
    const cacheKey: CacheKey = {
      step: 'plan',
      idea: idea.trim(),
      persona: persona?.trim(),
      job: job?.trim(),
      ...params,
    };
    
    const cached = getCached(cacheKey);
    if (cached) {
      const duration = Math.round(performance.now() - startTime);
      
      // Record cache hit
      recordEvent({
        name: 'api_call',
        route: '/api/plan',
        ok: true,
        ms: duration,
        meta: {
          cached: true,
          provider: 'cached',
          model: 'cached',
          tokensUsed: 0,
          costEstimate: 0,
        },
      });
      
      return {
        prd: cached.text,
        meta: cached.meta || { cached: true },
      };
    }
  }

  if (isMockMode()) {
    const mockResponse = {
      prd: `# Product Requirements Document

## Executive Summary
**Business Idea:** ${idea}

## Problem Statement
This document outlines the requirements for developing a business solution that addresses specific market needs and user challenges in the target domain.

## Target Audience
- **Primary Users:** Business professionals and entrepreneurs
- **Secondary Users:** Stakeholders and decision makers
- **Market Segment:** Small to medium enterprises

## Core Features
1. **User Authentication** - Secure login and registration system
2. **Dashboard** - Comprehensive overview with key metrics
3. **Data Management** - Create, read, update, and delete operations
4. **Reporting** - Analytics and insights generation
5. **Mobile Support** - Responsive design for all devices

## Technical Requirements
- **Frontend:** Modern web framework with TypeScript
- **Backend:** RESTful API with robust validation
- **Database:** Scalable data storage solution
- **Security:** Industry-standard encryption and privacy

## Success Metrics
- User adoption rate: 80% within first quarter
- System uptime: 99.9% availability
- User satisfaction: 4.5+ star rating

## Implementation Timeline
- **Phase 1 (MVP):** 6-8 weeks
- **Phase 2 (Enhancement):** 4-6 weeks
- **Phase 3 (Scale):** Ongoing iterations`,
      meta: {
        provider: 'mock',
        model: 'sample',
        durationMs: 100,
        tokensUsed: 0,
        costEstimate: 0,
      },
    };
    
    // Cache mock response if enabled
    if (isCacheEnabled()) {
      const cacheKey: CacheKey = {
        step: 'plan',
        idea: idea.trim(),
        persona: persona?.trim(),
        job: job?.trim(),
        ...params,
      };
      setCached(cacheKey, mockResponse.prd, mockResponse.meta);
    }
    
    return mockResponse;
  }

  // Try primary request with timeout
  let fallbackAttempted = false;
  let finalParams = params;
  
  try {
    const { controller, timeoutId } = createTimeoutController(settings.defaultTimeoutMs);
    
    try {
      const response = await fetchWithRetry("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          idea: idea.trim(),
          persona: persona?.trim(),
          job: job?.trim(),
          providerOverride: options?.providerOverride,
          modelOverride: options?.modelOverride,
          temperature: finalParams.temperature,
          depth: finalParams.depth,
          format: finalParams.format,
          revision: finalParams.revision,
          promptVersion: finalParams.promptVersion
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const duration = Math.round(performance.now() - startTime);
      
      // Check if we should have used fallback (performance warning)
      const shouldHaveUsedFallback = shouldFallback(duration, 'plan');
      
      // Record successful API call
      recordEvent({
        name: 'api_call',
        route: '/api/plan',
        ok: true,
        ms: duration,
        meta: {
          provider: data.meta?.provider,
          model: data.meta?.model,
          tokensUsed: data.meta?.tokensUsed,
          costEstimate: data.meta?.costEstimate,
          fallbackAttempted,
          shouldHaveUsedFallback,
          params: finalParams,
        },
      });

      // Cache successful response if enabled
      if (isCacheEnabled()) {
        const cacheKey: CacheKey = {
          step: 'plan',
          idea: idea.trim(),
          persona: persona?.trim(),
          job: job?.trim(),
          ...finalParams,
        };
        setCached(cacheKey, data.prd, data.meta);
      }

      return {
        prd: data.prd,
        meta: data.meta,
      };

    } catch (error) {
      clearTimeout(timeoutId);
      
      // If timeout or retryable error, try fallback
      if (!fallbackAttempted && ((error instanceof Error && error.name === 'AbortError') || isRetryableError(error))) {
        const elapsed = performance.now() - startTime;
        
        if (shouldFallback(elapsed, 'plan') || (error instanceof Error && error.name === 'AbortError')) {
          fallbackAttempted = true;
          finalParams = nextFallback(params);
          
          // Try fallback with shorter timeout
          const { controller: fallbackController, timeoutId: fallbackTimeoutId } = createTimeoutController(FALLBACK_TIMEOUT_MS);
          
          try {
            const fallbackResponse = await fetchWithRetry("/api/plan", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ 
                idea: idea.trim(),
                persona: persona?.trim(),
                job: job?.trim(),
                providerOverride: options?.providerOverride,
                modelOverride: options?.modelOverride,
                temperature: finalParams.temperature,
                depth: finalParams.depth,
                format: finalParams.format,
                revision: finalParams.revision,
                promptVersion: finalParams.promptVersion
              }),
              signal: fallbackController.signal,
            });

            clearTimeout(fallbackTimeoutId);

            if (!fallbackResponse.ok) {
              const errorData = await fallbackResponse.json().catch(() => ({}));
              throw new Error(errorData.message || `HTTP ${fallbackResponse.status}: ${fallbackResponse.statusText}`);
            }

            const data = await fallbackResponse.json();
            const duration = Math.round(performance.now() - startTime);
            
            // Record successful fallback API call
            recordEvent({
              name: 'api_call',
              route: '/api/plan',
              ok: true,
              ms: duration,
              meta: {
                provider: data.meta?.provider,
                model: data.meta?.model,
                tokensUsed: data.meta?.tokensUsed,
                costEstimate: data.meta?.costEstimate,
                fallbackAttempted: true,
                originalParams: params,
                fallbackParams: finalParams,
              },
            });

            // Cache fallback response if enabled
            if (isCacheEnabled()) {
              const cacheKey: CacheKey = {
                step: 'plan',
                idea: idea.trim(),
                persona: persona?.trim(),
                job: job?.trim(),
                ...finalParams,
              };
              setCached(cacheKey, data.prd, data.meta);
            }

            return {
              prd: data.prd,
              meta: data.meta,
            };

          } catch (fallbackError) {
            clearTimeout(fallbackTimeoutId);
            throw fallbackError;
          }
        }
      }
      
      throw error;
    }
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    
    // Record failed API call
    recordEvent({
      name: 'api_call',
      route: '/api/plan',
      ok: false,
      ms: duration,
      meta: {
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackAttempted,
        params: finalParams,
        timeout: error instanceof Error && error.name === 'AbortError',
      },
    });

    throw error;
  }
}

/**
 * Create UX design from a PRD
 */
export async function createUX(
  prd: string, 
  persona?: string, 
  job?: string,
  options?: {
    providerOverride?: 'anthropic' | 'openai';
    modelOverride?: string;
    temperature?: number;
    depth?: 'brief' | 'standard' | 'deep';
    format?: 'markdown' | 'bulleted';
    revision?: string;
    promptVersion?: string;
  }
): Promise<UXResponse> {
  const startTime = performance.now();
  
  if (!prd.trim()) {
    throw new Error("Product Requirements Document is required");
  }

  // Get performance settings for defaults
  const settings = getPerformanceSettings();
  
  // Build parameters with defaults
  const params: FallbackParams = {
    temperature: options?.temperature ?? settings.defaultTemperature,
    depth: options?.depth ?? settings.defaultDepth,
    format: options?.format ?? settings.defaultFormat,
    revision: options?.revision,
    promptVersion: options?.promptVersion ?? 'v1',
  };

  // Check cache first if enabled
  if (isCacheEnabled()) {
    const cacheKey: CacheKey = {
      step: 'ux',
      idea: prd.trim(), // Use PRD as the "idea" for UX generation
      persona: persona?.trim(),
      job: job?.trim(),
      ...params,
    };
    
    const cached = getCached(cacheKey);
    if (cached) {
      const duration = Math.round(performance.now() - startTime);
      
      // Record cache hit
      recordEvent({
        name: 'api_call',
        route: '/api/ux',
        ok: true,
        ms: duration,
        meta: {
          cached: true,
          provider: 'cached',
          model: 'cached',
          tokensUsed: 0,
          costEstimate: 0,
        },
      });
      
      return {
        ux: cached.text,
        meta: cached.meta || { cached: true },
      };
    }
  }

  if (isMockMode()) {
    const mockResponse = {
      ux: `# User Experience Design

## Design Principles
- **Simplicity:** Clean, intuitive interface design
- **Accessibility:** WCAG 2.1 AA compliance throughout
- **Consistency:** Unified design language and patterns
- **Performance:** Fast loading times and smooth interactions

## User Flows

### Primary Flow: User Onboarding
1. **Landing Page** - Clear value proposition and call-to-action
2. **Registration** - Streamlined 3-step signup process
3. **Dashboard Setup** - Guided tour and initial configuration
4. **First Project** - Template-based project creation

### Core Workflow
1. **Project Creation** - Intuitive project setup wizard
2. **Data Entry** - Form-based data input with validation
3. **Review & Edit** - Real-time preview and editing capabilities
4. **Publish & Share** - Export and sharing options

## Screen Descriptions

### Dashboard
- Overview cards with key metrics
- Recent activity feed
- Quick action buttons
- Navigation sidebar

### Project List
- Grid/list view toggle
- Search and filter functionality
- Bulk operations support
- Status indicators

## Accessibility Features
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management and indicators`,
      meta: {
        provider: 'mock',
        model: 'sample',
        durationMs: 100,
        tokensUsed: 0,
        costEstimate: 0,
      },
    };
    
    // Cache mock response if enabled
    if (isCacheEnabled()) {
      const cacheKey: CacheKey = {
        step: 'ux',
        idea: prd.trim(),
        persona: persona?.trim(),
        job: job?.trim(),
        ...params,
      };
      setCached(cacheKey, mockResponse.ux, mockResponse.meta);
    }
    
    return mockResponse;
  }

  // Try primary request with timeout
  let fallbackAttempted = false;
  let finalParams = params;
  
  try {
    const { controller, timeoutId } = createTimeoutController(settings.defaultTimeoutMs);
    
    try {
      const response = await fetchWithRetry("/api/ux", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prd: prd.trim(),
          persona: persona?.trim(),
          job: job?.trim(),
          providerOverride: options?.providerOverride,
          modelOverride: options?.modelOverride,
          temperature: finalParams.temperature,
          depth: finalParams.depth,
          format: finalParams.format,
          revision: finalParams.revision,
          promptVersion: finalParams.promptVersion
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const duration = Math.round(performance.now() - startTime);
      
      // Check if we should have used fallback (performance warning)
      const shouldHaveUsedFallback = shouldFallback(duration, 'ux');
      
      // Record successful API call
      recordEvent({
        name: 'api_call',
        route: '/api/ux',
        ok: true,
        ms: duration,
        meta: {
          provider: data.meta?.provider,
          model: data.meta?.model,
          tokensUsed: data.meta?.tokensUsed,
          costEstimate: data.meta?.costEstimate,
          fallbackAttempted,
          shouldHaveUsedFallback,
          params: finalParams,
        },
      });

      // Cache successful response if enabled
      if (isCacheEnabled()) {
        const cacheKey: CacheKey = {
          step: 'ux',
          idea: prd.trim(),
          persona: persona?.trim(),
          job: job?.trim(),
          ...finalParams,
        };
        setCached(cacheKey, data.ux, data.meta);
      }

      return {
        ux: data.ux,
        meta: data.meta,
      };

    } catch (error) {
      clearTimeout(timeoutId);
      
      // If timeout or retryable error, try fallback
      if (!fallbackAttempted && ((error instanceof Error && error.name === 'AbortError') || isRetryableError(error))) {
        const elapsed = performance.now() - startTime;
        
        if (shouldFallback(elapsed, 'ux') || (error instanceof Error && error.name === 'AbortError')) {
          fallbackAttempted = true;
          finalParams = nextFallback(params);
          
          // Try fallback with shorter timeout
          const { controller: fallbackController, timeoutId: fallbackTimeoutId } = createTimeoutController(FALLBACK_TIMEOUT_MS);
          
          try {
            const fallbackResponse = await fetchWithRetry("/api/ux", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ 
                prd: prd.trim(),
                persona: persona?.trim(),
                job: job?.trim(),
                providerOverride: options?.providerOverride,
                modelOverride: options?.modelOverride,
                temperature: finalParams.temperature,
                depth: finalParams.depth,
                format: finalParams.format,
                revision: finalParams.revision,
                promptVersion: finalParams.promptVersion
              }),
              signal: fallbackController.signal,
            });

            clearTimeout(fallbackTimeoutId);

            if (!fallbackResponse.ok) {
              const errorData = await fallbackResponse.json().catch(() => ({}));
              throw new Error(errorData.message || `HTTP ${fallbackResponse.status}: ${fallbackResponse.statusText}`);
            }

            const data = await fallbackResponse.json();
            const duration = Math.round(performance.now() - startTime);
            
            // Record successful fallback API call
            recordEvent({
              name: 'api_call',
              route: '/api/ux',
              ok: true,
              ms: duration,
              meta: {
                provider: data.meta?.provider,
                model: data.meta?.model,
                tokensUsed: data.meta?.tokensUsed,
                costEstimate: data.meta?.costEstimate,
                fallbackAttempted: true,
                originalParams: params,
                fallbackParams: finalParams,
              },
            });

            // Cache fallback response if enabled
            if (isCacheEnabled()) {
              const cacheKey: CacheKey = {
                step: 'ux',
                idea: prd.trim(),
                persona: persona?.trim(),
                job: job?.trim(),
                ...finalParams,
              };
              setCached(cacheKey, data.ux, data.meta);
            }

            return {
              ux: data.ux,
              meta: data.meta,
            };

          } catch (fallbackError) {
            clearTimeout(fallbackTimeoutId);
            throw fallbackError;
          }
        }
      }
      
      throw error;
    }
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    
    // Record failed API call
    recordEvent({
      name: 'api_call',
      route: '/api/ux',
      ok: false,
      ms: duration,
      meta: {
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackAttempted,
        params: finalParams,
        timeout: error instanceof Error && error.name === 'AbortError',
      },
    });

    throw error;
  }
}

/**
 * Request deployment (placeholder implementation)
 */
export async function requestDeploy(projectId: string): Promise<DeployResponse> {
  const startTime = performance.now();
  
  if (!projectId.trim()) {
    throw new Error("Project ID is required");
  }

  try {
    const response = await fetchWithRetry("/api/deploy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId: projectId.trim() }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const duration = Math.round(performance.now() - startTime);
    
    // Record successful API call
    recordEvent({
      name: 'api_call',
      route: '/api/deploy',
      ok: true,
      ms: duration,
      meta: {
        projectId,
        status: data.status,
      },
    });

    return data as DeployResponse;

  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    
    // Record failed API call
    recordEvent({
      name: 'api_call',
      route: '/api/deploy',
      ok: false,
      ms: duration,
      meta: {
        projectId,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    throw error;
  }
}