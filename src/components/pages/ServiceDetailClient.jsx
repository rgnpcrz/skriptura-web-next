'use client'

import Link from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n/client'
import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'
import NotFound from '@/components/ui/NotFound'
import { services } from '@/data/services'
import { clients } from '@/data/clients'

export default function ServiceDetailClient({ slug }) {
  const { t } = useTranslation()
  const service = services.find((s) => s.slug === slug)
  if (!service) return <NotFound />
  const relatedClients = clients.filter((c) => service.relatedClients.includes(c.slug))
  return (
    <div className="space-y-10">
      <div>
        <Link href="/services" className="font-mono text-xs font-bold hover:underline underline-offset-2 mb-4 block">{t('common.backToServices')}</Link>
        <SectionHeader title={`// ${service.name.toUpperCase()}`} />
      </div>
      <Card><p className="font-mono text-sm sm:text-base leading-relaxed max-w-3xl">{service.description}</p></Card>
      <section>
        <SectionHeader title={t('services.sectionIncludes')} />
        <Card>
          <ul className="space-y-3">
            {service.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-3 font-mono text-sm">
                <span className="font-bold text-accent bg-terminal px-1 shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>
      <section>
        <SectionHeader title={t('services.sectionClients')} />
        {relatedClients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedClients.map((client) => (
              <Link key={client.slug} href={`/clients/${client.slug}`} className="block group">
                <Card hover className="h-full">
                  <h3 className="font-mono font-bold text-sm mb-1 group-hover:underline underline-offset-2">{client.name}</h3>
                  <p className="font-mono text-xs text-ink/70">{client.tagline}</p>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card><p className="font-mono text-sm text-ink/60">{t('services.noClients')}</p></Card>
        )}
      </section>
    </div>
  )
}
