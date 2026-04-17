import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)

  // Add custom headers for tracking
  requestHeaders.set("x-pathname", request.nextUrl.pathname)
  requestHeaders.set("x-timestamp", new Date().toISOString())

  // Log route navigation (development only)
  if (process.env.NODE_ENV === "development") {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname}`)
  }

  // Create response with new headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Add analytics headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "SAMEORIGIN")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
