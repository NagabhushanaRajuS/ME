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

function hasMeaningfulText(value: string | undefined | null) {
  const text = (value ?? "").trim()
  if (!text) return false
  return !/^coming\s+soon\.?$/i.test(text)
}

function withAdvancedFallback(data: PortfolioData): PortfolioData {
  const ownerName = hasMeaningfulText(data.owner.name) ? data.owner.name.trim() : "Nagabhushana Raju"

  const headline = hasMeaningfulText(data.owner.headline)
    ? data.owner.headline.trim()
    : "Software Engineer | AI-Enabled Full Stack Systems"

  const shortIntro = hasMeaningfulText(data.owner.shortIntro)
    ? data.owner.shortIntro.trim()
    : "I build production-ready products with clean architecture, reliable APIs, and measurable outcomes. My focus is full stack engineering, AI-assisted workflows, and execution speed from idea to shipped result."

  const fallbackProjects = [
    {
      id: "proj-portfolio-os",
      title: "Portfolio Operating System",
      description:
        "Built a modular Next.js portfolio platform with admin controls, dynamic content APIs, and deploy-ready architecture. Optimized for maintainability, fast updates, and recruiter-friendly storytelling.",
      ytDemoUrl: "",
      tags: ["Next.js", "TypeScript", "Tailwind", "REST API", "DX"]
    },
    {
      id: "proj-ai-resume-pipeline",
      title: "AI Resume Intelligence Pipeline",
      description:
        "Implemented a resume ingestion flow with PDF parsing, contact extraction, and profile auto-population to remove manual updates and keep public profile data current.",
      ytDemoUrl: "",
      tags: ["Node.js", "Data Parsing", "Automation", "Content Pipeline"]
    },
    {
      id: "proj-cert-ingestion",
      title: "Certificate Ingestion and Validation",
      description:
        "Engineered a certificate ingestion workflow that supports local media, normalized metadata, and verification links, improving trust signals and reducing profile maintenance effort.",
      ytDemoUrl: "",
      tags: ["Data Modeling", "Validation", "File Processing"]
    },
    {
      id: "proj-contact-gateway",
      title: "Lead Capture and Inquiry Gateway",
      description:
        "Designed a lightweight inquiry API with input validation, persistence, and rate-limit protections to securely capture inbound opportunities from hiring teams and clients.",
      ytDemoUrl: "",
      tags: ["API Design", "Security", "Rate Limiting", "Backend"]
    }
  ]

  const fallbackGoals = [
    {
      id: "goal-system-design",
      title: "Ship 3 system design case studies",
      description: "Publish architecture writeups with traffic, latency, and scaling tradeoffs for real projects.",
      status: "in-progress" as const
    },
    {
      id: "goal-open-source",
      title: "Contribute to open source consistently",
      description: "Target one meaningful contribution every sprint and document impact with before/after metrics.",
      status: "planned" as const
    },
    {
      id: "goal-cloud",
      title: "Advance cloud deployment depth",
      description: "Strengthen production deployment skills with CI/CD, observability, and rollback-ready release workflows.",
      status: "in-progress" as const
    }
  ]

  const fallbackEducation = [
    {
      id: "edu-be",
      label: "B.E. in Computer Science (Data Science)",
      institution: "Maharaja Institute of Technology, Mysore",
      website: "https://mitmysore.in/",
      location: "Mysore, Karnataka, India",
      years: "2022 - 2026"
    },
    {
      id: "edu-puc",
      label: "Pre-University",
      institution: "Science Stream (PCMB)",
      website: "",
      location: "Karnataka, India",
      years: "Completed"
    }
  ]

  const fallbackChannels = [
    {
      id: "channel-engineering-lab",
      name: "Engineering Build Logs",
      url: "",
      description: "Deep dives on project architecture, implementation decisions, and delivery lessons."
    },
    {
      id: "channel-ai-workflows",
      name: "AI Workflow Experiments",
      url: "",
      description: "Hands-on experiments on practical AI tooling for productivity, development, and automation."
    }
  ]

  const nextProjects = data.projects.length ? data.projects : fallbackProjects
  const nextGoals = data.goals.length ? data.goals : fallbackGoals
  const nextEducation = data.education.length ? data.education : fallbackEducation
  const nextChannels = data.channels.length ? data.channels : fallbackChannels

  return {
    ...data,
    owner: {
      ...data.owner,
      name: ownerName,
      headline,
      shortIntro
    },
    projects: nextProjects,
    goals: nextGoals,
    education: nextEducation,
    channels: nextChannels
  }
}

export async function getPortfolioData(): Promise<PortfolioData> {
  await ensureDataDir()

  try {
    const raw = await fs.readFile(portfolioPath, "utf-8")
    const parsed = safeJsonParse<PortfolioData>(raw, defaultPortfolioData)
    const mergedData = {
      ...defaultPortfolioData,
      ...parsed,
      owner: {
        ...defaultPortfolioData.owner,
        ...(parsed.owner ?? {})
      },
      visitorContact: {
        ...defaultPortfolioData.visitorContact,
        ...(parsed.visitorContact ?? {})
      }
    }

    return withAdvancedFallback(mergedData)
  } catch {
    await fs.writeFile(portfolioPath, JSON.stringify(defaultPortfolioData, null, 2), "utf-8")
    return withAdvancedFallback(defaultPortfolioData)
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<PortfolioData> {
  await ensureDataDir()

  const nextData: PortfolioData = {
    ...defaultPortfolioData,
    ...data,
    owner: {
      ...defaultPortfolioData.owner,
      ...(data.owner ?? {})
    },
    visitorContact: {
      ...defaultPortfolioData.visitorContact,
      ...(data.visitorContact ?? {})
    },
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

  const maxItemsRaw = process.env.INQUIRIES_MAX_ITEMS?.trim() ?? ""
  const maxItems = Math.max(1, Math.min(2000, Number(maxItemsRaw) || 200))

  const next = [inquiry, ...current].slice(0, maxItems)
  await fs.writeFile(inquiriesPath, JSON.stringify(next, null, 2), "utf-8")
  return inquiry
}
