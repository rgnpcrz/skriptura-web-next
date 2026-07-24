'use client'

import { createContext, useContext, useMemo } from 'react'
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
  const t = (key) => {
    const value = resolvePath(dict, key)
    return typeof value === 'string' ? value : key
  }
  return { t }
}

export function useLocale() {
  return useContext(TranslationContext).locale
}
