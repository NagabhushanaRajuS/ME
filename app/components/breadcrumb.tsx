"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface Breadcrumb {
  label: string
  href: string
  isActive: boolean
}

export function Breadcrumb() {
  const pathname = usePathname()

  // Generate breadcrumbs from pathname
  const getBreadcrumbs = (): Breadcrumb[] => {
    const pathSegments = pathname
      .split("/")
      .filter((segment) => segment && segment !== "(portfolio)")

    if (pathSegments.length === 0) {
      return [{ label: "Home", href: "/", isActive: true }]
    }

    const breadcrumbs: Breadcrumb[] = [{ label: "Home", href: "/", isActive: false }]

    pathSegments.forEach((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/")
      const label =
        segment.charAt(0).toUpperCase() +
        segment.slice(1).replace(/-/g, " ")

      breadcrumbs.push({
        label,
        href,
        isActive: index === pathSegments.length - 1
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  if (breadcrumbs.length <= 1) return null

  return (
    <nav
      className="mx-auto max-w-7xl px-5 pt-24 md:px-8 lg:px-12"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => (
          <motion.li
            key={crumb.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-2"
          >
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted" />
            )}
            {crumb.isActive ? (
              <span className="text-sm font-medium text-text">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-sm font-medium text-muted transition-colors duration-300 hover:text-text"
              >
                {crumb.label}
              </Link>
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  )
}
