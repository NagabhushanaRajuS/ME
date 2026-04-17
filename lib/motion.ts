import { type ThemeMode } from "@/lib/themes"
export { prefersReducedMotion } from "@/lib/utils/performance"

export const sectionOffsets: Record<ThemeMode, number> = {
  light: 20,
  medium: 36,
  dark: 56
}

export const sectionDurations: Record<ThemeMode, number> = {
  light: 0.55,
  medium: 0.7,
  dark: 0.9
}

export const cardHoverByTheme: Record<ThemeMode, { scale: number; y: number; rotateX: number }> = {
  light: { scale: 1.02, y: -6, rotateX: 0 },
  medium: { scale: 1.035, y: -10, rotateX: 2 },
  dark: { scale: 1.05, y: -12, rotateX: 4 }
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.16
    }
  }
}

export const staggerItem = {
  hidden: { opacity: 0, y: 28, scale: 0.985, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
}

export const fadeInUp = {
  initial: { opacity: 0, y: 34, scale: 0.99, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
}

export const pageTransition = {
  initial: { opacity: 0, y: 18, scale: 0.992, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
}

export const pageTransitionSlow = {
  initial: { opacity: 0, y: 26, scale: 0.988, filter: "blur(12px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  transition: { duration: 0.92, ease: [0.22, 1, 0.36, 1] }
}

export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }
}

export const modalPanel = {
  hidden: { opacity: 0, y: 40, scale: 0.94, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: 28, scale: 0.96, filter: "blur(8px)" }
}

export const ambientFloat = {
  animate: {
    y: [0, -18, 0],
    x: [0, 10, 0],
    scale: [1, 1.06, 1]
  },
  transition: {
    duration: 10,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

export const orbFloatSecondary = {
  animate: {
    x: [0, -18, 0],
    y: [0, 14, 0],
    scale: [1, 1.08, 1]
  },
  transition: {
    duration: 14,
    repeat: Infinity,
    ease: "easeInOut",
    delay: 1.2
  }
}

export const slideInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

export const slideInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}
