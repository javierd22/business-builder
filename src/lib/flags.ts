/**
 * Feature flags for controlling UI visibility
 * Client-safe environment variable reading
 */

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

function getEnvFlag(key: string, defaultValue: boolean): boolean {
  if (!isClient()) return defaultValue;
  
  // Read from NEXT_PUBLIC_ environment variables (client-safe)
  const value = process.env[key];
  if (value === 'true') return true;
  if (value === 'false') return false;
  
  return defaultValue;
}

// Feature flags with sensible defaults
export const SHOW_RESEARCH = getEnvFlag('NEXT_PUBLIC_SHOW_RESEARCH', isDev());
export const SHOW_ASSUMPTIONS = getEnvFlag('NEXT_PUBLIC_SHOW_ASSUMPTIONS', isDev());
export const SHOW_DOC_LINKS = getEnvFlag('NEXT_PUBLIC_SHOW_DOC_LINKS', isDev());

// Helper function to check if research features should be visible
export function shouldShowResearch(): boolean {
  return SHOW_RESEARCH;
}

// Helper function to check if assumptions UI should be visible
export function shouldShowAssumptions(): boolean {
  return SHOW_ASSUMPTIONS;
}

// Helper function to check if documentation links should be visible
export function shouldShowDocLinks(): boolean {
  return SHOW_DOC_LINKS;
}