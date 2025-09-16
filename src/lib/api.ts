/**
 * Robust API client with tolerant parsing, friendly errors, and mock mode
 */

interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

// Custom error types
class NoPlanContentError extends Error {
  constructor() {
    super("The service returned an empty response. Please try again or check your input.");
    this.name = "NoPlanContentError";
  }
}

class NoUXContentError extends Error {
  constructor() {
    super("The UX generation service didn't return any content. Please try again.");
    this.name = "NoUXContentError";
  }
}

class NoDeploymentDataError extends Error {
  constructor() {
    super("The deployment service didn't return deployment information. Please try again.");
    this.name = "NoDeploymentDataError";
  }
}

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

      // Don't retry on 4xx errors (except 429)
      if (!response.ok && !shouldRetry(response, attempt, retryOptions.maxRetries)) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }

      if (response.ok) {
        return response;
      }

      lastError = response;
    } catch (error) {
      lastError = error;

      // Don't retry if we shouldn't
      if (!shouldRetry(error, attempt, retryOptions.maxRetries)) {
        break;
      }
    }

    // Wait before retrying (but not after the last attempt)
    if (attempt < retryOptions.maxRetries) {
      const delay = calculateDelay(attempt, retryOptions.baseDelay, retryOptions.maxDelay);
      await sleep(delay);
    }
  }

  // All retries failed
  if (lastError instanceof Response) {
    const errorText = await lastError.text().catch(() => "Unknown error");
    throw new Error(`Service temporarily unavailable. Please try again in a few minutes.`);
  }

  throw new Error(`Network error. Please check your connection and try again.`);
}

/**
 * Parse response with tolerant fallbacks
 */
async function parseResponse(response: Response): Promise<any> {
  const text = await response.text();
  
  if (!text.trim()) {
    return null;
  }

  // Try to parse as JSON first
  try {
    return JSON.parse(text);
  } catch {
    // If not JSON, return as plain text
    return text;
  }
}

/**
 * Extract PRD content from various response shapes
 */
function extractPRDContent(data: any): string {
  if (!data) {
    throw new NoPlanContentError();
  }

  // Direct string response
  if (typeof data === "string") {
    const content = data.trim();
    if (content) return content;
    throw new NoPlanContentError();
  }

  // Standard format: { prd: string }
  if (data.prd && typeof data.prd === "string") {
    return data.prd.trim();
  }

  // Alternative format: { data: { prd: string } }
  if (data.data?.prd && typeof data.data.prd === "string") {
    return data.data.prd.trim();
  }

  // OpenAI-like format: { choices: [{ message: { content: string } }] }
  if (data.choices && Array.isArray(data.choices) && data.choices[0]) {
    const choice = data.choices[0];
    if (choice.message?.content) {
      return choice.message.content.trim();
    }
    if (choice.text) {
      return choice.text.trim();
    }
  }

  // Generic content field
  if (data.content && typeof data.content === "string") {
    return data.content.trim();
  }

  throw new NoPlanContentError();
}

/**
 * Extract UX content from various response shapes
 */
function extractUXContent(data: any): string {
  if (!data) {
    throw new NoUXContentError();
  }

  // Direct string response
  if (typeof data === "string") {
    const content = data.trim();
    if (content) return content;
    throw new NoUXContentError();
  }

  // Standard format: { ux: string }
  if (data.ux && typeof data.ux === "string") {
    return data.ux.trim();
  }

  // Alternative format: { data: { ux: string } }
  if (data.data?.ux && typeof data.data.ux === "string") {
    return data.data.ux.trim();
  }

  // OpenAI-like format: { choices: [{ message: { content: string } }] }
  if (data.choices && Array.isArray(data.choices) && data.choices[0]) {
    const choice = data.choices[0];
    if (choice.message?.content) {
      return choice.message.content.trim();
    }
    if (choice.text) {
      return choice.text.trim();
    }
  }

  // Generic content field
  if (data.content && typeof data.content === "string") {
    return data.content.trim();
  }

  throw new NoUXContentError();
}

/**
 * Extract deployment info from various response shapes
 */
function extractDeploymentInfo(data: any): { url?: string; status: "deploying" | "completed" | "failed" } {
  if (!data) {
    throw new NoDeploymentDataError();
  }

  let url: string | undefined;
  let status: "deploying" | "completed" | "failed" = "deploying";

  // Direct string response (assume it's a URL)
  if (typeof data === "string") {
    const content = data.trim();
    if (content.startsWith("http")) {
      url = content;
      status = "completed";
    }
  } else {
    // Extract URL from various formats
    url = data.url || data.data?.url || data.deployment_url || data.deploymentUrl;
    
    // Extract status
    if (data.status) {
      status = data.status;
    } else if (data.data?.status) {
      status = data.data.status;
    } else if (url) {
      status = "completed";
    }
  }

  return { url, status };
}

// Response types
export interface PlanResponse {
  prd: string;
  isMocked?: boolean;
}

export interface UXResponse {
  ux: string;
  isMocked?: boolean;
}

export interface DeployResponse {
  url?: string;
  status: "deploying" | "completed" | "failed";
  isMocked?: boolean;
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

  // Mock mode
  if (isMockMode()) {
    return {
      prd: `# Product Requirements Document

## Executive Summary
**Product:** ${idea.slice(0, 50)}${idea.length > 50 ? "..." : ""}

## Problem Statement
Addressing the core challenges in the target market through innovative solutions.

## Target Audience
- Primary: Business professionals aged 25-45
- Secondary: Small to medium business owners
- Tertiary: Freelancers and consultants

## Core Features
1. **User Authentication**: Secure login and registration system
2. **Dashboard**: Comprehensive overview of key metrics
3. **Data Management**: Create, read, update, and delete functionality
4. **Reporting**: Generate insights and analytics
5. **Mobile Responsive**: Optimized for all devices

## Technical Requirements
- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Deployment**: Cloud-based infrastructure

## Success Metrics
- User adoption rate: 80% within first quarter
- Customer satisfaction: 4.5+ stars
- System uptime: 99.9%

## Timeline
- Phase 1 (MVP): 8 weeks
- Phase 2 (Enhanced features): 12 weeks
- Phase 3 (Scale): 16 weeks`,
      isMocked: true,
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
    if (error instanceof NoPlanContentError) {
      throw error;
    }
    
    if (error instanceof Error) {
      // Transform network/server errors into user-friendly messages
      if (error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection and try again.");
      }
      if (error.message.includes("500")) {
        throw new Error("Service temporarily unavailable. Please try again in a few minutes.");
      }
      if (error.message.includes("429")) {
        throw new Error("Too many requests. Please wait a moment before trying again.");
      }
      throw new Error("Unable to generate business plan. Please try again.");
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

  // Mock mode
  if (isMockMode()) {
    return {
      ux: `# User Experience Design

## Design Principles
- **Simplicity**: Clean, intuitive interface
- **Accessibility**: WCAG 2.1 AA compliant
- **Consistency**: Unified design language
- **Performance**: Fast loading times

## User Flows

### Primary Flow: Onboarding
1. **Landing Page**: Hero section with clear value proposition
2. **Registration**: Simple 3-step signup process
3. **Profile Setup**: Guided configuration wizard
4. **Dashboard**: First-time user welcome tour

### Secondary Flow: Core Features
1. **Navigation**: Persistent sidebar with main sections
2. **Data Entry**: Progressive forms with validation
3. **Results**: Interactive charts and tables
4. **Export**: Multiple format options (PDF, CSV, Excel)

## Key Screens

### Dashboard
- Header with user profile and notifications
- Quick stats cards showing key metrics
- Recent activity feed
- Call-to-action buttons for primary tasks

### Settings
- Account management panel
- Preferences and customization options
- Privacy and security settings
- Billing and subscription management

## Mobile Experience
- Touch-friendly interface with 44px minimum tap targets
- Responsive grid layout that adapts to screen size
- Simplified navigation for mobile contexts
- Optimized forms for mobile input

## Accessibility Features
- High contrast mode support
- Screen reader compatible
- Keyboard navigation throughout
- Clear focus indicators`,
      isMocked: true,
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
    if (error instanceof NoUXContentError) {
      throw error;
    }

    if (error instanceof Error) {
      // Transform network/server errors into user-friendly messages
      if (error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection and try again.");
      }
      if (error.message.includes("500")) {
        throw new Error("Service temporarily unavailable. Please try again in a few minutes.");
      }
      if (error.message.includes("429")) {
        throw new Error("Too many requests. Please wait a moment before trying again.");
      }
      throw new Error("Unable to generate UX design. Please try again.");
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

  // Mock mode
  if (isMockMode()) {
    return {
      url: "https://example.com/live-demo",
      status: "completed",
      isMocked: true,
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
    if (error instanceof NoDeploymentDataError) {
      throw error;
    }

    if (error instanceof Error) {
      // Transform network/server errors into user-friendly messages
      if (error.message.includes("fetch")) {
        throw new Error("Network error. Please check your connection and try again.");
      }
      if (error.message.includes("500")) {
        throw new Error("Service temporarily unavailable. Please try again in a few minutes.");
      }
      if (error.message.includes("429")) {
        throw new Error("Too many requests. Please wait a moment before trying again.");
      }
      throw new Error("Unable to deploy your project. Please try again.");
    }

    throw new Error("An unexpected error occurred. Please try again.");
  }
}