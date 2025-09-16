/**
 * Client-side telemetry for tracking user behavior and willingness-to-pay
 */

interface TelemetryEvent {
  event: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

interface TelemetryData {
  events: TelemetryEvent[];
  counters: Record<string, number>;
  lastUpdated: string;
}

const STORAGE_KEY = 'business_builder_telemetry';

/**
 * Check if we're running in the browser
 */
function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get telemetry data from localStorage
 */
function getTelemetryData(): TelemetryData {
  if (!isClient()) {
    return { events: [], counters: {}, lastUpdated: new Date().toISOString() };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { events: [], counters: {}, lastUpdated: new Date().toISOString() };
    }

    const parsed = JSON.parse(data) as TelemetryData;
    return {
      events: parsed.events || [],
      counters: parsed.counters || {},
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch (error) {
    console.warn('Failed to parse telemetry data:', error);
    return { events: [], counters: {}, lastUpdated: new Date().toISOString() };
  }
}

/**
 * Save telemetry data to localStorage
 */
function saveTelemetryData(data: TelemetryData): void {
  if (!isClient()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save telemetry data:', error);
  }
}

/**
 * Track an event
 */
export function trackEvent(event: string, data?: Record<string, unknown>): void {
  if (!isClient()) return;

  const telemetryData = getTelemetryData();
  const newEvent: TelemetryEvent = {
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  telemetryData.events.push(newEvent);
  telemetryData.lastUpdated = new Date().toISOString();

  // Keep only last 100 events to prevent storage bloat
  if (telemetryData.events.length > 100) {
    telemetryData.events = telemetryData.events.slice(-100);
  }

  saveTelemetryData(telemetryData);
}

/**
 * Increment a counter
 */
export function incrementCounter(counter: string, amount: number = 1): void {
  if (!isClient()) return;

  const telemetryData = getTelemetryData();
  telemetryData.counters[counter] = (telemetryData.counters[counter] || 0) + amount;
  telemetryData.lastUpdated = new Date().toISOString();

  saveTelemetryData(telemetryData);
}

/**
 * Get counter value
 */
export function getCounter(counter: string): number {
  if (!isClient()) return 0;

  const telemetryData = getTelemetryData();
  return telemetryData.counters[counter] || 0;
}

/**
 * Get all counters
 */
export function getAllCounters(): Record<string, number> {
  if (!isClient()) return {};

  const telemetryData = getTelemetryData();
  return { ...telemetryData.counters };
}

/**
 * Get recent events
 */
export function getRecentEvents(limit: number = 10): TelemetryEvent[] {
  if (!isClient()) return [];

  const telemetryData = getTelemetryData();
  return telemetryData.events.slice(-limit);
}

/**
 * Clear all telemetry data
 */
export function clearTelemetryData(): void {
  if (!isClient()) return;

  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get telemetry summary
 */
export function getTelemetrySummary(): {
  totalEvents: number;
  totalCounters: number;
  counters: Record<string, number>;
  recentEvents: TelemetryEvent[];
  lastUpdated: string;
} {
  if (!isClient()) {
    return {
      totalEvents: 0,
      totalCounters: 0,
      counters: {},
      recentEvents: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  const telemetryData = getTelemetryData();
  return {
    totalEvents: telemetryData.events.length,
    totalCounters: Object.keys(telemetryData.counters).length,
    counters: { ...telemetryData.counters },
    recentEvents: telemetryData.events.slice(-10),
    lastUpdated: telemetryData.lastUpdated,
  };
}

// Predefined tracking functions for common events
export const Telemetry = {
  // Pricing events
  pricingPageViewed: () => trackEvent('pricing_page_viewed'),
  pricingCtaClicked: (tier: string) => trackEvent('pricing_cta_clicked', { tier }),
  tierSelected: (tier: string) => {
    trackEvent('tier_selected', { tier });
    incrementCounter(`tier_${tier.toLowerCase()}_selected`);
  },
  
  // Flow events
  ideaCreated: () => {
    trackEvent('idea_created');
    incrementCounter('ideas_created');
  },
  prdGenerated: () => {
    trackEvent('prd_generated');
    incrementCounter('prds_generated');
  },
  uxGenerated: () => {
    trackEvent('ux_generated');
    incrementCounter('ux_generated');
  },
  projectDeployed: () => {
    trackEvent('project_deployed');
    incrementCounter('projects_deployed');
  },
  
  // Export events
  prdExported: (format: 'markdown' | 'pdf') => {
    trackEvent('prd_exported', { format });
    incrementCounter(`prd_exported_${format}`);
  },
  uxExported: (format: 'markdown' | 'pdf') => {
    trackEvent('ux_exported', { format });
    incrementCounter(`ux_exported_${format}`);
  },
  projectExported: () => {
    trackEvent('project_exported');
    incrementCounter('projects_exported');
  },
  projectImported: () => {
    trackEvent('project_imported');
    incrementCounter('projects_imported');
  },
  
  // Onboarding events
  onboardingStarted: () => trackEvent('onboarding_started'),
  onboardingCompleted: (persona: string, job: string) => {
    trackEvent('onboarding_completed', { persona, job });
    incrementCounter('onboarding_completed');
  },
  
  // Settings events
  settingsViewed: () => trackEvent('settings_viewed'),
  profileUpdated: () => {
    trackEvent('profile_updated');
    incrementCounter('profile_updates');
  },
  
  // Error events
  errorOccurred: (error: string, context?: string) => {
    trackEvent('error_occurred', { error, context });
    incrementCounter('errors_occurred');
  },
};
