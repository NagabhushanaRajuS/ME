"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Breadcrumb() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter((s) => s && s !== "(portfolio)")

  if (pathSegments.length === 0) return null

  const breadcrumbs = [
    { label: "Home", href: "/", isActive: false },
    ...pathSegments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + pathSegments.slice(0, index + 1).join("/"),
      isActive: index === pathSegments.length - 1
    }))
  ]

  return (
    <nav className="mx-auto max-w-7xl px-5 pt-24 md:px-8 lg:px-12">
      <ol className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => (
          <motion.li key={crumb.href} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted" />}
            {crumb.isActive ? (
              <span className="text-sm font-medium text-text">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-sm font-medium text-muted hover:text-text">
                {crumb.label}
              </Link>
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  )
}
