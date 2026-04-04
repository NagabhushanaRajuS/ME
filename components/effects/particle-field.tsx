"use client"

import { useEffect, useRef, useCallback } from "react"
import { useThemeMode } from "@/components/providers/theme-provider"

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

const PARTICLE_COUNT: Record<string, number> = {
  light: 30,
  medium: 40,
  dark: 55
}

export function ParticleField() {
  const { theme } = useThemeMode()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const themeRef = useRef(theme)

  themeRef.current = theme

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -Math.random() * 0.3 - 0.1,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.5 + 0.15,
    life: 0,
    maxLife: Math.random() * 300 + 200
  }), [])

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

    const count = PARTICLE_COUNT[theme] ?? 40
    particlesRef.current = Array.from({ length: count }, () => createParticle(canvas))

    const animate = () => {
      const currentTheme = themeRef.current
      const color = PARTICLE_COLORS[currentTheme] ?? PARTICLE_COLORS.dark
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.life++

        if (p.life > p.maxLife || p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          Object.assign(p, createParticle(canvas))
          p.y = canvas.height + 10
        }

        const fade = p.life < 30
          ? p.life / 30
          : p.life > p.maxLife - 30
          ? (p.maxLife - p.life) / 30
          : 1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${p.opacity * fade})`
        ctx.fill()
      }

      // Draw connections for dark theme
      if (currentTheme === "dark") {
        const particles = particlesRef.current
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 120) {
              const alpha = (1 - dist / 120) * 0.08
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.strokeStyle = `rgba(${color}, ${alpha})`
              ctx.lineWidth = 0.5
              ctx.stroke()
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
  }, [theme, createParticle])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[-15]"
      aria-hidden
    />
  )
}
