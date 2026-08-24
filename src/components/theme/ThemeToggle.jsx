'use client'

import { useTranslation } from '@/i18n/client'
import { THEMES } from '@/lib/theme'
import { THEME_ICONS } from './icons'
import { useTheme } from './ThemeProvider'

/**
 * Three-state theme control. The active option is highlighted by CSS reading
 * `data-theme-pref` off <html>, so it is correct in the first painted frame;
 * `aria-pressed` catches up once React hydrates.
 */
export default function ThemeToggle({ showLabels = false, className = 'flex' }) {
  const { t } = useTranslation()
  const { preference, setTheme } = useTheme()

  return (
    <div role="group" aria-label={t('theme.label')} className={`border border-ink ${className}`}>
      {THEMES.map((value, i) => {
        const label = t(`theme.${value}`)
        return (
          <button
            key={value}
            type="button"
            data-theme-option={value}
            aria-pressed={preference === value}
            aria-label={`${t('theme.label')}: ${label}`}
            title={label}
            onClick={() => setTheme(value)}
            className={[
              'flex items-center justify-center gap-1.5 bg-paper text-ink font-mono text-xs font-bold',
              'uppercase tracking-wide transition-colors hover:bg-accent hover:text-on-accent',
              i > 0 && 'border-l border-ink',
              showLabels ? 'flex-1 px-2 py-2' : 'px-2 py-1.5',
            ].filter(Boolean).join(' ')}
          >
            {THEME_ICONS[value]}
            {showLabels && <span>{label}</span>}
          </button>
        )
      })}
    </div>
  )
}
