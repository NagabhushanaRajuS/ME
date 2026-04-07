"use client"

import { useEffect, useState } from "react"
import type { InquiryItem, PortfolioData } from "@/lib/portfolio-types"

type SaveState = "idle" | "saving" | "saved" | "error"
type ImportTarget = "intro" | "project" | "channel"

type YoutubeImportSuccess = {
  ok: true
  target: ImportTarget
  normalizedUrl: string
  payload: {
    title: string
    description: string
    tags: string[]
  }
}

type YoutubeImportFailure = {
  error: string
}

type YoutubeImportResponse = YoutubeImportSuccess | YoutubeImportFailure

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2)
}

function parseJsonList<T>(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown
    return Array.isArray(parsed) ? (parsed as T[]) : null
  } catch {
    return null
  }
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
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

  const [youtubeTarget, setYoutubeTarget] = useState<ImportTarget>("project")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [youtubeTitle, setYoutubeTitle] = useState("")
  const [youtubeDescription, setYoutubeDescription] = useState("")
  const [youtubeTags, setYoutubeTags] = useState("")
  const [youtubeImportLoading, setYoutubeImportLoading] = useState(false)
  const [youtubeImportError, setYoutubeImportError] = useState("")
  const [youtubeImportSuccess, setYoutubeImportSuccess] = useState("")

  const [certificateImportLoading, setCertificateImportLoading] = useState(false)
  const [certificateImportError, setCertificateImportError] = useState("")
  const [certificateImportSuccess, setCertificateImportSuccess] = useState("")

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

    const parsedProjects = parseJsonList<PortfolioData["projects"][number]>(projectsJson)
    const parsedCertificates = parseJsonList<PortfolioData["certificates"][number]>(certificatesJson)
    const parsedGoals = parseJsonList<PortfolioData["goals"][number]>(goalsJson)
    const parsedEducation = parseJsonList<PortfolioData["education"][number]>(educationJson)
    const parsedChannels = parseJsonList<PortfolioData["channels"][number]>(channelsJson)

    if (!parsedProjects || !parsedCertificates || !parsedGoals || !parsedEducation || !parsedChannels) {
      setSaveState("error")
      setError("One of the list sections has invalid JSON")
      return
    }

    const payload: PortfolioData = {
      ...data,
      projects: parsedProjects,
      certificates: parsedCertificates,
      goals: parsedGoals,
      education: parsedEducation,
      channels: parsedChannels
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
  }

  const importYoutubeLink = async () => {
    setYoutubeImportError("")
    setYoutubeImportSuccess("")

    if (!youtubeUrl.trim()) {
      setYoutubeImportError("Paste a YouTube link first")
      return
    }

    setYoutubeImportLoading(true)

    const tags = youtubeTags
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)

    const response = await fetch("/api/admin/youtube/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: youtubeUrl,
        target: youtubeTarget,
        title: youtubeTitle,
        description: youtubeDescription,
        tags
      })
    })

    const result = (await response.json().catch(() => null)) as YoutubeImportResponse | null

    if (!response.ok || !result || !("ok" in result)) {
      setYoutubeImportError(result && "error" in result ? result.error : "Unable to import YouTube link")
      setYoutubeImportLoading(false)
      return
    }

    if (result.target === "intro") {
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          owner: {
            ...prev.owner,
            introVideoUrl: result.normalizedUrl
          }
        }
      })
      setYoutubeImportSuccess("Intro video updated. Click Save Changes to publish.")
      setYoutubeImportLoading(false)
      return
    }

    if (result.target === "project") {
      const currentProjects = parseJsonList<PortfolioData["projects"][number]>(projectsJson)
      if (!currentProjects) {
        setYoutubeImportError("Projects JSON is invalid. Fix it before importing.")
        setYoutubeImportLoading(false)
        return
      }

      const nextProject: PortfolioData["projects"][number] = {
        id: newId("project"),
        title: result.payload.title || "YouTube Project",
        description: result.payload.description || "Imported from YouTube",
        ytDemoUrl: result.normalizedUrl,
        tags: result.payload.tags
      }

      const duplicate = currentProjects.find((item) => item.ytDemoUrl === result.normalizedUrl)
      const nextProjects = duplicate
        ? currentProjects.map((item) => (item.ytDemoUrl === result.normalizedUrl ? { ...item, ...nextProject, id: item.id } : item))
        : [nextProject, ...currentProjects]

      setProjectsJson(pretty(nextProjects))
      setYoutubeImportSuccess(
        duplicate
          ? "Existing project video updated. Click Save Changes to publish."
          : "Project added from YouTube link. Click Save Changes to publish."
      )
      setYoutubeImportLoading(false)
      return
    }

    const currentChannels = parseJsonList<PortfolioData["channels"][number]>(channelsJson)
    if (!currentChannels) {
      setYoutubeImportError("Channels JSON is invalid. Fix it before importing.")
      setYoutubeImportLoading(false)
      return
    }

    const nextChannel: PortfolioData["channels"][number] = {
      id: newId("channel"),
      name: result.payload.title || "YouTube Channel",
      url: result.normalizedUrl,
      description: result.payload.description || "Imported from YouTube"
    }

    const duplicate = currentChannels.find((item) => item.url === result.normalizedUrl)
    const nextChannels = duplicate
      ? currentChannels.map((item) => (item.url === result.normalizedUrl ? { ...item, ...nextChannel, id: item.id } : item))
      : [nextChannel, ...currentChannels]

    setChannelsJson(pretty(nextChannels))
    setYoutubeImportSuccess(
      duplicate
        ? "Existing channel updated. Click Save Changes to publish."
        : "Channel added from YouTube link. Click Save Changes to publish."
    )
    setYoutubeImportLoading(false)
  }

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/access"
  }

  const importCertificatesFromFolder = async () => {
    setCertificateImportLoading(true)
    setCertificateImportError("")
    setCertificateImportSuccess("")

    const response = await fetch("/api/admin/certificates/import-local", {
      method: "POST"
    })

    const payload = (await response.json().catch(() => null)) as
      | {
          error?: string
          importedCount?: number
          renamedCount?: number
          skippedFiles?: string[]
          certificates?: PortfolioData["certificates"]
        }
      | null

    if (!response.ok || !payload?.certificates) {
      setCertificateImportError(payload?.error ?? "Unable to import certificate images")
      setCertificateImportLoading(false)
      return
    }

    const nextCertificates = payload.certificates
    setCertificatesJson(pretty(nextCertificates))
    setData((prev) => (prev ? { ...prev, certificates: nextCertificates } : prev))

    const importedCount = payload.importedCount ?? nextCertificates.length
    const renamedCount = payload.renamedCount ?? 0
    const skippedCount = payload.skippedFiles?.length ?? 0

    setCertificateImportSuccess(
      `Imported ${importedCount} certificate image(s). Renamed ${renamedCount}. Skipped ${skippedCount}.`
    )
    setCertificateImportLoading(false)
  }

  const setHologramPhoto = (index: number, value: string) => {
    setData((prev) => {
      if (!prev) return prev
      const next = [...(prev.owner.hologramPhotoUrls ?? [])]
      while (next.length < 5) next.push("")
      next[index] = value

      return {
        ...prev,
        owner: {
          ...prev.owner,
          hologramPhotoUrls: next.slice(0, 5)
        }
      }
    })
  }

  if (!data) {
    return <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 text-muted">Loading admin panel...</main>
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-28 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-4xl text-text">Portfolio Control Studio</h1>
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
        Fill details like a form. Keep fields empty to auto-show Coming Soon on the public site.
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
          {Array.from({ length: 5 }).map((_, index) => (
            <input
              key={`holo-${index}`}
              value={data.owner.hologramPhotoUrls?.[index] ?? ""}
              onChange={(event) => setHologramPhoto(index, event.target.value)}
              placeholder={`Hologram photo URL ${index + 1}`}
              className={`rounded-xl border border-line bg-bg/50 px-4 py-3 text-text ${index === 4 ? "md:col-span-2" : ""}`}
            />
          ))}
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

        <section className="rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
          <h3 className="font-heading text-2xl text-text">Import from YouTube link</h3>
          <p className="mt-2 text-xs text-muted">
            Choose target, paste a YouTube URL, and it auto-fills Intro Video, Project Demo, or Channel entry.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-xs text-muted">
              Target
              <select
                value={youtubeTarget}
                onChange={(event) => setYoutubeTarget(event.target.value as ImportTarget)}
                className="mt-1 w-full rounded-xl border border-line bg-bg/50 px-4 py-3 text-sm text-text"
              >
                <option value="intro">Owner Intro Video</option>
                <option value="project">Project Demo Video</option>
                <option value="channel">YouTube Channel</option>
              </select>
            </label>

            <input
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              placeholder="YouTube URL"
              className="rounded-xl border border-line bg-bg/50 px-4 py-3 text-text"
            />

            <input
              value={youtubeTitle}
              onChange={(event) => setYoutubeTitle(event.target.value)}
              placeholder="Title / Name override (optional)"
              className="rounded-xl border border-line bg-bg/50 px-4 py-3 text-text"
            />
            <input
              value={youtubeTags}
              onChange={(event) => setYoutubeTags(event.target.value)}
              placeholder="Tags comma separated (project only)"
              className="rounded-xl border border-line bg-bg/50 px-4 py-3 text-text"
            />

            <textarea
              value={youtubeDescription}
              onChange={(event) => setYoutubeDescription(event.target.value)}
              placeholder="Description override (optional)"
              className="min-h-24 rounded-xl border border-line bg-bg/50 px-4 py-3 text-text md:col-span-2"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void importYoutubeLink()}
              disabled={youtubeImportLoading}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-black disabled:opacity-60"
            >
              {youtubeImportLoading ? "Importing..." : "Import from YouTube"}
            </button>
            <button
              type="button"
              onClick={() => {
                setYoutubeUrl("")
                setYoutubeTitle("")
                setYoutubeDescription("")
                setYoutubeTags("")
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

        <section className="rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
          <h3 className="font-heading text-2xl text-text">Smart Certificate Import</h3>
          <p className="mt-2 text-xs text-muted">
            Reads images in CONTENT/Certificates, extracts text, auto-sets title/issuer/date, renames files cleanly,
            and updates the Certificates list.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void importCertificatesFromFolder()}
              disabled={certificateImportLoading}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-black disabled:opacity-60"
            >
              {certificateImportLoading ? "Importing..." : "Scan + Import From CONTENT/Certificates"}
            </button>
          </div>
          {certificateImportSuccess ? <p className="mt-3 text-sm text-accent">{certificateImportSuccess}</p> : null}
          {certificateImportError ? <p className="mt-3 text-sm text-red-400">{certificateImportError}</p> : null}
        </section>

        <JsonEditor title="Certificates" value={certificatesJson} onChange={setCertificatesJson} />
        <JsonEditor title="Goals" value={goalsJson} onChange={setGoalsJson} />
        <JsonEditor title="Education" value={educationJson} onChange={setEducationJson} />
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
