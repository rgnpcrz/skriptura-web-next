'use client'

import Link from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n/client'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import SectionHeader from '@/components/ui/SectionHeader'
import NotFound from '@/components/ui/NotFound'
import { projects } from '@/data/projects'

export default function ProjectDetailClient({ slug }) {
  const { t } = useTranslation()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <NotFound />
  return (
    <div className="space-y-10">
      <div>
        <Link href="/projects" className="font-mono text-xs font-bold hover:underline underline-offset-2 mb-4 block">{t('common.backToProjects')}</Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <SectionHeader title={`// ${project.name.toUpperCase()}`} className="mb-0 min-w-0" />
          <Badge yellow={project.status === 'live'} className="shrink-0">{project.status === 'live' ? t('projects.statusLive') : t('projects.statusComingSoon')}</Badge>
        </div>
      </div>
      <Card>
        <p className="font-mono font-bold text-sm sm:text-base mb-3">{project.tagline}</p>
        <p className="font-mono text-sm sm:text-base text-ink/70 leading-relaxed">{project.description}</p>
        {project.url && <div className="mt-6"><Button href={project.url} variant="solid">{t('projects.playNow')}</Button></div>}
      </Card>
      {project.plannedTools && (
        <section data-reveal>
          <SectionHeader title={`// ${t('projects.plannedTools').toUpperCase()}`} />
          <Card><div className="flex flex-wrap gap-2">{project.plannedTools.map((tool) => <Badge key={tool} yellow>{tool}</Badge>)}</div></Card>
        </section>
      )}
      <section data-reveal>
        <SectionHeader title="// TAGS" />
        <Card><div className="flex flex-wrap gap-2">{project.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div></Card>
      </section>
    </div>
  )
}
