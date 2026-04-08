"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useThemeMode } from "@/components/providers/theme-provider"

const GLOW_COLORS: Record<string, string> = {
  light: "rgba(0, 104, 255, 0.15)",
  medium: "rgba(255, 90, 54, 0.18)",
  dark: "rgba(24, 248, 154, 0.2)"
}

export function CursorGlow() {
  const { theme } = useThemeMode()
  const ref = useRef<HTMLDivElement>(null)
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

  return (
    <motion.div
      ref={ref}
      className="pointer-events-none fixed z-30 hidden md:block"
      style={{
        x: springX,
        y: springY,
        width: 400,
        height: 400,
        marginLeft: -200,
        marginTop: -200,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${GLOW_COLORS[theme]}, transparent 70%)`,
        willChange: "transform"
      }}
      animate={{ opacity: [0.4, 0.72, 0.4], scale: [0.96, 1.04, 0.96] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}
