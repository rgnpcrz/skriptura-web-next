import { getDictionary } from './dictionaries'

const SITE = 'Skriptura'
const BASE = 'https://skriptura.net'
const OG_LOCALE = { en: 'en_US', sq: 'sq_AL' }

// hreflang alternates for a locale-less path (e.g. '' or '/about').
function buildAlternates(locale, path) {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      en: `/en${path}`,
      sq: `/sq${path}`,
      'x-default': `/en${path}`,
    },
  }
}

// Metadata for the root [lang] layout: defaults, title template, base, robots.
export function rootMetadata(locale) {
  const seo = getDictionary(locale).seo
  return {
    metadataBase: new URL(BASE),
    title: { default: seo.default.title, template: `%s — ${SITE}` },
    description: seo.default.description,
    alternates: buildAlternates(locale, ''),
    openGraph: {
      siteName: SITE,
      type: 'website',
      locale: OG_LOCALE[locale],
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
  }
}

// Per-page metadata. `title`/`description` are already localized strings;
// `path` is locale-less (e.g. '/about', '/clients/furra-lumi', '' for home).
// `absoluteTitle` forces the brand suffix into <title> (used by the home page,
// which shares the [lang] segment with the title template and so bypasses it).
export function pageMetadata({ locale, path, title, description, absoluteTitle = false }) {
  const canonical = `/${locale}${path}`
  return {
    title: absoluteTitle ? { absolute: `${title} — ${SITE}` } : title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title: `${title} — ${SITE}`,
      description,
      url: canonical,
      locale: OG_LOCALE[locale],
    },
  }
}
