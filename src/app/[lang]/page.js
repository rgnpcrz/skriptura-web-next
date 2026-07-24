import HomeClient from '@/components/pages/HomeClient'
import { getDictionary } from '@/i18n/dictionaries'
import { isLocale, defaultLocale } from '@/i18n/config'
import { pageMetadata } from '@/i18n/seo'

export async function generateMetadata({ params }) {
  const { lang } = await params
  const locale = isLocale(lang) ? lang : defaultLocale
  const { seo } = getDictionary(locale)
  return pageMetadata({ locale, path: '', title: seo.home.title, description: seo.home.description, absoluteTitle: true })
}

export default function Page() {
  return <HomeClient />
}
