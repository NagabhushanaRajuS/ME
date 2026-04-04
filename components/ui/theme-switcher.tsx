"use client"

import { motion } from "framer-motion"
import { THEME_LABELS, type ThemeMode } from "@/lib/themes"
import { useThemeMode } from "@/components/providers/theme-provider"

const themes: ThemeMode[] = ["light", "medium", "dark"]

export function ThemeSwitcher() {
  const { theme, setTheme } = useThemeMode()

  return (
    <div className="relative inline-flex rounded-full border border-line bg-surface/70 p-1 backdrop-blur">
      {themes.map((mode) => (
        <button
          key={mode}
          onClick={() => setTheme(mode)}
          className="relative rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted"
        >
          {theme === mode ? (
            <motion.span
              layoutId="theme-pill"
              className="absolute inset-0 -z-10 rounded-full bg-accent"
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            />
          ) : null}
          <span className={theme === mode ? "text-black" : "text-muted"}>{THEME_LABELS[mode]}</span>
        </button>
      ))}
    </div>
  )
}
