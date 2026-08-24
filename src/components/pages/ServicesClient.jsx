'use client'

import Link from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n/client'
import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'
import { services } from '@/data/services'

export default function ServicesClient() {
  const { t } = useTranslation()
  return (
    <div className="space-y-8">
      <SectionHeader title={t('services.title')} subtitle={t('services.subtitle')} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Link key={service.slug} href={`/services/${service.slug}`} className="block group">
            <Card hover className="h-full flex flex-col">
              <h2 className="font-mono font-bold text-sm sm:text-base mb-2 group-hover:underline underline-offset-2">{service.name}</h2>
              <p className="font-mono text-xs sm:text-sm text-ink/70 flex-1 leading-relaxed mb-4">{service.shortDesc}</p>
              <p className="font-mono text-xs font-bold">{t('services.viewService')}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
