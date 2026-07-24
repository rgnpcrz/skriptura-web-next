import { services } from '@/data/services'
import ServiceDetailClient from '@/components/pages/ServiceDetailClient'
import { notFound } from 'next/navigation'
import { isLocale, defaultLocale } from '@/i18n/config'
import { pageMetadata } from '@/i18n/seo'

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
  const { slug } = await params
  const service = services.find((s) => s.slug === slug)
  if (!service) notFound()
  return <ServiceDetailClient slug={slug} />
}
