"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { projects, skills } from "@/lib/data"
import { Reveal } from "@/components/ui/reveal"
import { Search } from "lucide-react"
import { useRef, useMotionValue, useTransform, useSpring } from "framer-motion"

type FilterType = "all" | "category" | "tech"

interface Project {
  title: string
  number: string
  summary: string
  impact: string
  stack: string[]
  color: string
  date: string
  github: string
}

interface TiltCardProps {
  children: React.ReactNode
  color: string
  onClick: () => void
}

function TiltCard({ children, color, onClick }: TiltCardProps) {
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
        <div
          className="absolute left-0 top-0 h-1 w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />
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

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"date" | "impact">("date")

  // Get all unique technologies
  const allTechs = Array.from(
    new Set(projects.flatMap((p) => p.stack))
  ).sort()

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.summary.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTech =
        !selectedTech || project.stack.includes(selectedTech)

      return matchesSearch && matchesTech
    })

    // Sort projects
    if (sortBy === "impact") {
      filtered.sort(
        (a, b) => b.impact.length - a.impact.length
      )
    } else {
      // Sort by date (assuming more recent projects are meaningful)
      filtered.reverse()
    }

    return filtered
  }, [searchQuery, selectedTech, sortBy])

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 lg:px-12">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Projects
          </p>
          <div className="glow-line flex-1" />
        </div>
        <h1 className="mt-6 max-w-3xl font-heading text-4xl font-bold text-text md:text-5xl lg:text-6xl">
          Featured <span className="gradient-text">Work</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
          Explore my project portfolio with advanced filtering and search capabilities.
        </p>
      </Reveal>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 space-y-6"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-line/40 bg-bg/50 py-3 pl-12 pr-4 text-text placeholder:text-muted transition-all duration-300 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Tech Stack Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTech(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                selectedTech === null
                  ? "bg-accent text-black"
                  : "border border-line/40 text-muted hover:border-accent/60 hover:text-text"
              }`}
            >
              All Technologies
            </button>
            {allTechs.slice(0, 8).map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedTech === tech
                    ? "bg-accent text-black"
                    : "border border-line/40 text-muted hover:border-accent/60 hover:text-text"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("date")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                sortBy === "date"
                  ? "bg-accent/20 text-accent border border-accent/40"
                  : "border border-line/40 text-muted hover:border-accent/60 hover:text-text"
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy("impact")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                sortBy === "impact"
                  ? "bg-accent/20 text-accent border border-accent/40"
                  : "border border-line/40 text-muted hover:border-accent/60 hover:text-text"
              }`}
            >
              Impact
            </button>
          </div>
        </div>

        {/* Result Count */}
        <p className="text-sm text-muted">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        layout
        className="mt-12 grid gap-6 md:grid-cols-2"
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TiltCard color={project.color} onClick={() => {}}>
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
                <h3 className="mt-4 font-heading text-2xl font-bold text-text">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {project.summary}
                </p>
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
                    View Details
                  </span>
                  <span className="transition-transform duration-300 group-hover:translate-x-3">
                    →
                  </span>
                </div>
              </TiltCard>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-12 text-center"
          >
            <p className="text-muted">No projects found matching your criteria.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
