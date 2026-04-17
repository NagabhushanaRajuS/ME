"use client"

import { motion } from "framer-motion"
import { personalInfo, skills, stats } from "@/lib/data"
import { Reveal } from "@/components/ui/reveal"

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 lg:px-12">
      <Reveal>
        <h1 className="font-heading text-4xl font-bold text-text md:text-5xl lg:text-6xl">
          About <span className="gradient-text">Me</span>
        </h1>
      </Reveal>

      <div className="mt-12 space-y-6">
        {personalInfo.bio.map((paragraph, i) => (
          <p key={i} className="text-lg leading-relaxed text-muted">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-lg p-6">
            <div className="font-heading text-3xl font-bold text-accent">{stat.value}</div>
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="font-heading text-3xl font-bold text-text">Skills & Expertise</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {skills.slice(0, 8).map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-text">{skill.name}</span>
                <span className="text-sm text-muted">{skill.level}%</span>
              </div>
              <div className="h-2 rounded-full bg-line/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-accent/60"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
