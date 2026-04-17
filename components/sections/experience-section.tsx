"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar, GraduationCap } from "lucide-react"
import { Reveal } from "@/components/ui/reveal"
import { personalInfo, experience } from "@/lib/data"
import { staggerContainer, staggerItem } from "@/lib/motion"

export function ExperienceSection() {
  const internship = experience[0]

  if (!internship) return null

  return (
    <section id="experience" className="relative mx-auto w-full max-w-7xl px-5 py-28 md:px-8 lg:px-12">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Experience</p>
          <div className="glow-line flex-1" />
        </div>
        <h2 className="mt-6 max-w-4xl font-heading text-3xl font-bold leading-tight text-text md:text-5xl lg:text-6xl">
          Experience that shows <span className="gradient-text">real execution</span>, not filler.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-8 lg:grid-cols-5 lg:gap-14">
        <motion.div
          className="glass-card p-7 md:p-8 lg:col-span-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8%" }}
        >
          <motion.div className="flex items-start justify-between gap-4" variants={staggerItem}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Internship</p>
                <h3 className="mt-1 font-heading text-2xl font-bold text-text">{internship.role}</h3>
                <p className="mt-1 text-sm text-accent/70">{internship.company}</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-line/60 bg-surface/60 px-3 py-1 text-xs text-muted">
              <Calendar className="h-3.5 w-3.5" />
              {internship.year}
            </div>
          </motion.div>

          <motion.p className="mt-5 text-sm leading-relaxed text-muted md:text-base" variants={staggerItem}>
            {internship.description}
          </motion.p>

          <motion.div className="mt-6 space-y-3" variants={staggerContainer}>
            {internship.highlights.map((highlight) => (
              <motion.div key={highlight} className="flex gap-3" variants={staggerItem}>
                <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <p className="text-sm leading-relaxed text-muted">{highlight}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="mt-6 flex flex-wrap gap-2" variants={staggerContainer}>
            {internship.tags.map((tag) => (
              <motion.span
                key={tag}
                className="rounded-full border border-accent/25 px-3 py-1 text-xs font-medium text-accent"
                variants={staggerItem}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="glass-card p-7 md:p-8 lg:col-span-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8%" }}
        >
          <motion.div className="flex items-start gap-4" variants={staggerItem}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
              <GraduationCap className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Education</p>
              <h3 className="mt-1 font-heading text-xl font-bold text-text">
                B.E. Computer Science & Engineering (Data Science)
              </h3>
            </div>
          </motion.div>

          <motion.p className="mt-5 text-sm leading-relaxed text-muted" variants={staggerItem}>
            Maharaja Institute of Technology Mysuru (MITM)
          </motion.p>

          <motion.div className="mt-6 rounded-2xl border border-line/60 bg-bg/40 p-5" variants={staggerItem}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Status</p>
            <p className="mt-2 text-sm text-text">Expected Jun 2026</p>
            <p className="mt-1 text-sm text-muted">Current GPA: 7.2</p>
            <p className="mt-1 text-sm text-muted">7th Semester Ongoing</p>
          </motion.div>

          <motion.p className="mt-5 text-xs text-muted" variants={staggerItem}>
            Location: {personalInfo.location}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}