// Organization + WebSite structured data (JSON-LD). Helps search engines
// build a knowledge panel and improves the odds of brand sitelinks.
const BASE = 'https://skriptura.net'

export function organizationJsonLd(locale) {
  const description =
    locale === 'sq'
      ? 'Skriptura SH.P.K. ndërton softuer të personalizuar, faqe interneti dhe platforma e-commerce. Me seli në Prishtinë, Kosovë.'
      : 'Skriptura SH.P.K. builds custom software, websites, and e-commerce platforms. Based in Prishtinë, Kosovo.'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: 'Skriptura SH.P.K.',
        url: BASE,
        email: 'info@skriptura.net',
        telephone: '+383 44 564 565',
        foundingDate: '2023-12',
        description,
        image: `${BASE}/${locale}/opengraph-image`,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE}/apple-icon`,
          width: 180,
          height: 180,
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Rruga Dr. Shpëtim Robaj, B. C, Nr. 12',
          addressLocality: 'Prishtinë',
          addressCountry: 'XK',
        },
        areaServed: ['XK', 'Kosovo'],
        founder: [
          { '@type': 'Person', name: 'Rigon Paçarizi' },
          { '@type': 'Person', name: 'Argjenta Gashi' },
        ],
        identifier: {
          '@type': 'PropertyValue',
          propertyID: 'NUI',
          value: '812112431',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        url: BASE,
        name: 'Skriptura',
        publisher: { '@id': `${BASE}/#organization` },
        inLanguage: locale === 'sq' ? 'sq' : 'en',
      },
    ],
  }
}

/**
 * Breadcrumb trail for a page, as schema.org BreadcrumbList.
 *
 * Google's sitelinks guidance asks for "a logical site structure that is easy
 * for users to navigate" — this is that structure stated in machine-readable
 * form, so the hierarchy does not have to be inferred from link graphs alone.
 * It is also what puts a breadcrumb line under the result instead of a raw URL.
 *
 * `trail` is ordered root-first; each `path` is locale-less ('' for home).
 */
export function breadcrumbJsonLd(locale, trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${BASE}/${locale}${crumb.path}`,
    })),
  }
}
