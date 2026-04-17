"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Reveal } from "@/components/ui/reveal"
import { personalInfo, stats } from "@/lib/data"
import { staggerContainer, staggerItem } from "@/lib/motion"

export function AboutSection() {
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
                &ldquo;Focused on practical systems, thoughtful interfaces, and real-world outcomes.&rdquo;
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
    </section>
  )
}
