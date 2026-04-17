"use client"

import { motion } from "framer-motion"
import { Reveal } from "@/components/ui/reveal"
import { BookOpen } from "lucide-react"

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 lg:px-12">
      <Reveal>
        <h1 className="font-heading text-4xl font-bold text-text md:text-5xl lg:text-6xl">
          Technical <span className="gradient-text">Articles</span>
        </h1>
        <p className="mt-4 text-base text-muted">Coming soon! Blog posts and technical articles about ML, web development, and software engineering.</p>
      </Reveal>

      <div className="mt-20 rounded-lg bg-accent/5 border border-accent/20 p-8 text-center">
        <BookOpen className="h-12 w-12 text-accent mx-auto mb-4 opacity-50" />
        <h2 className="font-heading text-2xl font-bold text-text">More Content Coming Soon</h2>
        <p className="mt-3 text-muted max-w-2xl mx-auto">
          I&apos;m working on in-depth technical articles. Stay tuned!
        </p>
      </div>
    </div>
  )
}
