"use client"

import { motion, type MotionProps } from "framer-motion"
import { sectionDurations, sectionOffsets } from "@/lib/motion"
import { useThemeMode } from "@/components/providers/theme-provider"
import type { ReactNode } from "react"

export function Reveal({
  children,
  className,
  delay = 0
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { theme } = useThemeMode()

  const motionProps: MotionProps = {
    initial: { opacity: 0, y: sectionOffsets[theme], scale: 0.985, filter: "blur(10px)" },
    whileInView: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    viewport: { once: true, margin: "-12%" },
    transition: { duration: sectionDurations[theme] + 0.08, delay, ease: [0.22, 1, 0.36, 1] }
  }

  return (
    <motion.div className={className} style={{ willChange: "transform, opacity, filter" }} {...motionProps}>
      {children}
    </motion.div>
  )
}
