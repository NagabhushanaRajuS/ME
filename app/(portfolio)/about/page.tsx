"use client"

import { motion } from "framer-motion"
import { personalInfo, experience, skills, stats } from "@/lib/data"
import { Reveal } from "@/components/ui/reveal"
import { Award, BookOpen, Code2 } from "lucide-react"

export default function AboutPage() {
  // Group skills by category
  const skillsByCategory = {
    core: skills.filter((s) => s.category === "core"),
    backend: skills.filter((s) => s.category === "backend"),
    design: skills.filter((s) => s.category === "design")
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 lg:px-12">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            About
          </p>
          <div className="glow-line flex-1" />
        </div>
        <h1 className="mt-6 max-w-3xl font-heading text-4xl font-bold text-text md:text-5xl lg:text-6xl">
          About <span className="gradient-text">Me</span>
        </h1>
      </Reveal>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-12 space-y-6"
      >
        {personalInfo.bio.map((paragraph, i) => (
          <p key={i} className="text-lg leading-relaxed text-muted">
            {paragraph}
          </p>
        ))}
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass-card rounded-lg p-6"
            whileHover={{ scale: 1.05 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="font-heading text-3xl font-bold text-accent">
              {stat.value}
            </div>
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Skills Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-20"
      >
        <h2 className="font-heading text-3xl font-bold text-text">Skills & Expertise</h2>
        <p className="mt-2 text-muted">Organized by domain and proficiency level</p>

        {/* Core Skills */}
        <div className="mt-12 space-y-8">
          {[
            {
              category: "Core Technologies",
              icon: Code2,
              skills: skillsByCategory.core
            },
            {
              category: "Backend & ML",
              icon: BookOpen,
              skills: skillsByCategory.backend
            },
            {
              category: "Design & Soft Skills",
              icon: Award,
              skills: skillsByCategory.design
            }
          ].map((section, sectionIndex) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + sectionIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="h-6 w-6 text-accent" />
                  <h3 className="font-heading text-xl font-bold text-text">
                    {section.category}
                  </h3>
                </div>
                <div className="space-y-4 pl-9">
                  {section.skills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-text">{skill.name}</span>
                        <span className="text-sm text-muted">{skill.level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-line/20 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-accent to-accent/60"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Experience Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-20"
      >
        <h2 className="font-heading text-3xl font-bold text-text">Experience</h2>

        <div className="mt-12 space-y-8">
          {experience.map((job, i) => (
            <motion.div
              key={job.company}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="glass-card rounded-lg border border-line/40 p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-text">
                    {job.role}
                  </h3>
                  <p className="mt-2 text-accent">{job.company}</p>
                </div>
                <span className="mt-4 inline-block text-sm font-medium text-muted md:mt-0">
                  {job.year}
                </span>
              </div>
              <p className="mt-4 text-muted">{job.description}</p>
              <ul className="mt-4 space-y-2">
                {job.highlights.map((highlight, j) => (
                  <li key={j} className="flex gap-3 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              {job.tags && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line/60 px-3 py-1 text-[10px] font-medium text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="mt-20 rounded-lg bg-accent/5 border border-accent/20 p-8 text-center md:p-12"
      >
        <h3 className="font-heading text-2xl font-bold text-text">
          Let's work together
        </h3>
        <p className="mt-2 text-muted">
          Interested in collaborating? I'm always excited to discuss new projects and ideas.
        </p>
        <a
          href="/contact"
          className="mt-6 inline-block rounded-lg bg-accent px-8 py-3 font-semibold text-black transition-all duration-300 hover:shadow-aura"
        >
          Get in Touch
        </a>
      </motion.div>
    </div>
  )
}
