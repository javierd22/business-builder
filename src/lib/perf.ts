/**
 * Performance monitoring utilities using the Performance API
 * Updated: Fixed TypeScript casting issues for browser APIs
 */

import { recordEvent } from './observability';

function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Initialize performance monitoring
 */
export function init(): void {
  if (!isClient()) return;

  try {
    // Record initial render time
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const renderTime = navigation.loadEventEnd - navigation.loadEventStart;
      recordEvent({
        name: 'web-vitals',
        route: window.location.pathname,
        ok: true,
        ms: Math.round(renderTime),
        meta: {
          type: 'initial-render',
          loadEventEnd: navigation.loadEventEnd
        }
      });
    }

    // Monitor for LCP (Largest Contentful Paint) if available
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          
          recordEvent({
            name: 'web-vitals',
            route: window.location.pathname,
            ok: true,
            ms: Math.round(lastEntry.startTime),
            meta: {
              type: 'lcp',
              element: (lastEntry as any).element?.tagName || 'unknown'
            }
          });
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP monitoring not supported:', error);
      }

      // Monitor for CLS (Cumulative Layout Shift) if available
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += (layoutShiftEntry.value as number) || 0;
            }
          }
          
          recordEvent({
            name: 'web-vitals',
            route: window.location.pathname,
            ok: true,
            ms: Math.round(clsValue * 1000), // Convert to ms
            meta: {
              type: 'cls',
              value: clsValue
            }
          });
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS monitoring not supported:', error);
      }
    }

    // Record page load completion
    recordEvent({
      name: 'page-load',
      route: window.location.pathname,
      ok: true,
      ms: 0,
      meta: {
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        connection: (navigator as any).connection?.effectiveType || 'unknown'
      }
    });

  } catch (error) {
    console.warn('Performance monitoring initialization failed:', error);
  }
}

/**
 * Measure function execution time
 */
export function measureFunction<T>(
  name: string,
  route: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result.then(
        (value) => {
          const endTime = performance.now();
          recordEvent({
            name,
            route,
            ok: true,
            ms: Math.round(endTime - startTime)
          });
          return value;
        },
        (error) => {
          const endTime = performance.now();
          recordEvent({
            name,
            route,
            ok: false,
            ms: Math.round(endTime - startTime),
            meta: { error: error.message }
          });
          throw error;
        }
      );
    } else {
      const endTime = performance.now();
      recordEvent({
        name,
        route,
        ok: true,
        ms: Math.round(endTime - startTime)
      });
      return result;
    }
  } catch (error) {
    const endTime = performance.now();
    recordEvent({
      name,
      route,
      ok: false,
      ms: Math.round(endTime - startTime),
      meta: { error: (error as Error).message }
    });
    throw error;
  }
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(): {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  timing?: {
    loadEventEnd: number;
    domContentLoaded: number;
  };
} {
  if (!isClient()) return {};

  const metrics: Record<string, unknown> = {};

  // Memory usage (if available)
  if ('memory' in performance) {
    const memory = (performance as any).memory as Record<string, number>;
    metrics.memory = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    };
  }

  // Navigation timing
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    metrics.timing = {
      loadEventEnd: navigation.loadEventEnd,
      domContentLoaded: navigation.domContentLoadedEventEnd
    };
  }

  return metrics;
}
