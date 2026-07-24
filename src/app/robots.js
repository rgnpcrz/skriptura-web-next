export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/en/secret', '/sq/secret'],
      },
    ],
    sitemap: 'https://skriptura.net/sitemap.xml',
    host: 'https://skriptura.net',
  }
}
