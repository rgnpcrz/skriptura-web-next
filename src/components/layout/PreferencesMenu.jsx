'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation, useLocale } from '@/i18n/client'
import { locales } from '@/i18n/config'
import { THEMES } from '@/lib/theme'
import { THEME_ICONS, ChevronIcon } from '@/components/theme/icons'
import ThemeToggle from '@/components/theme/ThemeToggle'

const LOCALE_PREFIX = /^\/(en|sq)(?=\/|$)/

// Remember the visitor's language choice so the proxy honors it on later visits.
function persistLocale(locale) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`
}

/**
 * One control for both preferences. Two segmented switchers side by side ate
 * most of the header on small screens, so they live in a panel behind a single
 * trigger that shows what is currently active.
 */
export default function PreferencesMenu() {
  const { t } = useTranslation()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)

  // Navigating means the panel has done its job.
  const [menuPath, setMenuPath] = useState(pathname)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const switchLang = (next) => {
    if (next === locale) return setOpen(false)
    persistLocale(next)
    router.push(`/${next}${pathname.replace(LOCALE_PREFIX, '')}`)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="preferences-panel"
        aria-label={t('a11y.preferences')}
        className="flex items-center gap-1.5 border-2 border-ink bg-paper px-2 py-1 font-mono text-xs font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
      >
        {locale.toUpperCase()}
        {/* All three render; CSS shows the one matching data-theme-pref, so the
            trigger is right in the first frame without waiting for hydration. */}
        <span className="flex">
          {THEMES.map((value) => (
            <span key={value} data-theme-icon={value} className="items-center">
              {THEME_ICONS[value]}
            </span>
          ))}
        </span>
        <span className={`transition-transform duration-150 ${open ? '-scale-y-100' : ''}`}>{ChevronIcon}</span>
      </button>

      {open && (
        <div
          id="preferences-panel"
          className="absolute right-0 top-full mt-2 w-56 border-2 border-ink bg-paper shadow-card p-3 space-y-3"
        >
          <div>
            <p className="font-mono text-[0.625rem] font-bold uppercase tracking-widest text-ink/60 mb-1.5">
              {t('a11y.language')}
            </p>
            <div role="group" aria-label={t('a11y.language')} className="flex border border-ink">
              {locales.map((l, i) => (
                <button
                  key={l}
                  type="button"
                  lang={l}
                  onClick={() => switchLang(l)}
                  aria-pressed={locale === l}
                  className={`flex-1 px-2 py-2 font-mono text-xs font-bold uppercase tracking-wide transition-colors ${
                    i > 0 ? 'border-l border-ink' : ''
                  } ${locale === l ? 'bg-accent text-on-accent' : 'bg-paper text-ink hover:bg-accent hover:text-on-accent'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[0.625rem] font-bold uppercase tracking-widest text-ink/60 mb-1.5">
              {t('theme.label')}
            </p>
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  )
}
