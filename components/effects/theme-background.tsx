"use client"

import { useThemeMode } from "@/components/providers/theme-provider"

export function ThemeBackground() {
  const { theme } = useThemeMode()

  return (
    <>
      <div aria-hidden className={`theme-bg theme-bg--${theme}`} />
      <div aria-hidden className="noise-overlay" />

      {theme === "light" ? (
        <>
          <div aria-hidden className="light-grid-overlay" />
          <div aria-hidden className="light-beam-overlay" />
        </>
      ) : null}

      {theme === "medium" ? (
        <>
          <div aria-hidden className="medium-prism-overlay" />
          <div aria-hidden className="medium-ribbon-overlay" />
        </>
      ) : null}

      {theme === "dark" ? (
        <>
          <div aria-hidden className="dark-grid-overlay" />
          <div aria-hidden className="dark-terminal-overlay" />
          <div aria-hidden className="dark-rain-overlay" />
          <div aria-hidden className="dark-vignette-overlay" />
          <div aria-hidden className="scanlines" />
        </>
      ) : null}
    </>
  )
}
