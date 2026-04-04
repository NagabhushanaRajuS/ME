import { NextResponse } from "next/server"
import { isRequestAuthorized } from "@/lib/auth"
import { listInquiries, saveInquiry } from "@/lib/portfolio-store"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as {
    name?: string
    contact?: string
    companyName?: string
    purpose?: string
  } | null

  if (!body?.name || !body?.contact || !body?.companyName || !body?.purpose) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  const inquiry = await saveInquiry({
    name: body.name,
    contact: body.contact,
    companyName: body.companyName,
    purpose: body.purpose
  })

  return NextResponse.json(inquiry, { status: 201 })
}

export async function GET(request: import("next/server").NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const inquiries = await listInquiries()
  return NextResponse.json(inquiries)
}
