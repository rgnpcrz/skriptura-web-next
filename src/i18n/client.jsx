'use client'

import { createContext, useCallback, useContext, useMemo } from 'react'
import { defaultLocale } from './config'

const TranslationContext = createContext({ dict: {}, locale: defaultLocale })

export function TranslationProvider({ dict, locale, children }) {
  const value = useMemo(() => ({ dict, locale }), [dict, locale])
  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>
}

function resolvePath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

// Drop-in replacement for react-i18next's useTranslation: returns { t }.
// The dictionary has no interpolation/pluralization, so a dot-path lookup suffices.
export function useTranslation() {
  const { dict } = useContext(TranslationContext)
  // Stable per dictionary, so `t` can be listed in hook dependency arrays
  // without re-running the hook on every render.
  const t = useCallback((key) => {
    const value = resolvePath(dict, key)
    return typeof value === 'string' ? value : key
  }, [dict])
  return useMemo(() => ({ t }), [t])
}

export function useLocale() {
  return useContext(TranslationContext).locale
}
