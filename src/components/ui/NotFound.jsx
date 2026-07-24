'use client'

import Link from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n/client'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="border-2 border-black shadow-card p-8 sm:p-12 max-w-md w-full">
        <p className="font-mono font-bold text-6xl sm:text-8xl text-accent border-b-4 border-black pb-4 mb-6">
          {t('notFound.code')}
        </p>
        <h1 className="font-mono font-bold text-xl sm:text-2xl mb-3">{t('notFound.title')}</h1>
        <p className="font-mono text-sm text-black/70 mb-8">{t('notFound.message')}</p>
        <Link
          href="/"
          className="font-mono font-bold text-sm border-2 border-black px-5 py-2.5 bg-black text-white hover:bg-accent hover:text-black transition-colors inline-block"
        >
          {t('notFound.back')}
        </Link>
      </div>
    </div>
  )
}
