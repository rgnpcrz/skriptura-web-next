# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added — email verification (SQLite)

- Submissions are now persisted in SQLite (`data/skriptura.db`, gitignored) and the visitor is emailed a 6-digit code. Entering it sends the confirmation, BCC'd to the notification inboxes — the BCC arriving is the "this address is real" signal.
- **The verification is not a gate.** An inquiry alert reaches the notification inboxes the moment the form is submitted, marked unverified, so an ignored code never costs a lead. A contact form is the highest-value conversion on the site; gating it behind a step the visitor might not finish would trade real leads for inbox tidiness.
- `src/lib/contact/inquiries.js` — 10-minute single-use codes, 5 attempts before the code is destroyed, 3 codes per address per hour, 60s resend cooldown. Ported from `skriptura-hotel-api`'s `otpService.js`, with the code hash upgraded from a bare SHA-256 to an HMAC keyed by `CONTACT_CODE_SECRET`: a 6-digit digest is otherwise recoverable by sweeping a million inputs if the database file ever leaks.
- `src/lib/db/` — lazy `better-sqlite3` connection (WAL, `busy_timeout`), schema versioned via `PRAGMA user_version`. Unverified inquiries are purged after 30 days; verified ones are kept as a lead log.
- `POST /api/contact/verify` and `POST /api/contact/resend`.
- `src/lib/mail/layout.js` — one shell shared by all three emails, plus the standards items: `Auto-Submitted: auto-generated` (RFC 3834), `format-detection` so iOS Mail stops turning the 6-digit code into a `tel:` link, `color-scheme` and explicit per-cell colours so dark mode can't invert black-on-yellow, and the code as selectable text. Deliberately no `List-Unsubscribe` — these are transactional.
- A retention note under the form: storing names, emails and messages makes this a data-controller relationship under Kosovo's LMBPD.

### Changed — email verification

- The IP rate limit moved from an in-memory `Map` into SQLite, so it survives `pm2 reload`.
- `ContactClient.jsx` is now composition only; the `form → code → done` state machine lives in `ContactFormFlow.jsx` with an expiry countdown, resend cooldown, and a start-over escape hatch.
- The confirmation email's copy acknowledges the confirmation step.

### Added

- `POST /api/contact` — the contact form now sends mail server-side instead of handing off to `mailto:`. One message goes to the visitor as a confirmation from `hello@skriptura.net`, blind-copied to `skriptura.net@gmail.com` and `rgnpcrz@gmail.com`, so the BCC doubles as the inbound-inquiry notification. Recipients of the old `mailto:` flow were whoever had a mail client configured; now nobody has to.
- `src/lib/mail/mailer.js` — nodemailer transport, `MAIL_TYPE=LOCAL` (Postfix on `127.0.0.1:25`) or `SMTP`, mirroring `skriptura-hotel-api`.
- `src/lib/mail/contactTemplate.js` — HTML + plain-text confirmation in the visitor's language, quoting their submission so the BCC carries the full inquiry.
- `.env.example` and a Postfix section in `DEPLOYMENT.md` (SPF/DKIM, smoke test, `--update-env` after editing `.env`).
- Abuse protection on the public endpoint: honeypot field, field length caps, header-injection guard on `name`/`email`, and an in-memory limit of 3 sends per IP per 10 minutes.
- Contact translation keys `formSending`, `formSuccess`, `formError`, `formErrorInvalid`, `formErrorRate` (en + sq).

### Changed

- `contact.formNote` no longer says the form opens your email client — it now sets a reply expectation ("We reply within one business day.").
- `next.config.mjs`: `serverExternalPackages: ['nodemailer']`, so the SMTP client isn't bundled into the route.

## [1.2.0] - 2026-07-27

Brand identity applied and the last `create-next-app` defaults removed.

### Added

- `src/app/icon.svg` — the Skriptura `S` mark (yellow `#FFE600` on black), carried over from the previous Vite/React site. Applies to every route.
- `src/app/apple-icon.js` — 180x180 touch icon for iOS home screens, generated from the same mark with `next/og`, since Apple touch icons can't be SVG.
- This changelog.

### Changed

- `README.md` rewritten — was still the `create-next-app` boilerplate, down to a reference to the Geist font this project doesn't use.
- `package.json`: added description, homepage, author, license, and a `>=20.9.0` Node engine constraint (Next 16.2.7's own floor).
- Locale proxy matcher now excludes `icon` and `apple-icon`. Both are root-level routes without a dot in the path, so the matcher would otherwise have redirected `/apple-icon` into `/en/apple-icon` and broken the touch icon. The stale `favicon.ico` exclusion was dropped.

### Removed

- `src/app/favicon.ico` — the default Vercel triangle from `create-next-app`.
- `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — unused `create-next-app` sample assets. `public/` is now empty.

## [1.1.0] - 2026-07-27

Albanian copy rewritten for the Kosovo dialect.

### Added

- `common.quickLinks` and `common.rights` translation keys, replacing hardcoded English in the footer and homepage.

### Changed

- Albanian copy (`src/i18n/sq.json`) normalized to the informal `ti` register throughout, which had been mixed with formal `ju`. Gheg infinitives (`me shkru`, `me ta lehtësu`), `prej`/`qysh`/`veç`/`qasje`/`për qejf` over their standard-Albanian equivalents, and consistent `dixhital` and `softuer` spellings.
- Homepage contact heading `// NA GJENI` → `// KU NA GJEN`, to play off `// KUSH JEMI`.
- JSON-LD organization description now says `softuer` rather than `software`, matching `sq.json`.

### Fixed

- `// KU JEMI` ("where we are") → `// KUSH JEMI` ("who we are") in the homepage section heading.
- `Shoqëri me Përgjegjësi të Kufizuara` → `të Kufizuar`, the legally correct SH.P.K. company form.
- `vardin njerëzit nga puna` → `i largojnë njerëzit prej punës`; `vardin` is not a word.
- `faqet interneti` → `faqeve të internetit`.
- `Kthehu në Ballina` → `Kthehu te Ballina` (wrong case).
- `Siguron që projektet ecin` → `Kujdeset që projektet të ecin` (missing subjunctive).
- Mismatched clitic and possessive in the homepage mission line (`me të lehtësu jetën tuaj`).
- `Na kontaktoni te Skriptura` → `Kontakto Skriptura` in the Albanian contact metadata description.
- Footer and homepage no longer render `Prishtinë, Kosovo`, `Quick links`, and `All rights reserved.` in English on Albanian pages.

## [1.0.0] - 2026-07-24

Initial release. Rebuild of the Vite/React site at `skriptura-web` on Next.js.

### Added

- Next.js 16 App Router with React 19, Tailwind CSS 3, and Space Mono via `next/font/google`.
- Bilingual routing: every page lives under `src/app/[lang]/`, with `en` (default) and `sq` statically generated as separate, independently indexable trees.
- Locale detection in `src/proxy.js` — `NEXT_LOCALE` cookie, then `Accept-Language`, then the default — redirecting unprefixed paths.
- Translation layer in `src/i18n/`: bundled JSON dictionaries, server-side `getDictionary()`, and a `useTranslation()` hook for client components.
- Per-page metadata with hreflang alternates (`seo.js`), Organization and WebSite structured data (`jsonld.js`), `sitemap.xml`, `robots.txt`, and generated Open Graph images per locale.
- Pages: home, about, services, clients, projects, contact, a hidden `/secret` route, and a custom 404.
- Content in `src/data/` for clients, projects, and services.
- `DEPLOYMENT.md` and a PM2 `ecosystem.config.cjs` for Node hosting.

[unreleased]: https://github.com/rgnpcrz/skriptura-web-next/compare/3474369...HEAD
[1.2.0]: https://github.com/rgnpcrz/skriptura-web-next/compare/dd77633...3474369
[1.1.0]: https://github.com/rgnpcrz/skriptura-web-next/compare/28b0e4f...dd77633
[1.0.0]: https://github.com/rgnpcrz/skriptura-web-next/commit/28b0e4f
