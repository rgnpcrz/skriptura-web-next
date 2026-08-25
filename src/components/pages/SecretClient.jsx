'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n/client'

export default function SecretClient() {
  const { t } = useTranslation()
  const allLines = useMemo(
    () => [t('secret.line1'), t('secret.line2'), t('secret.line3'), t('secret.line4'), t('secret.line5')],
    [t]
  )
  // Only the number of revealed lines is state — the text itself is derived,
  // so a dictionary change can never leave a half-translated transcript behind.
  const [revealed, setRevealed] = useState(0)
  const lines = allLines.slice(0, revealed)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setRevealed(i)
      if (i >= allLines.length) clearInterval(interval)
    }, 700)
    return () => clearInterval(interval)
  }, [allLines])

  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="border-2 border-ink shadow-card bg-terminal text-accent p-8 sm:p-12 w-full max-w-lg font-mono">
        <p className="text-2xl sm:text-3xl font-bold mb-6 border-b-2 border-accent pb-4">{t('secret.title')}</p>
        <div className="space-y-2 text-sm min-h-32">
          {lines.map((line, i) => <p key={i}>{line}</p>)}
          {lines.length === allLines.length && <p className="mt-1 animate-pulse">{'>'} <span className="bg-accent text-on-accent px-0.5">_</span></p>}
        </div>
        <Link href="/" className="mt-8 inline-block border-2 border-accent text-accent px-5 py-2.5 text-sm font-bold hover:bg-accent hover:text-on-accent transition-colors">
          {t('secret.back')}
        </Link>
      </div>
    </div>
  )
}
