"use client"

import { useEffect, useState } from "react"
import type { ThemeMode } from "@/lib/themes"

/**
 * Animation configuration based on theme and user preferences
 */
export interface AnimationConfig {
  // Durations in seconds
  fastDuration: number
  normalDuration: number
  slowDuration: number

  // Delays in seconds
  fastDelay: number
  normalDelay: number
  slowDelay: number

  // Easing curves
  easeQuint: number[]
  easeQuad: number[]
  easeLinear: number[]

  // Spring physics
  springConfig: {
    stiffness: number
    damping: number
    mass: number
  }

  // Particle & effect counts
  particleCount: number

  // Motion preference
  prefersReducedMotion: boolean
}

const themeAnimationConfigMap: Record<ThemeMode, Omit<AnimationConfig, "prefersReducedMotion">> = {
  light: {
    fastDuration: 0.3,
    normalDuration: 0.5,
    slowDuration: 0.8,
    fastDelay: 0.05,
    normalDelay: 0.1,
    slowDelay: 0.15,
    easeQuint: [0.22, 1, 0.36, 1],
    easeQuad: [0.25, 0.46, 0.45, 0.94],
    easeLinear: [0, 0, 1, 1],
    springConfig: {
      stiffness: 100,
      damping: 30,
      mass: 1
    },
    particleCount: 80
  },
  medium: {
    fastDuration: 0.35,
    normalDuration: 0.6,
    slowDuration: 0.9,
    fastDelay: 0.06,
    normalDelay: 0.12,
    slowDelay: 0.18,
    easeQuint: [0.22, 1, 0.36, 1],
    easeQuad: [0.25, 0.46, 0.45, 0.94],
    easeLinear: [0, 0, 1, 1],
    springConfig: {
      stiffness: 90,
      damping: 28,
      mass: 1
    },
    particleCount: 100
  },
  dark: {
    fastDuration: 0.4,
    normalDuration: 0.7,
    slowDuration: 1.0,
    fastDelay: 0.07,
    normalDelay: 0.14,
    slowDelay: 0.21,
    easeQuint: [0.22, 1, 0.36, 1],
    easeQuad: [0.25, 0.46, 0.45, 0.94],
    easeLinear: [0, 0, 1, 1],
    springConfig: {
      stiffness: 80,
      damping: 25,
      mass: 1
    },
    particleCount: 120
  }
}

/**
 * Hook that returns animation configuration based on theme and motion preferences
 * Automatically disables animations if user prefers reduced motion
 */
export function useAnimationConfig(theme: ThemeMode): AnimationConfig {
  const [config, setConfig] = useState<AnimationConfig>(() => ({
    ...themeAnimationConfigMap[theme],
    prefersReducedMotion: false
  }))

  useEffect(() => {
    // Check for prefers-reduced-motion media query
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setConfig(prev => ({
        ...prev,
        prefersReducedMotion: e.matches,
        // Adjust durations if reduced motion is preferred
        fastDuration: e.matches ? 0 : themeAnimationConfigMap[theme].fastDuration,
        normalDuration: e.matches ? 0 : themeAnimationConfigMap[theme].normalDuration,
        slowDuration: e.matches ? 0 : themeAnimationConfigMap[theme].slowDuration,
        fastDelay: 0,
        normalDelay: 0,
        slowDelay: 0
      }))
    }

    // Check current state
    handleChange(mediaQuery)

    // Listen for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  return config
}

/**
 * Get reduced motion duration (returns 0 if reduced motion is preferred, otherwise returns the normal duration)
 */
export function getReducedMotionDuration(duration: number, prefersReducedMotion: boolean): number {
  return prefersReducedMotion ? 0 : duration
}

/**
 * Get animation configuration without a React component context
 * Use this for utility functions that aren't in React components
 */
export function getStaticAnimationConfig(theme: ThemeMode): Omit<AnimationConfig, "prefersReducedMotion"> {
  return themeAnimationConfigMap[theme]
}
