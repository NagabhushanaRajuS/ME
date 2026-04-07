"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 32, filter: "blur(10px)", clipPath: "inset(0 0 18% 0 round 22px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0 round 0px)" }}
        exit={{ opacity: 0, y: -18, filter: "blur(8px)", clipPath: "inset(12% 0 0 0 round 22px)" }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
          initial={{ scaleX: 0, opacity: 0.75 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left center" }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
