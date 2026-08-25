'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/i18n/client'
import { observeReveals } from '@/lib/motion'
import Header from './Header'
import Footer from './Footer'

export default function ClientShell({ children }) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [konamiActive, setKonamiActive] = useState(false)

  const handleKonami = () => {
    setKonamiActive(true)
    setTimeout(() => setKonamiActive(false), 3000)
  }

  useEffect(() => {
    document.body.style.filter = konamiActive ? 'invert(1)' : ''
    return () => { document.body.style.filter = '' }
  }, [konamiActive])

  // Re-run per route: the new page brings its own blocks to reveal.
  useEffect(() => observeReveals(), [pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main" className="skip-link">{t('a11y.skipToContent')}</a>
      <Header onKonami={handleKonami} />
      {konamiActive && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="bg-accent border-4 border-ink shadow-card px-8 py-4 font-mono font-bold text-xl text-on-accent animate-bounce">
            ↑↑↓↓←→←→BA · CHEAT ACTIVATED
          </div>
        </div>
      )}
      <main id="main" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Keyed on the route so the enter animation replays on every navigation. */}
        <div key={pathname} className="page-enter">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
