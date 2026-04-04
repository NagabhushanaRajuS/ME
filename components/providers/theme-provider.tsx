"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import { THEME_ORDER, type ThemeMode } from "@/lib/themes"

type ThemeContextValue = {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  cycleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "elite-portfolio-theme"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark")
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const fromStorage = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    const validTheme = THEME_ORDER.find((item) => item === fromStorage)
    const nextTheme = validTheme ?? "dark"
    setThemeState(nextTheme)
    document.documentElement.dataset.theme = nextTheme
  }, [])

  const setTheme = (next: ThemeMode) => {
    setTransitioning(true)
    setThemeState(next)
    document.documentElement.dataset.theme = next
    localStorage.setItem(STORAGE_KEY, next)
    window.setTimeout(() => setTransitioning(false), 420)
  }

  const cycleTheme = () => {
    const index = THEME_ORDER.indexOf(theme)
    const nextTheme = THEME_ORDER[(index + 1) % THEME_ORDER.length]
    setTheme(nextTheme)
  }

  const value: ThemeContextValue = { theme, setTheme, cycleTheme }

  return (
    <ThemeContext.Provider value={value}>
      <AnimatePresence>
        {transitioning ? (
          <motion.div
            key={theme}
            className="pointer-events-none fixed inset-0 z-[99] bg-accent/15 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        ) : null}
      </AnimatePresence>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeMode() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useThemeMode must be used inside ThemeProvider")
  }

  return context
}
