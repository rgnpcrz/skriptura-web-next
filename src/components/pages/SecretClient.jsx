'use client'

import { useState, useEffect } from 'react'
import Link from '@/components/ui/LocaleLink'
import { useTranslation } from '@/i18n/client'

export default function SecretClient() {
  const { t } = useTranslation()
  const [lines, setLines] = useState([])
  const allLines = [t('secret.line1'), t('secret.line2'), t('secret.line3'), t('secret.line4'), t('secret.line5')]

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < allLines.length) { setLines((prev) => [...prev, allLines[i]]); i++ }
      else clearInterval(interval)
    }, 700)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="border-2 border-black shadow-card bg-black text-accent p-8 sm:p-12 w-full max-w-lg font-mono">
        <p className="text-2xl sm:text-3xl font-bold mb-6 border-b-2 border-accent pb-4">{t('secret.title')}</p>
        <div className="space-y-2 text-sm min-h-32">
          {lines.map((line, i) => <p key={i}>{line}</p>)}
          {lines.length === allLines.length && <p className="mt-1 animate-pulse">{'>'} <span className="bg-accent text-black px-0.5">_</span></p>}
        </div>
        <Link href="/" className="mt-8 inline-block border-2 border-accent text-accent px-5 py-2.5 text-sm font-bold hover:bg-accent hover:text-black transition-colors">
          {t('secret.back')}
        </Link>
      </div>
    </div>
  )
}
