"use client"

import { type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { pageTransition, pageTransitionSlow, modalBackdrop, modalPanel } from "@/lib/motion"
import { prefersReducedMotion } from "@/lib/utils/performance"

export const pageEnterVariants = {
  hidden: pageTransition.initial,
  enter: pageTransition.animate,
  exit: { opacity: 0, y: 18, scale: 0.992, filter: "blur(10px)" }
}

export const pageEnterVariantsSlower = {
  hidden: pageTransitionSlow.initial,
  enter: pageTransitionSlow.animate,
  exit: { opacity: 0, y: 40, scale: 0.988, filter: "blur(15px)" }
}

export const modalEnterVariants = {
  backdrop: modalBackdrop,
  panel: modalPanel
}

export const tabTransitionVariants = {
  hidden: { opacity: 0, x: 20 },
  enter: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -20 }
}

export const themeTransitionDuration = 0.42

interface PageTransitionProps {
  children: ReactNode
  variant?: "default" | "slow"
}

export function PageTransition({ children, variant = "default" }: PageTransitionProps) {
  const variants = variant === "slow" ? pageEnterVariantsSlower : pageEnterVariants

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (prefersReducedMotion()) {
    return <>{children}</>
  }

  return (
    <motion.div initial="hidden" animate="enter" exit="exit" variants={variants}>
      {children}
    </motion.div>
  )
}

interface ModalTransitionProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export function ModalTransition({ isOpen, onClose, children, className }: ModalTransitionProps) {
  if (prefersReducedMotion()) {
    return isOpen ? <>{children}</> : null
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            key="backdrop"
            {...modalEnterVariants.backdrop}
            onClick={onClose}
            className="fixed inset-0 bg-black/50"
            aria-hidden
          />
          <motion.div key="panel" {...modalEnterVariants.panel} className={className}>
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}

interface TabTransitionProps {
  children: ReactNode
  key: string | number
}

export function TabTransition({ children, key }: TabTransitionProps) {
  if (prefersReducedMotion()) {
    return <>{children}</>
  }

  return (
    <motion.div key={key} initial="hidden" animate="enter" exit="exit" variants={tabTransitionVariants}>
      {children}
    </motion.div>
  )
}

export const drawerVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
  exit: { x: "-100%", opacity: 0, transition: { duration: 0.3 } }
}

export const popoverVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 15 } },
  exit: { opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.15 } }
}

export const expandVariants = {
  hidden: { height: 0, opacity: 0, overflow: "hidden" },
  visible: {
    height: "auto",
    opacity: 1,
    overflow: "visible",
    transition: { type: "spring", stiffness: 80, damping: 12 }
  },
  exit: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
}

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export const flipVariants = {
  hidden: { rotateY: 90, opacity: 0 },
  visible: { rotateY: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { rotateY: -90, opacity: 0, transition: { duration: 0.4 } }
}

export const layoutTransitionConfig = {
  type: "spring" as const,
  stiffness: 200,
  damping: 30,
  mass: 0.5
}
