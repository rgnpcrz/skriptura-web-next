'use client'

import Link from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n/client'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import SectionHeader from '@/components/ui/SectionHeader'
import NotFound from '@/components/ui/NotFound'
import { clients } from '@/data/clients'
import { services } from '@/data/services'

export default function ClientDetailClient({ slug }) {
  const { t } = useTranslation()
  const client = clients.find((c) => c.slug === slug)
  if (!client) return <NotFound />
  const clientServices = services.filter((s) => client.services.includes(s.slug))
  return (
    <div className="space-y-10">
      <div>
        <Link href="/clients" className="font-mono text-xs font-bold hover:underline underline-offset-2 mb-4 block">{t('common.backToClients')}</Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <SectionHeader title={`// ${client.name.toUpperCase()}`} className="mb-0 min-w-0" />
          <div className="flex flex-wrap gap-2 shrink-0">
            <Badge yellow>{client.year}</Badge>
            {client.active && <Badge>Active</Badge>}
          </div>
        </div>
      </div>
      <Card>
        <p className="font-mono text-sm sm:text-base leading-relaxed mb-4 max-w-3xl">{client.description}</p>
        {client.url ? (
          <a href={client.url} target="_blank" rel="noopener noreferrer" className="font-mono text-sm font-bold hover:underline underline-offset-2">
            {client.url.replace('https://', '')} ↗
          </a>
        ) : (
          <p className="font-mono text-xs text-ink/50">{t('clients.noUrl')}</p>
        )}
      </Card>
      <section data-reveal>
        <SectionHeader title={t('clients.sectionServices')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientServices.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="block group">
              <Card hover className="h-full">
                <h3 className="font-mono font-bold text-sm mb-1 group-hover:underline underline-offset-2">{service.name}</h3>
                <p className="font-mono text-xs text-ink/70 leading-snug">{service.shortDesc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      <section data-reveal>
        <SectionHeader title={t('clients.sectionTech')} />
        <Card><div className="flex flex-wrap gap-2">{client.tech.map((tech) => <Badge key={tech} yellow>{tech}</Badge>)}</div></Card>
      </section>
      <section data-reveal>
        <SectionHeader title={t('clients.sectionTestimonial')} />
        <Card>
          {client.testimonial ? (
            <blockquote className="font-mono text-sm sm:text-base italic leading-relaxed border-l-4 border-accent pl-4">&ldquo;{client.testimonial}&rdquo;</blockquote>
          ) : (
            <p className="font-mono text-sm text-ink/50">{t('clients.noTestimonial')}</p>
          )}
        </Card>
      </section>
    </div>
  )
}
