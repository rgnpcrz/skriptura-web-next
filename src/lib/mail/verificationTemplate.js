import { emailLayout, escapeHtml } from './layout'

// The code email. Two things matter more than the design here:
//   1. it says plainly that the message is ALREADY delivered — the code
//      confirms the reply address, it does not send the inquiry. Without that
//      sentence a code lost to a spam folder reads as a dead end.
//   2. the code is selectable text, never an image or a link.

const COPY = {
  en: {
    subject: (code) => `${code} — your Skriptura verification code`,
    preheader: (code, mins) => `Your code is ${code}. It expires in ${mins} minutes.`,
    greeting: (name) => `Hi ${name},`,
    intro: "Your message has already reached us — this code just confirms we've got the right address to reply to.",
    codeLabel: 'Your verification code',
    expiry: (mins) => `This code expires in ${mins} minutes and can be used once.`,
    ignore: "If you didn't fill in the form on skriptura.net, you can ignore this email — nothing else will happen.",
    signoff: '— The Skriptura team',
    footer: 'Skriptura SH.P.K. · Prishtinë, Kosovo · This is an automated message.',
  },
  sq: {
    subject: (code) => `${code} — kodi yt i verifikimit`,
    preheader: (code, mins) => `Kodi yt është ${code}. Skadon për ${mins} minuta.`,
    greeting: (name) => `Përshëndetje ${name},`,
    intro: 'Mesazhi yt ka ardhur te ne — ky kod veç konfirmon që e kemi adresën e saktë për të të kthyer përgjigje.',
    codeLabel: 'Kodi yt i verifikimit',
    expiry: (mins) => `Kodi skadon për ${mins} minuta dhe përdoret veç një herë.`,
    ignore: "Nëse s'ke plotësu formularin në skriptura.net, thjesht injoroje këtë email — s'ndodh asgjë tjetër.",
    signoff: '— Ekipi i Skripturës',
    footer: 'Skriptura SH.P.K. · Prishtinë, Kosovë · Ky është mesazh automatik.',
  },
}

/**
 * @param {Object} options
 * @param {string} options.name
 * @param {string} options.code    6-digit code, plain
 * @param {'en'|'sq'} [options.lang]
 * @param {number} [options.expiresInMinutes]
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildVerificationEmail({ name, code, lang = 'en', expiresInMinutes = 10 }) {
  const c = COPY[lang] || COPY.en
  const safeCode = escapeHtml(code)

  // The trailing letter-spacing pushes the block visually right by one gap;
  // padding-left compensates so the digits sit centred.
  const body = `        <p style="margin:0 0 16px;">${escapeHtml(c.greeting(name))}</p>
        <p style="margin:0 0 24px;">${escapeHtml(c.intro)}</p>

        <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;color:#666;">
          ${escapeHtml(c.codeLabel)}
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td align="center" style="background:#FFE600;color:#000;border:2px solid #000;padding:20px 12px;">
              <span style="font-family:'Space Mono','Courier New',monospace;font-size:38px;font-weight:700;letter-spacing:10px;padding-left:10px;color:#000;">${safeCode}</span>
            </td>
          </tr>
        </table>

        <p style="margin:16px 0 0;font-size:13px;color:#000;">${escapeHtml(c.expiry(expiresInMinutes))}</p>
        <p style="margin:12px 0 0;font-size:12px;color:#666;">${escapeHtml(c.ignore)}</p>
        <p style="margin:24px 0 0;font-weight:700;">${escapeHtml(c.signoff)}</p>`

  const html = emailLayout({
    lang,
    title: c.subject(code),
    preheader: c.preheader(code, expiresInMinutes),
    body,
    footer: escapeHtml(c.footer),
  })

  const text = [
    c.greeting(name),
    '',
    c.intro,
    '',
    `${c.codeLabel}: ${code}`,
    '',
    c.expiry(expiresInMinutes),
    c.ignore,
    '',
    c.signoff,
    c.footer,
  ].join('\n')

  return { subject: c.subject(code), html, text }
}
