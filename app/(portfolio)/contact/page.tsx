"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { personalInfo } from "@/lib/data"
import { Mail, MapPin } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 1000)
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 lg:px-12">
      <h1 className="font-heading text-4xl font-bold text-text md:text-5xl lg:text-6xl">
        Get in <span className="gradient-text">Touch</span>
      </h1>

      <div className="mt-16 grid gap-12 lg:grid-cols-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-text mb-8">Contact Information</h2>
          <div className="space-y-6">
            <a href={`mailto:${personalInfo.email}`} className="group block">
              <div className="flex items-start gap-4 p-4">
                <Mail className="h-6 w-6 text-red-400 mt-1" />
                <div>
                  <p className="text-sm text-muted font-medium">Email</p>
                  <p className="font-semibold text-text">{personalInfo.email}</p>
                </div>
              </div>
            </a>
            <div className="flex items-start gap-4 p-4">
              <MapPin className="h-6 w-6 text-blue-400 mt-1" />
              <div>
                <p className="text-sm text-muted font-medium">Location</p>
                <p className="font-semibold text-text">{personalInfo.location}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-lg border border-line/40 bg-bg/50 text-text"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full px-4 py-3 rounded-lg border border-line/40 bg-bg/50 text-text"
          />
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full px-4 py-3 rounded-lg border border-line/40 bg-bg/50 text-text"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-line/40 bg-bg/50 text-text resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-accent px-8 py-4 font-semibold text-black"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  )
}
