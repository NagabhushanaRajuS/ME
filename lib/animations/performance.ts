"use client"

/**
 * Performance Monitoring Utilities
 * Track animation performance and provide metrics
 */

export interface AnimationMetrics {
  fps: number
  avgFrameTime: number
  droppedFrames: number
  animationCount: number
  memoryUsage?: number
}

class AnimationPerformanceMonitor {
  private frameCount = 0
  private lastTime = performance.now()
  private fps = 60
  private frameTimes: number[] = []
  private maxFrames = 120
  private animationElements = new WeakSet<HTMLElement>()
  private droppedFrameThreshold = 16.67 // 60fps

  /**
   * Measure a single frame
   */
  measureFrame() {
    const now = performance.now()
    const frameTime = now - this.lastTime

    this.frameTimes.push(frameTime)
    if (this.frameTimes.length > this.maxFrames) {
      this.frameTimes.shift()
    }

    this.frameCount++
    this.lastTime = now

    return frameTime
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    if (this.frameTimes.length === 0) return 0

    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
    return Math.round(1000 / avgFrameTime)
  }

  /**
   * Get average frame time in milliseconds
   */
  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 0
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
  }

  /**
   * Count dropped frames (frames slower than 60fps threshold)
   */
  getDroppedFrameCount(): number {
    return this.frameTimes.filter((time) => time > this.droppedFrameThreshold).length
  }

  /**
   * Track animated element
   */
  trackElement(element: HTMLElement) {
    this.animationElements.add(element)
  }

  /**
   * Get animated element count
   */
  getAnimatedElementCount(): number {
    // WeakSet doesn't have length, so we estimate
    return 0 // Would need proper tracking mechanism
  }

  /**
   * Get all metrics
   */
  getMetrics(): AnimationMetrics {
    return {
      fps: this.getFPS(),
      avgFrameTime: this.getAverageFrameTime(),
      droppedFrames: this.getDroppedFrameCount(),
      animationCount: this.getAnimatedElementCount()
    }
  }

  /**
   * Reset metrics
   */
  reset() {
    this.frameCount = 0
    this.frameTimes = []
    this.lastTime = performance.now()
  }

  /**
   * Check if performance is acceptable
   */
  isPerformanceGood(): boolean {
    const fps = this.getFPS()
    const droppedFrames = this.getDroppedFrameCount()

    return fps >= 50 && droppedFrames < this.frameTimes.length * 0.1
  }
}

// Singleton instance
let monitor: AnimationPerformanceMonitor | null = null

/**
 * Get performance monitor instance
 */
export function getAnimationPerformanceMonitor(): AnimationPerformanceMonitor {
  if (!monitor) {
    monitor = new AnimationPerformanceMonitor()
  }
  return monitor
}

/**
 * Use animation performance monitoring in React
 */
export function useAnimationPerformance() {
  const monitor = getAnimationPerformanceMonitor()

  return {
    measureFrame: () => monitor.measureFrame(),
    getFPS: () => monitor.getFPS(),
    getAverageFrameTime: () => monitor.getAverageFrameTime(),
    getMetrics: () => monitor.getMetrics(),
    isPerformanceGood: () => monitor.isPerformanceGood()
  }
}

/**
 * Detect if device prefers reduced motion
 */
export function prefersReducedMotionInPerfMonitor(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Get device capabilities
 */
export interface DeviceCapabilities {
  cores: number
  memory: number
  hasGPU: boolean
  connectionSpeed: "4g" | "3g" | "2g" | "slow-2g" | "unknown"
  prefersReducedMotion: boolean
}

export function getDeviceCapabilities(): DeviceCapabilities {
  const navigator_ = typeof navigator !== "undefined" ? navigator : null
  const connection = (navigator_ as any)?.connection

  return {
    cores: navigator_?.hardwareConcurrency || 4,
    memory: (navigator_ as any)?.deviceMemory || 4,
    hasGPU: checkGPUSupport(),
    connectionSpeed: connection?.effectiveType || "unknown",
    prefersReducedMotion: prefersReducedMotionInPerfMonitor()
  }
}

/**
 * Check if browser supports GPU rendering
 */
function checkGPUSupport(): boolean {
  if (typeof window === "undefined") return false

  const canvas = document.createElement("canvas")
  try {
    return !!(window.WebGLRenderingContext && canvas.getContext("webgl"))
  } catch {
    return false
  }
}

/**
 * Determine optimal animation settings based on device
 */
export interface AnimationSettings {
  enableParticles: boolean
  particleCount: number
  enableGlows: boolean
  enableBlurs: boolean
  enableParallax: boolean
  enableScrollAnimations: boolean
  reduceMotion: boolean
}

export function getOptimalAnimationSettings(): AnimationSettings {
  const capabilities = getDeviceCapabilities()

  // Conservative settings for low-end devices
  const isLowEnd = capabilities.cores < 2 || capabilities.memory < 2

  // Conservative settings for slow connections
  const isSlowConnection = capabilities.connectionSpeed === "slow-2g" || capabilities.connectionSpeed === "2g"

  return {
    enableParticles: !isLowEnd,
    particleCount: isLowEnd ? 15 : capabilities.memory > 8 ? 60 : 40,
    enableGlows: !isLowEnd && !capabilities.prefersReducedMotion,
    enableBlurs: !isLowEnd && !capabilities.prefersReducedMotion,
    enableParallax: !isLowEnd,
    enableScrollAnimations: !isSlowConnection,
    reduceMotion: capabilities.prefersReducedMotion
  }
}

/**
 * Report animation metrics to analytics (optional)
 */
export function reportAnimationMetrics(callback?: (metrics: AnimationMetrics) => void) {
  if (typeof window === "undefined") return

  const monitor = getAnimationPerformanceMonitor()

  // Measure for 5 seconds then report
  const interval = setInterval(() => {
    const metrics = monitor.getMetrics()
    callback?.(metrics)

    if (!monitor.isPerformanceGood()) {
      console.warn("Animation performance degraded:", metrics)
    }
  }, 5000)

  return () => clearInterval(interval)
}

/**
 * Throttle motion animations based on performance
 */
export function shouldThrottleAnimations(): boolean {
  const monitor = getAnimationPerformanceMonitor()
  const fps = monitor.getFPS()

  // Throttle if FPS drops below 45
  return fps < 45
}

/**
 * Get animation duration scaled for performance
 */
export function getScaledAnimationDuration(baseDuration: number): number {
  const capabilities = getDeviceCapabilities()

  if (capabilities.prefersReducedMotion) {
    return baseDuration * 0.2
  }

  if (shouldThrottleAnimations()) {
    return baseDuration * 0.7 // Reduce slightly to improve performance
  }

  return baseDuration
}
