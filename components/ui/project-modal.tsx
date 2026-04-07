"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Github } from "lucide-react"

type Project = {
  title: string
  number: string
  summary: string
  impact: string
  stack: string[]
  color: string
  date?: string
  github?: string
}

type ProjectModalProps = {
  open: boolean
  onClose: () => void
  project: Project | null
}

export function ProjectModal({ open, onClose, project }: ProjectModalProps) {
  if (!project) return null

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            aria-label="Close project dialog"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-[60] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-line bg-surface shadow-card"
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Color accent bar */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }} />

            <div className="p-7 md:p-9">
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className="font-heading text-4xl font-bold opacity-20"
                    style={{ color: project.color }}
                  >
                    {project.number}
                  </span>
                  <h3 className="mt-1 font-heading text-2xl font-bold text-text md:text-3xl">{project.title}</h3>
                  {project.date && (
                    <p className="mt-2 text-xs text-muted">{project.date}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  &times;
                </button>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">{project.summary}</p>

              {/* Impact section */}
              <div className="mt-6 rounded-2xl border border-line bg-bg/50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Impact</p>
                <p className="mt-2 text-sm leading-relaxed text-text">{project.impact}</p>
              </div>

              {/* Tech stack */}
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Tech Stack</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-text"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* GitHub Link */}
              {project.github && (
                <div className="mt-6">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition-all hover:bg-accent/10"
                  >
                    <Github className="h-4 w-4" />
                    View on GitHub
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}
