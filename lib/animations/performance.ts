"use client"

export interface AnimationMetrics {
  fps: number
  avgFrameTime: number
  droppedFrames: number
  animationCount: number
}

class AnimationPerformanceMonitor {
  private frameCount = 0
  private lastTime = performance.now()
  private fps = 60
  private frameTimes: number[] = []
  private maxFrames = 120
  private droppedFrameThreshold = 16.67

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

  getFPS(): number {
    if (this.frameTimes.length === 0) return 0

    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
    return Math.round(1000 / avgFrameTime)
  }

  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 0
    return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
  }

  getDroppedFrameCount(): number {
    return this.frameTimes.filter((time) => time > this.droppedFrameThreshold).length
  }

  getMetrics(): AnimationMetrics {
    return {
      fps: this.getFPS(),
      avgFrameTime: this.getAverageFrameTime(),
      droppedFrames: this.getDroppedFrameCount(),
      animationCount: 0
    }
  }

  reset() {
    this.frameCount = 0
    this.frameTimes = []
    this.lastTime = performance.now()
  }

  isPerformanceGood(): boolean {
    const fps = this.getFPS()
    const droppedFrames = this.getDroppedFrameCount()

    return fps >= 50 && droppedFrames < this.frameTimes.length * 0.1
  }
}

let monitor: AnimationPerformanceMonitor | null = null

export function getAnimationPerformanceMonitor(): AnimationPerformanceMonitor {
  if (!monitor) {
    monitor = new AnimationPerformanceMonitor()
  }
  return monitor
}

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

export function prefersReducedMotionInPerfMonitor(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

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

function checkGPUSupport(): boolean {
  if (typeof window === "undefined") return false

  const canvas = document.createElement("canvas")
  try {
    return !!(window.WebGLRenderingContext && canvas.getContext("webgl"))
  } catch {
    return false
  }
}

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

  const isLowEnd = capabilities.cores < 2 || capabilities.memory < 2
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

export function shouldThrottleAnimations(): boolean {
  const monitor = getAnimationPerformanceMonitor()
  const fps = monitor.getFPS()

  return fps < 45
}

export function getScaledAnimationDuration(baseDuration: number): number {
  const capabilities = getDeviceCapabilities()

  if (capabilities.prefersReducedMotion) {
    return baseDuration * 0.2
  }

  if (shouldThrottleAnimations()) {
    return baseDuration * 0.7
  }

  return baseDuration
}
