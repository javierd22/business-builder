/**
 * Local caching system for Plan/UX generation
 * Avoids duplicate work by caching results based on input parameters
 */

import { hashObject } from './hash';

export interface CacheEntry {
  text: string;
  meta?: Record<string, unknown>;
  timestamp: number;
  hits: number;
}

export interface CacheKey {
  step: 'plan' | 'ux' | 'preview';
  idea: string;
  persona?: string;
  job?: string;
  promptVersion?: string;
  temperature?: number;
  depth?: string;
  format?: string;
  revision?: string;
}

const CACHE_KEY = 'business_builder_cache';
const MAX_CACHE_ENTRIES = 100;
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Check if we're in a client environment
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get cache storage structure
 */
interface CacheStorage {
  entries: Record<string, CacheEntry>;
  lastCleanup: number;
}

/**
 * Get the cache from localStorage
 */
function getCache(): CacheStorage {
  if (!isClient()) {
    return { entries: {}, lastCleanup: Date.now() };
  }
  
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure required fields exist
      return {
        entries: parsed.entries || {},
        lastCleanup: parsed.lastCleanup || Date.now(),
      };
    }
  } catch (error) {
    console.error('Failed to parse cache from localStorage', error);
  }
  
  return { entries: {}, lastCleanup: Date.now() };
}

/**
 * Save the cache to localStorage
 */
function saveCache(cache: CacheStorage): void {
  if (!isClient()) return;
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to save cache to localStorage', error);
  }
}

/**
 * Generate cache key from parameters
 */
function generateCacheKey(key: CacheKey): string {
  // Create a deterministic hash of all parameters
  const normalizedKey = {
    step: key.step,
    idea: key.idea.trim().toLowerCase(),
    persona: key.persona?.trim().toLowerCase() || '',
    job: key.job?.trim().toLowerCase() || '',
    promptVersion: key.promptVersion || 'v1',
    temperature: key.temperature || 0.7,
    depth: key.depth || 'standard',
    format: key.format || 'markdown',
    revision: key.revision?.trim().toLowerCase() || '',
  };
  
  return hashObject(normalizedKey);
}

/**
 * Clean up expired entries and enforce size limit
 */
function cleanupCache(cache: CacheStorage): void {
  const now = Date.now();
  const entries = cache.entries;
  
  // Remove expired entries
  Object.keys(entries).forEach(key => {
    const entry = entries[key];
    if (now - entry.timestamp > CACHE_EXPIRY_MS) {
      delete entries[key];
    }
  });
  
  // Enforce size limit using LRU (Least Recently Used)
  const entryKeys = Object.keys(entries);
  if (entryKeys.length > MAX_CACHE_ENTRIES) {
    // Sort by timestamp (oldest first)
    const sortedKeys = entryKeys.sort((a, b) => entries[a].timestamp - entries[b].timestamp);
    
    // Remove oldest entries
    const keysToRemove = sortedKeys.slice(0, entryKeys.length - MAX_CACHE_ENTRIES);
    keysToRemove.forEach(key => delete entries[key]);
  }
  
  cache.lastCleanup = now;
}

/**
 * Get cached result if available
 */
export function getCached(key: CacheKey): { text: string; meta?: Record<string, unknown> } | null {
  if (!isClient()) return null;
  
  const cache = getCache();
  const cacheKey = generateCacheKey(key);
  const entry = cache.entries[cacheKey];
  
  if (!entry) return null;
  
  // Check if entry is expired
  const now = Date.now();
  if (now - entry.timestamp > CACHE_EXPIRY_MS) {
    delete cache.entries[cacheKey];
    saveCache(cache);
    return null;
  }
  
  // Update hit count and timestamp
  entry.hits++;
  entry.timestamp = now;
  saveCache(cache);
  
  return {
    text: entry.text,
    meta: entry.meta ? { ...entry.meta, cached: true } : { cached: true },
  };
}

/**
 * Store result in cache
 */
export function setCached(
  key: CacheKey, 
  text: string, 
  meta?: Record<string, unknown>
): void {
  if (!isClient()) return;
  
  const cache = getCache();
  
  // Clean up if needed (once per day)
  const now = Date.now();
  if (now - cache.lastCleanup > CACHE_EXPIRY_MS) {
    cleanupCache(cache);
  }
  
  const cacheKey = generateCacheKey(key);
  cache.entries[cacheKey] = {
    text,
    meta,
    timestamp: now,
    hits: 0,
  };
  
  saveCache(cache);
}

/**
 * Clear all cached entries
 */
export function clearCache(): void {
  if (!isClient()) return;
  
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Failed to clear cache from localStorage', error);
  }
}

/**
 * Get cache size and statistics
 */
export function getCacheStats(): {
  entryCount: number;
  totalHits: number;
  oldestEntry: number;
  newestEntry: number;
  sizeEstimate: number;
} {
  if (!isClient()) {
    return { entryCount: 0, totalHits: 0, oldestEntry: 0, newestEntry: 0, sizeEstimate: 0 };
  }
  
  const cache = getCache();
  const entries = cache.entries;
  const entryKeys = Object.keys(entries);
  
  if (entryKeys.length === 0) {
    return { entryCount: 0, totalHits: 0, oldestEntry: 0, newestEntry: 0, sizeEstimate: 0 };
  }
  
  let totalHits = 0;
  let oldestEntry = Date.now();
  let newestEntry = 0;
  let sizeEstimate = 0;
  
  entryKeys.forEach(key => {
    const entry = entries[key];
    totalHits += entry.hits;
    oldestEntry = Math.min(oldestEntry, entry.timestamp);
    newestEntry = Math.max(newestEntry, entry.timestamp);
    
    // Rough size estimate
    sizeEstimate += key.length + entry.text.length + (entry.meta ? JSON.stringify(entry.meta).length : 0);
  });
  
  return {
    entryCount: entryKeys.length,
    totalHits,
    oldestEntry,
    newestEntry,
    sizeEstimate,
  };
}

/**
 * Get cache entries sorted by usage (for debugging)
 */
export function getCacheEntries(): Array<{
  key: string;
  entry: CacheEntry;
  age: number;
  hitRate: number;
}> {
  if (!isClient()) return [];
  
  const cache = getCache();
  const entries = cache.entries;
  const now = Date.now();
  
  return Object.entries(entries).map(([key, entry]) => ({
    key,
    entry,
    age: now - entry.timestamp,
    hitRate: entry.hits / Math.max(1, (now - entry.timestamp) / (60 * 1000)), // hits per minute
  })).sort((a, b) => b.entry.hits - a.entry.hits); // Sort by hit count
}

/**
 * Check if cache is enabled (global setting)
 */
export function isCacheEnabled(): boolean {
  if (!isClient()) return false;
  
  try {
    const settings = localStorage.getItem('business_builder_perf_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      return parsed.useCache !== false; // Default to true
    }
  } catch (error) {
    console.error('Failed to parse performance settings', error);
  }
  
  return true; // Default to enabled
}

/**
 * Set cache enabled/disabled
 */
export function setCacheEnabled(enabled: boolean): void {
  if (!isClient()) return;
  
  try {
    const existingSettings = localStorage.getItem('business_builder_perf_settings');
    const settings = existingSettings ? JSON.parse(existingSettings) : {};
    settings.useCache = enabled;
    localStorage.setItem('business_builder_perf_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to update cache setting', error);
  }
}

/**
 * Get cache hit rate (percentage of requests served from cache)
 */
export function getCacheHitRate(): number {
  const stats = getCacheStats();
  if (stats.totalHits === 0) return 0;
  
  // This is a simplified calculation - in a real system you'd track total requests
  // For now, we'll estimate based on hits vs age
  const now = Date.now();
  const entries = getCacheEntries();
  
  if (entries.length === 0) return 0;
  
  const totalAge = entries.reduce((sum, entry) => sum + entry.age, 0);
  const averageAge = totalAge / entries.length;
  
  // Rough estimate: hits per hour * entries / average age
  const estimatedRequests = entries.length * (now / averageAge);
  return Math.min(100, (stats.totalHits / Math.max(1, estimatedRequests)) * 100);
}

