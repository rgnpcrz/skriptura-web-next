import { services } from '@/data/services'
import ServiceDetailClient from '@/components/pages/ServiceDetailClient'
import { notFound } from 'next/navigation'
import { isLocale, defaultLocale } from '@/i18n/config'
import { pageMetadata } from '@/i18n/seo'
import { getDictionary } from '@/i18n/dictionaries'
import { breadcrumbJsonLd } from '@/i18n/jsonld'
import JsonLd from '@/components/JsonLd'

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  const locale = isLocale(lang) ? lang : defaultLocale
  const service = services.find((s) => s.slug === slug)
  if (!service) return { title: 'Service not found' }
  return pageMetadata({
    locale,
    path: `/services/${slug}`,
    title: service.name,
    description: `${service.shortDesc} — ${service.description.slice(0, 120)}`,
  })
}

export default async function Page({ params }) {
  const { lang, slug } = await params
  const locale = isLocale(lang) ? lang : defaultLocale
  const { nav } = getDictionary(locale)
  const service = services.find((s) => s.slug === slug)
  if (!service) notFound()
  const trail = [
    { name: nav.home, path: '' },
    { name: nav.services, path: '/services' },
    { name: service.name, path: `/services/${slug}` },
  ]

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, trail)} />
      <ServiceDetailClient slug={slug} />
    </>
  )
}
