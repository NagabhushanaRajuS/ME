"use client"

import { motion } from "framer-motion"
import { Aperture, Sun, TerminalSquare } from "lucide-react"
import { type ThemeMode } from "@/lib/themes"
import { useThemeMode } from "@/components/providers/theme-provider"

const themes: Array<{ mode: ThemeMode; label: string; Icon: typeof Sun }> = [
  { mode: "light", label: "Light Studio", Icon: Sun },
  { mode: "medium", label: "Prism Editorial", Icon: Aperture },
  { mode: "dark", label: "Terminal Core", Icon: TerminalSquare }
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useThemeMode()

  return (
    <div className="theme-switcher-shell relative inline-flex items-center gap-1 rounded-full border border-line bg-surface/70 p-1 backdrop-blur">
      {themes.map(({ mode, label, Icon }) => (
        <button
          key={mode}
          title={label}
          aria-label={`Switch to ${label}`}
          onClick={() => setTheme(mode)}
          className="theme-switcher-option relative grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:text-text"
        >
          {theme === mode ? (
            <motion.span
              layoutId="theme-pill"
              className="absolute inset-0 -z-10 rounded-full bg-accent"
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            />
          ) : null}
          <Icon size={14} className={theme === mode ? "text-black" : "text-muted"} />
        </button>
      ))}
    </div>
  )
}
