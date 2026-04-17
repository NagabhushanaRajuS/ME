"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { personalInfo, socialLinks } from "@/lib/data"
import { Reveal } from "@/components/ui/reveal"
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react"

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    color: "text-red-400"
  },
  {
    icon: MapPin,
    label: "Location",
    value: personalInfo.location,
    href: "#",
    color: "text-blue-400"
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setSubmitStatus("idle"), 3000)
    } catch (error) {
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 lg:px-12">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="glow-dot" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Contact
          </p>
          <div className="glow-line flex-1" />
        </div>
        <h1 className="mt-6 max-w-3xl font-heading text-4xl font-bold text-text md:text-5xl lg:text-6xl">
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
          Have a question or proposal? I'd love to hear from you. Send me a message and I'll
          respond as soon as possible.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-3">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <h2 className="font-heading text-2xl font-bold text-text mb-8">
            Contact Information
          </h2>

          {/* Direct Contact Methods */}
          <div className="space-y-6 mb-12">
            {contactMethods.map((method, i) => {
              const Icon = method.icon
              return (
                <motion.a
                  key={method.label}
                  href={method.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="group block"
                >
                  <div className="flex items-start gap-4 rounded-lg p-4 transition-all duration-300 hover:bg-line/5">
                    <Icon className={`h-6 w-6 flex-shrink-0 mt-1 ${method.color}`} />
                    <div>
                      <p className="text-sm text-muted font-medium">{method.label}</p>
                      <p className="font-semibold text-text group-hover:text-accent transition-colors">
                        {method.value}
                      </p>
                    </div>
                  </div>
                </motion.a>
              )
            })}
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-text mb-4">Follow me</h3>
            <div className="flex gap-4">
              <motion.a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-line/40 hover:border-accent/60 hover:bg-accent/10 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="h-5 w-5 text-text hover:text-accent" />
              </motion.a>
              <motion.a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg border border-line/40 hover:border-accent/60 hover:bg-accent/10 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="h-5 w-5 text-text hover:text-accent" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-line/40 bg-bg/50 text-text placeholder:text-muted transition-all duration-300 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-line/40 bg-bg/50 text-text placeholder:text-muted transition-all duration-300 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="your@email.com"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-text mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-line/40 bg-bg/50 text-text placeholder:text-muted transition-all duration-300 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="What's this about?"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-line/40 bg-bg/50 text-text placeholder:text-muted transition-all duration-300 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                placeholder="Tell me more about your project or inquiry..."
              />
            </div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-lg bg-green-500/10 border border-green-500/40 text-green-400"
              >
                <p className="font-medium">Thank you! I've received your message and will get back to you soon.</p>
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400"
              >
                <p className="font-medium">Something went wrong. Please try again.</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-lg bg-accent px-8 py-4 font-semibold text-black transition-all duration-300 hover:shadow-aura disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </motion.button>

            <p className="text-xs text-muted text-center">
              I typically respond within 24-48 hours. Looking forward to connecting!
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
