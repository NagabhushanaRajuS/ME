"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { useThemeMode } from "@/components/providers/theme-provider"
import { personalInfo, stats } from "@/lib/data"

const headlineWords = ["Building", "intelligent", "systems", "with", "Machine", "Learning."]

function FloatingShape({ className, delay }: { className: string; delay: number }) {
  return (
    <motion.div
      className={`absolute rounded-full opacity-20 blur-xl ${className}`}
      animate={{
        y: [0, -20, 0],
        x: [0, 8, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{
        duration: 6 + delay * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
      aria-hidden
    />
  )
}

export function HeroSection() {
  const { theme } = useThemeMode()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-5 pb-24 pt-20 md:px-8 lg:px-12"
    >
      {/* Floating background shapes */}
      <FloatingShape className="left-[5%] top-[15%] h-72 w-72 bg-accent/30" delay={0} />
      <FloatingShape className="right-[10%] top-[25%] h-52 w-52 bg-accent2/30" delay={1.5} />
      <FloatingShape className="bottom-[20%] left-[30%] h-40 w-40 bg-accent/20" delay={3} />

      <motion.div style={{ y: parallaxY, opacity: parallaxOpacity }}>
        {/* Role badge */}
        <motion.div
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-line/60 bg-surface/50 px-4 py-2 backdrop-blur-md"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="glow-dot" />
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {personalInfo.role}
          </span>
        </motion.div>

        {/* Headline with staggered word animation */}
        <h1 className="max-w-5xl font-heading text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          {headlineWords.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              className={`mr-3 inline-block md:mr-4 ${
                i === 1 || i === 5 ? "gradient-text-animate" : "text-text"
              }`}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 0.15 + i * 0.08,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          className="mt-8 max-w-2xl text-base leading-relaxed text-muted md:text-lg lg:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {personalInfo.tagline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <MagneticButton
            className="group relative overflow-hidden rounded-full bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-black shadow-aura transition-shadow hover:shadow-aura-lg"
            onClick={() => scrollToSection("contact")}
          >
            <span className="relative z-10">Start a Project</span>
            <span className="absolute inset-0 -z-0 bg-accent2 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </MagneticButton>
          <a
            href="#projects"
            className={`group rounded-full border px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
              theme === "dark"
                ? "border-accent/40 bg-surface/50 text-accent hover:border-accent hover:shadow-aura"
                : "border-line bg-surface/60 text-text hover:border-accent hover:text-accent"
            }`}
          >
            View Work
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mt-16 flex flex-wrap gap-8 md:gap-12 lg:mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.08, duration: 0.5 }}
            >
              <span className="font-heading text-3xl font-bold text-accent md:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="h-10 w-[1.5px] bg-gradient-to-b from-accent to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Scroll</span>
      </motion.div>
    </section>
  )
}
