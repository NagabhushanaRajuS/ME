type RateLimitBucket = {
  count: number
  resetAt: number
}

type RateLimitDecision = {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfterSeconds: number
}

const buckets = new Map<string, RateLimitBucket>()
const MAX_BUCKETS = 10_000

function cleanupBuckets(now: number) {
  if (buckets.size <= MAX_BUCKETS) return

  for (const [key, value] of buckets) {
    if (value.resetAt <= now) {
      buckets.delete(key)
    }

    if (buckets.size <= MAX_BUCKETS) return
  }
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim()
    if (first) return first
  }

  const realIp = request.headers.get("x-real-ip")?.trim()
  if (realIp) return realIp

  const cfIp = request.headers.get("cf-connecting-ip")?.trim()
  if (cfIp) return cfIp

  return "unknown"
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitDecision {
  const now = Date.now()
  cleanupBuckets(now)

  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs
    buckets.set(key, { count: 1, resetAt })

    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      resetAt,
      retryAfterSeconds: 0
    }
  }

  existing.count += 1
  buckets.set(key, existing)

  const allowed = existing.count <= limit
  const remaining = allowed ? Math.max(0, limit - existing.count) : 0
  const retryAfterSeconds = allowed ? 0 : Math.max(1, Math.ceil((existing.resetAt - now) / 1000))

  return {
    allowed,
    remaining,
    resetAt: existing.resetAt,
    retryAfterSeconds
  }
}

export function rateLimitByIp(request: Request, prefix: string, limit: number, windowMs: number) {
  const ip = getClientIp(request)
  return rateLimit(`${prefix}:${ip}`, limit, windowMs)
}
