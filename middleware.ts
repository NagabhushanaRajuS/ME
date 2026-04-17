import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)

  requestHeaders.set("x-pathname", request.nextUrl.pathname)
  requestHeaders.set("x-timestamp", new Date().toISOString())

  if (process.env.NODE_ENV === "development") {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname}`)
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "SAMEORIGIN")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
