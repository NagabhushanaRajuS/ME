"use client"

import { motion, useScroll, useSpring } from "framer-motion"
import { useMemo } from "react"

interface ScrollProgressProps {
  /**
   * Height of the progress bar in pixels
   * @default 3
   */
  height?: number

  /**
   * Whether to respect prefers-reduced-motion
   * @default true
   */
  respectReducedMotion?: boolean

  /**
   * Custom className for the progress bar
   */
  className?: string

  /**
   * Spring configuration for smooth animation
   */
  springConfig?: {
    stiffness?: number
    damping?: number
    restDelta?: number
  }
}

/**
 * Animated scroll progress bar component
 * Shows the percentage of page scrolled with smooth spring animation
 * Gradient from accent to accent2, respects prefers-reduced-motion
 */
export function ScrollProgress({
  height = 3,
  respectReducedMotion = true,
  className = "",
  springConfig = {}
}: ScrollProgressProps = {}) {
  const { stiffness = 100, damping = 30, restDelta = 0.001 } = springConfig
  const { scrollYProgress } = useScroll()

  // Check for prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false
    if (!respectReducedMotion) return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [respectReducedMotion])

  // Use spring animation unless reduced motion is preferred
  const scaleX = useSpring(scrollYProgress, {
    stiffness,
    damping,
    restDelta,
    // Disable animation if reduced motion is preferred
    duration: prefersReducedMotion ? 0 : undefined
  })

  return (
    <motion.div
      className={`fixed left-0 top-0 z-50 h-auto w-full origin-left bg-gradient-to-r from-accent to-accent2 ${className}`}
      style={{
        scaleX: prefersReducedMotion ? 0 : scaleX,
        height: `${height}px`
      }}
      aria-hidden="true"
      role="progressbar"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  )
}
