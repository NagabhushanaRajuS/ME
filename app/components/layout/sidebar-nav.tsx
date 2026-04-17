"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
]

export function SidebarNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)

  // Auto-hide sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsCollapsed(false)
      } else {
        setIsCollapsed(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {/* Sidebar toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-line/40 bg-bg/80 backdrop-blur-xl hover:bg-accent/10 md:hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="h-5 w-5 text-accent" />
        </motion.div>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{
          x: isOpen ? 0 : 300,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 right-0 top-0 z-40 w-64 border-l border-line/40 bg-bg/95 backdrop-blur-xl md:relative md:right-auto md:top-auto md:h-auto md:w-64 md:bg-transparent md:backdrop-blur-none"
      >
        <nav className="flex flex-col gap-2 p-6 md:sticky md:top-32">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/60 mb-4">
            Navigation
          </p>
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group relative flex items-center justify-between rounded-lg px-4 py-3 transition-all duration-300 ${
                  pathname === item.href
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-text hover:bg-line/5"
                }`}
              >
                <span className="font-medium">{item.label}</span>
                <motion.div
                  animate={{
                    opacity: pathname === item.href ? 1 : 0,
                    x: pathname === item.href ? 0 : -10
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </nav>
      </motion.aside>
    </>
  )
}
