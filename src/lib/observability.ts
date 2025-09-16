/**
 * Local-first observability and telemetry utilities
 */

export interface TelemetryEvent {
  id: string;
  name: string;
  route: string;
  ok: boolean;
  ms: number;
  meta?: Record<string, unknown>;
  timestamp: string;
}

export interface TelemetryStats {
  total: number;
  success: number;
  failure: number;
  successRate: number;
  avgMs: number;
  p50Ms: number;
  p95Ms: number;
}

export interface RouteStats {
  plan: TelemetryStats;
  ux: TelemetryStats;
  deploy: TelemetryStats;
}

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Record a telemetry event
 */
export function recordEvent(event: {
  name: string;
  route: string;
  ok: boolean;
  ms: number;
  meta?: Record<string, unknown>;
}): void {
  if (!isClient()) return;

  try {
    const telemetryEvent: TelemetryEvent = {
      id: generateEventId(),
      name: event.name,
      route: event.route,
      ok: event.ok,
      ms: event.ms,
      meta: event.meta || {},
      timestamp: new Date().toISOString()
    };

    const existing = getEvents();
    const updated = [telemetryEvent, ...existing].slice(0, 1000); // Keep last 1000 events
    localStorage.setItem('observability', JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to record telemetry event:', error);
  }
}

/**
 * Get recent telemetry events
 */
export function getEvents(limit: number = 50): TelemetryEvent[] {
  if (!isClient()) return [];

  try {
    const stored = localStorage.getItem('observability');
    if (!stored) return [];
    
    const events: TelemetryEvent[] = JSON.parse(stored);
    return events.slice(0, limit);
  } catch (error) {
    console.warn('Failed to get telemetry events:', error);
    return [];
  }
}

/**
 * Calculate statistics for a set of events
 */
function calculateStats(events: TelemetryEvent[]): TelemetryStats {
  if (events.length === 0) {
    return {
      total: 0,
      success: 0,
      failure: 0,
      successRate: 0,
      avgMs: 0,
      p50Ms: 0,
      p95Ms: 0
    };
  }

  const total = events.length;
  const success = events.filter(e => e.ok).length;
  const failure = total - success;
  const successRate = total > 0 ? (success / total) * 100 : 0;
  
  const msValues = events.map(e => e.ms).sort((a, b) => a - b);
  const avgMs = msValues.reduce((sum, ms) => sum + ms, 0) / total;
  const p50Ms = msValues[Math.floor(msValues.length * 0.5)] || 0;
  const p95Ms = msValues[Math.floor(msValues.length * 0.95)] || 0;

  return {
    total,
    success,
    failure,
    successRate: Math.round(successRate * 100) / 100,
    avgMs: Math.round(avgMs),
    p50Ms: Math.round(p50Ms),
    p95Ms: Math.round(p95Ms)
  };
}

/**
 * Get statistics for all routes
 */
export function getStats(): RouteStats {
  const events = getEvents(1000);
  
  const planEvents = events.filter(e => e.route.includes('/plan') || e.name.includes('plan'));
  const uxEvents = events.filter(e => e.route.includes('/ux') || e.name.includes('ux'));
  const deployEvents = events.filter(e => e.route.includes('/deploy') || e.name.includes('deploy'));

  return {
    plan: calculateStats(planEvents),
    ux: calculateStats(uxEvents),
    deploy: calculateStats(deployEvents)
  };
}

/**
 * Get statistics for a specific route
 */
export function getRouteStats(route: string): TelemetryStats {
  const events = getEvents(1000);
  const routeEvents = events.filter(e => e.route === route);
  return calculateStats(routeEvents);
}

/**
 * Clear all telemetry data
 */
export function clearEvents(): void {
  if (!isClient()) return;
  
  try {
    localStorage.removeItem('observability');
  } catch (error) {
    console.warn('Failed to clear telemetry events:', error);
  }
}

/**
 * Export telemetry data as JSON
 */
export function exportEvents(): string {
  if (!isClient()) return '{}';
  
  try {
    const events = getEvents(1000);
    const stats = getStats();
    
    return JSON.stringify({
      events,
      stats,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  } catch (error) {
    console.warn('Failed to export telemetry events:', error);
    return '{}';
  }
}

/**
 * Get user session ID (for funnel tracking)
 */
export function getSessionId(): string {
  if (!isClient()) return 'server';
  
  try {
    let sessionId = localStorage.getItem('session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('session-id', sessionId);
    }
    return sessionId;
  } catch (error) {
    console.warn('Failed to get session ID:', error);
    return 'unknown';
  }
}
