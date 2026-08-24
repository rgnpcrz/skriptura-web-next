'use client'

import Link from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n/client'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import SectionHeader from '@/components/ui/SectionHeader'
import { projects } from '@/data/projects'

export default function ProjectsClient() {
  const { t } = useTranslation()
  const live = projects.filter((p) => p.status === 'live')
  const soon = projects.filter((p) => p.status === 'coming-soon')
  return (
    <div className="space-y-12">
      <SectionHeader title={t('projects.title')} subtitle={t('projects.subtitle')} />
      {live.length > 0 && (
        <section data-reveal>
          <SectionHeader title={t('projects.sectionLive')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {live.map((project) => (
              <Card key={project.slug} hover className="h-full flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3 border-b-2 border-ink pb-3">
                  <h2 className="font-mono font-bold text-sm sm:text-base">{project.name}</h2>
                  <Badge yellow>{t('projects.statusLive')}</Badge>
                </div>
                <p className="font-mono text-xs font-bold text-ink/70 mb-2">{project.tagline}</p>
                <p className="font-mono text-xs sm:text-sm text-ink/60 mb-4 leading-relaxed flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">{project.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
                {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs font-bold hover:underline underline-offset-2 mt-auto">{t('projects.playNow')}</a>}
              </Card>
            ))}
          </div>
        </section>
      )}
      {soon.length > 0 && (
        <section data-reveal>
          <SectionHeader title={t('projects.sectionComingSoon')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {soon.map((project) => (
              <Card key={project.slug} className="h-full flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3 border-b-2 border-ink pb-3">
                  <h2 className="font-mono font-bold text-sm sm:text-base">{project.name}</h2>
                  <Badge>{t('projects.statusComingSoon')}</Badge>
                </div>
                <p className="font-mono text-xs font-bold text-ink/70 mb-2">{project.tagline}</p>
                <p className="font-mono text-xs sm:text-sm text-ink/60 mb-4 leading-relaxed">{project.description}</p>
                {project.plannedTools && (
                  <div className="border-t-2 border-ink pt-4 mt-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-widest mb-3">{t('projects.plannedTools')}</p>
                    <div className="flex flex-wrap gap-1.5">{project.plannedTools.map((tool) => <Badge key={tool}>{tool}</Badge>)}</div>
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5 mt-4">{project.tags.map((tag) => <Badge key={tag} yellow>{tag}</Badge>)}</div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
