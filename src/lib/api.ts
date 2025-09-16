/**
 * Resilient API client with tolerant parsing, exponential backoff retry, and mock mode
 */

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

  // Network errors should be retried
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return true;
  }

  // 5xx server errors should be retried
  if (error instanceof Error && error.message.includes("500")) {
    return true;
  }

  // Rate limiting should be retried
  if (error instanceof Error && error.message.includes("429")) {
    return true;
  }

  return false;
}

/**
 * Fetch with exponential backoff retry
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retryOptions: RetryOptions = DEFAULT_RETRY_OPTIONS
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Don't retry on 4xx errors (except 429)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return response;
      }

      // Don't retry on successful responses
      if (response.ok) {
        return response;
      }

      // For 5xx and 429, throw an error to trigger retry
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    } catch (error) {
      lastError = error;

      if (!shouldRetry(error, attempt, retryOptions.maxRetries)) {
        throw error;
      }

      if (attempt < retryOptions.maxRetries) {
        const delay = calculateDelay(attempt, retryOptions.baseDelay, retryOptions.maxDelay);
        console.warn(`Request failed (attempt ${attempt + 1}/${retryOptions.maxRetries + 1}), retrying in ${delay}ms:`, error);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Parse API response with tolerant error handling
 */
async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  
  if (contentType?.includes("application/json")) {
    try {
      return await response.json();
    } catch (error) {
      console.warn("Failed to parse JSON response:", error);
      throw new Error("Invalid response format");
    }
  }
  
  const text = await response.text();
  if (!text) {
    throw new Error("Empty response received");
  }
  
  // Try to parse as JSON even if content-type is wrong
  try {
    return JSON.parse(text);
  } catch {
    // Return as plain text if JSON parsing fails
    return { content: text };
  }
}

/**
 * Extract PRD content from various response formats
 */
// function extractPRDContent(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    
    // Direct prd field
    if (typeof obj.prd === "string") {
      return obj.prd;
    }
    
    // OpenAI-style response
    if (obj.choices && Array.isArray(obj.choices)) {
      const choice = obj.choices[0] as Record<string, unknown>;
      if (choice.message && typeof choice.message === "object") {
        const message = choice.message as Record<string, unknown>;
        if (typeof message.content === "string") {
          return message.content;
        }
      }
      if (typeof choice.text === "string") {
        return choice.text;
      }
    }
    
    // Anthropic-style response
    if (obj.content && Array.isArray(obj.content)) {
      const content = obj.content[0] as Record<string, unknown>;
      if (typeof content.text === "string") {
        return content.text;
      }
    }
    
    // Generic content field
    if (typeof obj.content === "string") {
      return obj.content;
    }
  }

  throw new Error("Could not extract PRD content from response");
}

/**
 * Extract UX content from various response formats
 */
function extractUXContent(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    
    // Direct ux field
    if (typeof obj.ux === "string") {
      return obj.ux;
    }
    
    // OpenAI-style response
    if (obj.choices && Array.isArray(obj.choices)) {
      const choice = obj.choices[0] as Record<string, unknown>;
      if (choice.message && typeof choice.message === "object") {
        const message = choice.message as Record<string, unknown>;
        if (typeof message.content === "string") {
          return message.content;
        }
      }
      if (typeof choice.text === "string") {
        return choice.text;
      }
    }
    
    // Anthropic-style response
    if (obj.content && Array.isArray(obj.content)) {
      const content = obj.content[0] as Record<string, unknown>;
      if (typeof content.text === "string") {
        return content.text;
      }
    }
    
    // Generic content field
    if (typeof obj.content === "string") {
      return obj.content;
    }
  }

  throw new Error("Could not extract UX content from response");
}

/**
 * Extract deployment info from response
 */
function extractDeploymentInfo(data: unknown): { url?: string; status: string } {
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    return {
      url: typeof obj.url === "string" ? obj.url : undefined,
      status: typeof obj.status === "string" ? obj.status : "unknown",
    };
  }

  return { status: "unknown" };
}

export interface PlanResponse {
  prd: string;
  meta: {
    provider: string;
    model: string;
    durationMs: number;
    tokensUsed?: number;
    costEstimate?: number;
  };
}

export interface PlanRequest {
  idea: string;
  persona?: string;
  job?: string;
}

export interface UXResponse {
  ux: string;
  meta: {
    provider: string;
    model: string;
    durationMs: number;
    tokensUsed?: number;
    costEstimate?: number;
  };
}

export interface UXRequest {
  prd: string;
  persona?: string;
  job?: string;
}

export interface DeployResponse {
  url?: string;
  status: 'deploying' | 'completed' | 'failed';
  deploymentId?: string;
  message?: string;
}

/**
 * Create a business plan from an idea
 */
export async function createPlan(idea: string, persona?: string, job?: string): Promise<PlanResponse> {
  if (!idea.trim()) {
    throw new Error("Business idea is required");
  }

  if (idea.trim().length < 10) {
    throw new Error("Business idea must be at least 10 characters long");
  }

  if (isMockMode()) {
    return {
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
  }

  try {
    const response = await fetchWithRetry("/api/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        idea: idea.trim(),
        persona: persona?.trim(),
        job: job?.trim()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as PlanResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection and try again.");
      }
      if (error.message.includes("500")) {
        throw new Error("Service temporarily unavailable. Please try again in a few minutes.");
      }
      if (error.message.includes("429")) {
        throw new Error("Too many requests. Please wait a moment before trying again.");
      }
      throw error;
    }
    
    throw new Error("An unexpected error occurred. Please try again.");
  }
}

/**
 * Create UX design from a PRD
 */
export async function createUX(prd: string, persona?: string, job?: string): Promise<UXResponse> {
  if (!prd.trim()) {
    throw new Error("Product Requirements Document is required");
  }

  if (isMockMode()) {
    return {
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
- Search and filter controls
- Project status indicators
- Bulk action options

### Project Detail
- Tabbed interface for different views
- Real-time collaboration indicators
- Version history and comments
- Export and sharing controls

## Interaction Patterns
- **Hover States:** Subtle animations and visual feedback
- **Loading States:** Skeleton screens and progress indicators
- **Error Handling:** Clear error messages with recovery actions
- **Success Feedback:** Toast notifications and confirmation dialogs

## Accessibility Considerations
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
  }

  try {
    const response = await fetchWithRetry("/api/ux", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        prd: prd.trim(),
        persona: persona?.trim(),
        job: job?.trim()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as UXResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection and try again.");
      }
      if (error.message.includes("500")) {
        throw new Error("Service temporarily unavailable. Please try again in a few minutes.");
      }
      if (error.message.includes("429")) {
        throw new Error("Too many requests. Please wait a moment before trying again.");
      }
      throw error;
    }
    
    throw new Error("An unexpected error occurred. Please try again.");
  }
}

/**
 * Request deployment of a project
 */
export async function requestDeploy(projectId: string, prd: string, ux: string): Promise<DeployResponse> {
  if (!projectId.trim()) {
    throw new Error("Project ID is required");
  }

  if (!prd.trim()) {
    throw new Error("PRD is required for deployment");
  }

  if (!ux.trim()) {
    throw new Error("UX specification is required for deployment");
  }

  try {
    const response = await fetchWithRetry("/api/deploy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        projectId: projectId.trim(),
        prd: prd.trim(),
        ux: ux.trim()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as DeployResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection and try again.");
      }
      if (error.message.includes("500")) {
        throw new Error("Service temporarily unavailable. Please try again in a few minutes.");
      }
      if (error.message.includes("429")) {
        throw new Error("Too many requests. Please wait a moment before trying again.");
      }
      throw error;
    }
    
    throw new Error("An unexpected error occurred. Please try again.");
  }
}