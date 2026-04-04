"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { skills } from "@/lib/data"
import { useThemeMode } from "@/components/providers/theme-provider"
import { Reveal } from "@/components/ui/reveal"
import { staggerContainer, staggerItem } from "@/lib/motion"

const CATEGORY_LABELS: Record<string, string> = {
  core: "Core Engineering",
  motion: "Motion & 3D",
  backend: "Backend & Infra",
  design: "Design & UX"
}

const CATEGORY_ORDER = ["core", "design", "motion", "backend"]

export function SkillsSection() {
  const { theme } = useThemeMode()
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, margin: "-10%" })

  const grouped = CATEGORY_ORDER.map((cat) => ({
    key: cat,
    label: CATEGORY_LABELS[cat],
    items: skills.filter((s) => s.category === cat)
  }))

  return (
    <section id="skills" className="relative mx-auto w-full max-w-7xl px-5 py-28 md:px-8 lg:px-12">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Skills</p>
          <div className="glow-line flex-1" />
        </div>
        <h2 className="mt-6 max-w-3xl font-heading text-3xl font-bold text-text md:text-5xl lg:text-6xl">
          Stack That Ships{" "}
          <span className="gradient-text">Premium</span> Products
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
          Proficiency built through years of shipping production interfaces across diverse domains.
        </p>
      </Reveal>

      <div ref={gridRef} className="mt-14 grid gap-8 md:grid-cols-2">
        {grouped.map((group, gi) => (
          <motion.div
            key={group.key}
            className="glass-card p-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-5%" }}
          >
            <motion.h3
              className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-accent"
              variants={staggerItem}
            >
              {group.label}
            </motion.h3>
            <div className="space-y-5">
              {group.items.map((skill, si) => (
                <motion.div key={skill.name} variants={staggerItem}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text">{skill.name}</span>
                    <span className="text-xs tabular-nums text-muted">{skill.level}%</span>
                  </div>
                  <div className="skill-bar mt-2">
                    <motion.div
                      className="skill-bar-fill"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: skill.level / 100 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.3 + gi * 0.15 + si * 0.06,
                        duration: 1,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skill tags cloud */}
      <motion.div
        className="mt-14 flex flex-wrap justify-center gap-2"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {skills.map((skill) => (
          <motion.span
            key={skill.name}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
              theme === "dark"
                ? "border-line/60 bg-surface/50 text-text hover:border-accent hover:text-accent hover:shadow-aura"
                : "border-line bg-surface/60 text-text hover:border-accent hover:text-accent"
            }`}
            variants={staggerItem}
            whileHover={{ scale: 1.06, y: -3 }}
          >
            {skill.name}
          </motion.span>
        ))}
      </motion.div>
    </section>
  )
}
