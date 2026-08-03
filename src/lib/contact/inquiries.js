import crypto from 'node:crypto'
import { getDb } from '@/lib/db/client'

// Ported from skriptura-hotel-api's src/services/otpService.js — same rules
// (hashed single-use code, opaque token, 10 min, 5 attempts, 3 codes/hour),
// on SQLite instead of Prisma, with the code hash upgraded to a keyed HMAC.

export const CODE_TTL_MS = 10 * 60 * 1000
export const MAX_ATTEMPTS = 5
export const RESEND_COOLDOWN_MS = 60 * 1000
const ADDRESS_LIMIT = { max: 3, windowMs: 60 * 60 * 1000 } // codes per email
const IP_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 } // submissions per IP
const PURGE_UNVERIFIED_AFTER_MS = 30 * 24 * 60 * 60 * 1000

// Every rejection carries a stable code the Route Handler maps to a translation
// key, and an HTTP status. Never let a raw SQL/crypto error reach the visitor.
function fail(code, status, extra = {}) {
  return Object.assign(new Error(code), { code, status, ...extra })
}

let cachedSecret
function secret() {
  if (cachedSecret) return cachedSecret

  const configured = process.env.CONTACT_CODE_SECRET
  if (configured && configured.length >= 16) {
    cachedSecret = configured
  } else {
    // Usable but not durable: a restart silently invalidates every in-flight
    // code, so this must be set in production.
    cachedSecret = crypto.randomBytes(32).toString('hex')
    console.warn('[Contact] CONTACT_CODE_SECRET is unset or too short — using an ephemeral key. Codes will not survive a restart.')
  }
  return cachedSecret
}

// Keyed, not a bare digest: a 6-digit SHA-256 falls to an offline sweep of one
// million inputs the moment the database file leaks. Without the key it doesn't.
function hashCode(code) {
  return crypto.createHmac('sha256', secret()).update(String(code)).digest('hex')
}

function generateCode() {
  return crypto.randomInt(100000, 1000000).toString()
}

function newToken() {
  return crypto.randomBytes(32).toString('base64url')
}

// Cheap, and only ever touches rows nobody is waiting on. Runs on write so no
// scheduler or cron is needed for a site this size.
function purgeExpired(db, now) {
  db.prepare(
    'DELETE FROM inquiries WHERE verified_at IS NULL AND created_at < ?'
  ).run(now - PURGE_UNVERIFIED_AFTER_MS)

  db.prepare(
    'UPDATE inquiries SET code_hash = NULL WHERE code_hash IS NOT NULL AND expires_at < ?'
  ).run(now)
}

function assertAddressBudget(db, email, now) {
  const { total } = db
    .prepare(
      'SELECT COALESCE(SUM(codes_sent), 0) AS total FROM inquiries WHERE email = ? AND last_code_at > ?'
    )
    .get(email, now - ADDRESS_LIMIT.windowMs)

  if (total >= ADDRESS_LIMIT.max) {
    throw fail('too_many_codes', 429)
  }
}

/**
 * Records a submission and issues its first code.
 * @returns {{ token: string, code: string, expiresAt: number }} `code` is for
 *   the email only — it must never reach the HTTP response or a production log.
 */
export function createInquiry({ name, email, message, lang, ip }) {
  const db = getDb()
  const now = Date.now()
  purgeExpired(db, now)

  // Replaces the old in-memory Map: the budget now survives `pm2 reload`.
  const { count } = db
    .prepare('SELECT COUNT(*) AS count FROM inquiries WHERE ip = ? AND created_at > ?')
    .get(ip, now - IP_LIMIT.windowMs)
  if (count >= IP_LIMIT.max) throw fail('rate_limited', 429)

  assertAddressBudget(db, email, now)

  const token = newToken()
  const code = generateCode()
  const expiresAt = now + CODE_TTL_MS

  db.prepare(
    `INSERT INTO inquiries
       (token, name, email, message, lang, ip, code_hash, last_code_at, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(token, name, email, message, lang, ip, hashCode(code), now, expiresAt, now)

  return { token, code, expiresAt }
}

function loadByToken(db, token) {
  const row = db.prepare('SELECT * FROM inquiries WHERE token = ?').get(String(token || ''))
  if (!row) throw fail('invalid_token', 404)
  return row
}

/**
 * Issues a replacement code for an existing inquiry, resetting the attempt
 * counter. Subject to a cooldown and the per-address hourly budget.
 */
export function issueNewCode(token) {
  const db = getDb()
  const now = Date.now()
  const row = loadByToken(db, token)

  if (row.verified_at) throw fail('already_verified', 409)

  const waited = now - row.last_code_at
  if (waited < RESEND_COOLDOWN_MS) {
    throw fail('cooldown', 429, { retryAfter: Math.ceil((RESEND_COOLDOWN_MS - waited) / 1000) })
  }
  assertAddressBudget(db, row.email, now)

  const code = generateCode()
  const expiresAt = now + CODE_TTL_MS

  db.prepare(
    `UPDATE inquiries
        SET code_hash = ?, attempts = 0, codes_sent = codes_sent + 1,
            last_code_at = ?, expires_at = ?
      WHERE id = ?`
  ).run(hashCode(code), now, expiresAt, row.id)

  return { code, expiresAt, inquiry: row }
}

/**
 * Checks a submitted code. On success the row is marked verified and the hash
 * is dropped, so a code is good exactly once.
 *
 * @returns {{ inquiry: Object, alreadyVerified: boolean }}
 */
export function verifyInquiry(token, code) {
  const db = getDb()
  const now = Date.now()
  const row = loadByToken(db, token)

  if (row.verified_at) return { inquiry: row, alreadyVerified: true }

  // Nulled by an exhausted attempt counter or by purgeExpired().
  if (!row.code_hash) throw fail('too_many_attempts', 429)
  if (row.expires_at < now) throw fail('expired', 410)
  if (row.attempts >= MAX_ATTEMPTS) throw fail('too_many_attempts', 429)

  const submitted = Buffer.from(hashCode(code), 'hex')
  const stored = Buffer.from(row.code_hash, 'hex')
  const match = submitted.length === stored.length && crypto.timingSafeEqual(submitted, stored)

  if (!match) {
    const attempts = row.attempts + 1
    const exhausted = attempts >= MAX_ATTEMPTS

    // Burning the hash on the last attempt means a dead code stays dead even if
    // the row is later touched by something else.
    db.prepare('UPDATE inquiries SET attempts = ?, code_hash = ? WHERE id = ?').run(
      attempts,
      exhausted ? null : row.code_hash,
      row.id
    )

    if (exhausted) throw fail('too_many_attempts', 429)
    throw fail('invalid_code', 401, { remaining: MAX_ATTEMPTS - attempts })
  }

  db.prepare('UPDATE inquiries SET verified_at = ?, code_hash = NULL WHERE id = ?').run(now, row.id)
  return { inquiry: row, alreadyVerified: false }
}
