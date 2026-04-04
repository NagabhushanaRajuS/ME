"use client"

import { motion } from "framer-motion"
import { personalInfo, socialLinks } from "@/lib/data"
import { useThemeMode } from "@/components/providers/theme-provider"

export function Footer() {
  const { theme } = useThemeMode()
  const year = new Date().getFullYear()
  const peerContributor = "TmFnYWJodXNoYW5hIFJhanUgUyA="

  return (
    <footer className="relative border-t border-line/50 py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 md:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        {/* Left */}
        <div>
          <a href="/" className="font-heading text-lg font-bold tracking-[0.2em] text-text">
            {personalInfo.initials}
          </a>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Crafted with precision, motion, and intent.
          </p>
        </div>

        {/* Social links */}
        <div className="flex flex-wrap gap-4">
          {socialLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium text-muted transition-colors duration-300 hover:text-accent ${
                theme === "dark" ? "hover:drop-shadow-[0_0_6px_var(--glow)]" : ""
              }`}
              whileHover={{ y: -2 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-xs text-muted">
          <p>
            &copy; {year} {personalInfo.name}. All rights reserved.
          </p>
          <p className="mt-1">
            Peer contributor: {typeof window === "undefined" ? peerContributor : atob(peerContributor)}
          </p>
        </div>
      </div>
    </footer>
  )
}
