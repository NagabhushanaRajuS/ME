import { createHmac, timingSafeEqual } from "node:crypto"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

const COOKIE_NAME = "portfolio_admin_session"
const SESSION_TTL_MS = 1000 * 60 * 60 * 12

function getSecret() {
  const secret = process.env.ADMIN_SECRET?.trim() ?? ""
  if (!secret) return null
  if (secret.length < 16) return null
  return secret
}

function sign(value: string) {
  const secret = getSecret()
  if (!secret) return null
  return createHmac("sha256", secret).update(value).digest("hex")
}

function getCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim() ?? ""
  const password = process.env.ADMIN_PASSWORD?.trim() ?? ""

  if (!username || !password) return null
  return { username, password }
}

export function isAdminConfigured() {
  return Boolean(getSecret()) && Boolean(getCredentials())
}

export function validateAdminCredentials(username: string, password: string) {
  const valid = getCredentials()
  if (!valid) return false
  return username === valid.username && password === valid.password
}

export function createSessionToken(username: string) {
  const expiresAt = Date.now() + SESSION_TTL_MS
  const payload = `${username}:${expiresAt}`
  const signature = sign(payload)
  if (!signature) {
    throw new Error("Admin auth is not configured")
  }
  return Buffer.from(`${payload}:${signature}`).toString("base64url")
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) return false

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8")
    const [username, expiresAtRaw, signature] = decoded.split(":")
    if (!username || !expiresAtRaw || !signature) return false

    const payload = `${username}:${expiresAtRaw}`
    const expected = sign(payload)
    if (!expected) return false
    const left = Buffer.from(signature)
    const right = Buffer.from(expected)

    if (left.length !== right.length || !timingSafeEqual(left, right)) return false

    const expiresAt = Number(expiresAtRaw)
    return Number.isFinite(expiresAt) && Date.now() < expiresAt
  } catch {
    return false
  }
}

export function isRequestAuthorized(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  return verifySessionToken(token)
}

export function isServerAuthorized() {
  const token = cookies().get(COOKIE_NAME)?.value
  return verifySessionToken(token)
}

export const authCookieName = COOKIE_NAME
