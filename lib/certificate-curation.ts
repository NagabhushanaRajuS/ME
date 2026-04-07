import type { CertificateItem } from "@/lib/portfolio-types"

const genericIssuers = new Set(["certificate authority", "authority", "issuer"])

function normalizeSpaces(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function cleanLabel(value: string) {
  return normalizeSpaces(value.replace(/[|]+/g, " ").replace(/[\[\]{}]+/g, " "))
}

function toTitleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

function extractFileNameFromPreview(previewImage: string) {
  const query = previewImage.split("?")[1] ?? ""
  const params = new URLSearchParams(query)
  const name = params.get("name")
  return name ? decodeURIComponent(name) : ""
}

function fallbackTitleFromPreview(previewImage: string) {
  const fileName = extractFileNameFromPreview(previewImage)
  if (!fileName) return "Professional Certificate"

  const stem = fileName.replace(/\.[^.]+$/, "")
  const readable = stem
    .replace(/[_-]+/g, " ")
    .replace(/\b(19|20)\d{2}(?:\s+\d{1,2})?(?:\s+\d{1,2})?\b/g, " ")
    .replace(/\b(date\s+not\s+specified|certificate\s+authority)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (readable.length < 5) return "Professional Certificate"
  return toTitleCase(readable)
}

function looksNoisyTitle(title: string) {
  const cleaned = cleanLabel(title)
  if (!cleaned) return true
  if (/^coming\s+soon\.?$/i.test(cleaned)) return true

  const letters = (cleaned.match(/[A-Za-z]/g) ?? []).length
  const symbols = (cleaned.match(/[^A-Za-z0-9\s&().,+/-]/g) ?? []).length
  if (letters < 4) return true
  if (symbols > letters * 0.25) return true

  if (/^[^A-Za-z]*[\])}]/.test(cleaned)) return true
  if (/\.(pdf|png|jpg|jpeg|gif|webp)\b/i.test(cleaned)) return true
  if (/\b(has successfully completed the|this is to certify that)\b/i.test(cleaned)) return true
  if (/\bfrom\s+(maharaja|institute|university|college|school)\b/i.test(cleaned)) return true

  const words = cleaned.trim().split(/\s+/)
  const longGibberishWords = words.filter((w) => w.length > 3 && !/[aeiou]/i.test(w))
  if (longGibberishWords.length >= 2) return true

  return false
}

function fallbackIssuer(credentialUrl: string) {
  const source = credentialUrl.toLowerCase()
  if (source.includes("coursera")) return "Coursera"
  if (source.includes("google")) return "Google"
  if (source.includes("infosys")) return "Infosys"
  return "Verified Platform"
}

function normalizeDate(date: string) {
  const cleaned = cleanLabel(date)
  if (!cleaned || /^date\s+not\s+specified$/i.test(cleaned)) return "Date not specified"
  return cleaned
}

function scoreCertificate(cert: CertificateItem) {
  let score = 0
  if (cert.credentialUrl) score += 4
  if (!looksNoisyTitle(cert.title)) score += 3
  if (cert.issuer && !genericIssuers.has(cert.issuer.trim().toLowerCase())) score += 2
  if (cert.date && cert.date.toLowerCase() !== "date not specified") score += 1
  return score
}

export function curateCertificates(input: CertificateItem[]): CertificateItem[] {
  return input
    .map((cert) => {
      const cleanedTitle = cleanLabel(cert.title)
      const title = looksNoisyTitle(cleanedTitle) ? fallbackTitleFromPreview(cert.previewImage) : cleanedTitle

      const rawIssuer = cleanLabel(cert.issuer)
      const issuer = rawIssuer && !genericIssuers.has(rawIssuer.toLowerCase()) ? rawIssuer : fallbackIssuer(cert.credentialUrl)

      return {
        ...cert,
        title,
        issuer,
        date: normalizeDate(cert.date)
      }
    })
    .sort((a, b) => scoreCertificate(b) - scoreCertificate(a))
}
