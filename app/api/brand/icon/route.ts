import { promises as fs } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"

const iconPath = path.join(process.cwd(), "CONTENT", "icon.mp4")

function parseRange(rangeHeader: string, size: number) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader)
  if (!match) return null

  const rawStart = match[1]
  const rawEnd = match[2]

  let start = rawStart ? Number(rawStart) : NaN
  let end = rawEnd ? Number(rawEnd) : NaN

  if (Number.isNaN(start) && Number.isNaN(end)) return null

  if (Number.isNaN(start)) {
    const suffix = Number(rawEnd)
    if (!Number.isFinite(suffix) || suffix <= 0) return null
    start = Math.max(0, size - suffix)
    end = size - 1
  } else {
    if (!Number.isFinite(start) || start < 0 || start >= size) return null
    if (Number.isNaN(end) || end >= size) end = size - 1
    if (end < start) return null
  }

  return { start, end }
}

export async function GET(request: Request) {
  const stat = await fs.stat(iconPath).catch(() => null)
  if (!stat || !stat.isFile()) {
    return NextResponse.json({ error: "Icon video not found" }, { status: 404 })
  }

  const range = request.headers.get("range")

  if (range) {
    const parsed = parseRange(range, stat.size)
    if (!parsed) {
      return new NextResponse(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${stat.size}`,
          "Accept-Ranges": "bytes"
        }
      })
    }

    const chunk = parsed.end - parsed.start + 1
    const handle = await fs.open(iconPath, "r")

    try {
      const buffer = Buffer.alloc(chunk)
      await handle.read(buffer, 0, chunk, parsed.start)

      return new NextResponse(buffer, {
        status: 206,
        headers: {
          "Content-Type": "video/mp4",
          "Content-Length": String(chunk),
          "Content-Range": `bytes ${parsed.start}-${parsed.end}/${stat.size}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=600"
        }
      })
    } finally {
      await handle.close()
    }
  }

  const file = await fs.readFile(iconPath)
  return new NextResponse(file, {
    status: 200,
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": String(stat.size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=600"
    }
  })
}
