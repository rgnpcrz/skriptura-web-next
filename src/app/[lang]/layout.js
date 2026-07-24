import { Space_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import '../globals.css'
import { locales, isLocale, defaultLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { TranslationProvider } from '@/i18n/client'
import { rootMetadata } from '@/i18n/seo'
import { organizationJsonLd } from '@/i18n/jsonld'
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

export async function generateMetadata({ params }) {
  const { lang } = await params
  return rootMetadata(isLocale(lang) ? lang : defaultLocale)
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const dict = getDictionary(lang)

  return (
    <html lang={lang} className={spaceMono.variable}>
      <body className="font-mono">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(lang)) }}
        />
        <TranslationProvider dict={dict} locale={lang}>
          <ClientShell>{children}</ClientShell>
        </TranslationProvider>
      </body>
    </html>
  )
}
