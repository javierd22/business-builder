/**
 * Performance and user settings management
 * Handles localStorage-based settings with SSR safety
 */

export interface PerformanceSettings {
  useCache: boolean;
  defaultTemperature: number;
  defaultDepth: 'brief' | 'standard' | 'deep';
  defaultFormat: 'markdown' | 'bulleted';
  defaultTimeoutMs: number;
  lastUpdated: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  showCostEstimates: boolean;
  showLatencyWarnings: boolean;
}

const PERFORMANCE_SETTINGS_KEY = 'business_builder_perf_settings';
const USER_PREFERENCES_KEY = 'business_builder_user_prefs';

// Default performance settings
const DEFAULT_PERFORMANCE_SETTINGS: PerformanceSettings = {
  useCache: true,
  defaultTemperature: 0.7,
  defaultDepth: 'standard',
  defaultFormat: 'markdown',
  defaultTimeoutMs: 60000,
  lastUpdated: new Date().toISOString(),
};

// Default user preferences
const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'light',
  fontSize: 'medium',
  showCostEstimates: true,
  showLatencyWarnings: true,
};

/**
 * Check if we're in a client environment
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get performance settings from localStorage
 */
export function getPerformanceSettings(): PerformanceSettings {
  if (!isClient()) return DEFAULT_PERFORMANCE_SETTINGS;
  
  try {
    const stored = localStorage.getItem(PERFORMANCE_SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PERFORMANCE_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('Failed to parse performance settings from localStorage', error);
  }
  
  return DEFAULT_PERFORMANCE_SETTINGS;
}

/**
 * Save performance settings to localStorage
 */
export function savePerformanceSettings(settings: Partial<PerformanceSettings>): void {
  if (!isClient()) return;
  
  try {
    const current = getPerformanceSettings();
    const updated = {
      ...current,
      ...settings,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(PERFORMANCE_SETTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save performance settings to localStorage', error);
  }
}

/**
 * Get user preferences from localStorage
 */
export function getUserPreferences(): UserPreferences {
  if (!isClient()) return DEFAULT_USER_PREFERENCES;
  
  try {
    const stored = localStorage.getItem(USER_PREFERENCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_USER_PREFERENCES, ...parsed };
    }
  } catch (error) {
    console.error('Failed to parse user preferences from localStorage', error);
  }
  
  return DEFAULT_USER_PREFERENCES;
}

/**
 * Save user preferences to localStorage
 */
export function saveUserPreferences(preferences: Partial<UserPreferences>): void {
  if (!isClient()) return;
  
  try {
    const current = getUserPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save user preferences to localStorage', error);
  }
}

/**
 * Reset all settings to defaults
 */
export function resetAllSettings(): void {
  if (!isClient()) return;
  
  try {
    localStorage.removeItem(PERFORMANCE_SETTINGS_KEY);
    localStorage.removeItem(USER_PREFERENCES_KEY);
  } catch (error) {
    console.error('Failed to reset settings', error);
  }
}

/**
 * Export all settings for backup
 */
export function exportSettings(): {
  performance: PerformanceSettings;
  preferences: UserPreferences;
  exportedAt: string;
} {
  return {
    performance: getPerformanceSettings(),
    preferences: getUserPreferences(),
    exportedAt: new Date().toISOString(),
  };
}

/**
 * Import settings from backup data
 */
export function importSettings(data: {
  performance?: Partial<PerformanceSettings>;
  preferences?: Partial<UserPreferences>;
}): boolean {
  if (!isClient()) return false;
  
  try {
    if (data.performance) {
      savePerformanceSettings(data.performance);
    }
    
    if (data.preferences) {
      saveUserPreferences(data.preferences);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import settings', error);
    return false;
  }
}

/**
 * Get storage usage estimate for all settings
 */
export function getSettingsStorageUsage(): {
  performanceSettingsSize: number;
  userPreferencesSize: number;
  totalSize: number;
} {
  if (!isClient()) {
    return { performanceSettingsSize: 0, userPreferencesSize: 0, totalSize: 0 };
  }
  
  try {
    const perfSettings = localStorage.getItem(PERFORMANCE_SETTINGS_KEY) || '';
    const userPrefs = localStorage.getItem(USER_PREFERENCES_KEY) || '';
    
    return {
      performanceSettingsSize: perfSettings.length,
      userPreferencesSize: userPrefs.length,
      totalSize: perfSettings.length + userPrefs.length,
    };
  } catch (error) {
    console.error('Failed to calculate settings storage usage', error);
    return { performanceSettingsSize: 0, userPreferencesSize: 0, totalSize: 0 };
  }
}

