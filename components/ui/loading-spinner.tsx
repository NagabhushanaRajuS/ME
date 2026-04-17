"use client"

import { motion } from "framer-motion"
import { useThemeMode } from "@/components/providers/theme-provider"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const { theme } = useThemeMode()

  const sizeMap = {
    sm: { size: 16, strokeWidth: 2 },
    md: { size: 24, strokeWidth: 2 },
    lg: { size: 32, strokeWidth: 2 },
  }

  const config = sizeMap[size]

  // Respect prefers-reduced-motion
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (prefersReducedMotion) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <div
          className="rounded-full bg-gradient-to-r from-accent via-accent2 to-accent"
          style={{ width: config.size, height: config.size }}
        />
      </div>
    )
  }

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <svg
        width={config.size}
        height={config.size}
        viewBox={`0 0 ${config.size} ${config.size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={config.size / 2 - config.strokeWidth}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          opacity="0.1"
        />

        {/* Animated gradient circle */}
        <defs>
          <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "var(--accent-2)", stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={config.size / 2 - config.strokeWidth}
          stroke="url(#spinner-gradient)"
          strokeWidth={config.strokeWidth}
          strokeDasharray={`${Math.PI * (config.size - 2 * config.strokeWidth) * 0.75} ${
            Math.PI * (config.size - 2 * config.strokeWidth)
          }`}
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  )
}
