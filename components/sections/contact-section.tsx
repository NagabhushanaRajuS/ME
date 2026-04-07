"use client"

import { motion } from "framer-motion"
import { Reveal } from "@/components/ui/reveal"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { useThemeMode } from "@/components/providers/theme-provider"
import { personalInfo, socialLinks } from "@/lib/data"
import { staggerContainer, staggerItem } from "@/lib/motion"

export function ContactSection() {
  const { theme } = useThemeMode()

  return (
    <section id="contact" className="relative mx-auto w-full max-w-7xl px-5 py-28 md:px-8 lg:px-12">
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Contact</p>
          <div className="glow-line flex-1" />
        </div>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-5 lg:gap-14">
        {/* Left: CTA text */}
        <motion.div
          className="lg:col-span-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
        >
          <motion.h2
            className="font-heading text-3xl font-bold leading-tight text-text md:text-5xl"
            variants={staggerItem}
          >
            Let&apos;s craft your next{" "}
            <span className="gradient-text">category-defining</span> interface.
          </motion.h2>
          <motion.p
            className="mt-4 text-base leading-relaxed text-muted"
            variants={staggerItem}
          >
            Ready to push the boundaries of your product? I&apos;d love to hear about your vision and explore how we can bring it to life.
          </motion.p>

          {/* Social links */}
          <motion.div className="mt-8 flex flex-wrap gap-3" variants={staggerItem}>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                  theme === "dark"
                    ? "border-line/60 text-muted hover:border-accent hover:text-accent hover:shadow-aura"
                    : "border-line text-muted hover:border-accent hover:text-accent"
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </motion.div>

          {personalInfo.email ? (
            <motion.p className="mt-8 text-sm text-muted" variants={staggerItem}>
              Or reach me directly at{" "}
              <a href={`mailto:${personalInfo.email}`} className="font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent2">
                {personalInfo.email}
              </a>
            </motion.p>
          ) : null}
        </motion.div>

        {/* Right: Form */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="glass-card p-7 md:p-9">
            <form className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="floating-input">
                  <input type="text" placeholder=" " id="contact-name" autoComplete="name" />
                  <label htmlFor="contact-name">Your name</label>
                </div>
                <div className="floating-input">
                  <input type="email" placeholder=" " id="contact-email" autoComplete="email" />
                  <label htmlFor="contact-email">Email</label>
                </div>
              </div>
              <div className="floating-input">
                <input type="text" placeholder=" " id="contact-subject" />
                <label htmlFor="contact-subject">Subject</label>
              </div>
              <div className="floating-input">
                <textarea placeholder=" " id="contact-message" rows={5} />
                <label htmlFor="contact-message">Tell me about your project and timeline</label>
              </div>
              <div className="pt-2">
                <MagneticButton className="group relative overflow-hidden rounded-full bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-black shadow-aura transition-shadow hover:shadow-aura-lg">
                  <span className="relative z-10">Send Inquiry</span>
                  <span className="absolute inset-0 -z-0 bg-accent2 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </MagneticButton>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
