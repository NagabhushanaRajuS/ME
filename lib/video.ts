export type YoutubeLinkKind = "video" | "channel" | "unknown"

function toUrl(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return null

  const value = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    return new URL(value)
  } catch {
    return null
  }
}

function isYoutubeHost(hostname: string) {
  const host = hostname.replace(/^www\./i, "").toLowerCase()
  return host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be"
}

export function normalizeYoutubeUrl(input: string) {
  const parsed = toUrl(input)
  if (!parsed || !isYoutubeHost(parsed.hostname)) return ""

  const host = parsed.hostname.replace(/^www\./i, "").toLowerCase()

  if (host === "youtu.be") {
    const id = parsed.pathname.split("/").filter(Boolean)[0] ?? ""
    return id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : ""
  }

  const pathname = parsed.pathname.replace(/\/+$/, "")
  parsed.hostname = "www.youtube.com"
  parsed.pathname = pathname || "/"
  parsed.hash = ""

  if (pathname === "/watch") {
    const v = parsed.searchParams.get("v")?.trim() ?? ""
    if (!v) return ""
    const list = parsed.searchParams.get("list")?.trim() ?? ""
    parsed.search = list
      ? `?v=${encodeURIComponent(v)}&list=${encodeURIComponent(list)}`
      : `?v=${encodeURIComponent(v)}`
    return parsed.toString()
  }

  if (pathname.startsWith("/@") || pathname.startsWith("/channel/") || pathname.startsWith("/c/") || pathname.startsWith("/user/")) {
    parsed.search = ""
    return parsed.toString()
  }

  if (pathname.startsWith("/shorts/") || pathname.startsWith("/live/")) {
    const id = pathname.split("/").filter(Boolean)[1] ?? ""
    return id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : ""
  }

  if (pathname.startsWith("/embed/")) {
    const id = pathname.split("/").filter(Boolean)[1] ?? ""
    return id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : ""
  }

  return ""
}

export function getYoutubeLinkKind(input: string): YoutubeLinkKind {
  const normalized = normalizeYoutubeUrl(input)
  if (!normalized) return "unknown"

  try {
    const url = new URL(normalized)
    if (url.pathname === "/watch") return "video"

    if (url.pathname.startsWith("/@") || url.pathname.startsWith("/channel/") || url.pathname.startsWith("/c/") || url.pathname.startsWith("/user/")) {
      return "channel"
    }
  } catch {
    return "unknown"
  }

  return "unknown"
}

export function extractYoutubeVideoId(input: string) {
  const normalized = normalizeYoutubeUrl(input)
  if (!normalized) return ""

  try {
    const url = new URL(normalized)
    if (url.pathname !== "/watch") return ""
    return url.searchParams.get("v") ?? ""
  } catch {
    return ""
  }
}

export function toYoutubeEmbedUrl(input: string) {
  const videoId = extractYoutubeVideoId(input)
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : ""
}
