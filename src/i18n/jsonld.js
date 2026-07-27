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
        logo: `${BASE}/${locale}/opengraph-image`,
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
