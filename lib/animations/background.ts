"use client"

import { useEffect, useRef, useCallback } from "react"
import { useMotionValue, useTransform, useScroll } from "framer-motion"
import { prefersReducedMotion } from "@/lib/motion"
import { type ThemeMode } from "@/lib/themes"

/**
 * useAnimateParticleIntensity
 * Dynamically adjusts particle count based on scroll position.
 * More particles visible as user scrolls through content.
 */
export function useAnimateParticleIntensity(
  options?: { minCount?: number; maxCount?: number; scrollFactor?: number }
) {
  const { minCount = 20, maxCount = 80, scrollFactor = 0.05 } = options || {}
  const { scrollY } = useScroll()

  const particleCount = useTransform(scrollY, (value) => {
    if (prefersReducedMotion()) return minCount

    const increase = value * scrollFactor
    return Math.min(minCount + Math.floor(increase), maxCount)
  })

  return particleCount
}

/**
 * useAnimateOrbPosition
 * Smoothly animates orb positions based on scroll.
 * Creates parallax depth effect with background elements.
 */
export function useAnimateOrbPosition(
  orbIndex: number = 0,
  options?: { speed?: number; maxOffset?: number }
) {
  const { speed = 0.3, maxOffset = 100 } = options || {}
  const { scrollY } = useScroll()

  const offsetMultiplier = orbIndex === 0 ? 1 : -0.8

  const x = useTransform(scrollY, (value) => {
    if (prefersReducedMotion()) return 0
    const offset = value * speed * offsetMultiplier
    return Math.min(Math.abs(offset), maxOffset) * Math.sign(offset)
  })

  const y = useTransform(scrollY, (value) => {
    if (prefersReducedMotion()) return 0
    const offset = value * (speed * 0.6) * -offsetMultiplier
    return Math.min(Math.abs(offset), maxOffset) * Math.sign(offset)
  })

  return { x, y }
}

/**
 * useAnimateBackgroundGradient
 * Animates background gradient colors based on theme and scroll.
 * Creates dynamic, flowing background effect.
 */
export function useAnimateBackgroundGradient(
  theme: ThemeMode,
  options?: { duration?: number }
) {
  const { duration = 15 } = options || {}

  const gradientPosition = useMotionValue(0)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const interval = setInterval(() => {
      gradientPosition.set((prev) => (prev + 1) % 100)
    }, duration * 10)

    return () => clearInterval(interval)
  }, [gradientPosition, duration])

  const backgroundPosition = useTransform(gradientPosition, (value) => {
    return `${value}% ${value}%`
  })

  return { backgroundPosition }
}

/**
 * useParticleFieldAnimation
 * Hook for controlling particle field animation properties.
 * Respects theme and reduced motion preferences.
 */
export function useParticleFieldAnimation(theme: ThemeMode) {
  const particleConfigs: Record<ThemeMode, { count: number; speed: number; color: string }> = {
    light: {
      count: 30,
      speed: 0.3,
      color: "0, 104, 255"
    },
    medium: {
      count: 40,
      speed: 0.4,
      color: "255, 90, 54"
    },
    dark: {
      count: 55,
      speed: 0.5,
      color: "24, 248, 154"
    }
  }

  const { scrollY } = useScroll()

  const config = particleConfigs[theme]

  // Animate particle count based on scroll
  const animatedCount = useTransform(scrollY, (value) => {
    if (prefersReducedMotion()) return config.count
    const boost = Math.min(value * 0.1, config.count * 0.5)
    return Math.floor(config.count + boost)
  })

  return {
    baseCount: config.count,
    animatedCount,
    speed: config.speed,
    color: config.color
  }
}

/**
 * useGradientAnimation
 * Creates animated gradient that shifts colors over time.
 * Useful for dynamic background gradients.
 */
export function useGradientAnimation(
  colorStops: string[],
  options?: { duration?: number; direction?: string }
) {
  const { duration = 15, direction = "135deg" } = options || {}

  const progress = useMotionValue(0)

  useEffect(() => {
    if (prefersReducedMotion()) return

    let animationId: ReturnType<typeof requestAnimationFrame> | null = null
    let startTime: number | null = null

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime

      const elapsed = currentTime - startTime
      const percentage = (elapsed % (duration * 1000)) / (duration * 1000)

      progress.set(percentage)
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [progress, duration])

  const backgroundImage = useTransform(progress, (value) => {
    const index = Math.floor(value * (colorStops.length - 1))
    const nextIndex = (index + 1) % colorStops.length

    const gradient = `${direction}, ${colorStops[index]}, ${colorStops[nextIndex]}`
    return `linear-gradient(${gradient})`
  })

  return { backgroundImage, progress }
}

/**
 * useScrollBasedOpacity
 * Fades elements in/out based on scroll position.
 * Creates depth and visual hierarchy.
 */
export function useScrollBasedOpacity(
  options?: { startScroll?: number; endScroll?: number; reverse?: boolean }
) {
  const { startScroll = 0, endScroll = 500, reverse = false } = options || {}
  const { scrollY } = useScroll()

  const opacity = useTransform(scrollY, [startScroll, endScroll], reverse ? [1, 0] : [0, 1], {
    clamp: true
  })

  return opacity
}

/**
 * useFloatingAnimation
 * Creates continuous floating motion for background elements.
 * Includes parallax effect and respects reduced motion.
 */
export function useFloatingAnimation(
  options?: { duration?: number; distance?: number; delay?: number }
) {
  const { duration = 10, distance = 20, delay = 0 } = options || {}

  const y = useMotionValue(0)
  const scale = useMotionValue(1)

  useEffect(() => {
    if (prefersReducedMotion()) return

    let animationId: ReturnType<typeof requestAnimationFrame> | null = null
    let startTime: number | null = null

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime + delay * 1000

      const elapsed = Math.max(0, currentTime - startTime)
      const progress = (elapsed % (duration * 1000)) / (duration * 1000)

      const yPos = Math.sin(progress * Math.PI * 2) * distance
      const scaleVal = 1 + Math.sin(progress * Math.PI * 2) * 0.04

      y.set(yPos)
      scale.set(scaleVal)

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [y, scale, duration, distance, delay])

  return { y, scale }
}

/**
 * useScrollParallax
 * Creates parallax effect for background layers.
 * Different layers move at different speeds.
 */
export function useScrollParallax(speed: number = 0.5, options?: { maxOffset?: number }) {
  const { maxOffset = 200 } = options || {}
  const { scrollY } = useScroll()

  const y = useTransform(scrollY, (value) => {
    if (prefersReducedMotion()) return 0
    const offset = value * speed
    return Math.min(offset, maxOffset)
  })

  return y
}

/**
 * useGlitchEffect
 * Creates subtle glitch animation effect.
 * Useful for cyberpunk/tech aesthetic backgrounds.
 */
export function useGlitchEffect(options?: { enabled?: boolean; intensity?: number }) {
  const { enabled = true, intensity = 2 } = options || {}

  const offsetX = useMotionValue(0)
  const offsetY = useMotionValue(0)
  const opacity = useMotionValue(1)

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return

    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        offsetX.set((Math.random() - 0.5) * intensity)
        offsetY.set((Math.random() - 0.5) * intensity)
        opacity.set(0.9)

        setTimeout(() => {
          offsetX.set(0)
          offsetY.set(0)
          opacity.set(1)
        }, 50)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [enabled, intensity, offsetX, offsetY, opacity])

  return { offsetX, offsetY, opacity }
}

/**
 * useAmbientParticles
 * Low-performance particle animation for ambient effects.
 * Uses SVG or canvas for optimal performance.
 */
export function useAmbientParticles(
  count: number = 20,
  options?: { speed?: number; color?: string }
) {
  const { speed = 0.5, color = "rgba(24, 248, 154, 0.3)" } = options || {}

  const particles = useRef<Array<{ x: number; y: number; vx: number; vy: number }>>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Initialize particles
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles.current) {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2)
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()
  }, [count, speed, color])

  return canvasRef
}
