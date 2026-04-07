import { NextResponse } from "next/server"
import { saveInquiry } from "@/lib/portfolio-store"
import { sendVisitorThanksMail } from "@/lib/mailer"
import { rateLimit, rateLimitByIp } from "@/lib/rate-limit"

type VisitorBody = {
  viewerName?: string
  companyName?: string
  email?: string
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  const ipLimiter = rateLimitByIp(request, "visitor-checkin", 8, 30 * 60 * 1000)
  if (!ipLimiter.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(ipLimiter.retryAfterSeconds),
          "Cache-Control": "no-store"
        }
      }
    )
  }

  const body = await request.json().catch(() => null) as VisitorBody | null

  const viewerName = body?.viewerName?.trim() ?? ""
  const companyName = body?.companyName?.trim() ?? ""
  const email = body?.email?.trim() ?? ""

  if (viewerName.length > 80 || companyName.length > 120 || email.length > 254) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 })
  }

  if (!viewerName || !companyName || !email) {
    return NextResponse.json({ error: "viewerName, companyName, and email are required" }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Provide a valid email" }, { status: 400 })
  }

  const toLimiter = rateLimit(`visitor-checkin:to:${email.toLowerCase()}`, 2, 60 * 60 * 1000)
  if (!toLimiter.allowed) {
    return NextResponse.json(
      { error: "Too many requests for this email. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(toLimiter.retryAfterSeconds),
          "Cache-Control": "no-store"
        }
      }
    )
  }

  await saveInquiry({
    name: viewerName,
    contact: email,
    companyName,
    purpose: "Portfolio visit check-in"
  })

  const mailResult = await sendVisitorThanksMail({
    to: email,
    viewerName,
    companyName
  })

  return NextResponse.json({
    ok: true,
    mailed: mailResult.sent,
    mailSkipped: mailResult.skipped
  }, {
    headers: {
      "Cache-Control": "no-store"
    }
  })
}
