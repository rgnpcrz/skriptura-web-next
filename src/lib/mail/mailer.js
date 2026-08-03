import nodemailer from 'nodemailer'

// Same transport strategy as skriptura-hotel-api:
//   MAIL_TYPE=LOCAL → hand the mail to the server's own Postfix on 127.0.0.1:25
//                     (no auth, no credentials in .env — this is the production path)
//   MAIL_TYPE=SMTP  → authenticate against an external SMTP host (useful locally,
//                     e.g. a Gmail app password or Mailtrap)
// Anything else disables sending so a misconfigured box fails loudly in the logs
// instead of silently pretending mail went out.

let transporter
let initialized = false

function createTransporter() {
  const type = (process.env.MAIL_TYPE || 'LOCAL').toUpperCase()

  switch (type) {
    case 'LOCAL':
      console.log('[Mailer] Using local SMTP (Postfix on 127.0.0.1:25)')
      return nodemailer.createTransport({
        host: '127.0.0.1',
        port: 25,
        secure: false,
        tls: { rejectUnauthorized: false },
      })

    case 'SMTP':
      console.log(`[Mailer] Using SMTP: ${process.env.MAIL_HOST}:${process.env.MAIL_PORT || 587}`)
      return nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT || 587),
        secure: process.env.MAIL_SECURE === 'true',
        auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
      })

    default:
      console.warn(`[Mailer] Invalid MAIL_TYPE "${type}". Email sending is disabled.`)
      return null
  }
}

// Built on first use, not at import time: `next build` imports Route Handlers to
// collect their config, and we don't want a transport (or its logging) then.
function getTransporter() {
  if (!initialized) {
    initialized = true
    try {
      transporter = createTransporter()
    } catch (err) {
      console.error('[Mailer] Transporter not initialized:', err.message)
      transporter = null
    }
  }
  return transporter
}

export const MAIL_FROM = process.env.MAIL_FROM || 'hello@skriptura.net'
export const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || 'Skriptura'

/**
 * Sends an email. Throws on failure — the caller decides what the visitor sees.
 *
 * @param {Object} options
 * @param {string} options.to        Recipient
 * @param {string} [options.bcc]     Comma-separated blind copies
 * @param {string} [options.replyTo] Reply-To header
 * @param {string} options.subject
 * @param {string} options.html
 * @param {string} [options.text]    Plain-text alternative
 * @param {boolean} [options.automated] Adds `Auto-Submitted: auto-generated`
 *   (RFC 3834) so out-of-office replies and other autoresponders don't answer
 *   a machine. Set it on anything the visitor didn't directly ask a human for.
 * @returns {Promise<Object>} nodemailer's sendMail() info
 */
export async function sendEmail({ to, bcc, replyTo, subject, html, text, automated = false }) {
  const mailer = getTransporter()
  if (!mailer) throw new Error('Mail transport unavailable (check MAIL_TYPE)')

  const info = await mailer.sendMail({
    from: `"${MAIL_FROM_NAME}" <${MAIL_FROM}>`,
    to,
    bcc,
    replyTo: replyTo || MAIL_FROM,
    subject,
    html,
    text,
    // Deliberately no List-Unsubscribe: these are transactional, and offering
    // one invites Gmail to classify the stream as bulk.
    headers: automated ? { 'Auto-Submitted': 'auto-generated' } : undefined,
  })

  console.log(`[Mailer] Sent "${subject}" to ${to}. Message ID: ${info.messageId}`)
  return info
}
