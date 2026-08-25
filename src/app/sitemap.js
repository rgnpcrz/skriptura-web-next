import { clients } from '@/data/clients'
import { services } from '@/data/services'
import { projects } from '@/data/projects'

const BASE = 'https://skriptura.net'

// Bump when page content actually changes. A build-time `new Date()` would move
// on every deploy whether anything changed or not, and a lastmod that is always
// "today" is one search engines learn to discount.
const LAST_CONTENT_UPDATE = new Date('2026-08-25')

// One sitemap entry per page, listing the English URL as canonical and the
// Albanian URL as an hreflang alternate (plus x-default → English).
// `changefreq` and `priority` are omitted deliberately: Google ignores both.
function entry(path) {
  return {
    url: `${BASE}/en${path}`,
    lastModified: LAST_CONTENT_UPDATE,
    alternates: {
      languages: {
        en: `${BASE}/en${path}`,
        sq: `${BASE}/sq${path}`,
        'x-default': `${BASE}/en${path}`,
      },
    },
  }
}

export default function sitemap() {
  const paths = [
    '',
    '/about',
    '/services',
    '/clients',
    '/projects',
    '/contact',
    ...services.map((s) => `/services/${s.slug}`),
    ...clients.map((c) => `/clients/${c.slug}`),
    ...projects.map((p) => `/projects/${p.slug}`),
  ]

  return paths.map(entry)
}
