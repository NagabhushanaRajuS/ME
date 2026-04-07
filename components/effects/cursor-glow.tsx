"use client"

import { useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useThemeMode } from "@/components/providers/theme-provider"
import type { ThemeMode } from "@/lib/themes"

const GLOW_STYLE: Record<ThemeMode, { size: number; gradient: string }> = {
  light: {
    size: 420,
    gradient: "radial-gradient(circle, rgba(61, 202, 249, 0.16), rgba(27, 123, 255, 0.07), transparent 68%)"
  },
  medium: {
    size: 360,
    gradient: "radial-gradient(circle, rgba(255, 176, 56, 0.18), rgba(255, 94, 51, 0.12), transparent 70%)"
  },
  dark: {
    size: 300,
    gradient: "radial-gradient(circle, rgba(42, 248, 141, 0.16), rgba(41, 216, 255, 0.08), transparent 74%)"
  }
}

export function CursorGlow() {
  const { theme } = useThemeMode()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window
    if (isTouchDevice) return

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [mouseX, mouseY])

  const style = GLOW_STYLE[theme]

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-30 hidden md:block"
        style={{
          x: springX,
          y: springY,
          width: style.size,
          height: style.size,
          marginLeft: -(style.size / 2),
          marginTop: -(style.size / 2),
          borderRadius: "50%",
          background: style.gradient,
          mixBlendMode: theme === "dark" ? "screen" : "normal",
          willChange: "transform"
        }}
      />

      {theme === "dark" ? (
        <motion.div
          className="pointer-events-none fixed z-30 hidden md:block"
          style={{
            x: springX,
            y: springY,
            width: 140,
            height: 140,
            marginLeft: -70,
            marginTop: -70,
            borderRadius: "2px",
            border: "1px solid rgba(42, 248, 141, 0.24)",
            boxShadow: "0 0 22px rgba(42, 248, 141, 0.18), inset 0 0 20px rgba(42, 248, 141, 0.08)",
            transform: "rotate(45deg)",
            willChange: "transform"
          }}
        />
      ) : null}
    </>
  )
}
