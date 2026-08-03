// One shell for every message the site sends, so the confirmation, the code and
// the internal alert are visibly the same product.
//
// The constraints this is built against are email's, not the web's:
//   · tables + inline CSS only — Gmail strips <style>, Outlook has no flexbox
//   · 600px max width, no external assets, no border-radius (Outlook drops it,
//     and the brutalist design doesn't want it anyway)
//   · explicit background AND foreground on every cell, so Gmail/Outlook dark
//     mode can't invert black-on-yellow into something unreadable
//   · format-detection: iOS Mail otherwise turns a bare 6-digit code into a
//     tel: link, which recolours and underlines it
//   · a real text/plain alternative always accompanies this (see mailer.js)

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Escapes user input and turns newlines into <br> for HTML bodies. */
export function escapeMultiline(value) {
  return escapeHtml(value).replace(/\r?\n/g, '<br>')
}

/**
 * @param {Object} options
 * @param {string} options.lang      `lang` attribute + footer locale
 * @param {string} options.title     <title>, mirrors the subject
 * @param {string} options.preheader Inbox preview line — hidden in the body
 * @param {string} options.body      Pre-escaped HTML for the white card
 * @param {string} options.footer    Pre-escaped footer line
 * @returns {string} A complete HTML document
 */
export function emailLayout({ lang = 'en', title, preheader, body, footer }) {
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:24px;background:#f5f5f5;color:#000;font-family:'Space Mono','Courier New',monospace;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}</span>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;border-collapse:separate;">
    <tr>
      <td style="background:#FFE600;color:#000;border:2px solid #000;padding:16px 20px;font-weight:700;font-size:18px;letter-spacing:2px;">
        SKRIPTURA
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;color:#000;border:2px solid #000;border-top:0;padding:24px 20px;font-size:14px;line-height:1.6;">
${body}
      </td>
    </tr>
    <tr>
      <td style="background:#f5f5f5;color:#666;padding:16px 4px;font-size:11px;line-height:1.6;">
        ${footer}<br>
        <a href="https://skriptura.net/${lang}" style="color:#666;">skriptura.net</a>
      </td>
    </tr>
  </table>
</body>
</html>`
}
