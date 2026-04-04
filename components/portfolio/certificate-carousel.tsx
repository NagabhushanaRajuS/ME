"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { CertificateItem } from "@/lib/portfolio-types"
import { ComingSoon } from "@/components/portfolio/coming-soon"

type CertificateCarouselProps = {
  certificates: CertificateItem[]
}

export function CertificateCarousel({ certificates }: CertificateCarouselProps) {
  const [active, setActive] = useState(0)

  if (!certificates.length) {
    return <ComingSoon text="Certificates Coming Soon" />
  }

  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-hidden py-8 [perspective:1200px]">
      <div className="relative h-[360px] w-full">
        {certificates.map((item, index) => {
          const offset = index - active
          const absOffset = Math.abs(offset)
          const isActive = offset === 0

          return (
            <motion.article
              key={item.id}
              className="absolute left-1/2 top-1/2 w-[86%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-line bg-surface/85 p-6 shadow-card backdrop-blur"
              animate={{
                x: offset * 180,
                rotateY: offset * -22,
                scale: isActive ? 1 : 0.88,
                opacity: absOffset > 2 ? 0 : isActive ? 1 : 0.5,
                zIndex: 100 - absOffset
              }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-accent">Certificate</p>
              <h3 className="mt-2 font-heading text-2xl text-text">{item.title || "Coming Soon"}</h3>
              <p className="mt-2 text-sm text-muted">{item.issuer || "Coming Soon"}</p>
              <p className="mt-1 text-xs text-muted">{item.date || "Coming Soon"}</p>
              {item.credentialUrl ? (
                <a
                  href={item.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block rounded-full border border-line px-4 py-2 text-xs font-semibold text-text transition hover:border-accent hover:text-accent"
                >
                  View Credential
                </a>
              ) : (
                <p className="mt-5 text-xs text-muted">Credential link coming soon</p>
              )}
            </motion.article>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => setActive((prev) => (prev - 1 + certificates.length) % certificates.length)}
          className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-text transition hover:border-accent"
        >
          Prev
        </button>
        <button
          onClick={() => setActive((prev) => (prev + 1) % certificates.length)}
          className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-text transition hover:border-accent"
        >
          Next
        </button>
      </div>
    </div>
  )
}
