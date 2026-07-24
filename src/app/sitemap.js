import { clients } from '@/data/clients'
import { services } from '@/data/services'
import { projects } from '@/data/projects'

const BASE = 'https://skriptura.net'

// One sitemap entry per page, listing the English URL as canonical and the
// Albanian URL as an hreflang alternate (plus x-default → English).
function entry(path, priority) {
  return {
    url: `${BASE}/en${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority,
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
  const staticRoutes = [
    ['', 1],
    ['/about', 0.8],
    ['/services', 0.8],
    ['/clients', 0.8],
    ['/projects', 0.8],
    ['/contact', 0.8],
  ]

  const dynamicRoutes = [
    ...clients.map((c) => [`/clients/${c.slug}`, 0.7]),
    ...services.map((s) => [`/services/${s.slug}`, 0.7]),
    ...projects.map((p) => [`/projects/${p.slug}`, 0.6]),
  ]

  return [...staticRoutes, ...dynamicRoutes].map(([path, priority]) => entry(path, priority))
}
