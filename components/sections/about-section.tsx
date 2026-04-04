"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Reveal } from "@/components/ui/reveal"
import { useThemeMode } from "@/components/providers/theme-provider"
import { personalInfo, experience } from "@/lib/data"
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
          Product-minded engineer shaping{" "}
          <span className="gradient-text">intentional</span>, high-performance frontend ecosystems.
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
                &ldquo;Every pixel earns its place. Every animation serves a purpose.&rdquo;
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
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
