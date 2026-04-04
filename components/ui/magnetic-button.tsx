"use client"

import { motion } from "framer-motion"
import { type ReactNode, useRef } from "react"

type MagneticButtonProps = {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function MagneticButton({ children, className, onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const handleMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2

    element.style.transform = `translate(${x * 0.16}px, ${y * 0.2}px)`
  }

  const reset = () => {
    if (ref.current) {
      ref.current.style.transform = "translate(0px, 0px)"
    }
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={className}
      transition={{ type: "spring", stiffness: 220, damping: 16 }}
    >
      {children}
    </motion.button>
  )
}
