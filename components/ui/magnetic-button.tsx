"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { type ReactNode, useRef, useCallback, useState } from "react"
import { prefersReducedMotion } from "@/lib/motion"

type MagneticButtonProps = {
  children: ReactNode
  className?: string
  onClick?: () => void
  enableRipple?: boolean
}

interface Ripple {
  id: number
  size: number
  x: number
  y: number
}

export function MagneticButton({ children, className, onClick, enableRipple = true }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextRippleIdRef = useRef(0)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (prefersReducedMotion() || !ref.current) return

      const element = ref.current
      const rect = element.getBoundingClientRect()
      const moveX = event.clientX - rect.left - rect.width / 2
      const moveY = event.clientY - rect.top - rect.height / 2

      x.set(moveX * 0.16)
      y.set(moveY * 0.2)
    },
    [x, y]
  )

  const handleLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.()

      // Add ripple effect
      if (enableRipple && !prefersReducedMotion() && ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const rippleX = event.clientX - rect.left
        const rippleY = event.clientY - rect.top

        const size = Math.max(rect.width, rect.height) * 2
        const id = nextRippleIdRef.current++

        const newRipple: Ripple = { id, size, x: rippleX, y: rippleY }
        setRipples((prev) => [...prev, newRipple])

        // Remove ripple after animation
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id))
        }, 600)
      }
    },
    [onClick, enableRipple]
  )

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      className={className}
      style={{
        x: prefersReducedMotion() ? 0 : springX,
        y: prefersReducedMotion() ? 0 : springY
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 220, damping: 16 }}
    >
      {children}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            x: "-50%",
            y: "-50%"
          }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.button>
  )
}
