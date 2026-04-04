import { NextResponse } from "next/server"
import { authCookieName, createSessionToken, validateAdminCredentials } from "@/lib/auth"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { username?: string; password?: string } | null

  if (!body?.username || !body?.password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
  }

  if (!validateAdminCredentials(body.username, body.password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = createSessionToken(body.username)
  const response = NextResponse.json({ ok: true })
  response.cookies.set(authCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12
  })

  return response
}
