import { NextResponse } from "next/server"
import { authCookieName, createSessionToken, isAdminConfigured, validateAdminCredentials } from "@/lib/auth"
import { rateLimitByIp } from "@/lib/rate-limit"

function shouldUseSecureCookie(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto")
  if (forwardedProto) {
    return forwardedProto.split(",")[0]?.trim() === "https"
  }

  try {
    return new URL(request.url).protocol === "https:"
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin auth is not configured" }, { status: 503 })
  }

  const limiter = rateLimitByIp(request, "admin-login", 10, 15 * 60 * 1000)
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limiter.retryAfterSeconds),
          "Cache-Control": "no-store"
        }
      }
    )
  }

  const body = await request.json().catch(() => null) as { username?: string; password?: string } | null

  if (!body?.username || !body?.password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
  }

  if (!validateAdminCredentials(body.username, body.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  let token = ""
  try {
    token = createSessionToken(body.username)
  } catch {
    return NextResponse.json({ error: "Admin auth is not configured" }, { status: 503 })
  }

  const response = NextResponse.json(
    { ok: true },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  )
  response.cookies.set(authCookieName, token, {
    httpOnly: true,
    secure: shouldUseSecureCookie(request),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12
  })

  return response
}
