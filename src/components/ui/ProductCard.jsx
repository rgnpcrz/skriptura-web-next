'use client'

import Link from '@/components/ui/LocaleLink'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { useTranslation, useLocale } from '@/i18n/client'
import { clients } from '@/data/clients'
import { pick } from '@/data/projects'

const clientName = Object.fromEntries(clients.map((c) => [c.slug, c.name]))

/**
 * One product from src/data/products.js. `compact` (the home page) drops the
 * feature list; both variants keep the clients running it and the demo link.
 * The card itself is not a link — it holds several — so it has no hover lift.
 */
export default function ProductCard({ product, compact = false, headingLevel = 'h3' }) {
  const { t } = useTranslation()
  const locale = useLocale()
  const Heading = headingLevel
  const running = product.clients.filter((slug) => clientName[slug])

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3 border-b-2 border-ink pb-3">
        <Heading className="font-mono font-bold text-sm sm:text-base min-w-0">{pick(product.name, locale)}</Heading>
        <Badge yellow className="shrink-0">{t('products.statusAvailable')}</Badge>
      </div>
      <p className="font-mono text-xs sm:text-sm text-ink/70 mb-4 leading-relaxed">{pick(product.tagline, locale)}</p>
      {!compact && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {pick(product.features, locale).map((feature) => <Badge key={feature}>{feature}</Badge>)}
        </div>
      )}
      {running.length > 0 && (
        <p className="font-mono text-xs text-ink/70 mb-4">
          {t('products.inUseAt')}{' '}
          {running.map((slug, i) => (
            <span key={slug}>
              {i > 0 && ', '}
              <Link href={`/clients/${slug}`} className="font-bold text-ink underline underline-offset-2 hover:no-underline">
                {clientName[slug]}
              </Link>
            </span>
          ))}
        </p>
      )}
      <Link href="/contact" className="font-mono text-xs font-bold hover:underline underline-offset-2 mt-auto">
        {t('products.ctaDemo')}
      </Link>
    </Card>
  )
}
