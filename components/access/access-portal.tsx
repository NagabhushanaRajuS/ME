"use client"

import { useState } from "react"

type ControlState = {
  id: string
  passkey: string
}

type VisitorState = {
  viewerName: string
  companyName: string
  email: string
}

const emptyControl: ControlState = {
  id: "",
  passkey: ""
}

const emptyVisitor: VisitorState = {
  viewerName: "",
  companyName: "",
  email: ""
}

export function AccessPortal() {
  const [control, setControl] = useState<ControlState>(emptyControl)
  const [visitor, setVisitor] = useState<VisitorState>(emptyVisitor)

  const [controlLoading, setControlLoading] = useState(false)
  const [visitorLoading, setVisitorLoading] = useState(false)

  const [controlMessage, setControlMessage] = useState("")
  const [visitorMessage, setVisitorMessage] = useState("")

  const onControlSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setControlLoading(true)
    setControlMessage("")

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: control.id, password: control.passkey })
    })

    if (!response.ok) {
      setControlMessage("Access denied. Re-check ID or passkey.")
      setControlLoading(false)
      return
    }

    window.location.href = "/admin"
  }

  const onVisitorSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setVisitorLoading(true)
    setVisitorMessage("")

    const response = await fetch("/api/access/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitor)
    })

    const payload = await response.json().catch(() => null) as
      | { error?: string; mailed?: boolean; mailSkipped?: boolean }
      | null

    if (!response.ok) {
      setVisitorMessage(payload?.error ?? "Unable to check in right now.")
      setVisitorLoading(false)
      return
    }

    if (payload?.mailed) {
      setVisitorMessage("Thanks for visiting. A humble acknowledgement email has been sent.")
    } else if (payload?.mailSkipped) {
      setVisitorMessage("Thanks for checking in. Email is currently disabled, but your visit is recorded.")
    } else {
      setVisitorMessage("Thanks for checking in. Your details are safely recorded.")
    }

    setVisitorLoading(false)
    setVisitor(emptyVisitor)
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-3">
      <article className="animated-border card-premium card-premium-pad card-premium-hover">
        <p className="kicker">Secure Control</p>
        <h2 className="mt-2 font-heading text-2xl text-text">Creator Console Access</h2>
        <p className="mt-2 text-sm text-muted">No admin labels. If your ID and passkey are right, control panel opens instantly.</p>

        <form className="mt-5 space-y-3" onSubmit={onControlSubmit}>
          <input
            value={control.id}
            onChange={(event) => setControl((prev) => ({ ...prev, id: event.target.value }))}
            placeholder="Control ID"
            className="w-full rounded-xl border border-line bg-bg/40 px-4 py-3 text-text placeholder:text-muted"
            required
          />
          <input
            value={control.passkey}
            onChange={(event) => setControl((prev) => ({ ...prev, passkey: event.target.value }))}
            type="password"
            placeholder="Passkey"
            className="w-full rounded-xl border border-line bg-bg/40 px-4 py-3 text-text placeholder:text-muted"
            required
          />
          <button
            disabled={controlLoading}
            className="w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-black disabled:opacity-60"
          >
            {controlLoading ? "Verifying..." : "Enter Console"}
          </button>
        </form>

        {controlMessage ? <p className="mt-3 text-sm text-accent">{controlMessage}</p> : null}
      </article>

      <article className="animated-border card-premium card-premium-pad card-premium-hover">
        <p className="kicker">Visitor / HR / Company</p>
        <h2 className="mt-2 font-heading text-2xl text-text">Quick Check-in</h2>
        <p className="mt-2 text-sm text-muted">Share your name, company, and email. A thank-you note is sent when SMTP is configured.</p>

        <form className="mt-5 space-y-3" onSubmit={onVisitorSubmit}>
          <input
            value={visitor.viewerName}
            onChange={(event) => setVisitor((prev) => ({ ...prev, viewerName: event.target.value }))}
            placeholder="Your name"
            className="w-full rounded-xl border border-line bg-bg/40 px-4 py-3 text-text placeholder:text-muted"
            required
          />
          <input
            value={visitor.companyName}
            onChange={(event) => setVisitor((prev) => ({ ...prev, companyName: event.target.value }))}
            placeholder="Company"
            className="w-full rounded-xl border border-line bg-bg/40 px-4 py-3 text-text placeholder:text-muted"
            required
          />
          <input
            value={visitor.email}
            onChange={(event) => setVisitor((prev) => ({ ...prev, email: event.target.value }))}
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-line bg-bg/40 px-4 py-3 text-text placeholder:text-muted"
            required
          />
          <button
            disabled={visitorLoading}
            className="w-full rounded-full border border-line bg-bg/50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-text disabled:opacity-60"
          >
            {visitorLoading ? "Saving..." : "Check In"}
          </button>
        </form>

        {visitorMessage ? <p className="mt-3 text-sm text-accent">{visitorMessage}</p> : null}
      </article>

      <article className="animated-border card-premium card-premium-pad card-premium-hover">
        <p className="kicker">AI Gateway</p>
        <h2 className="mt-2 font-heading text-2xl text-text">Machine-readable Portfolio</h2>
        <p className="mt-2 text-sm text-muted">No dedicated UI needed for AI crawlers. Clean structured feeds are exposed below.</p>

        <div className="mt-5 space-y-3 text-sm">
          <a className="block rounded-xl border border-line bg-bg/40 px-4 py-3 text-accent" href="/api/ai/readable" target="_blank" rel="noopener noreferrer">
            /api/ai/readable (JSON)
          </a>
          <a className="block rounded-xl border border-line bg-bg/40 px-4 py-3 text-accent" href="/ai-readable.txt" target="_blank" rel="noopener noreferrer">
            /ai-readable.txt (plain text)
          </a>
          <a className="block rounded-xl border border-line bg-bg/40 px-4 py-3 text-accent" href="/api/public/portfolio" target="_blank" rel="noopener noreferrer">
            /api/public/portfolio (full public data)
          </a>
        </div>
      </article>
    </section>
  )
}
