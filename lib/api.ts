/**
 * Resilient API client with retries, typed responses, and user-friendly errors
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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
    throw new Error(`Request failed after ${retryOptions.maxRetries + 1} attempts: ${lastError.status} ${errorText}`);
  }

  throw new Error(`Request failed after ${retryOptions.maxRetries + 1} attempts: ${lastError}`);
}

/**
 * Safely parse JSON response
 */
async function parseJsonResponse<T>(response: Response): Promise<T> {
  try {
    return await response.json();
  } catch (error) {
    throw new Error("Invalid JSON response from server");
  }
}

// Response types
export interface PlanResponse {
  prd?: string;
  message?: string;
  status?: "success" | "error";
}

export interface UXResponse {
  ux?: string;
  message?: string;
  status?: "success" | "error";
}

export interface DeployResponse {
  url?: string;
  status?: "deploying" | "completed" | "failed";
  message?: string;
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

  try {
    const response = await fetchWithRetry("/api/plan", {
      method: "POST",
      body: JSON.stringify({ idea: idea.trim() }),
    });

    const data = await parseJsonResponse<PlanResponse>(response);

    if (!data.prd && !data.message) {
      throw new Error("Invalid response: missing PRD and message");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with more context for user-facing errors
      if (error.message.includes("fetch")) {
        throw new Error("Network error: Please check your internet connection and try again");
      }
      if (error.message.includes("500")) {
        throw new Error("Server error: Our service is temporarily unavailable. Please try again in a few minutes");
      }
      if (error.message.includes("429")) {
        throw new Error("Too many requests: Please wait a moment before trying again");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred while generating your business plan");
  }
}

/**
 * Create UX design from a PRD
 */
export async function createUX(prd: string): Promise<UXResponse> {
  if (!prd.trim()) {
    throw new Error("Product Requirements Document is required");
  }

  try {
    const response = await fetchWithRetry("/api/ux", {
      method: "POST",
      body: JSON.stringify({ prd: prd.trim() }),
    });

    const data = await parseJsonResponse<UXResponse>(response);

    if (!data.ux && !data.message) {
      throw new Error("Invalid response: missing UX design and message");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with more context for user-facing errors
      if (error.message.includes("fetch")) {
        throw new Error("Network error: Please check your internet connection and try again");
      }
      if (error.message.includes("500")) {
        throw new Error("Server error: Our service is temporarily unavailable. Please try again in a few minutes");
      }
      if (error.message.includes("429")) {
        throw new Error("Too many requests: Please wait a moment before trying again");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred while generating your UX design");
  }
}

/**
 * Request deployment for a project
 */
export async function requestDeploy(projectId: string): Promise<DeployResponse> {
  if (!projectId.trim()) {
    throw new Error("Project ID is required");
  }

  try {
    const response = await fetchWithRetry("/api/deploy", {
      method: "POST",
      body: JSON.stringify({ projectId: projectId.trim() }),
    });

    const data = await parseJsonResponse<DeployResponse>(response);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with more context for user-facing errors
      if (error.message.includes("fetch")) {
        throw new Error("Network error: Please check your internet connection and try again");
      }
      if (error.message.includes("500")) {
        throw new Error("Server error: Our service is temporarily unavailable. Please try again in a few minutes");
      }
      if (error.message.includes("429")) {
        throw new Error("Too many requests: Please wait a moment before trying again");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred while deploying your project");
  }
}
