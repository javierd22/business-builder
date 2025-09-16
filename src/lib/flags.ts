/**
 * Feature flags for safe experiments and gradual rollouts
 */

/**
 * Check if we're running in the browser
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get feature flag value from environment variables
 */
function getFlagValue(flagName: string, defaultValue: boolean = false): boolean {
  if (!isClient()) return defaultValue;

  const value = process.env[`NEXT_PUBLIC_${flagName}`];
  if (value === undefined) return defaultValue;
  
  return value === 'true' || value === '1';
}

/**
 * Feature flags configuration
 */
export const FeatureFlags = {
  /**
   * Show pricing page and related CTAs
   */
  showPricing: getFlagValue('SHOW_PRICING', true),

  /**
   * Show export functionality (Markdown, PDF, JSON)
   */
  showExports: getFlagValue('SHOW_EXPORTS', true),

  /**
   * Show insights and analytics dashboard
   */
  showInsights: getFlagValue('SHOW_INSIGHTS', true),

  /**
   * Show onboarding flow
   */
  showOnboarding: getFlagValue('SHOW_ONBOARDING', true),

  /**
   * Show import functionality
   */
  showImport: getFlagValue('SHOW_IMPORT', true),

  /**
   * Show telemetry tracking
   */
  showTelemetry: getFlagValue('SHOW_TELEMETRY', true),

  /**
   * Show flow steps navigation
   */
  showFlowSteps: getFlagValue('SHOW_FLOW_STEPS', true),

  /**
   * Show empty states
   */
  showEmptyStates: getFlagValue('SHOW_EMPTY_STATES', true),

  /**
   * Enable mock mode for demos
   */
  enableMockMode: getFlagValue('MOCK_AI', false),

  /**
   * Show build info badge
   */
  showBuildInfo: getFlagValue('SHOW_BUILD_INFO', false),
};

/**
 * Get all feature flags as an object
 */
export function getAllFlags(): Record<string, boolean> {
  return { ...FeatureFlags };
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FeatureFlags): boolean {
  return FeatureFlags[feature];
}

/**
 * Get feature flag status for debugging
 */
export function getFlagStatus(): {
  flags: Record<string, boolean>;
  environment: string;
  timestamp: string;
} {
  return {
    flags: getAllFlags(),
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  };
}
