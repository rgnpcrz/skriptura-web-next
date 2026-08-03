import { sendEmail } from '@/lib/mail/mailer'
import { buildVerificationEmail } from '@/lib/mail/verificationTemplate'
import { issueNewCode, CODE_TTL_MS } from '@/lib/contact/inquiries'
import { readJson, failure } from '@/lib/contact/http'

export const runtime = 'nodejs'

export async function POST(request) {
  const payload = await readJson(request)
  if (!payload) return Response.json({ error: 'invalid_body' }, { status: 400 })

  const token = String(payload.token ?? '')
  if (!token) return Response.json({ error: 'invalid_token' }, { status: 400 })

  let issued
  try {
    issued = issueNewCode(token)
  } catch (err) {
    return failure(err, 'issueNewCode')
  }

  const { name, lang, email } = issued.inquiry

  try {
    const mail = buildVerificationEmail({
      name,
      code: issued.code,
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
    console.error('[Contact] Resend failed:', err.message)
    return Response.json({ error: 'send_failed' }, { status: 502 })
  }

  return Response.json({ ok: true, expiresIn: Math.round(CODE_TTL_MS / 1000) })
}
