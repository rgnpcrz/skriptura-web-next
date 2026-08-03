import { emailLayout, escapeHtml, escapeMultiline } from './layout'

// Sent once the address has been verified. Blind-copied to the notification
// inboxes, so its arrival is itself the "this lead is real" signal — which is
// why it quotes the whole submission.

const COPY = {
  en: {
    subject: (name) => `We got your message, ${name} — Skriptura`,
    preheader: "Confirmed — we'll get back to you within one business day.",
    greeting: (name) => `Hi ${name},`,
    intro: "Thanks for getting in touch, and for confirming your email. We've received your message and we'll get back to you within one business day.",
    copyLabel: "Here's a copy of what you sent us:",
    fieldName: 'Name',
    fieldEmail: 'Email',
    fieldMessage: 'Message',
    urgent: 'If it\'s urgent, call us on <a href="tel:+38344564565" style="color:#000;">+383 44 564 565</a>.',
    signoff: '— The Skriptura team',
    footer: 'Skriptura SH.P.K. · Rruga Dr. Shpëtim Robaj, B. C, Nr. 12 · Prishtinë, Kosovo',
  },
  sq: {
    subject: (name) => `E morëm mesazhin tënd, ${name} — Skriptura`,
    preheader: 'U konfirmua — të kthejmë përgjigje brenda një dite pune.',
    greeting: (name) => `Përshëndetje ${name},`,
    intro: 'Faleminderit që na shkrove dhe që e konfirmove email-in. E morëm mesazhin tënd dhe të kthejmë përgjigje brenda një dite pune.',
    copyLabel: 'Këtu e ke kopjen e asaj që na dërgove:',
    fieldName: 'Emri',
    fieldEmail: 'Email',
    fieldMessage: 'Mesazhi',
    urgent: 'Nëse është urgjente, na merr në <a href="tel:+38344564565" style="color:#000;">+383 44 564 565</a>.',
    signoff: '— Ekipi i Skripturës',
    footer: 'Skriptura SH.P.K. · Rruga Dr. Shpëtim Robaj, B. C, Nr. 12 · Prishtinë, Kosovë',
  },
}

/**
 * @param {Object} submission
 * @param {string} submission.name
 * @param {string} submission.email
 * @param {string} submission.message
 * @param {'en'|'sq'} [submission.lang] Language the visitor was browsing in
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildContactEmail({ name, email, message, lang = 'en' }) {
  const c = COPY[lang] || COPY.en
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    message: escapeMultiline(message),
  }

  const body = `        <p style="margin:0 0 16px;">${escapeHtml(c.greeting(name))}</p>
        <p style="margin:0 0 24px;">${escapeHtml(c.intro)}</p>

        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;color:#666;">
          ${escapeHtml(c.copyLabel)}
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:2px solid #000;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #000;font-size:12px;background:#ffffff;color:#000;">
              <strong style="text-transform:uppercase;letter-spacing:1px;font-size:11px;">${escapeHtml(c.fieldName)}:</strong> ${safe.name}
            </td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #000;font-size:12px;background:#ffffff;color:#000;">
              <strong style="text-transform:uppercase;letter-spacing:1px;font-size:11px;">${escapeHtml(c.fieldEmail)}:</strong>
              <a href="mailto:${safe.email}" style="color:#000;">${safe.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:12px;font-size:13px;line-height:1.6;background:#ffffff;color:#000;">
              <strong style="text-transform:uppercase;letter-spacing:1px;font-size:11px;display:block;margin-bottom:6px;">${escapeHtml(c.fieldMessage)}:</strong>
              ${safe.message}
            </td>
          </tr>
        </table>

        <p style="margin:24px 0 0;font-size:13px;">${c.urgent}</p>
        <p style="margin:24px 0 0;font-weight:700;">${escapeHtml(c.signoff)}</p>`

  const html = emailLayout({
    lang,
    title: c.subject(name),
    preheader: c.preheader,
    body,
    footer: escapeHtml(c.footer),
  })

  const text = [
    c.greeting(name),
    '',
    c.intro,
    '',
    c.copyLabel,
    '',
    `${c.fieldName}: ${name}`,
    `${c.fieldEmail}: ${email}`,
    `${c.fieldMessage}:`,
    message,
    '',
    c.urgent.replace(/<[^>]+>/g, ''),
    '',
    c.signoff,
    c.footer,
  ].join('\n')

  return { subject: c.subject(name), html, text }
}
