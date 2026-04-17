"use client"

import { motion } from "framer-motion"
import { Reveal } from "@/components/ui/reveal"
import { ArrowRight, BookOpen } from "lucide-react"

const blogPostStubs = [
  {
    id: 1,
    title: "Coming Soon",
    excerpt: "Blog posts and technical articles coming soon. Stay tuned for insights on ML, web development, and software engineering.",
    category: "Featured",
    date: "Q2 2026"
  },
  {
    id: 2,
    title: "Building Scalable AI Systems",
    excerpt: "Explore best practices for building production-ready AI systems at scale.",
    category: "Machine Learning",
    date: "Planned"
  },
  {
    id: 3,
    title: "Modern Web Development with Next.js",
    excerpt: "Deep dive into modern web development practices using Next.js and React.",
    category: "Web Development",
    date: "Planned"
  }
]

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 lg:px-12">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Blog
          </p>
          <div className="glow-line flex-1" />
        </div>
        <h1 className="mt-6 max-w-3xl font-heading text-4xl font-bold text-text md:text-5xl lg:text-6xl">
          Technical <span className="gradient-text">Articles</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
          Thoughts on software development, machine learning, and building products. Coming soon!
        </p>
      </Reveal>

      {/* Blog Posts Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {blogPostStubs.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="group glass-card rounded-lg border border-line/40 p-6 md:p-8 cursor-pointer transition-all duration-300 hover:border-accent/60 hover:bg-accent/5"
          >
            {/* Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent/60">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-heading text-xl font-bold text-text group-hover:text-accent transition-colors">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="mt-3 text-muted text-sm leading-relaxed">
              {post.excerpt}
            </p>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-line/20 pt-4">
              <span className="text-xs text-muted">{post.date}</span>
              <ArrowRight className="h-4 w-4 text-accent opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-20 rounded-lg bg-accent/5 border border-accent/20 p-8 text-center md:p-12"
      >
        <BookOpen className="h-12 w-12 text-accent mx-auto mb-4 opacity-50" />
        <h2 className="font-heading text-2xl font-bold text-text">
          More Content Coming Soon
        </h2>
        <p className="mt-3 text-muted max-w-2xl mx-auto">
          I'm working on in-depth technical articles on machine learning, web development, and software engineering.
          Subscribe to stay updated when new posts are published!
        </p>
        <button className="mt-6 rounded-lg bg-accent px-8 py-3 font-semibold text-black transition-all duration-300 hover:shadow-aura">
          Subscribe for Updates
        </button>
      </motion.div>
    </div>
  )
}
