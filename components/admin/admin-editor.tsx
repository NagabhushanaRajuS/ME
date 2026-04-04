"use client"

import { useEffect, useState } from "react"
import type { InquiryItem, PortfolioData } from "@/lib/portfolio-types"

type SaveState = "idle" | "saving" | "saved" | "error"

type YoutubeImportResult =
  | { ok: true; item: { id: string; name: string; url: string; description: string } }
  | { ok: false; error: string }

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2)
}

export function AdminEditor() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [inquiries, setInquiries] = useState<InquiryItem[]>([])
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [error, setError] = useState("")

  const [projectsJson, setProjectsJson] = useState("[]")
  const [certificatesJson, setCertificatesJson] = useState("[]")
  const [goalsJson, setGoalsJson] = useState("[]")
  const [educationJson, setEducationJson] = useState("[]")
  const [channelsJson, setChannelsJson] = useState("[]")

  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [youtubeName, setYoutubeName] = useState("")
  const [youtubeDescription, setYoutubeDescription] = useState("")
  const [youtubeImportError, setYoutubeImportError] = useState("")
  const [youtubeImportSuccess, setYoutubeImportSuccess] = useState("")

  useEffect(() => {
    const load = async () => {
      const [portfolioRes, inquiriesRes] = await Promise.all([
        fetch("/api/admin/portfolio"),
        fetch("/api/inquiries")
      ])

      if (!portfolioRes.ok) {
        setError("Failed to load admin data")
        return
      }

      const portfolioData = (await portfolioRes.json()) as PortfolioData
      setData(portfolioData)
      setProjectsJson(pretty(portfolioData.projects))
      setCertificatesJson(pretty(portfolioData.certificates))
      setGoalsJson(pretty(portfolioData.goals))
      setEducationJson(pretty(portfolioData.education))
      setChannelsJson(pretty(portfolioData.channels))

      if (inquiriesRes.ok) {
        setInquiries((await inquiriesRes.json()) as InquiryItem[])
      }
    }

    void load()
  }, [])

  const save = async () => {
    if (!data) return

    setSaveState("saving")
    setError("")

    try {
      const payload: PortfolioData = {
        ...data,
        projects: JSON.parse(projectsJson) as PortfolioData["projects"],
        certificates: JSON.parse(certificatesJson) as PortfolioData["certificates"],
        goals: JSON.parse(goalsJson) as PortfolioData["goals"],
        education: JSON.parse(educationJson) as PortfolioData["education"],
        channels: JSON.parse(channelsJson) as PortfolioData["channels"]
      }

      const response = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        setSaveState("error")
        setError("Save failed")
        return
      }

      const saved = (await response.json()) as PortfolioData
      setData(saved)
      setSaveState("saved")
    } catch {
      setSaveState("error")
      setError("Invalid JSON in one of the list sections")
    }
  }

  const importYoutubeLink = () => {
    setYoutubeImportError("")
    setYoutubeImportSuccess("")

    const result = parseYoutubeImport(youtubeUrl, {
      name: youtubeName.trim(),
      description: youtubeDescription.trim()
    })

    if (!result.ok) {
      setYoutubeImportError(result.error)
      return
    }

    try {
      const current = JSON.parse(channelsJson) as unknown
      if (!Array.isArray(current)) {
        setYoutubeImportError("Channels JSON is not a list")
        return
      }

      const next = upsertChannelItem(current, result.item)
      setChannelsJson(pretty(next))
      setYoutubeImportSuccess("Imported and added to YouTube Channels list")
    } catch {
      setYoutubeImportError("Channels JSON is invalid; fix it before importing")
    }
  }

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/admin/login"
  }

  if (!data) {
    return <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 text-muted">Loading admin panel...</main>
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-28 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-4xl text-text">Admin Portfolio Editor</h1>
        <div className="flex gap-3">
          <button
            onClick={save}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-black"
          >
            {saveState === "saving" ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={logout}
            className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-text"
          >
            Logout
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted">
        Future updates are form-like. Fill fields below. Leave empty to auto-show Coming Soon.
      </p>
      {saveState === "saved" ? <p className="mt-2 text-sm text-accent">Saved successfully</p> : null}
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}

      <section className="mt-8 rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
        <h2 className="font-heading text-2xl text-text">Owner Profile</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            value={data.owner.name}
            onChange={(event) => setData((prev) => prev ? { ...prev, owner: { ...prev.owner, name: event.target.value } } : prev)}
            placeholder="Name"
            className="rounded-xl border border-line bg-bg/50 px-4 py-3 text-text"
          />
          <input
            value={data.owner.headline}
            onChange={(event) => setData((prev) => prev ? { ...prev, owner: { ...prev.owner, headline: event.target.value } } : prev)}
            placeholder="Headline"
            className="rounded-xl border border-line bg-bg/50 px-4 py-3 text-text"
          />
          <input
            value={data.owner.profilePhotoUrl}
            onChange={(event) => setData((prev) => prev ? { ...prev, owner: { ...prev.owner, profilePhotoUrl: event.target.value } } : prev)}
            placeholder="Profile photo URL"
            className="rounded-xl border border-line bg-bg/50 px-4 py-3 text-text md:col-span-2"
          />
          <input
            value={data.owner.introVideoUrl}
            onChange={(event) => setData((prev) => prev ? { ...prev, owner: { ...prev.owner, introVideoUrl: event.target.value } } : prev)}
            placeholder="Intro YouTube URL"
            className="rounded-xl border border-line bg-bg/50 px-4 py-3 text-text md:col-span-2"
          />
          <textarea
            value={data.owner.shortIntro}
            onChange={(event) => setData((prev) => prev ? { ...prev, owner: { ...prev.owner, shortIntro: event.target.value } } : prev)}
            placeholder="Short intro"
            className="min-h-24 rounded-xl border border-line bg-bg/50 px-4 py-3 text-text md:col-span-2"
          />
        </div>
      </section>

      <section className="mt-8 grid gap-6">
        <JsonEditor title="Projects" value={projectsJson} onChange={setProjectsJson} />
        <JsonEditor title="Certificates" value={certificatesJson} onChange={setCertificatesJson} />
        <JsonEditor title="Goals" value={goalsJson} onChange={setGoalsJson} />
        <JsonEditor title="Education" value={educationJson} onChange={setEducationJson} />

        <section className="rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
          <h3 className="font-heading text-2xl text-text">Import from YouTube link</h3>
          <p className="mt-2 text-xs text-muted">
            Paste a YouTube channel link, handle link, or video link. It will add an entry into the YouTube Channels JSON list.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="YouTube URL (channel/@handle/video)"
              className="rounded-xl border border-line bg-bg/50 px-4 py-3 text-text md:col-span-2"
            />
            <input
              value={youtubeName}
              onChange={(e) => setYoutubeName(e.target.value)}
              placeholder="Display name (optional)"
              className="rounded-xl border border-line bg-bg/50 px-4 py-3 text-text"
            />
            <input
              value={youtubeDescription}
              onChange={(e) => setYoutubeDescription(e.target.value)}
              placeholder="Description (optional)"
              className="rounded-xl border border-line bg-bg/50 px-4 py-3 text-text"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={importYoutubeLink}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-black"
            >
              Import & Add
            </button>
            <button
              type="button"
              onClick={() => {
                setYoutubeUrl("")
                setYoutubeName("")
                setYoutubeDescription("")
                setYoutubeImportError("")
                setYoutubeImportSuccess("")
              }}
              className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-text"
            >
              Clear
            </button>
          </div>

          {youtubeImportSuccess ? <p className="mt-3 text-sm text-accent">{youtubeImportSuccess}</p> : null}
          {youtubeImportError ? <p className="mt-3 text-sm text-red-400">{youtubeImportError}</p> : null}
        </section>

        <JsonEditor title="YouTube Channels" value={channelsJson} onChange={setChannelsJson} />
      </section>

      <section className="mt-8 rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
        <h2 className="font-heading text-2xl text-text">Visitor Contact Destination</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            value={data.visitorContact.email}
            onChange={(event) => setData((prev) => prev ? { ...prev, visitorContact: { ...prev.visitorContact, email: event.target.value } } : prev)}
            placeholder="Public email"
            className="rounded-xl border border-line bg-bg/50 px-4 py-3 text-text"
          />
          <input
            value={data.visitorContact.phone}
            onChange={(event) => setData((prev) => prev ? { ...prev, visitorContact: { ...prev.visitorContact, phone: event.target.value } } : prev)}
            placeholder="Public phone"
            className="rounded-xl border border-line bg-bg/50 px-4 py-3 text-text"
          />
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
        <h2 className="font-heading text-2xl text-text">Visitor Inquiries</h2>
        <div className="mt-4 space-y-3">
          {inquiries.length ? (
            inquiries.map((item) => (
              <article key={item.id} className="rounded-2xl border border-line bg-bg/40 p-4">
                <p className="text-sm text-text">{item.name} - {item.contact}</p>
                <p className="text-sm text-muted">{item.companyName}</p>
                <p className="mt-1 text-sm text-muted">{item.purpose}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-muted">No inquiries yet.</p>
          )}
        </div>
      </section>
    </main>
  )
}

function normalizeYoutubeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ""

  let urlString = trimmed
  if (!/^https?:\/\//i.test(urlString)) {
    urlString = `https://${urlString}`
  }

  let url: URL
  try {
    url = new URL(urlString)
  } catch {
    return ""
  }

  const host = url.hostname.replace(/^www\./i, "").toLowerCase()
  const isYoutube = host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be"
  if (!isYoutube) return ""

  url.hash = ""

  if (host === "youtu.be") {
    const videoId = url.pathname.split("/").filter(Boolean)[0] ?? ""
    if (!videoId) return ""
    return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`
  }

  const pathname = url.pathname.replace(/\/+$/, "")
  const allowedPrefixes = ["/watch", "/shorts/", "/channel/", "/@", "/c/", "/user/"]
  const ok = allowedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix))
  if (!ok) return ""

  url.hostname = "www.youtube.com"
  url.pathname = pathname

  if (pathname === "/watch") {
    const v = url.searchParams.get("v")?.trim() ?? ""
    if (!v) return ""
    url.search = `?v=${encodeURIComponent(v)}`
  } else {
    url.search = ""
  }

  return url.toString()
}

function parseYoutubeImport(
  inputUrl: string,
  fields: { name?: string; description?: string }
): YoutubeImportResult {
  const url = normalizeYoutubeUrl(inputUrl)
  if (!url) {
    return { ok: false, error: "Enter a valid YouTube URL (channel/@handle/video/shorts)" }
  }

  const id = `yt-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
  const name = fields.name && fields.name.length ? fields.name : "YouTube"
  const description = fields.description && fields.description.length ? fields.description : "Imported from YouTube link"

  return {
    ok: true,
    item: {
      id,
      name,
      url,
      description
    }
  }
}

function upsertChannelItem(
  current: unknown[],
  nextItem: { id: string; name: string; url: string; description: string }
): unknown[] {
  const normalizedUrl = normalizeYoutubeUrl(nextItem.url)
  const existingIndex = current.findIndex((item) => {
    if (!item || typeof item !== "object") return false
    const maybeUrl = (item as { url?: unknown }).url
    if (typeof maybeUrl !== "string") return false
    return normalizeYoutubeUrl(maybeUrl) === normalizedUrl
  })

  if (existingIndex === -1) {
    return [nextItem, ...current]
  }

  const existing = current[existingIndex]
  const merged = {
    ...(typeof existing === "object" && existing ? existing : {}),
    ...nextItem,
    url: normalizedUrl || nextItem.url
  }

  return current.map((item, index) => (index === existingIndex ? merged : item))
}

type JsonEditorProps = {
  title: string
  value: string
  onChange: (next: string) => void
}

function JsonEditor({ title, value, onChange }: JsonEditorProps) {
  return (
    <div className="rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
      <h3 className="font-heading text-2xl text-text">{title}</h3>
      <p className="mt-2 text-xs text-muted">Edit this JSON list. Keep valid JSON format.</p>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-4 min-h-48 w-full rounded-2xl border border-line bg-bg/50 px-4 py-3 font-mono text-sm text-text"
      />
    </div>
  )
}
