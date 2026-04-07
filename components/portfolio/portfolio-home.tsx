"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import type { PortfolioData } from "@/lib/portfolio-types"
import { toYoutubeEmbedUrl } from "@/lib/video"
import { curateCertificates } from "@/lib/certificate-curation"
import { ComingSoon } from "@/components/portfolio/coming-soon"
import { HologramFace } from "@/components/portfolio/hologram-face"

type PortfolioHomeProps = {
  data: PortfolioData
}

type InquiryState = {
  name: string
  contact: string
  companyName: string
  purpose: string
}

const emptyInquiry: InquiryState = {
  name: "",
  contact: "",
  companyName: "",
  purpose: ""
}

const sectionTransition = {
  initial: { opacity: 0, y: 26, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] as const }
}

function hasText(value: string) {
  return value.trim().length > 0
}

function formatUpdated(value: string) {
  const ts = Date.parse(value)
  if (!Number.isFinite(ts)) return "Recently"
  const diffMs = Date.now() - ts
  const diffHrs = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)))
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  return `${diffDays}d ago`
}

export function PortfolioHome({ data }: PortfolioHomeProps) {
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState("")
  const [form, setForm] = useState<InquiryState>(emptyInquiry)

  const introEmbed = toYoutubeEmbedUrl(data.owner.introVideoUrl)
  const hologramSources = (data.owner.hologramPhotoUrls ?? []).filter(hasText).slice(0, 5)
  const hologramPhotos = hologramSources.length
    ? hologramSources
    : hasText(data.owner.profilePhotoUrl)
      ? [data.owner.profilePhotoUrl]
      : []

  const projectCount = data.projects.length
  const certificateCount = data.certificates.length
  const channelCount = data.channels.length
  const updatedAt = formatUpdated(data.updatedAt)
  const featuredCertificates = curateCertificates(data.certificates).slice(0, 3)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSending(true)
    setMessage("")

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        setMessage("Unable to send right now. Please try again.")
        return
      }

      setForm(emptyInquiry)
      setMessage("Thanks. Your message has been sent.")
    } catch {
      setMessage("Network issue. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page-container page-padding">
      <motion.section
        id="home"
        className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]"
        {...sectionTransition}
      >
        <div className="max-w-3xl">
          <p className="kicker">Software Engineering Portfolio</p>
          <h1 className="mt-4 font-heading text-4xl leading-[0.94] md:text-6xl lg:text-7xl">
            <span className="gradient-text-animate">
              {hasText(data.owner.name) ? data.owner.name : "Coming Soon"}
            </span>
          </h1>
          <p className="mt-5 text-lg text-muted md:text-xl">
            {hasText(data.owner.headline) ? data.owner.headline : "Coming Soon"}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            {hasText(data.owner.shortIntro) ? data.owner.shortIntro : "Coming Soon"}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="control-button rounded-full border border-accent/50 bg-accent/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-accent"
            >
              View Case Studies
            </a>
            <a
              href="#contact"
              className="rounded-full border border-line px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-text transition-colors hover:border-accent hover:text-accent"
            >
              Discuss Opportunity
            </a>
            <Link
              href="/resume"
              className="rounded-full border border-line px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Review Resume
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Projects", value: projectCount || "--" },
              { label: "Certificates", value: certificateCount || "--" },
              { label: "Channels", value: channelCount || "--" },
              { label: "Updated", value: updatedAt }
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-line bg-bg/35 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted">{item.label}</p>
                <p className="mt-2 font-heading text-xl text-text">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 w-full max-w-xl rounded-xl border border-line bg-bg/35 p-3">
            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.1em] text-muted">
              <span>[System]</span>
              <span>88% Loading Content...</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full border border-line bg-bg/60">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-accent2"
                initial={{ width: "22%" }}
                animate={{ width: ["74%", "88%", "82%", "88%"] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>

          <div className="mt-8 glow-line" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 22 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {hologramPhotos.length ? (
            <HologramFace photoUrls={hologramPhotos} className="w-full" />
          ) : (
            <ComingSoon text="Face mesh coming soon" />
          )}
        </motion.div>
      </motion.section>

      <motion.section
        className="mt-20 grid gap-8 lg:grid-cols-2"
        {...sectionTransition}
      >
        <div className="animated-border card-premium card-premium-pad">
          <p className="kicker">Intro Video</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-line">
            {introEmbed ? (
              <iframe
                className="aspect-video w-full"
                src={introEmbed}
                title="Intro video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <ComingSoon text="Intro video coming soon" className="rounded-none border-0" />
            )}
          </div>
        </div>

        <div className="animated-border card-premium card-premium-pad">
          <p className="kicker">Visitor Contact</p>
          <p className="mt-3 text-sm text-muted">
            Email: {hasText(data.visitorContact.email) ? data.visitorContact.email : "Coming Soon"}
          </p>
          <p className="text-sm text-muted">
            Phone: {hasText(data.visitorContact.phone) ? data.visitorContact.phone : "Coming Soon"}
          </p>
          <p className="mt-4 text-xs text-muted">Only inquiry details are collected from visitors.</p>
          <div className="mt-6 rounded-xl border border-line bg-bg/30 p-4 text-xs text-muted">
            <p className="font-semibold uppercase tracking-[0.12em] text-accent">Trust Signals</p>
            <p className="mt-2">Updated profile data, live sync indicator, and direct certificate links are always visible.</p>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="projects"
        className="mt-20"
        {...sectionTransition}
      >
        <p className="kicker">Selected Work</p>
        <h2 className="mt-4 font-heading text-3xl text-text md:text-5xl">Engineering case studies</h2>
        <p className="mt-3 max-w-3xl text-sm text-muted md:text-base">
          Each case study highlights problem framing, implementation depth, and delivery outcomes for fast technical review.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {data.projects.length ? (
            data.projects.map((project) => {
              const embed = toYoutubeEmbedUrl(project.ytDemoUrl)
              return (
                <motion.article
                  key={project.id}
                  className="animated-border card-premium card-premium-pad"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-[10px] uppercase tracking-[0.12em] text-accent/90">Case Study</p>
                  <h3 className="font-heading text-2xl text-text">{hasText(project.title) ? project.title : "Coming Soon"}</h3>
                  <p className="mt-3 text-sm text-muted">{hasText(project.description) ? project.description : "Coming Soon"}</p>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-line">
                    {embed ? (
                      <iframe
                        className="aspect-video w-full"
                        src={embed}
                        title={`${project.title} demo`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <ComingSoon text="Project demo video coming soon" className="rounded-none border-0" />
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.length ? (
                      project.tags.map((tag) => (
                        <span key={tag} className="pill">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted">Tags coming soon</span>
                    )}
                  </div>
                </motion.article>
              )
            })
          ) : (
            <ComingSoon text="Projects coming soon" className="lg:col-span-2" />
          )}
        </div>
      </motion.section>

      <motion.section className="mt-20" {...sectionTransition}>
        <p className="kicker">Credentials Snapshot</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredCertificates.length ? (
            featuredCertificates.map((cert) => (
              <article key={cert.id} className="card-premium card-premium-pad">
                <p className="text-[10px] uppercase tracking-[0.12em] text-accent">{cert.issuer || "Authority"}</p>
                <h3 className="mt-2 font-heading text-lg text-text">{cert.title || "Certificate"}</h3>
                <p className="mt-2 text-xs text-muted">{cert.date || "Date not specified"}</p>
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.1em] text-accent hover:text-accent2"
                  >
                    Verify Credential
                  </a>
                ) : (
                  <p className="mt-4 text-xs text-muted">Verification link not added yet.</p>
                )}
              </article>
            ))
          ) : (
            <ComingSoon text="Certificates coming soon" className="md:col-span-2 lg:col-span-3" />
          )}
        </div>
      </motion.section>

      <motion.section
        id="contact"
        className="mt-20 animated-border card-premium card-premium-pad"
        {...sectionTransition}
      >
        <p className="kicker">Inquiry Form</p>
        <p className="mt-2 text-sm text-muted">Visitors can submit name, contact, company name, and purpose.</p>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Name"
            className="rounded-xl border border-line bg-bg/40 px-4 py-3 text-text placeholder:text-muted"
          />
          <input
            required
            value={form.contact}
            onChange={(event) => setForm((prev) => ({ ...prev, contact: event.target.value }))}
            placeholder="Mail or Number"
            className="rounded-xl border border-line bg-bg/40 px-4 py-3 text-text placeholder:text-muted"
          />
          <input
            required
            value={form.companyName}
            onChange={(event) => setForm((prev) => ({ ...prev, companyName: event.target.value }))}
            placeholder="Company Name"
            className="rounded-xl border border-line bg-bg/40 px-4 py-3 text-text placeholder:text-muted md:col-span-2"
          />
          <textarea
            required
            value={form.purpose}
            onChange={(event) => setForm((prev) => ({ ...prev, purpose: event.target.value }))}
            placeholder="Purpose"
            className="min-h-28 rounded-xl border border-line bg-bg/40 px-4 py-3 text-text placeholder:text-muted md:col-span-2"
          />
          <button
            disabled={sending}
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-black disabled:opacity-60 md:col-span-2"
          >
            {sending ? "Sending..." : "Send Inquiry"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-accent">{message}</p> : null}
      </motion.section>
    </div>
  )
}
