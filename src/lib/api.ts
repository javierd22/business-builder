/**
 * Robust API client with tolerant parsing, exponential backoff retry, and mock mode
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

  // HTTP errors
  if (error instanceof Response) {
    const status = error.status;
    // Retry on 5xx server errors and 429 rate limit
    return status >= 500 || status === 429;
  }

  return false;
}

/**
 * Fetch with exponential backoff retry
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = DEFAULT_RETRY_OPTIONS
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok && !shouldRetry(response, attempt, retryOptions.maxRetries)) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }

      if (response.ok) {
        return response;
      }

      lastError = response;
    } catch (error) {
      lastError = error;

      if (!shouldRetry(error, attempt, retryOptions.maxRetries)) {
        break;
      }
    }

    if (attempt < retryOptions.maxRetries) {
      const delay = calculateDelay(attempt, retryOptions.baseDelay, retryOptions.maxDelay);
      await sleep(delay);
    }
  }

  if (lastError instanceof Response) {
    await lastError.text().catch(() => "Unknown error");
    throw new Error("Service temporarily unavailable. Please try again in a few minutes.");
  }

  throw new Error("Network error. Please check your connection and try again.");
}

/**
 * Parse response with tolerant fallbacks
 */
async function parseResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  
  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Extract PRD content from various response shapes
 */
function extractPRDContent(data: unknown): string {
  if (!data) {
    throw new Error("The service returned no content.");
  }

  if (typeof data === "string") {
    const content = data.trim();
    if (content) return content;
    throw new Error("The service returned no content.");
  }

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;
    
    // Standard format: { prd: string }
    if (record.prd && typeof record.prd === "string") {
      return record.prd.trim();
    }

    // Alternative format: { data: { prd: string } }
    if (typeof record.data === "object" && record.data !== null) {
      const nestedRecord = record.data as Record<string, unknown>;
      if (nestedRecord.prd && typeof nestedRecord.prd === "string") {
        return nestedRecord.prd.trim();
      }
    }

    // OpenAI-like format
    if (Array.isArray(record.choices) && record.choices[0]) {
      const choice = record.choices[0] as Record<string, unknown>;
      if (typeof choice.message === "object" && choice.message !== null) {
        const message = choice.message as Record<string, unknown>;
        if (message.content && typeof message.content === "string") {
          return message.content.trim();
        }
      }
      if (choice.text && typeof choice.text === "string") {
        return choice.text.trim();
      }
    }
  }

  throw new Error("The service returned no content.");
}

/**
 * Extract UX content from various response shapes
 */
function extractUXContent(data: unknown): string {
  if (!data) {
    throw new Error("The service returned no content.");
  }

  if (typeof data === "string") {
    const content = data.trim();
    if (content) return content;
    throw new Error("The service returned no content.");
  }

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;
    
    // Standard format: { ux: string }
    if (record.ux && typeof record.ux === "string") {
      return record.ux.trim();
    }

    // Alternative format: { data: { ux: string } }
    if (typeof record.data === "object" && record.data !== null) {
      const nestedRecord = record.data as Record<string, unknown>;
      if (nestedRecord.ux && typeof nestedRecord.ux === "string") {
        return nestedRecord.ux.trim();
      }
    }

    // OpenAI-like format
    if (Array.isArray(record.choices) && record.choices[0]) {
      const choice = record.choices[0] as Record<string, unknown>;
      if (typeof choice.message === "object" && choice.message !== null) {
        const message = choice.message as Record<string, unknown>;
        if (message.content && typeof message.content === "string") {
          return message.content.trim();
        }
      }
      if (choice.text && typeof choice.text === "string") {
        return choice.text.trim();
      }
    }
  }

  throw new Error("The service returned no content.");
}

/**
 * Extract deployment info from various response shapes
 */
function extractDeploymentInfo(data: unknown): { url?: string; status: "deploying" | "completed" | "failed" } {
  if (!data) {
    throw new Error("The service returned no content.");
  }

  let url: string | undefined;
  let status: "deploying" | "completed" | "failed" = "deploying";

  if (typeof data === "string") {
    const content = data.trim();
    if (content.startsWith("http")) {
      url = content;
      status = "completed";
    }
  } else if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;
    
    // Extract URL from various formats
    url = (record.url as string) || 
          (typeof record.data === "object" && record.data !== null ? (record.data as Record<string, unknown>).url as string : undefined);
    
    // Extract status
    if (typeof record.status === "string" && (record.status === "deploying" || record.status === "completed" || record.status === "failed")) {
      status = record.status;
    } else if (typeof record.data === "object" && record.data !== null) {
      const nestedRecord = record.data as Record<string, unknown>;
      if (typeof nestedRecord.status === "string" && (nestedRecord.status === "deploying" || nestedRecord.status === "completed" || nestedRecord.status === "failed")) {
        status = nestedRecord.status;
      }
    } else if (url) {
      status = "completed";
    }
  }

  return { url, status };
}

// Response types
export interface PlanResponse {
  prd: string;
}

export interface UXResponse {
  ux: string;
}

export interface DeployResponse {
  url?: string;
  status: "deploying" | "completed" | "failed";
}

/**
 * Create a business plan from an idea
 */
export async function createPlan(idea: string): Promise<PlanResponse> {
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
    };
  }

  try {
    const response = await fetchWithRetry("/api/plan", {
      method: "POST",
      body: JSON.stringify({ idea: idea.trim() }),
    });

    const data = await parseResponse(response);
    const prd = extractPRDContent(data);

    return { prd };
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
export async function createUX(prd: string): Promise<UXResponse> {
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
3. **Profile Setup** - Guided configuration with smart defaults
4. **Dashboard Tour** - Interactive walkthrough of key features

### Core Application Flow
1. **Navigation** - Persistent sidebar with clear sections
2. **Data Entry** - Progressive forms with inline validation
3. **Results Display** - Interactive charts and sortable tables
4. **Export Options** - Multiple formats (PDF, CSV, Excel)

## Key Screens

### Dashboard
- Header with user profile and notifications
- Quick stats cards showing important metrics
- Recent activity feed with timestamps
- Primary action buttons for common tasks

### Settings
- Account management and profile editing
- Preference controls for customization
- Privacy and security configurations
- Billing and subscription management

## Mobile Experience
- Touch-friendly interface with 44px minimum tap targets
- Responsive grid layout adapting to screen size
- Simplified navigation optimized for mobile
- Gesture support for common actions

## Accessibility Features
- High contrast mode for improved visibility
- Screen reader compatibility with proper ARIA labels
- Keyboard navigation throughout the application
- Clear focus indicators for all interactive elements`,
    };
  }

  try {
    const response = await fetchWithRetry("/api/ux", {
      method: "POST",
      body: JSON.stringify({ prd: prd.trim() }),
    });

    const data = await parseResponse(response);
    const ux = extractUXContent(data);

    return { ux };
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
 * Request deployment for a project
 */
export async function requestDeploy(projectId: string): Promise<DeployResponse> {
  if (!projectId.trim()) {
    throw new Error("Project ID is required");
  }

  if (isMockMode()) {
    return {
      url: "https://example.com/live-demo",
      status: "completed",
    };
  }

  try {
    const response = await fetchWithRetry("/api/deploy", {
      method: "POST",
      body: JSON.stringify({ projectId: projectId.trim() }),
    });

    const data = await parseResponse(response);
    const deploymentInfo = extractDeploymentInfo(data);

    return deploymentInfo;
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