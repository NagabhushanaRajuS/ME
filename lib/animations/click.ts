"use client"

import { useRef, useCallback, useEffect } from "react"
import { useMotionValue, useSpring } from "framer-motion"
import { prefersReducedMotion } from "@/lib/motion"

export function useClickAnimation(options?: { feedback?: boolean; scale?: number }) {
  const ref = useRef<HTMLElement>(null)
  const { feedback = true, scale = 0.96 } = options || {}

  const clickScale = useMotionValue(1)
  const springScale = useSpring(clickScale, { stiffness: 200, damping: 10 })

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion()) return

      clickScale.set(scale)
      setTimeout(() => clickScale.set(1), 100)

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

export function useClickPulse(options?: { duration?: number; maxRadius?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { duration = 600 } = options || {}

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

      const maxDistance = Math.max(
        Math.sqrt(x * x + y * y),
        Math.sqrt((rect.width - x) ** 2 + (rect.height - y) ** 2),
        Math.sqrt(x ** 2 + (rect.height - y) ** 2),
        Math.sqrt((rect.width - x) ** 2 + y ** 2)
      )

      const id = nextIdRef.current++
      ripples.current.push({ x, y, size: maxDistance * 2, id })

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
