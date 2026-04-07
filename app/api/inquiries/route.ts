import { NextResponse } from "next/server"
import { isRequestAuthorized } from "@/lib/auth"
import { listInquiries, saveInquiry } from "@/lib/portfolio-store"
import { rateLimitByIp } from "@/lib/rate-limit"

export async function POST(request: Request) {
  const limiter = rateLimitByIp(request, "public-inquiry", 10, 60 * 60 * 1000)
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limiter.retryAfterSeconds),
          "Cache-Control": "no-store"
        }
      }
    )
  }

  const body = await request.json().catch(() => null) as {
    name?: string
    contact?: string
    companyName?: string
    purpose?: string
  } | null

  if (!body?.name || !body?.contact || !body?.companyName || !body?.purpose) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  if (body.name.length > 80 || body.contact.length > 254 || body.companyName.length > 120 || body.purpose.length > 800) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 })
  }

  const inquiry = await saveInquiry({
    name: body.name,
    contact: body.contact,
    companyName: body.companyName,
    purpose: body.purpose
  })

  return NextResponse.json(inquiry, {
    status: 201,
    headers: {
      "Cache-Control": "no-store"
    }
  })
}

export async function GET(request: import("next/server").NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const inquiries = await listInquiries()
  return NextResponse.json(inquiries, {
    headers: {
      "Cache-Control": "no-store"
    }
  })
}
