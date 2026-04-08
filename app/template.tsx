"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { pageTransition } from "@/lib/motion"

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  )
}
