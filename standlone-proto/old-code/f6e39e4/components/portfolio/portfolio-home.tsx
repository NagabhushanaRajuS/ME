"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { PortfolioData } from "@/lib/portfolio-types"
import { toYoutubeEmbedUrl } from "@/lib/video"
import { ComingSoon } from "@/components/portfolio/coming-soon"
import { GeometricAvatar } from "@/components/portfolio/geometric-avatar"

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

function hasText(value: string) {
  return value.trim().length > 0
}

export function PortfolioHome({ data }: PortfolioHomeProps) {
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState("")
  const [form, setForm] = useState<InquiryState>(emptyInquiry)

  const introEmbed = toYoutubeEmbedUrl(data.owner.introVideoUrl)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSending(true)
    setMessage("")

    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })

    if (!response.ok) {
      setMessage("Unable to send right now. Please try again.")
      setSending(false)
      return
    }

    setForm(emptyInquiry)
    setSending(false)
    setMessage("Thanks. Your message has been sent.")
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-28 md:px-8 lg:px-12">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Profile</p>
          <h1 className="mt-4 font-heading text-4xl leading-tight text-text md:text-6xl">
            {hasText(data.owner.name) ? data.owner.name : "Coming Soon"}
          </h1>
          <p className="mt-4 text-lg text-muted">
            {hasText(data.owner.headline) ? data.owner.headline : "Coming Soon"}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            {hasText(data.owner.shortIntro) ? data.owner.shortIntro : "Coming Soon"}
          </p>
        </div>

        <div className="grid gap-5">
          {hasText(data.owner.profilePhotoUrl) ? (
            <img
              src={data.owner.profilePhotoUrl}
              alt="Profile"
              className="h-64 w-full rounded-3xl border border-line object-cover shadow-card"
            />
          ) : (
            <ComingSoon text="Profile photo coming soon" />
          )}
          <GeometricAvatar />
        </div>
      </section>

      <section className="mt-20 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Intro Video</p>
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

        <div className="rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Visitor Contact</p>
          <p className="mt-3 text-sm text-muted">
            Email: {hasText(data.visitorContact.email) ? data.visitorContact.email : "Coming Soon"}
          </p>
          <p className="text-sm text-muted">
            Phone: {hasText(data.visitorContact.phone) ? data.visitorContact.phone : "Coming Soon"}
          </p>
          <p className="mt-4 text-xs text-muted">Only inquiry details are collected from visitors.</p>
        </div>
      </section>

      <section className="mt-20">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Projects + Demo Videos</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {data.projects.length ? (
            data.projects.map((project) => {
              const embed = toYoutubeEmbedUrl(project.ytDemoUrl)
              return (
                <motion.article
                  key={project.id}
                  className="rounded-3xl border border-line bg-surface/70 p-6 shadow-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
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
                        <span key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
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
      </section>

      <section className="mt-20 rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Inquiry Form</p>
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
      </section>
    </div>
  )
}
