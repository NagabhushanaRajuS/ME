"use client"

import { motion } from "framer-motion"
import { experience } from "@/lib/data"
import { Reveal } from "@/components/ui/reveal"
import { Briefcase, GraduationCap } from "lucide-react"

// Sample education data (can be added to lib/data.ts later)
const educationTimeline = [
  {
    degree: "Bachelor of Engineering (B.E.) - Data Science",
    institution: "MIT Mysuru (MITM)",
    period: "2022 - 2026",
    description: "Currently in final year with focus on machine learning, deep learning, and data science applications.",
    gpa: "7.2 CGPA",
    highlights: [
      "Specialization in Data Science and Artificial Intelligence",
      "Strong foundation in algorithms, data structures, and systems design"
    ]
  }
]

const certifications = [
  {
    name: "Deep Learning Specialization",
    issuer: "In Progress",
    date: "Expected 2026"
  },
  {
    name: "Machine Learning Engineering",
    issuer: "In Progress",
    date: "Expected 2026"
  }
]

interface TimelineEvent {
  type: "experience" | "education" | "certification"
  title: string
  subtitle: string
  period: string
  description?: string
  highlights?: string[]
  tags?: string[]
  icon: React.ReactNode
  color: string
}

function TimelineEvent({
  icon,
  title,
  subtitle,
  period,
  description,
  highlights,
  tags,
  color
}: TimelineEvent & { icon: React.ReactNode; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative ml-8 mb-12 md:ml-0 md:flex"
    >
      {/* Timeline dot and line (mobile) */}
      <div className="absolute -left-4 top-0 md:static md:mb-0 md:mr-12 md:w-48 md:text-right">
        <div className={`absolute -left-6 top-2 h-4 w-4 rounded-full border-2 border-bg ${color} md:left-auto md:-right-8 md:top-6`} />
        <div className={`absolute -left-4 top-8 bottom-0 w-0.5 ${color} md:absolute md:-right-[15px] md:top-12 md:bottom-auto md:h-0.5 md:w-12`} />
      </div>

      {/* Content */}
      <div className="glass-card rounded-lg border border-line/40 p-6 flex-1 md:p-8">
        <div className="flex items-start gap-3 mb-3">
          <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
            {icon}
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-text">{title}</h3>
            <p className="text-sm text-accent font-medium">{subtitle}</p>
          </div>
        </div>

        <p className="text-xs text-muted font-medium uppercase tracking-[0.12em] mb-3">
          {period}
        </p>

        {description && (
          <p className="text-muted mb-4">{description}</p>
        )}

        {highlights && highlights.length > 0 && (
          <ul className="space-y-2 mb-4">
            {highlights.map((highlight, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-line/20">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line/60 px-3 py-1 text-[10px] font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function ExperiencePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 lg:px-12">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Timeline
          </p>
          <div className="glow-line flex-1" />
        </div>
        <h1 className="mt-6 max-w-3xl font-heading text-4xl font-bold text-text md:text-5xl lg:text-6xl">
          Experience &amp; <span className="gradient-text">Education</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
          A comprehensive timeline of my professional journey and academic achievements.
        </p>
      </Reveal>

      {/* Experience Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-20"
      >
        <h2 className="flex items-center gap-3 font-heading text-2xl font-bold text-text">
          <Briefcase className="h-6 w-6 text-accent" />
          Professional Experience
        </h2>

        <div className="mt-12 space-y-0 md:relative md:before:absolute md:before:left-[187px] md:before:top-0 md:before:bottom-0 md:before:w-0.5 md:before:bg-gradient-to-b md:before:from-accent md:before:to-transparent">
          {experience.map((job, i) => (
            <TimelineEvent
              key={job.company}
              type="experience"
              title={job.role}
              subtitle={job.company}
              period={job.year}
              description={job.description}
              highlights={job.highlights}
              tags={job.tags}
              icon={<Briefcase className="h-5 w-5 text-accent" />}
              color="bg-accent"
            />
          ))}
        </div>
      </motion.div>

      {/* Education Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-20"
      >
        <h2 className="flex items-center gap-3 font-heading text-2xl font-bold text-text">
          <GraduationCap className="h-6 w-6 text-blue-400" />
          Education
        </h2>

        <div className="mt-12 space-y-0 md:relative md:before:absolute md:before:left-[187px] md:before:top-0 md:before:bottom-0 md:before:w-0.5 md:before:bg-gradient-to-b md:before:from-blue-400 md:before:to-transparent">
          {educationTimeline.map((edu, i) => (
            <TimelineEvent
              key={edu.institution}
              type="education"
              title={edu.degree}
              subtitle={edu.institution}
              period={edu.period}
              description={edu.description}
              highlights={[...edu.highlights, `GPA: ${edu.gpa}`]}
              icon={<GraduationCap className="h-5 w-5 text-blue-400" />}
              color="bg-blue-400"
            />
          ))}
        </div>
      </motion.div>

      {/* Certifications Section */}
      {certifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20"
        >
          <h2 className="flex items-center gap-3 font-heading text-2xl font-bold text-text">
            <GraduationCap className="h-6 w-6 text-purple-400" />
            Certifications &amp; Learning
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="glass-card rounded-lg border border-line/40 p-6"
              >
                <h3 className="font-heading text-lg font-bold text-text">
                  {cert.name}
                </h3>
                <p className="mt-2 text-sm text-accent">{cert.issuer}</p>
                <p className="text-xs text-muted mt-2">{cert.date}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Info section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-20 rounded-lg bg-accent/5 border border-accent/20 p-8 text-center"
      >
        <p className="text-muted max-w-2xl mx-auto">
          I'm continuously learning and growing. Passionate about staying updated with the latest technologies
          in Machine Learning, Web Development, and Full-Stack Engineering.
        </p>
      </motion.div>
    </div>
  )
}
