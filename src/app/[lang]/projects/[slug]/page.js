import { projects } from '@/data/projects'
import ProjectDetailClient from '@/components/pages/ProjectDetailClient'
import { notFound } from 'next/navigation'
import { isLocale, defaultLocale } from '@/i18n/config'
import { pageMetadata } from '@/i18n/seo'

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
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()
  return <ProjectDetailClient slug={slug} />
}
