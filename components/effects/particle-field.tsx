"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useScroll } from "framer-motion"
import { useThemeMode } from "@/components/providers/theme-provider"
import { prefersReducedMotion } from "@/lib/utils/performance"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
}

const PARTICLE_COLORS: Record<string, string> = {
  light: "0, 104, 255",
  medium: "255, 90, 54",
  dark: "24, 248, 154"
}

const BASE_PARTICLE_COUNT: Record<string, number> = {
  light: 30,
  medium: 40,
  dark: 55
}

const PARTICLE_SPEED: Record<string, number> = {
  light: 0.3,
  medium: 0.4,
  dark: 0.5
}

export function ParticleField() {
  const { theme } = useThemeMode()
  const { scrollY } = useScroll()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const themeRef = useRef(theme)
  const [particleCount, setParticleCount] = useState(BASE_PARTICLE_COUNT[theme] ?? 40)

  themeRef.current = theme

  // Track scroll for particle intensity adjustment
  useEffect(() => {
    if (prefersReducedMotion()) return

    const unsubscribe = scrollY.onChange((value) => {
      // Scale particle count based on scroll (up to 50% more)
      const baseCount = BASE_PARTICLE_COUNT[theme] ?? 40
      const scrollBoost = Math.min(value * 0.05, baseCount * 0.5)
      setParticleCount(Math.floor(baseCount + scrollBoost))
    })

    return unsubscribe
  }, [scrollY, theme])

  const createParticle = useCallback(
    (canvas: HTMLCanvasElement): Particle => {
      const speed = PARTICLE_SPEED[theme] ?? 0.4
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: -Math.random() * speed * 0.75 - 0.05,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.15,
        life: 0,
        maxLife: Math.random() * 300 + 200
      }
    },
    [theme]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Initialize with dynamic count
    const initialCount = prefersReducedMotion() ? BASE_PARTICLE_COUNT[theme] * 0.3 : particleCount
    particlesRef.current = Array.from({ length: Math.floor(initialCount) }, () => createParticle(canvas))

    const animate = () => {
      const currentTheme = themeRef.current
      const color = PARTICLE_COLORS[currentTheme] ?? PARTICLE_COLORS.dark
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Ensure we have the right number of particles
      const targetCount = prefersReducedMotion() ? BASE_PARTICLE_COUNT[theme] * 0.3 : particleCount
      while (particlesRef.current.length < targetCount) {
        particlesRef.current.push(createParticle(canvas))
      }
      while (particlesRef.current.length > targetCount) {
        particlesRef.current.pop()
      }

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.life++

        if (p.life > p.maxLife || p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          Object.assign(p, createParticle(canvas))
          p.y = canvas.height + 10
        }

        const fade =
          p.life < 30 ? p.life / 30 : p.life > p.maxLife - 30 ? (p.maxLife - p.life) / 30 : 1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${p.opacity * fade})`
        ctx.fill()
      }

      // Draw connections for dark theme - only when performance allows
      if (currentTheme === "dark" && particleCount < BASE_PARTICLE_COUNT.dark * 1.3) {
        const particles = particlesRef.current
        const connectionThreshold = 120
        const maxConnections = Math.min(particles.length * 2, 100) // Limit for performance

        let connectionCount = 0
        for (let i = 0; i < particles.length && connectionCount < maxConnections; i++) {
          for (let j = i + 1; j < particles.length && connectionCount < maxConnections; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < connectionThreshold) {
              const alpha = (1 - dist / connectionThreshold) * 0.08
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.strokeStyle = `rgba(${color}, ${alpha})`
              ctx.lineWidth = 0.5
              ctx.stroke()
              connectionCount++
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [theme, particleCount, createParticle])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[-15]" aria-hidden />
}
