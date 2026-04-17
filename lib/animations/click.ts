"use client"

import { useRef, useCallback, useEffect } from "react"
import { useMotionValue, useSpring } from "framer-motion"
import { prefersReducedMotion } from "@/lib/motion"

/**
 * useClickAnimation
 * Provides feedback on click with scale and ripple effect.
 * Includes optional haptic feedback for mobile devices.
 */
export function useClickAnimation(options?: { feedback?: boolean; scale?: number }) {
  const ref = useRef<HTMLElement>(null)
  const { feedback = true, scale = 0.96 } = options || {}

  const clickScale = useMotionValue(1)
  const springScale = useSpring(clickScale, { stiffness: 200, damping: 10 })

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion()) return

      // Scale feedback
      clickScale.set(scale)
      setTimeout(() => clickScale.set(1), 100)

      // Haptic feedback on mobile
      if (feedback && navigator.vibrate) {
        navigator.vibrate(10)
      }
    },
    [clickScale, feedback, scale]
  )

  return {
    ref,
    handlers: { onClick: handleClick },
    style: { scale: springScale }
  }
}

/**
 * useClickPulse
 * Creates pulsing animation on click.
 * Radius expands outward from click point.
 */
export function useClickPulse(options?: { duration?: number; maxRadius?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { duration = 600, maxRadius = 300 } = options || {}

  const pulses = useRef<Array<{ x: number; y: number; id: number }>>([])
  const nextIdRef = useRef(0)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion() || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const id = nextIdRef.current++
      pulses.current.push({ x, y, id })

      // Remove pulse after animation completes
      setTimeout(() => {
        pulses.current = pulses.current.filter((p) => p.id !== id)
      }, duration)
    },
    [duration]
  )

  return {
    ref,
    handlers: { onClick: handleClick },
    pulses: pulses.current
  }
}

/**
 * useClickRipple
 * Material Design ripple effect on click.
 * Creates expanding circles from click point.
 */
export function useClickRipple(options?: { color?: string; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { color = "rgba(255, 255, 255, 0.5)", duration = 600 } = options || {}

  const ripples = useRef<Array<{ x: number; y: number; size: number; id: number }>>([])
  const nextIdRef = useRef(0)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion() || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Calculate ripple size
      const maxDistance = Math.max(
        Math.sqrt(x * x + y * y),
        Math.sqrt((rect.width - x) ** 2 + (rect.height - y) ** 2),
        Math.sqrt(x ** 2 + (rect.height - y) ** 2),
        Math.sqrt((rect.width - x) ** 2 + y ** 2)
      )

      const id = nextIdRef.current++
      ripples.current.push({ x, y, size: maxDistance * 2, id })

      // Remove ripple after animation
      setTimeout(() => {
        ripples.current = ripples.current.filter((r) => r.id !== id)
      }, duration)
    },
    [color, duration]
  )

  return {
    ref,
    handlers: { onClick: handleClick },
    ripples: ripples.current,
    color
  }
}

/**
 * useDoubleTapAnimation
 * Detects double tap and triggers animation.
 * Useful for mobile interactions.
 */
export function useDoubleTapAnimation(
  onDoubleTap?: () => void,
  options?: { tapDelay?: number; scale?: number }
) {
  const ref = useRef<HTMLElement>(null)
  const { tapDelay = 300, scale = 1.15 } = options || {}

  const lastTapRef = useRef(0)
  const tapScale = useMotionValue(1)
  const springScale = useSpring(tapScale, { stiffness: 120, damping: 12 })

  const handleTouchStart = useCallback(() => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTapRef.current

    if (timeSinceLastTap < tapDelay) {
      // Double tap detected
      if (!prefersReducedMotion()) {
        tapScale.set(scale)
        setTimeout(() => tapScale.set(1), 150)
      }
      onDoubleTap?.()
    }

    lastTapRef.current = now
  }, [onDoubleTap, tapDelay, tapScale, scale])

  return {
    ref,
    handlers: { onTouchStart: handleTouchStart },
    style: { scale: springScale }
  }
}

/**
 * useLongPressAnimation
 * Triggers animation on long press/click.
 * Returns state indicating if pressed and duration.
 */
export function useLongPressAnimation(
  onLongPress?: () => void,
  options?: { duration?: number; minScale?: number }
) {
  const ref = useRef<HTMLElement>(null)
  const { duration = 500, minScale = 0.95 } = options || {}

  const pressScale = useMotionValue(1)
  const springScale = useSpring(pressScale, { stiffness: 100, damping: 12 })
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseDown = useCallback(() => {
    if (prefersReducedMotion()) return

    pressScale.set(minScale)

    timeoutRef.current = setTimeout(() => {
      onLongPress?.()
    }, duration)
  }, [pressScale, minScale, onLongPress, duration])

  const handleMouseUp = useCallback(() => {
    pressScale.set(1)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [pressScale])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    ref,
    handlers: { onMouseDown: handleMouseDown, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp },
    style: { scale: springScale }
  }
}

/**
 * useClickWave
 * Creates expanding wave effect from click point.
 * Similar to ripple but with different visual style.
 */
export function useClickWave(options?: { color?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { color = "rgba(24, 248, 154, 0.4)", speed = 0.6 } = options || {}

  const waves = useRef<Array<{ x: number; y: number; id: number; startTime: number }>>([])
  const nextIdRef = useRef(0)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion() || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const id = nextIdRef.current++
      waves.current.push({ x, y, id, startTime: Date.now() })

      // Remove wave after animation
      setTimeout(() => {
        waves.current = waves.current.filter((w) => w.id !== id)
      }, 1000 / speed)
    },
    [speed]
  )

  return {
    ref,
    handlers: { onClick: handleClick },
    waves: waves.current,
    color,
    speed
  }
}

/**
 * useClickBurst
 * Creates particle burst effect on click.
 * Particles expand outward from click point.
 */
export function useClickBurst(options?: { particleCount?: number; duration?: number; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { particleCount = 8, duration = 600, speed = 1 } = options || {}

  const bursts = useRef<
    Array<{ particles: Array<{ angle: number; distance: number; id: number }>; id: number }>
  >([])
  const nextIdRef = useRef(0)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion() || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const particles = Array.from({ length: particleCount }, (_, i) => ({
        angle: (i / particleCount) * Math.PI * 2,
        distance: 0,
        id: i
      }))

      const id = nextIdRef.current++
      bursts.current.push({ particles, id })

      // Animate particles
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = elapsed / duration

        bursts.current = bursts.current.map((burst) => ({
          ...burst,
          particles: burst.particles.map((p) => ({
            ...p,
            distance: 100 * progress * speed
          }))
        }))

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          bursts.current = bursts.current.filter((b) => b.id !== id)
        }
      }

      animate()
    },
    [particleCount, duration, speed]
  )

  return {
    ref,
    handlers: { onClick: handleClick },
    bursts: bursts.current
  }
}
