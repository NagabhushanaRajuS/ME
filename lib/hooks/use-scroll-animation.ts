"use client"

import { useRef, useEffect, useState } from "react"
import { useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion"

/**
 * Configuration for scroll animation
 */
export interface ScrollAnimationConfig {
  offset?: [string, string]
  threshold?: number
  triggerOnce?: boolean
}

/**
 * Return type for useScrollAnimation hook
 */
export interface ScrollAnimationResult {
  ref: React.RefObject<HTMLElement>
  scrollYProgress: MotionValue<number>
  isVisible: boolean
  isInView: boolean
}

/**
 * Hook for scroll-triggered animations with ref tracking
 * Returns ref, scrollYProgress, and visibility state for reveal animations
 *
 * @param config - Configuration for scroll animation behavior
 * @returns Object with ref, scrollYProgress, and visibility states
 */
export function useScrollAnimation(config: ScrollAnimationConfig = {}): ScrollAnimationResult {
  const {
    offset = ["start end", "end start"],
    threshold = 0.1,
    triggerOnce = false
  } = config

  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as [string, string]
  })

  // Track visibility changes
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const isCurrentlyInView = latest > threshold && latest < (1 - threshold)

    setIsInView(isCurrentlyInView)
    setIsVisible(isCurrentlyInView)

    if (isCurrentlyInView && !hasBeenVisible) {
      setHasBeenVisible(true)
    }
  })

  return {
    ref,
    scrollYProgress,
    isVisible: triggerOnce ? hasBeenVisible : isVisible,
    isInView
  }
}

/**
 * Hook for scroll progress with debouncing
 * Returns a smooth scroll progress value
 *
 * @returns Object with ref and scrollYProgress motion value
 */
export function useScrollProgress() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  })

  return {
    ref,
    scrollYProgress
  }
}

/**
 * Hook for parallax scroll effects
 * Transforms scroll progress into position/rotation/opacity changes
 *
 * @param maxDistance - Maximum distance to translate (in pixels)
 * @returns Object with ref and motion value for parallax
 */
export function useParallaxScroll(maxDistance: number = 100) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -maxDistance])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return {
    ref,
    y,
    opacity,
    scrollYProgress
  }
}

/**
 * Hook to detect if element is in viewport with intersection observer fallback
 * More performant than useScroll for simple visibility detection
 *
 * @param options - IntersectionObserver options
 * @returns Object with ref and isVisible state
 */
export function useInView(options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting)
    }, {
      threshold: 0.1,
      ...options
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
      observer.disconnect()
    }
  }, [options])

  return {
    ref,
    isInView
  }
}
