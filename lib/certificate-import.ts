import path from "node:path"
import type { CertificateItem } from "@/lib/portfolio-types"
import {
  buildCertificateImageFileName,
  getLocalCertificatePreviewUrl,
  listLocalCertificateImageNames,
  renameLocalCertificateImage,
  resolveLocalCertificatePath
} from "@/lib/certificate-local"

type ImportReport = {
  certificates: CertificateItem[]
  importedCount: number
  renamedCount: number
  skippedFiles: string[]
}

const GOOGLE_AI_COURSE_LINKS = [
  "https://coursera.org/share/021ae5d0876d16c9d6142f2461ce9a74",
  "https://coursera.org/share/b78b1d3b54a407813bb28dc8fbff2527",
  "https://coursera.org/share/74f05229401d92729926bc1d4b0f8b42",
  "https://coursera.org/share/75a86f79c043051a9a17cd0e55c500f0",
  "https://coursera.org/share/3bcf87d7282bff3d5b663a72c26ceecd",
  "https://coursera.org/share/bacf27be775ab2859f606f28f0eb1c37",
  "https://coursera.org/share/2d021f9aede33085bd439d0931ed26f9"
]

const GOOGLE_AI_CREDENTIAL_URL = "https://coursera.org/verify/professional-cert/BY56EG6NY11L"

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

function titleFromFileName(fileName: string) {
  const raw = path.parse(fileName).name
  const cleaned = raw
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (!cleaned) return "Certificate"

  if (/^screenshot\b/i.test(cleaned)) {
    const dateMatch = cleaned.match(/(\d{4}[-/]\d{2}[-/]\d{2})/)
    return dateMatch ? `Certificate ${dateMatch[1].replace(/\//g, "-")}` : "Certificate Screenshot"
  }

  if (/^whatsapp image\b/i.test(cleaned)) {
    return "Certificate Image"
  }

  return titleCase(cleaned)
}

function inferIssuer(text: string, fileName: string) {
  const source = `${text}\n${fileName}`.toLowerCase()

  const hints: Array<{ needle: RegExp; issuer: string }> = [
    { needle: /infosys/, issuer: "Infosys" },
    { needle: /google/, issuer: "Google" },
    { needle: /coursera/, issuer: "Coursera" },
    { needle: /udemy/, issuer: "Udemy" },
    { needle: /nptel/, issuer: "NPTEL" },
    { needle: /government|govt|gov\b/, issuer: "Government" },
    { needle: /internshala/, issuer: "Internshala" },
    { needle: /hackerrank/, issuer: "HackerRank" }
  ]

  for (const hint of hints) {
    if (hint.needle.test(source)) return hint.issuer
  }

  const lines = text.split(/\r?\n/).map(normalizeWhitespace).filter(Boolean)
  const byLine = lines.find((line) => /issued by|offered by|from\s+/i.test(line))
  if (byLine) return byLine.slice(0, 60)

  return "Certificate Authority"
}

function inferDate(text: string, fileName: string) {
  const source = `${text}\n${fileName}`

  const datePatterns = [
    /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/,
    /\b\d{4}[/-]\d{2}[/-]\d{2}\b/,
    /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2},?\s*\d{4}\b/i,
    /\b\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{4}\b/i
  ]

  for (const pattern of datePatterns) {
    const found = source.match(pattern)
    if (found) return found[0].replace(/\s+/g, " ").replace(/,(\d{4})/, ", $1")
  }

  const fileDate = fileName.match(/(\d{4}-\d{2}-\d{2})/)
  return fileDate ? fileDate[1] : "Date Not Specified"
}

function inferTitle(text: string, fileName: string) {
  const normalized = normalizeWhitespace(text)

  const professionalMatch = normalized.match(
    /(?:Professional Certificate|Specialization)\s+(.+?)(?:\s+(?:Those|This|Verify|Issued|Date)\b|$)/i
  )

  if (professionalMatch?.[1]) {
    const extracted = normalizeWhitespace(professionalMatch[1])
    if (/\bgoogle\s+a[il]\b/i.test(extracted)) return "Google AI"
    if (extracted.length >= 3 && extracted.length <= 80) return extracted
  }

  const completedMatch = normalized.match(
    /has\s+successfully\s+completed\s+(?:the\s+online\s+)?(.+?)(?:\s+an\s+online\b|\s+authorized\b|\s+offered\b|\s+provided\b|\s+Those\b|\s+This\b|$)/i
  )

  if (completedMatch?.[1]) {
    const extracted = normalizeWhitespace(completedMatch[1])
      .replace(/^(?:professional\s+certificate|specialization)\s+/i, "")
      .trim()
    if (/\bgoogle\s+a[il]\b/i.test(extracted)) return "Google AI"
    if (extracted.length >= 3 && extracted.length <= 80) return extracted
  }

  const lines = text
    .split(/\r?\n/)
    .map(normalizeWhitespace)
    .filter((line) => line.length >= 6 && line.length <= 88)

  const blockedExact = new Set([
    "certificate",
    "certificate of completion",
    "this is to certify that",
    "verify this certificate"
  ])

  const scored = lines
    .map((line) => {
      const lower = line.toLowerCase()
      let score = 0

      if (blockedExact.has(lower)) return { line, score: -999 }
      if (/^issued\s+on\b/i.test(line)) return { line, score: -999 }
      if (/^credential\s+id\b/i.test(line)) return { line, score: -999 }
      if (/^[0-9\W]+$/.test(line)) return { line, score: -999 }
      if (!/[a-z]/i.test(line)) return { line, score: -999 }

      if (/\b(ai|machine|learning|data|cloud|python|java|react|node|devops|security|google|coursera|udemy|nptel|infosys|internshala|hackerrank)\b/i.test(line)) {
        score += 3
      }

      if (line.length >= 8 && line.length <= 56) score += 2
      if (line.split(/\s+/).length >= 2) score += 1

      if (/^(?:[A-Z][a-z]+\s+){1,3}[A-Z][a-z]+$/.test(line)) score -= 2
      if (/\b(verify|issued|credential|date|certificate)\b/i.test(line)) score -= 1

      return { line, score }
    })
    .sort((a, b) => b.score - a.score)

  const candidate = scored[0]?.score > 0 ? scored[0].line : null

  return candidate ? candidate : titleFromFileName(fileName)
}

function inferCredentialUrl(text: string) {
  const compact = text.replace(/\s+/g, "")
  const courseraVerifyMatch = compact.match(/(https?:\/\/)?coursera\.org\/verify\/[a-z0-9\/-]+/i)

  if (courseraVerifyMatch?.[0]) {
    const raw = courseraVerifyMatch[0].replace(/[),.]+$/, "")
    return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  }

  const genericMatch = text.match(/https?:\/\/[^\s)]+/i)
  if (genericMatch?.[0]) {
    return genericMatch[0].replace(/[),.]+$/, "")
  }

  return ""
}

function shouldAttachGoogleAiCourseLinks(input: {
  ocrText: string
  title: string
  issuer: string
  fileName: string
}) {
  const combined = `${input.ocrText}\n${input.title}\n${input.issuer}\n${input.fileName}`.toLowerCase()
  const hasGoogle = /\bgoogle\b/.test(combined)
  const hasAi =
    /\bai\b/.test(combined) ||
    /\bgoogle\s+a[il]\b/.test(combined) ||
    /artificial\s+intelligence|generative\s+ai/.test(combined)
  return hasGoogle && hasAi
}

async function readCertificateText(filePath: string) {
  const worker = await createOcrWorker()
  try {
    return await readCertificateTextWithWorker(worker, filePath)
  } finally {
    await worker?.terminate().catch(() => undefined)
  }
}

type OcrWorker = {
  recognize: (image: string) => Promise<{ data?: { text?: string } }>
  terminate: () => Promise<unknown>
}

async function createOcrWorker(): Promise<OcrWorker | null> {
  try {
    const tesseract = await import("tesseract.js")
    const workerPath = path.join(
      process.cwd(),
      "node_modules",
      "tesseract.js",
      "src",
      "worker-script",
      "node",
      "index.js"
    )

    const worker = await tesseract.createWorker("eng", tesseract.OEM.LSTM_ONLY, {
      logger: () => undefined,
      workerPath
    })

    return worker as unknown as OcrWorker
  } catch {
    return null
  }
}

async function readCertificateTextWithWorker(worker: OcrWorker | null, filePath: string) {
  if (!worker) return ""

  try {
    const result = await worker.recognize(filePath)
    const raw = typeof result?.data?.text === "string" ? result.data.text : ""
    return raw.trim()
  } catch {
    return ""
  }
}

function makeId(stem: string, index: number) {
  const safeStem = stem
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36)

  return `cert-${safeStem || "item"}-${index + 1}`
}

export async function importCertificatesFromLocalFolder(existing: CertificateItem[]): Promise<ImportReport> {
  const fileNames = await listLocalCertificateImageNames()
  const localPreviewPrefix = "/api/certificates/local-image?name="

  const retained = existing.filter((item) => !item.previewImage.startsWith(localPreviewPrefix))
  const existingLocal = existing.filter((item) => item.previewImage.startsWith(localPreviewPrefix))
  const existingLocalByPreview = new Map(existingLocal.map((item) => [item.previewImage, item]))

  const imported: CertificateItem[] = []
  const skippedFiles: string[] = []
  let renamedCount = 0

  const ocrWorker = await createOcrWorker()

  try {
    for (let index = 0; index < fileNames.length; index += 1) {
      const originalName = fileNames[index]
      const filePath = resolveLocalCertificatePath(originalName)
      if (!filePath) {
        skippedFiles.push(originalName)
        continue
      }

      const ocrText = await readCertificateTextWithWorker(ocrWorker, filePath)

    const title = inferTitle(ocrText, originalName)
    const issuer = inferIssuer(ocrText, originalName)
    const date = inferDate(ocrText, originalName)

    const inferredCredentialUrl = inferCredentialUrl(ocrText)

    const ext = path.extname(originalName).toLowerCase() || ".png"
    const desiredName = buildCertificateImageFileName({
      title,
      issuer,
      date,
      ext
    })

    const finalName = await renameLocalCertificateImage(originalName, desiredName)
    if (finalName !== originalName) renamedCount += 1

    const previewImage = getLocalCertificatePreviewUrl(finalName)
    const existingItem = existingLocalByPreview.get(previewImage)
    const isGoogleAi = shouldAttachGoogleAiCourseLinks({
      ocrText,
      title,
      issuer,
      fileName: originalName
    })

    const credentialUrl =
      inferredCredentialUrl ||
      existingItem?.credentialUrl ||
      (isGoogleAi ? GOOGLE_AI_CREDENTIAL_URL : "")

    const autoCourseLinks = isGoogleAi ? GOOGLE_AI_COURSE_LINKS : []

    const existingCourseLinks = Array.isArray(existingItem?.courseLinks) ? existingItem.courseLinks : []
    const mergedCourseLinks = Array.from(new Set([...autoCourseLinks, ...existingCourseLinks])).filter(Boolean)

      imported.push({
        id: makeId(path.parse(finalName).name, index),
        title,
        issuer,
        date,
        credentialUrl,
        courseLinks: mergedCourseLinks.length ? mergedCourseLinks : undefined,
        previewImage
      })
    }
  } finally {
    await ocrWorker?.terminate().catch(() => undefined)
  }

  return {
    certificates: [...imported, ...retained],
    importedCount: imported.length,
    renamedCount,
    skippedFiles
  }
}
