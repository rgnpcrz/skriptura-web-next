'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from '@/components/ui/LocaleLink'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation, useLocale } from '@/i18n/client'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

// Remember the visitor's language choice so the proxy honors it on later visits.
function persistLocale(l) {
  document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000`
}

export default function Header({ onKonami }) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const konamiRef = useRef(0)
  const [konamiProgress, setKonamiProgress] = useState(0)

  const switchLang = (l) => {
    if (l === locale) return
    persistLocale(l)
    const restPath = pathname.replace(/^\/(en|sq)(?=\/|$)/, '')
    router.push(`/${l}${restPath}`)
  }

  const handleKey = useCallback((e) => {
    const next = konamiRef.current
    if (e.key === KONAMI[next]) {
      const newVal = next + 1
      konamiRef.current = newVal
      setKonamiProgress(newVal)
      if (newVal === KONAMI.length) {
        konamiRef.current = 0
        setKonamiProgress(0)
        onKonami && onKonami()
      }
    } else {
      konamiRef.current = 0
      setKonamiProgress(0)
    }
  }, [onKonami])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // Compare against the locale-stripped path so active state survives the /en, /sq prefix.
  const basePath = pathname.replace(/^\/(en|sq)(?=\/|$)/, '') || '/'
  const isActive = (href, exact = false) =>
    exact ? basePath === href : basePath === href || basePath.startsWith(href + '/')

  const navLinks = [
    { href: '/', label: t('nav.home'), exact: true },
    { href: '/about', label: t('nav.about') },
    { href: '/services', label: t('nav.services') },
    { href: '/clients', label: t('nav.clients') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/contact', label: t('nav.contact') },
  ]

  return (
    <header className="border-b-2 border-black bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="font-mono font-bold text-lg sm:text-xl tracking-widest uppercase select-none hover:text-black">
          SKRIPTURA
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono font-bold text-sm uppercase tracking-wide px-1 py-0.5 border-b-2 transition-colors ${
                isActive(link.href, link.exact) ? 'border-accent text-black' : 'border-transparent text-black hover:border-accent'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex border border-black">
            {['en', 'sq'].map((l, i) => (
              <button
                key={l}
                onClick={() => switchLang(l)}
                className={`font-mono text-xs font-bold px-2 py-1 transition-colors ${i > 0 ? 'border-l border-black' : ''} ${
                  locale === l ? 'bg-accent text-black' : 'bg-white text-black hover:bg-accent'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            className="md:hidden border-2 border-black p-1.5 bg-white hover:bg-black hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-mono font-bold text-sm uppercase tracking-wide py-3 border-b border-black block transition-all ${
                  isActive(link.href, link.exact) ? 'pl-2 border-l-4 border-l-accent' : 'hover:pl-2'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {konamiProgress > 0 && (
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-100"
          style={{ width: `${(konamiProgress / KONAMI.length) * 100}%` }}
        />
      )}
    </header>
  )
}
