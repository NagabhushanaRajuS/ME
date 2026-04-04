import { type ThemeMode } from "@/lib/themes"

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
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
}

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
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
