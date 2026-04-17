"use client"

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion"
import { useRef, type PointerEvent } from "react"

export function GeometricAvatar() {
  const ref = useRef<HTMLDivElement>(null)
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const reduceMotion = useReducedMotion() ?? false

  const rotateX = useTransform(pointerY, [0, 1], [14, -14])
  const rotateY = useTransform(pointerX, [0, 1], [-16, 16])
  const springRotateX = useSpring(rotateX, { stiffness: 140, damping: 18 })
  const springRotateY = useSpring(rotateY, { stiffness: 140, damping: 18 })

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width)
    pointerY.set((event.clientY - rect.top) / rect.height)
  }

  const resetPointer = () => {
    pointerX.set(0.5)
    pointerY.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="group relative mx-auto h-64 w-64 cursor-grab [perspective:1200px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      style={{
        rotateX: reduceMotion ? 0 : springRotateX,
        rotateY: reduceMotion ? 0 : springRotateY,
        transformStyle: "preserve-3d",
        willChange: "transform"
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-[2rem] border border-line/70 bg-gradient-to-br from-surface/90 via-surface/70 to-bg/70 shadow-card backdrop-blur-xl"
        animate={reduceMotion ? undefined : { y: [0, -8, 0], rotateZ: [-1.5, 1.5, -1.5] }}
        transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-4 rounded-[1.5rem] border border-accent/15 [transform:translateZ(18px)]" />

      <div className="absolute inset-8 [transform:translateZ(42px)]">
        <motion.div
          className="h-full w-full rounded-[1.25rem] border border-accent/25 bg-gradient-to-b from-accent/6 via-transparent to-transparent"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={reduceMotion ? undefined : { duration: 24, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="absolute inset-0 [transform:translateZ(56px)]">
        <motion.div
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20"
          animate={reduceMotion ? undefined : { rotate: -360 }}
          transition={reduceMotion ? undefined : { duration: 32, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="absolute inset-0 [transform:translateZ(80px)]">
        <motion.div
          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent/70 via-accent2/35 to-transparent blur-2xl"
          animate={reduceMotion ? undefined : { scale: [0.94, 1.06, 0.94], opacity: [0.72, 1, 0.72] }}
          transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute inset-0 [transform:translateZ(96px)]">
        <div className="absolute left-1/2 top-1/2 h-24 w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-accent to-transparent opacity-80" />
        <div className="absolute left-1/2 top-1/2 h-px w-28 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-accent2 to-transparent opacity-60" />
        <motion.div
          className="absolute left-[18%] top-[18%] h-3 w-3 rounded-full bg-accent shadow-[0_0_24px_var(--glow)]"
          animate={reduceMotion ? undefined : { y: [0, -6, 0], x: [0, 4, 0] }}
          transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[18%] top-[20%] h-2.5 w-2.5 rounded-full border border-accent2/80 bg-bg/40 shadow-[0_0_18px_var(--glow)]"
          animate={reduceMotion ? undefined : { y: [0, 5, 0], x: [0, -3, 0] }}
          transition={reduceMotion ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
        <motion.div
          className="absolute bottom-[18%] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent2 shadow-[0_0_18px_var(--glow)]"
          animate={reduceMotion ? undefined : { scale: [0.9, 1.15, 0.9] }}
          transition={reduceMotion ? undefined : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="absolute bottom-5 left-5 right-5 rounded-full border border-line/60 bg-bg/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted backdrop-blur-md"
        animate={reduceMotion ? undefined : { opacity: [0.78, 1, 0.78] }}
        transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "translateZ(72px)" }}
      >
        Lightweight 3D tilt
      </motion.div>

      <div className="absolute inset-0 -z-10 rounded-full bg-accent/10 blur-3xl" />
    </motion.div>
  )
}
