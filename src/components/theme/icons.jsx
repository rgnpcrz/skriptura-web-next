import { THEME_LIGHT, THEME_DARK, THEME_SYSTEM } from '@/lib/theme'

// Square caps and thin strokes, to sit with the rest of the brutalist chrome.
const svgProps = {
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'square',
  'aria-hidden': true,
  focusable: false,
  className: 'w-3.5 h-3.5',
}

export const THEME_ICONS = {
  [THEME_LIGHT]: (
    <svg {...svgProps}>
      <circle cx="8" cy="8" r="3.1" />
      <path d="M8 1v1.8M8 13.2V15M1 8h1.8M13.2 8H15M3.05 3.05l1.27 1.27M11.68 11.68l1.27 1.27M12.95 3.05l-1.27 1.27M4.32 11.68l-1.27 1.27" />
    </svg>
  ),
  [THEME_DARK]: (
    <svg {...svgProps}>
      <path d="M13.4 9.9A5.9 5.9 0 0 1 6.1 2.6 5.9 5.9 0 1 0 13.4 9.9Z" />
    </svg>
  ),
  [THEME_SYSTEM]: (
    <svg {...svgProps}>
      <rect x="1.8" y="2.6" width="12.4" height="8.6" />
      <path d="M5.6 13.9h4.8M8 11.2v2.7" />
    </svg>
  ),
}

export const ChevronIcon = (
  <svg {...svgProps} className="w-3 h-3">
    <path d="M3.5 6L8 10.5 12.5 6" />
  </svg>
)
