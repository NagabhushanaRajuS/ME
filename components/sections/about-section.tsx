"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Reveal } from "@/components/ui/reveal"
import { useThemeMode } from "@/components/providers/theme-provider"
import { personalInfo, experience, stats } from "@/lib/data"
import { staggerContainer, staggerItem } from "@/lib/motion"

export function AboutSection() {
  const { theme } = useThemeMode()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative mx-auto w-full max-w-7xl px-5 py-28 md:px-8 lg:px-12"
    >
      {/* Section header */}
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">About</p>
          <div className="glow-line flex-1" />
        </div>
        <h2 className="mt-6 max-w-4xl font-heading text-3xl font-bold leading-tight text-text md:text-5xl lg:text-6xl">
          Building intelligent systems with{" "}
          <span className="gradient-text">Machine Learning</span> and crafting seamless web experiences
        </h2>
      </Reveal>

      {/* Bio + Visual columns */}
      <div className="mt-16 grid gap-10 lg:grid-cols-5 lg:gap-14">
        {/* Bio */}
        <motion.div
          className="space-y-5 lg:col-span-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8%" }}
        >
          {personalInfo.bio.map((paragraph, i) => (
            <motion.p
              key={i}
              className="text-base leading-relaxed text-muted md:text-lg"
              variants={staggerItem}
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>

        {/* Decorative card */}
        <motion.div
          className="relative lg:col-span-2"
          style={{ y: imageY }}
        >
          <div className="glass-card overflow-hidden p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 font-heading text-xl font-bold text-accent">
                {personalInfo.initials}
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-text">{personalInfo.name}</p>
                <p className="text-xs text-muted">{personalInfo.role}</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="glow-line" />
              <p className="mt-4 text-sm italic text-muted">
                &ldquo;Eager to learn and contribute to innovative projects that make a real impact.&rdquo;
              </p>
            </div>
            {/* Mini bar chart decorative */}
            <div className="mt-6 flex items-end gap-1.5">
              {[60, 85, 45, 92, 70, 95, 55, 88, 72, 96, 80, 90].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-sm bg-accent/20"
                  initial={{ height: 0 }}
                  whileInView={{ height: h * 0.5 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <motion.div
        className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-5%" }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass-card p-6 text-center"
            variants={staggerItem}
          >
            <p className="font-heading text-4xl font-bold text-accent">{stat.value}</p>
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Experience Timeline */}
      <Reveal className="mt-24">
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Experience</p>
          <div className="glow-line flex-1" />
        </div>
      </Reveal>

      <div className="mt-10 space-y-0">
        {experience.map((exp, i) => (
          <motion.div
            key={exp.year}
            className="group relative grid gap-4 border-l-2 border-line py-8 pl-8 md:grid-cols-12 md:gap-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Timeline dot */}
            <div className="absolute -left-[7px] top-10 h-3 w-3 rounded-full border-2 border-accent bg-bg transition-shadow group-hover:shadow-aura" />

            <div className="md:col-span-3">
              <span className="text-xs font-semibold text-accent">{exp.year}</span>
            </div>
            <div className="md:col-span-9">
              <h3 className="font-heading text-lg font-bold text-text">{exp.role}</h3>
              <p className="mt-1 text-sm font-medium text-accent/70">{exp.company}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{exp.description}</p>
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
              {exp.tags && exp.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="inline-block rounded-full border border-accent/30 px-3 py-1 text-xs text-accent">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Education Section */}
      <Reveal className="mt-24">
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Education</p>
          <div className="glow-line flex-1" />
        </div>
      </Reveal>

      <motion.div
        className="mt-10 glass-card p-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-5%" }}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-heading text-lg font-bold text-text">B.E. Computer Science & Engineering (Data Science)</h3>
            <p className="mt-2 text-sm text-accent/70">Maharaja Institute of Technology Mysuru (MITM)</p>
            <p className="mt-3 text-sm text-muted">Expected Graduation: Jun 2026</p>
            <p className="mt-2 text-sm text-muted">Current GPA: 7.2 (Improved from 6.6)</p>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-sm text-muted">7th Semester Ongoing • Demonstrating consistent upward growth</p>
            <p className="mt-4 text-xs text-accent">Location: {personalInfo.location}</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
