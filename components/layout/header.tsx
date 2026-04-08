"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { MagneticButton } from "@/components/ui/magnetic-button"

const homeLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" }
]

const pageLinks = [
  { href: "/", label: "Home" },
  { href: "/certificates", label: "Certificates" },
  { href: "/goals", label: "Goals" },
  { href: "/education", label: "Education" },
  { href: "/channels", label: "Channels" }
]

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = pathname === "/" ? homeLinks : pageLinks

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-500 ${
          scrolled
            ? "border-b border-line/40 bg-bg/80 py-2 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent py-4"
        }`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 md:px-8 lg:px-12">
          {/* Logo */}
          <a href="/" className="relative font-heading text-lg font-bold tracking-[0.2em] text-text">
            NR
            <span className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-accent opacity-60" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-sm font-medium text-muted transition-colors duration-300 hover:text-text"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <MagneticButton
              className="hidden rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-accent transition-all duration-300 hover:bg-accent hover:text-black hover:shadow-aura md:block"
              onClick={() => {
                window.location.href = "/admin/login"
              }}
            >
              Admin
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
            className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-bg/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="font-heading text-2xl font-bold text-text transition-colors hover:text-accent"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06 }}
              >
                {link.label}
              </motion.a>
            ))}
            <MagneticButton
              className="mt-4 rounded-full border border-accent/40 bg-accent/10 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-accent"
              onClick={() => {
                setMobileOpen(false)
                window.location.href = "/admin/login"
              }}
            >
              Admin
            </MagneticButton>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
