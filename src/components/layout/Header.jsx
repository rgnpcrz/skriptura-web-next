'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from '@/components/ui/LocaleLink'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation, useLocale } from '@/i18n/client'
import ThemeToggle from '@/components/theme/ThemeToggle'

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

  // The header survives navigation, so the drawer has to be closed explicitly.
  // Adjusting during render (rather than in an effect) avoids painting the open
  // drawer over the new page for a frame.
  const [drawerPath, setDrawerPath] = useState(pathname)
  if (drawerPath !== pathname) {
    setDrawerPath(pathname)
    setMenuOpen(false)
  }

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
    <header className="border-b-2 border-ink bg-paper sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="font-mono font-bold text-lg sm:text-xl tracking-widest uppercase select-none">
          SKRIPTURA
        </Link>

        <nav aria-label={t('a11y.mainNav')} className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => {
            const active = isActive(link.href, link.exact)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`font-mono font-bold text-sm uppercase tracking-wide px-1 py-0.5 border-b-2 transition-colors ${
                  active ? 'border-accent' : 'border-transparent hover:border-accent'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:flex" />

          <div role="group" aria-label={t('a11y.language')} className="flex border border-ink">
            {['en', 'sq'].map((l, i) => (
              <button
                key={l}
                type="button"
                lang={l}
                onClick={() => switchLang(l)}
                aria-pressed={locale === l}
                className={`font-mono text-xs font-bold px-2 py-1 transition-colors ${i > 0 ? 'border-l border-ink' : ''} ${
                  locale === l ? 'bg-accent text-on-accent' : 'bg-paper text-ink hover:bg-accent hover:text-on-accent'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="md:hidden border-2 border-ink p-1.5 bg-paper hover:bg-ink hover:text-paper transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t('a11y.closeMenu') : t('a11y.openMenu')}
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-t-2 border-ink bg-paper">
          <nav aria-label={t('a11y.mainNav')} className="max-w-6xl mx-auto px-4 py-4 flex flex-col">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.exact)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`font-mono font-bold text-sm uppercase tracking-wide py-3 border-b border-ink block transition-all ${
                    active ? 'pl-2 border-l-4 border-l-accent' : 'hover:pl-2'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <ThemeToggle showLabels className="flex sm:hidden mt-4" />
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
