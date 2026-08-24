'use client'

import Link from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n/client'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import SectionHeader from '@/components/ui/SectionHeader'
import { clients } from '@/data/clients'

export default function ClientsClient() {
  const { t } = useTranslation()
  return (
    <div className="space-y-8">
      <SectionHeader title={t('clients.title')} subtitle={t('clients.subtitle')} />
      <div data-reveal className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {clients.map((client) => (
          <Card key={client.slug} hover className="h-full flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-3 border-b-2 border-ink pb-3">
              <h2 className="font-mono font-bold text-sm sm:text-base">{client.name}</h2>
              <Badge yellow>{client.year}</Badge>
            </div>
            <p className="font-mono text-xs sm:text-sm text-ink/70 mb-4 leading-relaxed flex-1">{client.tagline}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {client.services.map((s) => <Badge key={s}>{s.replace(/-/g, ' ')}</Badge>)}
            </div>
            <div className="flex flex-wrap gap-3 mt-auto pt-2 border-t border-ink/20">
              <Link href={`/clients/${client.slug}`} className="font-mono text-xs font-bold hover:underline underline-offset-2">{t('clients.viewDetails')}</Link>
              {client.url && <a href={client.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-ink/60 hover:text-ink hover:underline underline-offset-2">{t('clients.visitSite')}</a>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
