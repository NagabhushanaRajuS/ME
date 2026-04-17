"use client"

import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion"
import { type ReactNode, useRef, useCallback, useState } from "react"
import { prefersReducedMotion } from "@/lib/utils/performance"

type MagneticButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode
  enableRipple?: boolean
}

interface Ripple {
  id: number
  size: number
  x: number
  y: number
}

export function MagneticButton({
  children,
  className,
  onClick,
  enableRipple = true,
  disabled,
  ...buttonProps
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextRippleIdRef = useRef(0)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || prefersReducedMotion() || !ref.current) return

      const element = ref.current
      const rect = element.getBoundingClientRect()
      const moveX = event.clientX - rect.left - rect.width / 2
      const moveY = event.clientY - rect.top - rect.height / 2

      x.set(moveX * 0.16)
      y.set(moveY * 0.2)
    },
    [disabled, x, y]
  )

  const handleLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return

      onClick?.(event)

      if (enableRipple && !prefersReducedMotion() && ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const rippleX = event.clientX - rect.left
        const rippleY = event.clientY - rect.top

        const size = Math.max(rect.width, rect.height) * 2
        const id = nextRippleIdRef.current++

        const newRipple: Ripple = { id, size, x: rippleX, y: rippleY }
        setRipples((prev) => [...prev, newRipple])

        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id))
        }, 600)
      }
    },
    [disabled, onClick, enableRipple]
  )

  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      onMouseMove={handleMove}
      onMouseLeave={disabled ? undefined : handleLeave}
      onClick={handleClick}
      className={className}
      style={{
        x: prefersReducedMotion() ? 0 : springX,
        y: prefersReducedMotion() ? 0 : springY
      }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 220, damping: 16 }}
      {...buttonProps}
    >
      {children}

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
