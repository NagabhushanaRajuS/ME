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

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-line/40 bg-bg/80 backdrop-blur-xl hover:bg-accent/10 md:hidden"
        whileHover={{ scale: 1.1 }}
      >
        <ChevronRight className="h-5 w-5 text-accent" />
      </motion.button>

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

      <motion.aside
        animate={{ x: isOpen ? 0 : 300, opacity: isOpen ? 1 : 0 }}
        className="fixed bottom-0 right-0 top-0 z-40 w-64 border-l border-line/40 bg-bg/95 backdrop-blur-xl md:hidden"
      >
        <nav className="flex flex-col gap-2 p-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`rounded-lg px-4 py-3 transition-all ${
                pathname === item.href
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-line/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </motion.aside>
    </>
  )
}
