import { promises as fs } from "node:fs"
import path from "node:path"
import { defaultPortfolioData } from "@/lib/portfolio-default"
import type { InquiryItem, PortfolioData } from "@/lib/portfolio-types"

const dataDir = path.join(process.cwd(), "data")
const portfolioPath = path.join(dataDir, "portfolio.json")
const inquiriesPath = path.join(dataDir, "inquiries.json")

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true })
}

function safeJsonParse<T>(content: string, fallback: T): T {
  try {
    return JSON.parse(content) as T
  } catch {
    return fallback
  }
}

export async function getPortfolioData(): Promise<PortfolioData> {
  await ensureDataDir()

  try {
    const raw = await fs.readFile(portfolioPath, "utf-8")
    const parsed = safeJsonParse<PortfolioData>(raw, defaultPortfolioData)
    return { ...defaultPortfolioData, ...parsed }
  } catch {
    await fs.writeFile(portfolioPath, JSON.stringify(defaultPortfolioData, null, 2), "utf-8")
    return defaultPortfolioData
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<PortfolioData> {
  await ensureDataDir()

  const nextData: PortfolioData = {
    ...defaultPortfolioData,
    ...data,
    updatedAt: new Date().toISOString()
  }

  await fs.writeFile(portfolioPath, JSON.stringify(nextData, null, 2), "utf-8")
  return nextData
}

export async function listInquiries(): Promise<InquiryItem[]> {
  await ensureDataDir()

  try {
    const raw = await fs.readFile(inquiriesPath, "utf-8")
    return safeJsonParse<InquiryItem[]>(raw, [])
  } catch {
    return []
  }
}

export async function saveInquiry(input: Omit<InquiryItem, "id" | "createdAt">): Promise<InquiryItem> {
  const current = await listInquiries()
  const inquiry: InquiryItem = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    ...input
  }

  const next = [inquiry, ...current]
  await fs.writeFile(inquiriesPath, JSON.stringify(next, null, 2), "utf-8")
  return inquiry
}
