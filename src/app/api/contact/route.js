import { sendEmail } from '@/lib/mail/mailer'
import { buildContactEmail } from '@/lib/mail/contactTemplate'
import { isLocale, defaultLocale } from '@/i18n/config'

// nodemailer needs real sockets — keep this handler off the Edge runtime.
export const runtime = 'nodejs'

const LIMITS = { name: 100, email: 254, message: 5000 }

// Blind copies double as the inbound-inquiry notification. Comma-separated so a
// deployment can override the list without touching code.
const BCC = process.env.CONTACT_BCC || 'skriptura.net@gmail.com, rgnpcrz@gmail.com'

// Deliberately loose: the real proof an address works is that the confirmation
// email below lands in it. This only rejects obvious junk.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// One PM2 fork process serves the whole site (see ecosystem.config.cjs), so an
// in-memory window is enough to stop a bored visitor hammering send. Restarting
// the process clears it — acceptable for a brochure-site contact form.
const RATE_LIMIT = { max: 3, windowMs: 10 * 60 * 1000 }
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs)
  recent.push(now)
  hits.set(ip, recent)

  // Drop stale buckets so the Map can't grow unbounded.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key)
    }
  }
  return recent.length > RATE_LIMIT.max
}

// Header injection guard: a newline in a name or address would let a submitter
// append their own SMTP headers to the Subject/To we build from it.
function singleLine(value, max) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max)
}

export async function POST(request) {
  let payload
  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: 'invalid_body' }, { status: 400 })
  }

  // Honeypot — a field hidden from humans. Bots fill it in; pretend it worked.
  if (payload.company) return Response.json({ ok: true })

  const name = singleLine(payload.name, LIMITS.name)
  const email = singleLine(payload.email, LIMITS.email).toLowerCase()
  const message = String(payload.message ?? '').trim().slice(0, LIMITS.message)
  const lang = isLocale(payload.lang) ? payload.lang : defaultLocale

  if (!name || !message || !EMAIL_RE.test(email)) {
    return Response.json({ error: 'invalid_fields' }, { status: 400 })
  }

  // Apache/nginx set these; without a proxy every caller shares the same bucket.
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  if (rateLimited(ip)) {
    return Response.json({ error: 'rate_limited' }, { status: 429 })
  }

  try {
    const { subject, html, text } = buildContactEmail({ name, email, message, lang })
    await sendEmail({ to: email, bcc: BCC, subject, html, text })
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[Contact] Failed to send:', err.message)
    return Response.json({ error: 'send_failed' }, { status: 502 })
  }
}
