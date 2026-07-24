import { clients } from '@/data/clients'
import ClientDetailClient from '@/components/pages/ClientDetailClient'
import { notFound } from 'next/navigation'
import { isLocale, defaultLocale } from '@/i18n/config'
import { pageMetadata } from '@/i18n/seo'

export async function generateStaticParams() {
  return clients.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  const locale = isLocale(lang) ? lang : defaultLocale
  const client = clients.find((c) => c.slug === slug)
  if (!client) return { title: 'Client not found' }
  return pageMetadata({
    locale,
    path: `/clients/${slug}`,
    title: client.name,
    description: `${client.tagline} — ${client.description.slice(0, 130)}`,
  })
}

export default async function Page({ params }) {
  const { slug } = await params
  const client = clients.find((c) => c.slug === slug)
  if (!client) notFound()
  return <ClientDetailClient slug={slug} />
}
