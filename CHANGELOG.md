# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] - 2026-08-25

Light/dark/auto theming, and the contact form moved onto server-side mail.

### Added

- Light / dark / auto theme switching. The toggle sits beside the language switcher on desktop and inside the mobile menu; "auto" follows the OS and keeps following it live, an explicit choice is remembered in `localStorage` and stays put. The dark palette is a straight inversion of the light one — ink and paper swap, and the hard brutalist card shadow flips from black to near-white so cards keep lifting off the page. Yellow `#FFE600` is unchanged in both.
- Semantic color tokens (`ink`, `paper`, `canvas`, `accent`, `accent-strong`, `on-accent`, `terminal`) backed by CSS variables in `src/app/globals.css` and mapped in `tailwind.config.js` as `rgb(var(--x) / <alpha-value>)`, so opacity modifiers like `text-ink/70` still work. Switching themes is one variable flip on `<html data-theme>` — the stylesheet carries no duplicated `dark:` utilities, and the browser repaints once.
- `src/lib/theme.js` — theme resolution, persistence, the cross-tab/OS-change store behind `useSyncExternalStore`, the switch animation, and the pre-paint script, in one place.
- A blocking inline script (413 bytes) as the first element in `<body>`, so a dark-theme visitor never sees a white flash on load. `globals.css` also honours `prefers-color-scheme` on its own, which covers visitors with JavaScript disabled or a blocked `localStorage`.
- Theme switches animate: a View Transitions circular wipe out of the button that was pressed, falling back to a short color fade on browsers without the API, and to an instant swap under `prefers-reduced-motion`.
- Accessibility: a skip-to-content link, `aria-current="page"` on the active nav item, `aria-expanded`/`aria-controls` on the mobile menu button, labelled nav and language/theme groups, `htmlFor`/`id` on the contact form fields, a global `:focus-visible` outline, and a `prefers-reduced-motion` block that stops the marquee animations and smooth scrolling.
- One merged preferences control in the header, replacing the separate language and theme switchers. A single trigger shows the active locale and theme and opens a brutalist dropdown holding both; it closes on outside click, Escape, or navigation. Two segmented switchers side by side took most of the header on small screens.
- Entrance motion: the page content fades and rises on every navigation, and each section arrives as it scrolls into view, lightly staggered. Both animate only `opacity` and `transform`, so they run on the compositor. Gated behind `data-motion` on `<html>`, which the boot script sets only when `IntersectionObserver` exists and reduced motion is off — with a `load` failsafe that drops the hidden state if the bundle never boots, so server-rendered content can never be stranded at `opacity: 0`.
- Translation keys `theme.*` and `a11y.*` (en + sq).
- `POST /api/contact` — the contact form now sends mail server-side instead of handing off to `mailto:`. One message goes to the visitor as a confirmation from `hello@skriptura.net`, blind-copied to `skriptura.net@gmail.com` and `rgnpcrz@gmail.com`, so the BCC doubles as the inbound-inquiry notification. Recipients of the old `mailto:` flow were whoever had a mail client configured; now nobody has to.
- `src/lib/mail/mailer.js` — nodemailer transport, `MAIL_TYPE=LOCAL` (Postfix on `127.0.0.1:25`) or `SMTP`, mirroring `skriptura-hotel-api`.
- `src/lib/mail/contactTemplate.js` — HTML + plain-text confirmation in the visitor's language, quoting their submission so the BCC carries the full inquiry.
- `.env.example` and a Postfix section in `DEPLOYMENT.md` (SPF/DKIM, smoke test, `--update-env` after editing `.env`).
- Abuse protection on the public endpoint: honeypot field, field length caps, header-injection guard on `name`/`email`, and an in-memory limit of 3 sends per IP per 10 minutes.
- Contact translation keys `formSending`, `formSuccess`, `formError`, `formErrorInvalid`, `formErrorRate` (en + sq).

### Changed

- Responsiveness pass. `overflow-wrap: break-word` as a global last-resort guard; the home wordmark is fluid (`clamp(1.75rem, 9vw, 4.5rem)`) instead of stepping 36/60/72px, which was ~227px wide inside ~240px of room at 320px; `min-w-0` on the flex children that sit next to a `whitespace-nowrap` link or a badge, since flex items default to `min-width: auto` and refuse to shrink below their content; `shrink-0` on year and status badges; the registration table's label column wraps below `sm` instead of forcing a horizontal scroll.
- Every component moved off hardcoded `black`/`white` utilities onto the semantic tokens. Anything drawn on the accent yellow now uses `on-accent`, which stays black in both themes rather than inverting into an unreadable white-on-yellow.
- The scrollbar fades with the theme instead of flipping instantly. It is browser UI, never part of the view-transition snapshot, so it cannot take part in the circular wipe — it changed the moment `data-theme` did, as a hard line down the right edge while the page was still sweeping. Hover stays at 120ms.
- Card shadows are grey rather than pure black in light and near-white in dark — `#404040` and `#a3a3a3`. The hard brutalist offset is unchanged; it just stops shouting at either end.
- Scrollbars, `::selection`, and `<meta name="theme-color">` follow the active theme; `color-scheme` is declared so the browser styles form controls and native scrollbars to match.
- `useTranslation()` returns a `t` with a stable identity per dictionary, so it is safe to list in hook dependency arrays.
- The mobile menu now closes on navigation, not just on tapping one of its own links.
- The theme wipe now expands out of the SKRIPTURA wordmark rather than the control that was clicked.
- `contact.formNote` no longer says the form opens your email client — it now sets a reply expectation ("We reply within one business day.").
- `next.config.mjs`: `serverExternalPackages: ['nodemailer']`, so the SMTP client isn't bundled into the route.

### Fixed

- `Card` emitted two conflicting `bg-*` classes on yellow cards and only rendered correctly by CSS source-order luck.
- The `/secret` typewriter captured its lines on first render and would have replayed stale text if the dictionary changed; the revealed line count is now the only state and the text is derived.
- `NotFound` had no background of its own and showed the page canvas instead of a card surface.
- The far corners of the theme wipe popped in at the end instead of being swept. The reveal had no `animation-fill-mode`, so the clip was released the frame the animation ended, and the radius was measured against `innerWidth`/`innerHeight` — which undershoots the area the browser actually animates. The reveal now fills forwards, measures against the larger of the two viewport metrics, and overshoots the farthest corner by 8%.
- `<html>` now paints the canvas background as well as `<body>`, so the view-transition snapshot owns the page background instead of relying on propagation. `<body>` keeps its copy, which is what the konami invert filter flips.
- The theme options overflowed the preferences menu. Three labelled options across a 224px panel left roughly 30px per label, which "Auto" and every Albanian label ran past; they are a stacked list now, each with the full width.
- The theme wipe swapped the remainder in one jump, leaving a wedge of the old theme in the far corner until it snapped. The box the browser clips is not the viewport — on a 2953px document in an 840px viewport it is the whole document — so a radius sized against the viewport covered roughly a third of what it needed to. The wipe now uses two radii for two jobs. The visible sweep runs to `--theme-r`, the distance to the furthest visible corner, measured from the viewport at each switch; the last 12% of the timeline carries on to a box-relative `circle(150%)`, which covers whatever was actually clipped (a percentage on `circle()` resolves against its own reference box, and covering one from any interior point needs at most its diagonal, 141.4%). Nothing of that last part is on screen — it exists so releasing the clip has nothing left to reveal.
- The wipe now takes the same time on every page. Driving the whole animation from the clipped box made its speed a function of page length: the same 520ms crossed a larger radius on a longer document, so the visible sweep ran 409ms on a short page and 147ms on a long one. It is ~420ms everywhere now.
- The boot script's two snippets each end in a semicolon. Concatenated bare, `})()` followed by `(function(){` parses as the second IIFE being *called on* the first one's return value, throwing on every page load.

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
