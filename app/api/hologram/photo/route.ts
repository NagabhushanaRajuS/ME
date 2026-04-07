import { promises as dns } from "node:dns"
import { isIP } from "node:net"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

const MAX_IMAGE_BYTES = 8_000_000
const FETCH_TIMEOUT_MS = 4000

function parseIpv4(value: string) {
  const parts = value.split(".")
  if (parts.length !== 4) return null

  const out = parts.map((part) => Number(part))
  if (out.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return null

  return out as [number, number, number, number]
}

function isBlockedIpv4(ip: string) {
  const parsed = parseIpv4(ip)
  if (!parsed) return true

  const [a, b] = parsed

  if (a === 0) return true
  if (a === 10) return true
  if (a === 100 && b >= 64 && b <= 127) return true
  if (a === 127) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a >= 224) return true

  return false
}

function isBlockedIpv6(ip: string) {
  const host = ip.toLowerCase()
  if (host === "::" || host === "::1") return true
  if (host.startsWith("fe80:")) return true
  if (host.startsWith("fc") || host.startsWith("fd")) return true

  const mapped = host.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped?.[1]) {
    return isBlockedIpv4(mapped[1])
  }

  return false
}

function isBlockedIp(value: string) {
  const kind = isIP(value)
  if (kind === 4) return isBlockedIpv4(value)
  if (kind === 6) return isBlockedIpv6(value)
  return true
}

function isBlockedHostname(hostname: string) {
  const host = hostname.toLowerCase().trim()
  if (!host || host.includes("\0")) return true
  if (host === "localhost" || host.endsWith(".local")) return true

  const ipKind = isIP(host)
  if (ipKind) return isBlockedIp(host)

  return false
}

async function resolvesToBlockedIp(hostname: string) {
  const ipKind = isIP(hostname)
  if (ipKind) return isBlockedIp(hostname)

  try {
    const results = await dns.lookup(hostname, { all: true, verbatim: true })
    return results.some((result) => isBlockedIp(result.address))
  } catch {
    return true
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get("url")?.trim()

  if (!target) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(target)
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 })
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json({ error: "Unsupported url" }, { status: 400 })
  }

  if (parsed.username || parsed.password) {
    return NextResponse.json({ error: "Unsupported url" }, { status: 400 })
  }

  if (parsed.port && !["80", "443"].includes(parsed.port)) {
    return NextResponse.json({ error: "Unsupported url" }, { status: 400 })
  }

  if (isBlockedHostname(parsed.hostname) || (await resolvesToBlockedIp(parsed.hostname))) {
    return NextResponse.json({ error: "Unsupported url" }, { status: 400 })
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  const upstream = await fetch(parsed.toString(), {
    redirect: "manual",
    cache: "no-store",
    signal: controller.signal,
    headers: {
      Accept: "image/*",
      "User-Agent": "portfolio-hologram-proxy"
    }
  }).catch(() => null)

  clearTimeout(timeoutId)

  if (!upstream) {
    return NextResponse.json({ error: "Unable to fetch image" }, { status: 502 })
  }

  if (upstream.status >= 300 && upstream.status < 400) {
    return NextResponse.json({ error: "Redirects are not allowed" }, { status: 400 })
  }

  if (!upstream.ok) {
    return NextResponse.json({ error: "Unable to fetch image" }, { status: 502 })
  }

  const contentType = upstream.headers.get("content-type") ?? ""
  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "URL does not return an image" }, { status: 415 })
  }

  const contentLength = Number(upstream.headers.get("content-length") ?? "0")
  if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image too large" }, { status: 413 })
  }

  const reader = upstream.body?.getReader()
  if (!reader) {
    return NextResponse.json({ error: "Unable to fetch image" }, { status: 502 })
  }

  const chunks: Uint8Array[] = []
  let total = 0

  while (true) {
    const next = await reader.read().catch(() => null)
    if (!next) {
      return NextResponse.json({ error: "Unable to fetch image" }, { status: 502 })
    }

    if (next.done) break
    if (!next.value) continue

    total += next.value.byteLength
    if (total > MAX_IMAGE_BYTES) {
      await reader.cancel().catch(() => null)
      return NextResponse.json({ error: "Image too large" }, { status: 413 })
    }

    chunks.push(next.value)
  }

  const body = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)))

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300"
    }
  })
}
