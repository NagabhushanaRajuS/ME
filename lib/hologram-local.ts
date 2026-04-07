import { promises as fs } from "node:fs"
import path from "node:path"

const hologramDir = path.join(process.cwd(), "CONTENT", "my_Images")
const allowedExt = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"])

function normalizeFileName(input: string) {
  const trimmed = input.trim()
  if (!trimmed || trimmed.includes("\0")) return null

  const base = path.basename(trimmed)
  if (base !== trimmed) return null

  const ext = path.extname(base).toLowerCase()
  if (!allowedExt.has(ext)) return null

  return base
}

export function resolveLocalHologramImagePath(fileName: string) {
  const safeName = normalizeFileName(fileName)
  if (!safeName) return null
  return path.join(hologramDir, safeName)
}

export async function listLocalHologramImageNames() {
  try {
    const entries = await fs.readdir(hologramDir, { withFileTypes: true })

    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => {
        const ext = path.extname(name).toLowerCase()
        return allowedExt.has(ext)
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
  } catch {
    return []
  }
}

export async function getLocalHologramPhotoUrls() {
  const names = await listLocalHologramImageNames()
  return names.map((name) => `/api/hologram/local-photo?name=${encodeURIComponent(name)}`)
}
