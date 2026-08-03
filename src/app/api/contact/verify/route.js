import { sendEmail } from '@/lib/mail/mailer'
import { buildContactEmail } from '@/lib/mail/contactTemplate'
import { verifyInquiry } from '@/lib/contact/inquiries'
import { readJson, failure } from '@/lib/contact/http'

export const runtime = 'nodejs'

const BCC = process.env.CONTACT_BCC || 'skriptura.net@gmail.com, rgnpcrz@gmail.com'

export async function POST(request) {
  const payload = await readJson(request)
  if (!payload) return Response.json({ error: 'invalid_body' }, { status: 400 })

  const token = String(payload.token ?? '')
  // People paste codes with spaces in them; keep only what a code can contain.
  const code = String(payload.code ?? '').replace(/\D/g, '')

  if (!token || code.length !== 6) {
    return Response.json({ error: 'invalid_code' }, { status: 400 })
  }

  let result
  try {
    result = verifyInquiry(token, code)
  } catch (err) {
    return failure(err, 'verifyInquiry')
  }

  // Replaying a spent token is a no-op rather than an error — a double-submit
  // shouldn't look like a failure, and it must not re-send the confirmation.
  if (result.alreadyVerified) return Response.json({ ok: true, confirmationSent: false })

  const { name, email, message, lang } = result.inquiry

  // The BCC arriving in the notification inboxes IS the "verified" signal —
  // that's why this send carries the copies rather than a separate alert.
  try {
    const mail = buildContactEmail({ name, email, message, lang })
    await sendEmail({
      to: email,
      bcc: BCC,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    })
  } catch (err) {
    // The code was correct and the row is verified; that's what this endpoint
    // answers. Report the mail failure in the payload rather than pretending
    // the whole step failed and pushing them into a pointless retry.
    console.error('[Contact] Confirmation send failed after verification:', err.message)
    return Response.json({ ok: true, confirmationSent: false })
  }

  return Response.json({ ok: true, confirmationSent: true })
}
