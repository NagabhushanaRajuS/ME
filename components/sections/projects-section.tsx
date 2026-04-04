"use client"

import dynamic from "next/dynamic"
import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { projects } from "@/lib/data"
import { Reveal } from "@/components/ui/reveal"
import { useThemeMode } from "@/components/providers/theme-provider"

const ProjectModal = dynamic(
  () => import("@/components/ui/project-modal").then((m) => m.ProjectModal),
  { ssr: false }
)

function TiltCard({
  children,
  color,
  onClick
}: {
  children: React.ReactNode
  color: string
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const rotateX = useTransform(mouseY, [0, 1], [8, -8])
  const rotateY = useTransform(mouseX, [0, 1], [-8, 8])
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      className="group cursor-pointer [perspective:800px]"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="glass-card relative overflow-hidden p-7 transition-all duration-300 md:p-8"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d"
        }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Color accent bar */}
        <div
          className="absolute left-0 top-0 h-1 w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />
        {/* Glow effect on hover */}
        <div
          className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${color}10, transparent 70%)`
          }}
        />
        {children}
      </motion.div>
    </motion.div>
  )
}

export function ProjectsSection() {
  const { theme } = useThemeMode()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section id="projects" className="relative mx-auto w-full max-w-7xl px-5 py-28 md:px-8 lg:px-12">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Projects</p>
          <div className="glow-line flex-1" />
        </div>
        <h2 className="mt-6 max-w-3xl font-heading text-3xl font-bold text-text md:text-5xl lg:text-6xl">
          Selected <span className="gradient-text">Outcomes</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
          A curated set of projects where design craft meets engineering depth.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <TiltCard color={project.color} onClick={() => setActiveIndex(index)}>
              <div className="flex items-start justify-between">
                <span
                  className="font-heading text-5xl font-bold opacity-10"
                  style={{ color: project.color }}
                >
                  {project.number}
                </span>
                <span className="rounded-full border border-line px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-muted">
                  Case Study
                </span>
              </div>
              <h3 className="mt-4 font-heading text-2xl font-bold text-text">{project.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{project.summary}</p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.stack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line/60 px-2.5 py-1 text-[10px] font-medium text-muted"
                  >
                    {tech}
                  </span>
                ))}
                {project.stack.length > 3 && (
                  <span className="rounded-full border border-line/60 px-2.5 py-1 text-[10px] font-medium text-muted">
                    +{project.stack.length - 3}
                  </span>
                )}
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-accent">
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                  Explore Project
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-3">&rarr;</span>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      <ProjectModal
        open={activeIndex !== null}
        onClose={() => setActiveIndex(null)}
        project={activeIndex !== null ? projects[activeIndex] : null}
      />
    </section>
  )
}
