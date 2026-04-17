"use client"

import { useEffect, useRef } from "react"
import { useMotionValue, useTransform, useScroll } from "framer-motion"
import { prefersReducedMotion } from "@/lib/motion"
import { type ThemeMode } from "@/lib/themes"

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

export function useParticleFieldAnimation(theme: ThemeMode) {
  const particleConfigs: Record<ThemeMode, { count: number; speed: number; color: string }> = {
    light: { count: 30, speed: 0.3, color: "0, 104, 255" },
    medium: { count: 40, speed: 0.4, color: "255, 90, 54" },
    dark: { count: 55, speed: 0.5, color: "24, 248, 154" }
  }

  const { scrollY } = useScroll()
  const config = particleConfigs[theme]

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

export function useGradientAnimation(
  colorStops: string[],
  options?: { duration?: number; direction?: string }
) {
  const { duration = 15 } = options || {}

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

  return { progress }
}

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
