export function toYoutubeEmbedUrl(url: string) {
  if (!url) return ""

  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.slice(1)
      return videoId ? `https://www.youtube.com/embed/${videoId}` : ""
    }

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v")
      if (videoId) return `https://www.youtube.com/embed/${videoId}`

      if (parsed.pathname.includes("/embed/")) return url
    }

    return ""
  } catch {
    return ""
  }
}
