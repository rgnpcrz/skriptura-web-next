'use client'

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'
import {
  commitTheme,
  getServerThemeSnapshot,
  getThemeSnapshot,
  runThemeTransition,
  subscribeTheme,
} from '@/lib/theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // The preference is external state (DOM, localStorage, the OS, other tabs),
  // so it is read rather than mirrored — no mount effect, no cascading render.
  // The hydration render sees the server snapshot, which matches the HTML; the
  // visible highlight does not wait for it, since CSS reads `data-theme-pref`
  // off <html> where the pre-paint script already put it.
  const { preference, resolved } = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  )

  const setTheme = useCallback((next) => {
    runThemeTransition(() => {
      // View Transitions snapshot the DOM as soon as this callback returns, so
      // the toggle has to land in the same frame as the palette.
      flushSync(() => commitTheme(next))
    })
  }, [])

  const value = useMemo(() => ({ preference, resolved, setTheme }), [preference, resolved, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>')
  return context
}
