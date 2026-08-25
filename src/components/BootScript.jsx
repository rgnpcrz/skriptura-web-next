import { themeInitScript } from '@/lib/theme'
import { motionInitScript } from '@/lib/motion'

// One blocking inline script, first inside <body>, so it runs after the
// stylesheet is parsed but before any content paints. That is what keeps a
// dark-theme visitor from seeing a white flash, and what keeps the scroll-in
// blocks from appearing before they animate.
export default function BootScript() {
  // Each snippet ends in its own semicolon — two bare IIFEs run together would
  // parse as the second calling the first one's return value.
  return <script dangerouslySetInnerHTML={{ __html: themeInitScript + motionInitScript }} />
}
