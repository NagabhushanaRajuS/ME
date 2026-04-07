import { NextResponse } from "next/server"
import { authCookieName } from "@/lib/auth"

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
  const response = NextResponse.json(
    { ok: true },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  )
  response.cookies.set(authCookieName, "", {
    httpOnly: true,
    secure: shouldUseSecureCookie(request),
    sameSite: "lax",
    path: "/",
    maxAge: 0
  })
  return response
}
