import { NextResponse } from "next/server"
import { getPortfolioData } from "@/lib/portfolio-store"

export async function GET() {
  const data = await getPortfolioData()

  const summary = {
    owner: {
      name: data.owner.name,
      headline: data.owner.headline,
      shortIntro: data.owner.shortIntro
    },
    contact: data.visitorContact,
    projects: data.projects.map((item) => ({
      title: item.title,
      description: item.description,
      tags: item.tags,
      ytDemoUrl: item.ytDemoUrl
    })),
    certificates: data.certificates.map((item) => ({
      title: item.title,
      issuer: item.issuer,
      date: item.date,
      credentialUrl: item.credentialUrl,
      courseLinks: item.courseLinks ?? []
    })),
    goals: data.goals,
    education: data.education,
    channels: data.channels,
    updatedAt: data.updatedAt
  }

  return NextResponse.json(summary, {
    headers: {
      "Cache-Control": "no-store"
    }
  })
}
