import { themeInitScript } from '@/lib/theme'

// Blocking, render-blocking-free inline script. Placed first inside <body> so
// it runs after the stylesheet is parsed but before any content paints — which
// is what keeps a dark-theme visitor from seeing a white flash on every load.
export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
}
