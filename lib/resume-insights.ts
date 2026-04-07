import { promises as fs } from "node:fs"
import { getDefaultResumeFileName, resolveLocalResumePath } from "@/lib/resume-local"

export type ResumeInsights = {
  fileName: string
  email: string
  phone: string
  textPreview: string
  objective: string
}

let cached:
  | {
      fileName: string
      mtimeMs: number
      insights: ResumeInsights
    }
  | null = null

function pickFirstEmail(text: string) {
  const match = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)
  return match?.[0] ?? ""
}

function normalizePhone(raw: string) {
  const trimmed = raw.trim()
  if (!trimmed) return ""

  const keepPlus = trimmed.startsWith("+")
  const digits = trimmed.replace(/\D/g, "")
  const digitCount = digits.length
  if (digitCount < 10 || digitCount > 15) return ""

  return keepPlus ? `+${digits}` : digits
}

function pickFirstPhone(text: string) {
  const candidates = text.match(/\+?\d[\d\s().-]{8,}\d/g) ?? []
  for (const candidate of candidates) {
    const normalized = normalizePhone(candidate)
    if (normalized) return normalized
  }
  return ""
}

function makePreview(text: string, maxChars: number) {
  const cleaned = text.replace(/\s+/g, " ").trim()
  if (!cleaned) return ""
  return cleaned.length > maxChars ? `${cleaned.slice(0, maxChars).trim()}…` : cleaned
}

function cleanResumeText(text: string) {
  return text
    .replace(/[\u00ad\u200b]/g, "")
    .replace(/Ɵ/g, "ti")
    .replace(/Ō/g, "ft")
    .replace(/–|—/g, "-")
    .replace(/\s+/g, " ")
    .trim()
}

function extractObjective(text: string) {
  const cleaned = cleanResumeText(text)
  if (!cleaned) return ""

  const objectiveMatch = cleaned.match(
    /CAREER\s+OBJECTIVE\s*(.*?)(?=\s+EXPERIENCE\b|\s+PROJECTS\b|\s+EDUCATION\b|\s+TECHNICAL\s+SKILLS\b|$)/i
  )

  const objectiveText = objectiveMatch?.[1]?.trim() ?? ""
  if (!objectiveText) return ""

  return makePreview(objectiveText, 460)
}

async function extractPdfText(buffer: Buffer) {
  const pdfParseModule = (await import("pdf-parse").catch(() => null)) as unknown as
    | { default?: (input: Buffer) => Promise<{ text?: string }> }
    | ((input: Buffer) => Promise<{ text?: string }>)
    | null

  if (!pdfParseModule) return ""

  const parseFn = typeof pdfParseModule === "function" ? pdfParseModule : pdfParseModule.default
  if (!parseFn) return ""

  try {
    const result = await parseFn(buffer)
    return typeof result?.text === "string" ? result.text : ""
  } catch {
    return ""
  }
}

export async function getLocalResumeInsights(): Promise<ResumeInsights | null> {
  const fileName = await getDefaultResumeFileName()
  if (!fileName) return null

  const filePath = resolveLocalResumePath(fileName)
  if (!filePath) return null

  const stat = await fs.stat(filePath).catch(() => null)
  if (!stat || !stat.isFile()) return null

  if (cached && cached.fileName === fileName && cached.mtimeMs === stat.mtimeMs) {
    return cached.insights
  }

  const buffer = await fs.readFile(filePath).catch(() => null)
  if (!buffer) return null

  const text = await extractPdfText(buffer)
  const insights: ResumeInsights = {
    fileName,
    email: pickFirstEmail(text),
    phone: pickFirstPhone(text),
    textPreview: makePreview(text, 520),
    objective: extractObjective(text)
  }

  cached = { fileName, mtimeMs: stat.mtimeMs, insights }
  return insights
}
