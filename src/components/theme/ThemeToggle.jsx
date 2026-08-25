'use client'

import { useTranslation } from '@/i18n/client'
import { THEMES } from '@/lib/theme'
import { THEME_ICONS } from './icons'
import { useTheme } from './ThemeProvider'

/**
 * The three theme options as a stacked list. Three labelled options across a
 * row left roughly 30px per label, which "Auto" — and every Albanian label —
 * overflowed; stacking gives each one the full width of the menu.
 *
 * The active option is highlighted by CSS reading `data-theme-pref` off <html>,
 * so it is correct in the first painted frame; `aria-pressed` catches up once
 * React hydrates.
 */
export default function ThemeToggle({ className = '' }) {
  const { t } = useTranslation()
  const { preference, setTheme } = useTheme()

  return (
    <div role="group" aria-label={t('theme.label')} className={`flex flex-col border border-ink ${className}`}>
      {THEMES.map((value, i) => {
        const label = t(`theme.${value}`)
        return (
          <button
            key={value}
            type="button"
            data-theme-option={value}
            aria-pressed={preference === value}
            aria-label={`${t('theme.label')}: ${label}`}
            onClick={() => setTheme(value)}
            className={[
              'flex items-center gap-2 w-full px-2.5 py-2 bg-paper text-ink font-mono text-xs',
              'font-bold uppercase tracking-wide text-left transition-colors',
              'hover:bg-accent hover:text-on-accent',
              i > 0 && 'border-t border-ink',
            ].filter(Boolean).join(' ')}
          >
            <span className="shrink-0">{THEME_ICONS[value]}</span>
            <span className="truncate">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
