'use client'

import { useTranslation } from '@/i18n/client'
import { THEMES, THEME_LIGHT, THEME_DARK, THEME_SYSTEM } from '@/lib/theme'
import { useTheme } from './ThemeProvider'

// Square caps and thin strokes, to sit with the rest of the brutalist chrome.
const svgProps = {
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'square',
  'aria-hidden': true,
  focusable: false,
}

const iconClass = 'w-3.5 h-3.5'

const ICONS = {
  [THEME_LIGHT]: (
    <svg {...svgProps} className={iconClass}>
      <circle cx="8" cy="8" r="3.1" />
      <path d="M8 1v1.8M8 13.2V15M1 8h1.8M13.2 8H15M3.05 3.05l1.27 1.27M11.68 11.68l1.27 1.27M12.95 3.05l-1.27 1.27M4.32 11.68l-1.27 1.27" />
    </svg>
  ),
  [THEME_DARK]: (
    <svg {...svgProps} className={iconClass}>
      <path d="M13.4 9.9A5.9 5.9 0 0 1 6.1 2.6 5.9 5.9 0 1 0 13.4 9.9Z" />
    </svg>
  ),
  [THEME_SYSTEM]: (
    <svg {...svgProps} className={iconClass}>
      <rect x="1.8" y="2.6" width="12.4" height="8.6" />
      <path d="M5.6 13.9h4.8M8 11.2v2.7" />
    </svg>
  ),
}

/**
 * Three-state theme control. The active option is highlighted by CSS reading
 * `data-theme-pref` off <html>, so it is correct in the first painted frame;
 * `aria-pressed` catches up once React hydrates.
 */
export default function ThemeToggle({ showLabels = false, className = 'flex' }) {
  const { t } = useTranslation()
  const { preference, setTheme } = useTheme()

  const handleSelect = (value, event) => {
    if (value === preference) return
    // Start the wipe from the button that was pressed.
    const rect = event.currentTarget.getBoundingClientRect()
    setTheme(value, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }

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
            onClick={(event) => handleSelect(value, event)}
            className={[
              'flex items-center justify-center gap-1.5 bg-paper text-ink font-mono text-xs font-bold',
              'uppercase tracking-wide transition-colors hover:bg-accent hover:text-on-accent',
              i > 0 && 'border-l border-ink',
              showLabels ? 'flex-1 px-2 py-2' : 'px-2 py-1.5',
            ].filter(Boolean).join(' ')}
          >
            {ICONS[value]}
            {showLabels && <span>{label}</span>}
          </button>
        )
      })}
    </div>
  )
}
