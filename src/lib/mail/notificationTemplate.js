import { emailLayout, escapeHtml, escapeMultiline } from './layout'

// Internal alert, sent to the notification inboxes only — never to the visitor.
// It fires the moment the form is submitted, before any code is entered, so no
// lead is ever gated behind a verification step the visitor might not finish.
// English regardless of the visitor's locale: the audience is the Skriptura inbox.

/**
 * @param {Object} inquiry
 * @param {string} inquiry.name
 * @param {string} inquiry.email
 * @param {string} inquiry.message
 * @param {'en'|'sq'} inquiry.lang Locale the visitor was browsing in
 * @param {string} [inquiry.ip]
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildNotificationEmail({ name, email, message, lang, ip }) {
  const subject = `New inquiry (unverified) — ${name}`
  const submitted = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC'

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    message: escapeMultiline(message),
    lang: escapeHtml(lang),
    ip: escapeHtml(ip || 'unknown'),
    submitted: escapeHtml(submitted),
  }

  const row = (label, value) => `          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #000;font-size:12px;background:#ffffff;color:#000;">
              <strong style="text-transform:uppercase;letter-spacing:1px;font-size:11px;">${label}:</strong> ${value}
            </td>
          </tr>`

  const body = `        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin:0 0 20px;">
          <tr>
            <td style="background:#000000;color:#FFE600;padding:10px 12px;font-size:12px;font-weight:700;letter-spacing:1px;">
              ⚠ EMAIL NOT YET CONFIRMED
            </td>
          </tr>
        </table>
        <p style="margin:0 0 20px;font-size:13px;">
          They've been sent a code. If they enter it, the confirmation lands in this inbox as a BCC —
          that copy is your "this address is real" signal. If it never arrives, treat the address with suspicion.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:2px solid #000;border-collapse:collapse;">
${row('Name', safe.name)}
${row('Email', `<a href="mailto:${safe.email}" style="color:#000;">${safe.email}</a>`)}
${row('Language', safe.lang)}
${row('Submitted', safe.submitted)}
${row('IP', safe.ip)}
          <tr>
            <td style="padding:12px;font-size:13px;line-height:1.6;background:#ffffff;color:#000;">
              <strong style="text-transform:uppercase;letter-spacing:1px;font-size:11px;display:block;margin-bottom:6px;">Message:</strong>
              ${safe.message}
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;font-size:12px;color:#666;">Reply to this email to answer them directly.</p>`

  const html = emailLayout({
    lang: 'en',
    title: subject,
    preheader: `${name} <${email}> — awaiting email confirmation`,
    body,
    footer: escapeHtml('Skriptura contact form · skriptura.net/' + lang),
  })

  const text = [
    '⚠ EMAIL NOT YET CONFIRMED',
    '',
    "They've been sent a code. If they enter it, the confirmation lands in this inbox as a BCC.",
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Language: ${lang}`,
    `Submitted: ${submitted}`,
    `IP: ${ip || 'unknown'}`,
    'Message:',
    message,
    '',
    'Reply to this email to answer them directly.',
  ].join('\n')

  return { subject, html, text }
}
