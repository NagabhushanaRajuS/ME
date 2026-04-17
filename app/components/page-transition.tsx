"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    // Save scroll position before route change
    const handleRouteChange = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("beforeunload", handleRouteChange)
    return () => window.removeEventListener("beforeunload", handleRouteChange)
  }, [pathname])

  useEffect(() => {
    // Scroll to top on new page
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
