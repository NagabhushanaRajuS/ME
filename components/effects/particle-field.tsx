"use client"

import { useEffect, useRef, useCallback } from "react"
import { useThemeMode } from "@/components/providers/theme-provider"
import type { ThemeMode } from "@/lib/themes"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
  rotation: number
  spin: number
  tint: number
  shape: "circle" | "diamond" | "pixel"
}

type ParticleConfig = {
  count: number
  sizeMin: number
  sizeMax: number
  colorA: string
  colorB: string
  shape: Particle["shape"]
}

const PARTICLE_CONFIG: Record<ThemeMode, ParticleConfig> = {
  light: {
    count: 28,
    sizeMin: 1.2,
    sizeMax: 3.5,
    colorA: "27, 123, 255",
    colorB: "61, 202, 249",
    shape: "circle"
  },
  medium: {
    count: 42,
    sizeMin: 1,
    sizeMax: 2.8,
    colorA: "255, 94, 51",
    colorB: "255, 176, 56",
    shape: "diamond"
  },
  dark: {
    count: 72,
    sizeMin: 0.75,
    sizeMax: 2,
    colorA: "42, 248, 141",
    colorB: "41, 216, 255",
    shape: "pixel"
  }
}

export function ParticleField() {
  const { theme } = useThemeMode()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const themeRef = useRef(theme)

  themeRef.current = theme

  const createParticle = useCallback((mode: ThemeMode): Particle => {
    const cfg = PARTICLE_CONFIG[mode]
    const width = window.innerWidth
    const height = window.innerHeight

    const speed = mode === "dark" ? 0.36 : mode === "medium" ? 0.28 : 0.22
    const drift = mode === "dark" ? 0.22 : mode === "medium" ? 0.25 : 0.16

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * drift,
      vy: -Math.random() * speed - 0.04,
      size: Math.random() * (cfg.sizeMax - cfg.sizeMin) + cfg.sizeMin,
      opacity: mode === "dark" ? Math.random() * 0.5 + 0.18 : Math.random() * 0.45 + 0.2,
      life: 0,
      maxLife: Math.random() * 320 + 180,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * (mode === "dark" ? 0.035 : 0.025),
      tint: Math.random(),
      shape: cfg.shape
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const count = PARTICLE_CONFIG[theme].count
    particlesRef.current = Array.from({ length: count }, () => createParticle(theme))

    const animate = () => {
      const currentTheme = themeRef.current
      const config = PARTICLE_CONFIG[currentTheme]
      const now = performance.now()

      const width = window.innerWidth
      const height = window.innerHeight

      ctx.clearRect(0, 0, width, height)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.life++
        p.rotation += p.spin

        if (currentTheme === "dark") {
          p.x += Math.sin(now * 0.001 + p.y * 0.02) * 0.14
        }

        if (p.life > p.maxLife || p.y < -18 || p.x < -18 || p.x > width + 18) {
          Object.assign(p, createParticle(currentTheme))
          p.y = height + 16
        }

        const fade = p.life < 30
          ? p.life / 30
          : p.life > p.maxLife - 30
          ? (p.maxLife - p.life) / 30
          : 1

        const color = p.tint > 0.52 ? config.colorA : config.colorB
        const alpha = p.opacity * fade

        if (p.shape === "circle") {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${color}, ${alpha})`
          ctx.fill()

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${color}, ${alpha * 0.2})`
          ctx.fill()
          continue
        }

        if (p.shape === "diamond") {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.fillStyle = `rgba(${color}, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(0, -p.size)
          ctx.lineTo(p.size * 0.85, 0)
          ctx.lineTo(0, p.size)
          ctx.lineTo(-p.size * 0.85, 0)
          ctx.closePath()
          ctx.fill()
          ctx.restore()
          continue
        }

        const side = Math.max(1, p.size)
        ctx.fillStyle = `rgba(${color}, ${alpha})`
        ctx.fillRect(p.x - side / 2, p.y - side / 2, side, side)

        if (p.life % 18 === 0) {
          ctx.strokeStyle = `rgba(${color}, ${alpha * 0.45})`
          ctx.strokeRect(p.x - side, p.y - side, side * 2, side * 2)
        }
      }

      if (currentTheme === "dark") {
        const particles = particlesRef.current
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 95) {
              const alpha = (1 - dist / 95) * 0.1
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.strokeStyle = `rgba(42, 248, 141, ${alpha})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }

        const scanY = (now * 0.08) % height
        const scanGradient = ctx.createLinearGradient(0, scanY - 22, 0, scanY + 22)
        scanGradient.addColorStop(0, "rgba(42, 248, 141, 0)")
        scanGradient.addColorStop(0.5, "rgba(42, 248, 141, 0.12)")
        scanGradient.addColorStop(1, "rgba(42, 248, 141, 0)")
        ctx.fillStyle = scanGradient
        ctx.fillRect(0, scanY - 22, width, 44)
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
