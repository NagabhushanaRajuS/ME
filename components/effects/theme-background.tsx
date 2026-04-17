"use client"

import { motion } from "framer-motion"
import { useThemeMode } from "@/components/providers/theme-provider"
import { ambientFloat, orbFloatSecondary } from "@/lib/motion"
import { prefersReducedMotion } from "@/lib/utils/performance"

export function ThemeBackground() {
  const { theme } = useThemeMode()

  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion()) {
    return (
      <>
        <div aria-hidden className={`theme-bg theme-bg--${theme}`} />
        <div aria-hidden className="noise-overlay" />
        <div aria-hidden className={`theme-orb theme-orb--${theme} theme-orb--primary`} />
        <div aria-hidden className={`theme-orb theme-orb--${theme} theme-orb--secondary`} />
        {theme === "dark" ? (
          <>
            <div aria-hidden className="grid-overlay" />
            <div aria-hidden className="scanlines" />
          </>
        ) : null}
        {theme === "medium" ? <div aria-hidden className="orb-field" /> : null}
      </>
    )
  }

  return (
    <>
      <div aria-hidden className={`theme-bg theme-bg--${theme}`} />
      <div aria-hidden className="noise-overlay" />
      <motion.div aria-hidden className={`theme-orb theme-orb--${theme} theme-orb--primary`} {...ambientFloat} />
      <motion.div
        aria-hidden
        className={`theme-orb theme-orb--${theme} theme-orb--secondary`}
        {...orbFloatSecondary}
      />
      {theme === "dark" ? (
        <>
          <div aria-hidden className="grid-overlay" />
          <div aria-hidden className="scanlines" />
        </>
      ) : null}
      {theme === "medium" ? <div aria-hidden className="orb-field" /> : null}
    </>
  )
}
