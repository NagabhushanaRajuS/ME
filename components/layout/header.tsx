"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { LiveSyncIndicator } from "@/components/effects/live-sync-indicator"
import { BrandLoopIcon } from "@/components/layout/brand-loop-icon"
import { useThemeMode } from "@/components/providers/theme-provider"

const links = [
  { href: "/", label: "Home" },
  { href: "/resume", label: "Resume" },
  { href: "/certificates", label: "Certificates" },
  { href: "/goals", label: "Goals" },
  { href: "/education", label: "Education" },
  { href: "/channels", label: "Channels" }
]

type HeaderProps = {
  ownerName?: string
}

export function Header({ ownerName }: HeaderProps) {
  const { theme } = useThemeMode()
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <motion.header
        className={`header-shell fixed left-0 right-0 top-0 z-40 transition-all duration-500 ${
          scrolled
            ? "border-b border-line/40 bg-bg/80 py-2 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent py-4"
        }`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="page-container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center" aria-label="Home">
            <BrandLoopIcon title={ownerName ? `${ownerName} icon` : "Brand icon"} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link group relative text-sm font-medium transition-colors duration-300 hover:text-text ${
                  pathname === link.href ? "text-text" : "text-muted"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full ${
                    pathname === link.href ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LiveSyncIndicator />
            <ThemeSwitcher />
            <MagneticButton
              className="control-button hidden rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-accent transition-all duration-300 hover:bg-accent hover:text-black hover:shadow-aura md:block"
              onClick={() => {
                router.push("/access")
              }}
            >
              {theme === "dark" ? "Console" : "Control"}
            </MagneticButton>

            {/* Mobile hamburger */}
            <button
              className="relative flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                className="h-[1.5px] w-5 bg-text"
                animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="h-[1.5px] w-5 bg-text"
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="h-[1.5px] w-5 bg-text"
                animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="mobile-menu-shell fixed inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-bg/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                className="font-heading text-2xl font-bold text-text transition-colors hover:text-accent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <MagneticButton
              className="control-button mt-4 rounded-full border border-accent/40 bg-accent/10 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-accent"
              onClick={() => {
                setMobileOpen(false)
                router.push("/access")
              }}
            >
              {theme === "dark" ? "Console" : "Control"}
            </MagneticButton>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
