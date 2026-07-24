import { NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n/config'

// Pick a locale from the visitor's cookie preference, then Accept-Language,
// falling back to the default. Dependency-free (no negotiator/intl-localematcher).
function getLocale(request) {
  const cookie = request.cookies.get('NEXT_LOCALE')?.value
  if (cookie && locales.includes(cookie)) return cookie

  const accept = request.headers.get('accept-language') || ''
  for (const part of accept.split(',')) {
    const base = part.split(';')[0].trim().toLowerCase().split('-')[0]
    if (locales.includes(base)) return base
  }
  return defaultLocale
}

export function proxy(request) {
  const { pathname } = request.nextUrl

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )
  if (hasLocale) return

  const locale = getLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Run on everything except Next internals, API routes, metadata files,
  // and any path containing a dot (static assets like images/fonts).
  matcher: ['/((?!_next|api|favicon.ico|sitemap.xml|robots.txt|opengraph-image|.*\\..*).*)'],
}
