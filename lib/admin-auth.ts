import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'admin_session'

/**
 * Derives a deterministic session token from the ADMIN_PASSWORD secret.
 * The raw password is never stored in the cookie — only this HMAC token is.
 */
function expectedToken(): string {
  const secret = process.env.ADMIN_PASSWORD ?? ''
  return createHmac('sha256', secret).update('admin-authenticated').digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

/** True only when ADMIN_PASSWORD is configured and the request carries a valid session cookie. */
export async function isAdminAuthenticated(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return false
  return safeEqual(token, expectedToken())
}

/** Validates a submitted password against the configured ADMIN_PASSWORD. */
export function verifyPassword(password: string): boolean {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) return false
  return safeEqual(password, secret)
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME

export function adminSessionToken(): string {
  return expectedToken()
}
