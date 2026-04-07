import { promises as fs } from "node:fs"
import path from "node:path"

const certificateDir = path.join(process.cwd(), "CONTENT", "Certificates")
const allowedExt = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"])

function normalizeCertificateImageName(input: string) {
  const trimmed = input.trim()
  if (!trimmed || trimmed.includes("\0")) return null

  const base = path.basename(trimmed)
  if (base !== trimmed) return null

  const ext = path.extname(base).toLowerCase()
  if (!allowedExt.has(ext)) return null

  return base
}

export function resolveLocalCertificatePath(fileName: string) {
  const safeName = normalizeCertificateImageName(fileName)
  if (!safeName) return null

  return path.join(certificateDir, safeName)
}

export async function listLocalCertificateImageNames() {
  try {
    const entries = await fs.readdir(certificateDir, { withFileTypes: true })

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

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

export async function renameLocalCertificateImage(oldName: string, desiredName: string) {
  const safeOldName = normalizeCertificateImageName(oldName)
  const safeDesiredName = normalizeCertificateImageName(desiredName)

  if (!safeOldName || !safeDesiredName) return oldName
  if (safeOldName === safeDesiredName) return safeOldName

  const oldPath = resolveLocalCertificatePath(safeOldName)
  const desiredPath = resolveLocalCertificatePath(safeDesiredName)

  if (!oldPath || !desiredPath) return oldName

  const desiredBase = path.parse(safeDesiredName).name
  const desiredExt = path.extname(safeDesiredName)

  let finalName = safeDesiredName
  let finalPath = desiredPath
  let suffix = 1

  while (await fileExists(finalPath)) {
    finalName = `${desiredBase}-${suffix}${desiredExt}`
    finalPath = resolveLocalCertificatePath(finalName) ?? finalPath
    suffix += 1
  }

  try {
    await fs.rename(oldPath, finalPath)
    return finalName
  } catch {
    return oldName
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function buildCertificateImageFileName(input: {
  title: string
  issuer: string
  date: string
  ext: string
}) {
  const title = slugify(input.title) || "certificate"
  const issuer = slugify(input.issuer)
  const date = slugify(input.date)

  const stem = [title, issuer, date].filter(Boolean).join("-")
  const ext = allowedExt.has(input.ext.toLowerCase()) ? input.ext.toLowerCase() : ".png"

  return `${stem}${ext}`
}

export function getLocalCertificatePreviewUrl(fileName: string) {
  return `/api/certificates/local-image?name=${encodeURIComponent(fileName)}`
}
