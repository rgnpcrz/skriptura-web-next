import { projects } from '@/data/projects'
import ProjectDetailClient from '@/components/pages/ProjectDetailClient'
import { notFound } from 'next/navigation'
import { isLocale, defaultLocale } from '@/i18n/config'
import { pageMetadata } from '@/i18n/seo'
import { getDictionary } from '@/i18n/dictionaries'
import { breadcrumbJsonLd } from '@/i18n/jsonld'
import JsonLd from '@/components/JsonLd'

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params
  const locale = isLocale(lang) ? lang : defaultLocale
  const project = projects.find((p) => p.slug === slug)
  if (!project) return { title: 'Project not found' }
  return pageMetadata({
    locale,
    path: `/projects/${slug}`,
    title: project.name,
    description: `${project.tagline} — ${project.description.slice(0, 120)}`,
  })
}

export default async function Page({ params }) {
  const { lang, slug } = await params
  const locale = isLocale(lang) ? lang : defaultLocale
  const { nav } = getDictionary(locale)
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()
  const trail = [
    { name: nav.home, path: '' },
    { name: nav.projects, path: '/projects' },
    { name: project.name, path: `/projects/${slug}` },
  ]

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, trail)} />
      <ProjectDetailClient slug={slug} />
    </>
  )
}
