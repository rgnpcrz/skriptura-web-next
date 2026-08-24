import { Space_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import '../globals.css'
import { locales, isLocale, defaultLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { TranslationProvider } from '@/i18n/client'
import { rootMetadata } from '@/i18n/seo'
import { organizationJsonLd } from '@/i18n/jsonld'
import { THEME_COLORS, THEME_LIGHT } from '@/lib/theme'
import ThemeScript from '@/components/theme/ThemeScript'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import ClientShell from '@/components/layout/ClientShell'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export const viewport = {
  // `light dark` lets the UA style scrollbars and form controls for whichever
  // theme is active. The single theme-color is a light-theme default that the
  // pre-paint script rewrites before anything renders.
  colorScheme: 'light dark',
  themeColor: THEME_COLORS[THEME_LIGHT],
}

export async function generateMetadata({ params }) {
  const { lang } = await params
  return rootMetadata(isLocale(lang) ? lang : defaultLocale)
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const dict = getDictionary(lang)

  return (
    // The theme script writes data-theme/data-theme-pref onto <html> before
    // React hydrates, which React would otherwise flag as a mismatch.
    <html lang={lang} className={spaceMono.variable} suppressHydrationWarning>
      <body className="font-mono">
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(lang)) }}
        />
        <TranslationProvider dict={dict} locale={lang}>
          <ThemeProvider>
            <ClientShell>{children}</ClientShell>
          </ThemeProvider>
        </TranslationProvider>
      </body>
    </html>
  )
}
