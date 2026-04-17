"use client"

import { useRef, useState, useCallback } from "react"
import { useMotionValue, useSpring, useTransform } from "framer-motion"
import { prefersReducedMotion } from "@/lib/motion"

// Re-export useTransform for use in color animations
const motionTransform = useTransform

/**
 * useHoverAnimation
 * Creates 3D tilt effect on hover with parallax.
 * Uses mouse position to calculate rotation angles.
 */
export function useHoverAnimation(options?: { tiltIntensity?: number; glowColor?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { tiltIntensity = 0.1, glowColor = "rgba(24, 248, 154, 0.3)" } = options || {}

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const scale = useMotionValue(1)

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion() || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const rotateXValue = ((y - rect.height / 2) / rect.height) * tiltIntensity * -10
      const rotateYValue = ((x - rect.width / 2) / rect.width) * tiltIntensity * 10

      rotateX.set(rotateXValue)
      rotateY.set(rotateYValue)
      scale.set(1.05)
    },
    [rotateX, rotateY, scale, tiltIntensity]
  )

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
  }, [rotateX, rotateY, scale])

  return {
    ref,
    handlers: { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave },
    style: { rotateX, rotateY, scale }
  }
}

/**
 * useMagneticHover
 * Element smoothly follows cursor position.
 * Creates magnetic attraction effect towards mouse.
 */
export function useMagneticHover(options?: { strength?: number; threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { strength = 0.16, threshold = 200 } = options || {}

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion() || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const mouseX = event.clientX - rect.left - rect.width / 2
      const mouseY = event.clientY - rect.top - rect.height / 2

      const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY)

      if (distance < threshold) {
        x.set(mouseX * strength)
        y.set(mouseY * strength)
      }
    },
    [x, y, strength, threshold]
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return {
    ref,
    handlers: { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave },
    style: { x, y }
  }
}

/**
 * useHoverScale
 * Spring-based scale animation on hover.
 * Provides natural, bouncy feel when hovering over element.
 */
export function useHoverScale(options?: { stiffness?: number; damping?: number; mass?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { stiffness = 100, damping = 12, mass = 0.8 } = options || {}

  const scale = useMotionValue(1)
  const springScale = useSpring(scale, { stiffness, damping, mass })

  const handleMouseEnter = useCallback(() => {
    if (!prefersReducedMotion()) {
      scale.set(1.08)
    }
  }, [scale])

  const handleMouseLeave = useCallback(() => {
    scale.set(1)
  }, [scale])

  return {
    ref,
    handlers: { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave },
    style: { scale: springScale }
  }
}

/**
 * useGlowHover
 * Creates glowing effect on hover with customizable color.
 * Uses motion values for performance optimization.
 */
export function useGlowHover(options?: { color?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { color = "24, 248, 154", intensity = 0.3 } = options || {}

  const glowOpacity = useMotionValue(0)

  const handleMouseEnter = useCallback(() => {
    if (!prefersReducedMotion()) {
      glowOpacity.set(intensity)
    }
  }, [glowOpacity, intensity])

  const handleMouseLeave = useCallback(() => {
    glowOpacity.set(0)
  }, [glowOpacity])

  const boxShadow = useTransform(glowOpacity, (opacity) => {
    return `0 0 ${24 * opacity}px rgba(${color}, ${opacity})`
  })

  return {
    ref,
    handlers: { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave },
    style: { boxShadow }
  }
}

/**
 * useHoverGradient
 * Animates gradient position on hover.
 * Useful for gradient backgrounds that shift with cursor.
 */
export function useHoverGradient() {
  const ref = useRef<HTMLDivElement>(null)
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 })

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion() || !ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100

      setGradientPos({ x, y })
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    setGradientPos({ x: 50, y: 50 })
  }, [])

  return {
    ref,
    handlers: { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave },
    gradientPos
  }
}

/**
 * useHoverLift
 * Creates lifting/elevation effect on hover.
 * Simulates element rising with shadow adjustment.
 */
export function useHoverLift(options?: { distance?: number; shadowBlur?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { distance = 12, shadowBlur = 24 } = options || {}

  const y = useMotionValue(0)
  const shadowOpacity = useMotionValue(0)

  const handleMouseEnter = useCallback(() => {
    if (!prefersReducedMotion()) {
      y.set(-distance)
      shadowOpacity.set(0.2)
    }
  }, [y, shadowOpacity, distance])

  const handleMouseLeave = useCallback(() => {
    y.set(0)
    shadowOpacity.set(0)
  }, [y, shadowOpacity])

  const boxShadow = useTransform(shadowOpacity, (opacity) => {
    return `0 ${distance}px ${shadowBlur}px rgba(0, 0, 0, ${opacity})`
  })

  return {
    ref,
    handlers: { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave },
    style: { y, boxShadow }
  }
}

/**
 * useColorHover
 * Smoothly transitions color on hover.
 * Useful for text or background color changes.
 */
export function useColorHover(options?: { fromColor?: string; toColor?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { fromColor = "rgb(255, 255, 255)", toColor = "rgb(24, 248, 154)" } = options || {}

  const colorProgress = useMotionValue(0)
  const color = useTransform(colorProgress, (progress) => {
    if (prefersReducedMotion()) return fromColor
    // Simple color interpolation (in real app, might use colord or similar)
    return progress > 0.5 ? toColor : fromColor
  })

  const handleMouseEnter = useCallback(() => {
    colorProgress.set(1)
  }, [colorProgress])

  const handleMouseLeave = useCallback(() => {
    colorProgress.set(0)
  }, [colorProgress])

  return {
    ref,
    handlers: { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave },
    style: { color }
  }
}
