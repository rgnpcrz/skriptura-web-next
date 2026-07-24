import ServicesClient from '@/components/pages/ServicesClient'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, defaultLocale } from '@/i18n/config'
import { pageMetadata } from '@/i18n/seo'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const locale = isLocale(lang) ? lang : defaultLocale
  const { seo } = getDictionary(locale)
  return pageMetadata({ locale, path: '/services', title: seo.services.title, description: seo.services.description })
}

export default function Page() {
  return <ServicesClient />
}
