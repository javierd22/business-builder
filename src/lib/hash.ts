/**
 * Deterministic hash utility for small objects/strings
 * Creates stable hashes for evaluation parameters and IDs
 */

/**
 * Simple hash function for strings
 * Returns a short, deterministic hash
 */
function simpleHash(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Create a deterministic hash from an object
 * Sorts keys and stringifies for consistent hashing
 */
export function hashObject(obj: Record<string, unknown>): string {
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: Record<string, unknown> = {};
  
  sortedKeys.forEach(key => {
    sortedObj[key] = obj[key];
  });
  
  return simpleHash(JSON.stringify(sortedObj));
}

/**
 * Create a hash from evaluation parameters
 * Used to group comparable runs
 */
export function hashParams(params: {
  temperature?: number;
  depth?: string;
  format?: string;
  revision?: string;
  promptVersion?: string;
}): string {
  return hashObject(params);
}

/**
 * Create a stable ID for evaluation runs
 * Combines timestamp with random component
 */
export function createRunId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `run_${timestamp}_${random}`;
}

/**
 * Create a stable ID for evaluation sets
 */
export function createSetId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `set_${timestamp}_${random}`;
}

/**
 * Create a stable ID for evaluation items
 */
export function createItemId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `item_${timestamp}_${random}`;
}
