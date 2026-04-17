"use client"

import { motion } from "framer-motion"
import { experience } from "@/lib/data"
import { Reveal } from "@/components/ui/reveal"
import { Briefcase } from "lucide-react"

export default function ExperiencePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 lg:px-12">
      <Reveal>
        <h1 className="font-heading text-4xl font-bold text-text md:text-5xl lg:text-6xl">
          Experience &amp; <span className="gradient-text">Timeline</span>
        </h1>
      </Reveal>

      <div className="mt-20">
        <h2 className="flex items-center gap-3 font-heading text-2xl font-bold text-text">
          <Briefcase className="h-6 w-6 text-accent" />
          Professional Experience
        </h2>

        <div className="mt-12 space-y-8">
          {experience.map((job, i) => (
            <motion.div
              key={job.company}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-lg border border-line/40 p-6 md:p-8"
            >
              <h3 className="font-heading text-2xl font-bold text-text">{job.role}</h3>
              <p className="mt-2 text-accent">{job.company}</p>
              <p className="mt-2 text-sm text-muted">{job.year}</p>
              <p className="mt-4 text-muted">{job.description}</p>
              {job.tags && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-line/60 px-3 py-1 text-[10px] font-medium text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
