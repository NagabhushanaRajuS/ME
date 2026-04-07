import { promises as fs } from "node:fs"
import path from "node:path"

const resumeDir = path.join(process.cwd(), "CONTENT", "Resume")
const allowedExt = new Set([".pdf"])

function normalizeResumeFileName(input: string) {
  const trimmed = input.trim()
  if (!trimmed || trimmed.includes("\0")) return null

  const base = path.basename(trimmed)
  if (base !== trimmed) return null

  const ext = path.extname(base).toLowerCase()
  if (!allowedExt.has(ext)) return null

  return base
}

export function resolveLocalResumePath(fileName: string) {
  const safeName = normalizeResumeFileName(fileName)
  if (!safeName) return null
  return path.join(resumeDir, safeName)
}

export async function listLocalResumeFileNames() {
  try {
    const entries = await fs.readdir(resumeDir, { withFileTypes: true })

    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => allowedExt.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
  } catch {
    return []
  }
}

export async function getDefaultResumeFileName() {
  const names = await listLocalResumeFileNames()
  return names[0] ?? null
}
