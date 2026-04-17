"use client"

import { motion } from "framer-motion"

type ComingSoonProps = {
  text?: string
  className?: string
}

export function ComingSoon({ text = "Coming Soon", className = "" }: ComingSoonProps) {
  return (
    <motion.div
      className={`glass-card border-dashed p-6 text-center text-sm text-muted ${className}`}
      animate={{ y: [0, -4, 0], scale: [1, 1.01, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {text}
    </motion.div>
  )
}
