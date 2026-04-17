"use client"

import { motion } from "framer-motion"
import { projects } from "@/lib/data"
import { Reveal } from "@/components/ui/reveal"

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 lg:px-12">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Projects</p>
          <div className="glow-line flex-1" />
        </div>
        <h1 className="mt-6 max-w-3xl font-heading text-4xl font-bold text-text md:text-5xl lg:text-6xl">
          Featured <span className="gradient-text">Work</span>
        </h1>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-lg border border-line/40 p-6 md:p-8"
          >
            <h3 className="font-heading text-2xl font-bold text-text">{project.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.slice(0, 3).map((tech) => (
                <span key={tech} className="rounded-full border border-line/60 px-2.5 py-1 text-[10px] font-medium text-muted">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
