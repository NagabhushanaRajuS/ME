/**
 * Performance Utilities
 * Provides debouncing, throttling, and memoization helpers for optimized rendering
 */

/**
 * Debounce function - delays execution until after specified delay
 * Useful for scroll/resize handlers
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - limits execution frequency
 * Useful for resize/scroll handlers
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize function - caches expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get animation duration based on motion preferences
 */
export function getAnimationDuration(
  preferredMs: number = 300,
  reduceMotionMs: number = 0
): number {
  return prefersReducedMotion() ? reduceMotionMs : preferredMs;
}

/**
 * Check if device is touch-enabled
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    (typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0)) ||
    false
  );
}

/**
 * Report Web Vital metric
 */
export function reportMetric(metric: string, value: number) {
  if (typeof window !== "undefined" && "navigator" in window) {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`${metric}: ${value.toFixed(2)}`);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === "production") {
      // For Vercel Analytics or custom analytics endpoint
      try {
        const body = JSON.stringify({
          metric,
          value,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        });

        // Beacon API for analytics
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/analytics", body);
        }
      } catch (error) {
        console.error("Failed to report metric:", error);
      }
    }
  }
}

/**
 * Measure Core Web Vitals
 */
export function measureWebVitals() {
  if (typeof window === "undefined") return;

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    reportMetric("LCP", lastEntry.renderTime || lastEntry.loadTime);
  });
  lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if ((entry as any).hadRecentInput) continue;
      clsValue += (entry as any).value;
      reportMetric("CLS", clsValue);
    }
  });
  clsObserver.observe({ entryTypes: ["layout-shift"] });

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      reportMetric("FID", (entry as any).processingDuration);
    });
  });
  fidObserver.observe({ entryTypes: ["first-input"] });
}

/**
 * Detect if user is on a low-end device
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  const cores = navigator.hardwareConcurrency || 1;
  const ram = (navigator as any).deviceMemory || 4;

  // Consider low-end if < 4 cores and < 4GB RAM
  return cores < 4 && ram < 4;
}

/**
 * Get optimized particle count based on device
 */
export function getOptimizedParticleCount(defaultCount: number = 100): number {
  if (typeof window === "undefined") return defaultCount;

  const mobile = window.innerWidth < 768;
  const lowEnd = isLowEndDevice();

  if (lowEnd) return Math.floor(defaultCount * 0.3); // 30%
  if (mobile) return Math.floor(defaultCount * 0.5); // 50%
  return defaultCount;
}

/**
 * Request idle callback polyfill
 */
export function requestIdleCallback(
  cb: IdleRequestCallback,
  options?: IdleRequestOptions
): number {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    return window.requestIdleCallback(cb, options);
  }

  const start = Date.now();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    } as IdleDeadline);
  }, 1) as unknown as number;
}

/**
 * Cancel idle callback
 */
export function cancelIdleCallback(id: number): void {
  if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}
