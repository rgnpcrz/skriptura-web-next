# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-27

First release of the Next.js site. Replaces the Vite/React version at `skriptura-web`.

### Added

- `src/app/icon.svg` — the Skriptura `S` mark (yellow `#FFE600` on black), carried over from the previous site. Applies to every route.
- `src/app/apple-icon.js` — 180x180 touch icon for iOS home screens, generated from the same mark with `next/og`.
- `common.quickLinks` and `common.rights` translation keys, replacing hardcoded English in the footer and homepage.
- This changelog.

### Changed

- Albanian copy (`src/i18n/sq.json`) rewritten for the Kosovo dialect and normalized to the informal `ti` register throughout, which had been mixed with formal `ju`. Gheg infinitives (`me shkru`, `me ta lehtësu`), `prej`/`qysh`/`veç`/`qasje`/`për qejf` over their standard-Albanian equivalents, and consistent `dixhital` and `softuer` spellings.
- `README.md` rewritten — was still the `create-next-app` boilerplate, including a reference to the Geist font this project doesn't use.
- `package.json`: version `0.1.0` → `1.0.0`, plus description, homepage, author, license, and a `>=20.9.0` Node engine constraint.
- Locale proxy matcher now excludes `icon` and `apple-icon` so the root-level icon routes aren't redirected into a locale segment. The stale `favicon.ico` exclusion was dropped.
- JSON-LD organization description now says `softuer` rather than `software`, matching `sq.json`.

### Removed

- `src/app/favicon.ico` — the default Vercel triangle from `create-next-app`.
- `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — unused `create-next-app` sample assets.

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
