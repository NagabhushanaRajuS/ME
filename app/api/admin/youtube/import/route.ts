import { NextResponse } from "next/server"
import { isRequestAuthorized } from "@/lib/auth"
import { getYoutubeLinkKind, normalizeYoutubeUrl } from "@/lib/video"

type ImportTarget = "intro" | "project" | "channel"

type ImportBody = {
  url?: string
  target?: ImportTarget
  title?: string
  description?: string
  tags?: string[]
}

async function fetchYoutubeOEmbed(url: string) {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`

  try {
    const response = await fetch(endpoint, {
      headers: {
        "User-Agent": "portfolio-admin-youtube-import"
      },
      cache: "no-store"
    })

    if (!response.ok) return null

    const payload = await response.json().catch(() => null) as
      | { title?: string; author_name?: string; thumbnail_url?: string }
      | null

    if (!payload) return null

    return {
      title: payload.title ?? "",
      authorName: payload.author_name ?? "",
      thumbnailUrl: payload.thumbnail_url ?? ""
    }
  } catch {
    return null
  }
}

export async function POST(request: import("next/server").NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null) as ImportBody | null
  const rawUrl = body?.url?.trim() ?? ""
  const target = body?.target ?? "project"

  if (!rawUrl) {
    return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 })
  }

  if (!["intro", "project", "channel"].includes(target)) {
    return NextResponse.json({ error: "Invalid import target" }, { status: 400 })
  }

  const normalizedUrl = normalizeYoutubeUrl(rawUrl)
  if (!normalizedUrl) {
    return NextResponse.json({ error: "Enter a valid YouTube URL" }, { status: 400 })
  }

  const kind = getYoutubeLinkKind(normalizedUrl)
  const metadata = await fetchYoutubeOEmbed(normalizedUrl)

  if ((target === "intro" || target === "project") && kind !== "video") {
    return NextResponse.json({ error: "For intro/project import, provide a YouTube video link" }, { status: 400 })
  }

  if (target === "channel" && kind !== "channel") {
    return NextResponse.json({ error: "For channel import, provide a YouTube channel/@handle link" }, { status: 400 })
  }

  const title = (body?.title?.trim() || metadata?.title || (target === "channel" ? metadata?.authorName : "") || "YouTube Import")
  const description = body?.description?.trim() || "Imported from YouTube"
  const tags = Array.isArray(body?.tags) ? body.tags.filter((item) => item.trim().length > 0) : []

  return NextResponse.json(
    {
      ok: true,
      target,
      normalizedUrl,
      kind,
      metadata,
      payload: {
        title,
        description,
        tags
      }
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  )
}
