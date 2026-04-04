import { NextResponse } from "next/server"
import { isRequestAuthorized } from "@/lib/auth"
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio-store"
import type { PortfolioData } from "@/lib/portfolio-types"

export async function GET(request: import("next/server").NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await getPortfolioData()
  return NextResponse.json(data)
}

export async function PUT(request: import("next/server").NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null) as PortfolioData | null
  if (!body) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const saved = await savePortfolioData(body)
  return NextResponse.json(saved)
}
