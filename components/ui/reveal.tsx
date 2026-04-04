"use client"

import { motion, type MotionProps } from "framer-motion"
import { sectionDurations, sectionOffsets } from "@/lib/motion"
import { useThemeMode } from "@/components/providers/theme-provider"
import type { ReactNode } from "react"

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const { theme } = useThemeMode()

  const motionProps: MotionProps = {
    initial: { opacity: 0, y: sectionOffsets[theme] },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10%" },
    transition: { duration: sectionDurations[theme], ease: "easeOut" }
  }

  return (
    <motion.div className={className} {...motionProps}>
      {children}
    </motion.div>
  )
}
