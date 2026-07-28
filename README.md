# Skriptura — skriptura.net

Bilingual (English / Albanian) marketing site for **Skriptura SH.P.K.**, a custom software and web development company based in Prishtinë, Kosovo.

Built with Next.js 16 (App Router), React 19, and Tailwind CSS 3. Successor to the original Vite/React site.

## Requirements

- Node.js **>= 20.9.0**

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/en` or `/sq` depending on your `NEXT_LOCALE` cookie and `Accept-Language` header.

| Script          | Purpose                    |
| --------------- | -------------------------- |
| `npm run dev`   | Development server         |
| `npm run build` | Production build           |
| `npm start`     | Serve the production build |
| `npm run lint`  | ESLint                     |

## Structure

```
src/
  app/
    icon.svg          Brand mark — favicon for every route
    apple-icon.js     180x180 touch icon, generated with next/og
    robots.js         /robots.txt
    sitemap.js        /sitemap.xml
    globals.css       Tailwind entry + base styles
    api/contact/      POST endpoint behind the contact form
    [lang]/           All routes, one segment per locale
      layout.js       Root layout (fonts, JSON-LD, translation provider)
      opengraph-image.js
      about/ clients/ contact/ projects/ secret/ services/
  components/
    layout/ pages/ ui/
  data/               Client, project, and service content
  lib/mail/           Nodemailer transport + contact email template
  i18n/
    config.js         Locale list and default
    dictionaries.js   Server-side dictionary lookup
    client.jsx        useTranslation + provider for client components
    en.json sq.json   Translation strings
    seo.js            Per-page metadata and hreflang alternates
    jsonld.js         Organization + WebSite structured data
  proxy.js            Locale detection and redirect
```

## Localization

Locales are `en` (default) and `sq`, defined in [`src/i18n/config.js`](src/i18n/config.js). Every route lives under `src/app/[lang]/`, so both languages are statically generated and independently indexable.

Translations are plain JSON bundled at build time — no async loading, no translation backend. Server components read them via `getDictionary(locale)`; client components use the `useTranslation()` hook. **Both `en.json` and `sq.json` must carry the same key set.**

Albanian copy targets the Kosovo dialect in the informal register, not standard Tosk.

## Contact form

The form posts to `/api/contact`, which emails the visitor a confirmation from
`hello@skriptura.net` and blind-copies the notification inboxes — no `mailto:`
handoff, so nothing depends on the visitor having a mail client configured. The
confirmation is written in whichever language they were browsing in.

Sending needs a mail transport (Postfix on the server, or an SMTP host in
development) plus the env vars in [`.env.example`](.env.example) — see
[DEPLOYMENT.md](DEPLOYMENT.md#contact-form-email-postfix).

## Branding

- Yellow `#FFE600`, black `#000000`, off-white `#f8fafc`
- Space Mono, loaded via `next/font/google`
- The `S` mark is shared by `icon.svg` and `apple-icon.js`

## Deployment

Requires a Node.js host — the locale proxy runs per request, so a purely static export won't work. See [DEPLOYMENT.md](DEPLOYMENT.md); [`ecosystem.config.cjs`](ecosystem.config.cjs) holds the PM2 process config.
