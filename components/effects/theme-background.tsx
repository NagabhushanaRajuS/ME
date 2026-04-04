"use client"

import { useThemeMode } from "@/components/providers/theme-provider"

export function ThemeBackground() {
  const { theme } = useThemeMode()

  return (
    <>
      <div aria-hidden className={`theme-bg theme-bg--${theme}`} />
      <div aria-hidden className="noise-overlay" />
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
