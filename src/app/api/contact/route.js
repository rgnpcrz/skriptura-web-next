import { sendEmail } from '@/lib/mail/mailer'
import { buildVerificationEmail } from '@/lib/mail/verificationTemplate'
import { buildNotificationEmail } from '@/lib/mail/notificationTemplate'
import { createInquiry, CODE_TTL_MS } from '@/lib/contact/inquiries'
import { clientIp, readJson, failure } from '@/lib/contact/http'
import { isLocale, defaultLocale } from '@/i18n/config'

// nodemailer and better-sqlite3 both need real Node — keep this off the Edge runtime.
export const runtime = 'nodejs'

const LIMITS = { name: 100, email: 254, message: 5000 }

// Blind copies on the *confirmation* (see verify/route.js) and recipients of the
// unverified alert below. Comma-separated so a deployment can change the list
// without touching code.
const NOTIFY = process.env.CONTACT_BCC || 'skriptura.net@gmail.com, rgnpcrz@gmail.com'

// Deliberately loose: the real proof an address works is that the code below
// lands in it. This only rejects obvious junk.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Header injection guard: a newline in a name or address would let a submitter
// append their own SMTP headers to the Subject/To we build from it.
function singleLine(value, max) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max)
}

export async function POST(request) {
  const payload = await readJson(request)
  if (!payload) return Response.json({ error: 'invalid_body' }, { status: 400 })

  // Honeypot — a field hidden from humans. Bots fill it in; pretend it worked.
  // No token comes back, so the client shows the done state rather than parking
  // a bot (or a rare over-eager password manager) on a code screen forever.
  if (payload.company) return Response.json({ ok: true, verified: false })

  const name = singleLine(payload.name, LIMITS.name)
  const email = singleLine(payload.email, LIMITS.email).toLowerCase()
  const message = String(payload.message ?? '').trim().slice(0, LIMITS.message)
  const lang = isLocale(payload.lang) ? payload.lang : defaultLocale

  if (!name || !message || !EMAIL_RE.test(email)) {
    return Response.json({ error: 'invalid_fields' }, { status: 400 })
  }

  const ip = clientIp(request)

  let token, code
  try {
    ;({ token, code } = createInquiry({ name, email, message, lang, ip }))
  } catch (err) {
    return failure(err, 'createInquiry')
  }

  // The lead goes out first and its delivery is best-effort-independent of the
  // code: whatever happens next, the inquiry has already reached the inboxes.
  try {
    const alert = buildNotificationEmail({ name, email, message, lang, ip })
    await sendEmail({
      to: NOTIFY,
      replyTo: email, // hit reply in the alert and you're writing to the lead
      subject: alert.subject,
      html: alert.html,
      text: alert.text,
      automated: true,
    })
  } catch (err) {
    console.error('[Contact] Notification send failed (inquiry is still stored):', err.message)
  }

  try {
    const mail = buildVerificationEmail({
      name,
      code,
      lang,
      expiresInMinutes: Math.round(CODE_TTL_MS / 60000),
    })
    await sendEmail({
      to: email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      automated: true,
    })
  } catch (err) {
    console.error('[Contact] Verification send failed:', err.message)
    return Response.json({ error: 'send_failed' }, { status: 502 })
  }

  // expiresIn (seconds), not an absolute timestamp — a client clock that's off
  // by minutes would otherwise show a nonsense countdown.
  return Response.json({ ok: true, token, expiresIn: Math.round(CODE_TTL_MS / 1000) })
}
