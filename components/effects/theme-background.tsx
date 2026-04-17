"use client"

import { motion } from "framer-motion"
import { useThemeMode } from "@/components/providers/theme-provider"
import { ambientFloat } from "@/lib/motion"

export function ThemeBackground() {
  const { theme } = useThemeMode()

  return (
    <>
      <div aria-hidden className={`theme-bg theme-bg--${theme}`} />
      <div aria-hidden className="noise-overlay" />
      <motion.div aria-hidden className={`theme-orb theme-orb--${theme} theme-orb--primary`} {...ambientFloat} />
      <motion.div
        aria-hidden
        className={`theme-orb theme-orb--${theme} theme-orb--secondary`}
        animate={{ x: [0, -18, 0], y: [0, 14, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
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
