import { promises as fs } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"
import { resolveLocalHologramImagePath } from "@/lib/hologram-local"

function getContentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()

  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".png":
      return "image/png"
    case ".webp":
      return "image/webp"
    case ".gif":
      return "image/gif"
    case ".avif":
      return "image/avif"
    default:
      return "application/octet-stream"
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get("name") ?? ""

  const imagePath = resolveLocalHologramImagePath(name)
  if (!imagePath) {
    return NextResponse.json({ error: "Invalid image name" }, { status: 400 })
  }

  const buffer = await fs.readFile(imagePath).catch(() => null)
  if (!buffer) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 })
  }

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": getContentType(imagePath),
      "Cache-Control": "public, max-age=600"
    }
  })
}
